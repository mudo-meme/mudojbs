import imageListDOM from './imagelist.html';
import './imagelist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    isDev = false;
    isOpened = false;
    containerName = null;
    myDOM = new DOMParser().parseFromString(imageListDOM, 'text/html');

    constructor(containerName, title) {
        this.containerName = containerName;
        this.init(title);
    }

    init = async (title) => {
        window.addEventListener(
            `ATTACHED_COMPONENT_imagelist_${this.containerName}`,
            this.attached,
            { once: true }
        );

        $('div.image-list-container', this.myDOM).dataset.container = this.containerName;
        $('p.title', this.myDOM).textContent = title;
        $('button.load-more', this.myDOM).addEventListener('click', this.clickEvent);
    };

    attached = (event) => {
        switch (event.detail.target) {
            case 'popular':
                console.log(`Attached imagelist(${event.detail.target}) Component`);
                break;

            case 'recent':
                console.log(`Attached imagelist(${event.detail.target}) Component`);
                break;
        }

        $(`[data-container=${this.containerName}] button.load-more`).addEventListener(
            'click',
            this.clickEvent
        );
    };

    clickEvent = (event) => {
        if (!this.isOpened) {
            $$(`[data-container=${this.containerName}] li.image-item.hide`).forEach((item) => {
                item.classList.remove('hide');
            });

            this.isOpened = true;
            $(`[data-container=${this.containerName}] button.load-more`).classList.add('hide');
        }
    };

    createEleFromImages = (imageList) => {
        // <li class="image-item">
        //     <a href="#">
        //         <img src="../../assets/images/test_asset/10.jpg" alt="" />
        //     </a>
        // </li>;

        let listObject = null;

        console.log(imageList);
        if (this.isDev) {
            listObject = imageList.entries();
        } else {
            listObject = imageList.entries();
        }

        for (let [index, imageItem] of listObject) {
            let newLi = this.myDOM.createElement('li');
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            if (this.isDev) {
                newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
                newImg.setAttribute('src', `/images/test_asset/${imageItem.imageUrl}`);
            } else {
                newA.setAttribute('href', `/view/${imageItem.id}`);
                newImg.setAttribute('src', imageItem.imageUrl);
            }

            newLi.setAttribute('class', 'image-item');

            if (index > 4) {
                newLi.classList.add('hide');
            }

            newA.appendChild(newImg);
            newLi.appendChild(newA);

            $('ul.image-list', this.myDOM).appendChild(newLi);
        }
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
