import AbstractView from './AbstractView';
import HomeView from './HomeView.html';
import '../scss/home.scss';

import ImageAPI from '../js/api';
const imageAPI = new ImageAPI();

export default class extends AbstractView {
    myDOM = new DOMParser().parseFromString(HomeView, 'text/html');

    $ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelector(param);
    $$ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelectorAll(param);

    pos = { top: 0, left: 0, x: 0, y: 0 };

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        // let imageList = await imageAPI.getImage('임시', 1, 10);
        let imageList = await imageAPI.getImage('임시', 1, 10);
        imageList = imageList.content;

        for (let imageItem of imageList) {
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newA.setAttribute('class', 'image-item');
            newA.setAttribute('href', imageItem.id);
            newImg.setAttribute('src', imageItem.imageUrl);
            newA.appendChild(newImg);

            this.$('#popular-group .image-list-container').appendChild(newA);
        }

        // imageList = await imageAPI.getImage('임시', 1, 10);

        // for (let imageItem of imageList) {
        //     let newA = this.myDOM.createElement('a');
        //     let newImg = this.myDOM.createElement('img');

        //     newA.setAttribute('class', 'image-item');
        //     newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
        //     newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
        //     newA.appendChild(newImg);

        //     this.$('#recent-group .image-list-container').appendChild(newA);
        // }

        // imageList = await imageAPI.getImage('임시', 1, 50);

        // for (let imageItem of imageList) {
        //     let newFigure = this.myDOM.createElement('figure');
        //     let newA = this.myDOM.createElement('a');
        //     let newImg = this.myDOM.createElement('img');

        //     newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
        //     newFigure.setAttribute('class', 'image-item');
        //     newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
        //     newA.appendChild(newImg);
        //     newFigure.appendChild(newA);

        //     this.$('#new-group .tiled-list-container').appendChild(newFigure);
        // }

        this.$$('.container-wrapper').forEach((item) => {
            item.addEventListener('mousedown', this.mouseDownHandler);
        });
    };

    container = null;

    mouseDownHandler = (e) => {
        this.container = e.target.closest('.container-wrapper');

        this.pos = {
            left: this.container.scrollLeft,
            top: this.container.scrollTop,

            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
    };

    mouseMoveHandler = (e) => {
        const dx = e.clientX - this.pos.x;
        const dy = e.clientY - this.pos.y;

        this.container.scrollTop = this.pos.top - dy;
        this.container.scrollLeft = this.pos.left - dx;
        // this.container.style.transform = `translateX(-${this.pos.left - dx}px)`;
        console.log(this.pos.left - dx);
    };

    mouseUpHandler = () => {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);

        this.container.style.cursor = 'grab';
        this.container.style.removeProperty('user-select');
    };

    async getView() {
        return this.myDOM.body.childNodes[0];
    }
}
