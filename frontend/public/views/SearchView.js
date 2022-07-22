import AbstractView from './AbstractView';
import SearchView from './SearchView.html';
import '../scss/search.scss';

import commonInstance from '../js/utils';

import ImageAPI from '../testdatas/image';
const imageAPI = new ImageAPI();

export default class extends AbstractView {
    myDOM = new DOMParser().parseFromString(SearchView, 'text/html');
    searchQuery = null;

    $ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelector(param);
    $$ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelectorAll(param);

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');

        if (queryParams) {
            for (let query of queryParams) {
                let queryList = query.split('=');

                for (let i = 0; i < queryList.length; i += 2) {
                    if (queryList[i] === 'query') {
                        this.searchQuery = decodeURIComponent(queryList[i + 1]);
                    }
                }
            }
        }
    }

    init = async () => {
        console.log(`${this.searchQuery}를 검색했습니다`);

        // commonInstance.myHeader.setSearchQuery(this.searchQuery);

        let imageList = await imageAPI.getImage(this.searchQuery, 1, 50);

        for (let imageItem of imageList) {
            let newFigure = this.myDOM.createElement('figure');
            let newImg = this.myDOM.createElement('img');

            newFigure.setAttribute('class', 'image-item');
            newFigure.setAttribute('data-link', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            newFigure.appendChild(newImg);

            this.$('#new-group .tiled-list-container').appendChild(newFigure);
        }
    };

    async getView() {
        return this.myDOM.body.childNodes[0];
    }
}
