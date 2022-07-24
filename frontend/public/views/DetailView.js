import AbstractView from './AbstractView';
import DetailView from './DetailView.html';
import '../scss/detail.scss';

import ImageAPI from '../js/api';
const imageAPI = new ImageAPI();

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

export default class extends AbstractView {
    myDOM = new DOMParser().parseFromString(DetailView, 'text/html');
    viewId = null;

    $ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelector(param);
    $$ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelectorAll(param);

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');

        if (urlParams) {
            this.viewId = urlParams[0];
        }
    }

    init = async () => {
        let imageList = await imageAPI.getImage('임시', 1, 50);

        if (this.viewId) {
            this.$('#view-image').src = `../images/test_asset/${this.viewId}.jpg`;
        }

        for (let imageItem of imageList) {
            let newFigure = this.myDOM.createElement('figure');
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newFigure.setAttribute('class', 'image-item');
            // newFigure.setAttribute('data-link', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newA.appendChild(newImg);
            newFigure.appendChild(newA);

            this.$('#related-group .tiled-list-container').appendChild(newFigure);
        }
    };

    async getView() {
        return this.myDOM.body.childNodes[0];
    }
}
