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

        window.addEventListener(
            `DEATTACHED_COMPONENT_imagelist_${this.containerName}`,
            this.deattached,
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

    deattached = (event) => {
        console.log(`Deattached imagelist(${event.detail.target}) Component`);
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

    createEleFromImages = async (imageList) => {
        // <li class="image-item">
        //     <a href="#">
        //         <img src="../../assets/images/test_asset/10.jpg" alt="" />
        //     </a>
        // </li>;

        let loadPromises = [];

        for (let item of imageList) {
            loadPromises.push(this.loadImage(item.imageUrl));
        }

        let listObject = await Promise.all(loadPromises);

        listObject = listObject.map((item, index) => {
            return { index, element: item, id: imageList[index].id };
        });

        const newUl = document.createElement('ul');
        newUl.classList.add('image-list');

        for (let imageItem of listObject) {
            let newLi = document.createElement('li');
            let newA = document.createElement('a');

            // if (this.isDev) {
            //     newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
            //     newImg.setAttribute('src', `/images/test_asset/${imageItem.imageUrl}`);
            // } else {
            //     newA.setAttribute('href', `/view/${imageItem.id}`);
            //     newImg.setAttribute('src', imageItem.imageUrl);
            // }

            newA.setAttribute('href', `/view/${imageItem.id}`);
            newLi.setAttribute('class', 'image-item');

            if (imageItem.index > 4) {
                newLi.classList.add('hide');
            }

            newA.appendChild(imageItem.element);
            newLi.appendChild(newA);

            newUl.appendChild(newLi);
        }

        // $('ul.image-list', this.myDOM).appendChild(newUl);
        // $('div.image-list-wrapper', this.myDOM).replaceChild(newUl, $('ul.image-list', this.myDOM));

        // console.log(this.myDOM);
        $(`[data-container=${this.containerName}] div.image-list-wrapper`).replaceChild(
            newUl,
            $(`[data-container=${this.containerName}] ul.image-list`)
        );
    };

    loadImage = async (url) => {
        return new Promise((resolve, reject) => {
            const tmpImg = document.createElement('img');
            tmpImg.setAttribute('src', url);

            tmpImg.addEventListener('load', (event) => resolve(tmpImg), {
                once: true,
            });

            tmpImg.src = url;
        });
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
