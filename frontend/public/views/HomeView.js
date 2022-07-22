import AbstractView from './AbstractView';
import HomeView from './HomeView.html';
import '../scss/home.scss';

import ImageAPI from '../testdatas/image';
const imageAPI = new ImageAPI();

export default class extends AbstractView {
    myDOM = new DOMParser().parseFromString(HomeView, 'text/html');

    $ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelector(param);
    $$ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelectorAll(param);

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        let imageList = await imageAPI.getImage('임시', 1, 10);

        for (let imageItem of imageList) {
            let newDiv = this.myDOM.createElement('div');
            let newImg = this.myDOM.createElement('img');

            newDiv.setAttribute('class', 'image-item');
            newDiv.setAttribute('data-link', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            newDiv.appendChild(newImg);

            this.$('#popular-group .image-list-container').appendChild(newDiv);
        }

        imageList = await imageAPI.getImage('임시', 1, 5);

        for (let imageItem of imageList) {
            let newDiv = this.myDOM.createElement('div');
            let newImg = this.myDOM.createElement('img');

            newDiv.setAttribute('class', 'image-item');
            newDiv.setAttribute('data-link', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            newDiv.appendChild(newImg);

            this.$('#recent-group .image-list-container').appendChild(newDiv);
        }

        imageList = await imageAPI.getImage('임시', 1, 50);

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
