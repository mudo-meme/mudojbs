import imageViewDOM from './imageview.html';
import './imageview.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    isDev = false;
    myDOM = new DOMParser().parseFromString(imageViewDOM, 'text/html');

    targetInfo = null;

    imageId = null;

    constructor(imageId) {
        this.imageId = imageId;
        this.init();
    }

    init = async () => {
        window.addEventListener(`ATTACHED_COMPONENT_imageview_`, this.attached, { once: true });
        window.addEventListener(`DEATTACHED_COMPONENT_imageview_`, this.deattached, { once: true });
    };

    attached = async (event) => {
        console.log('Attached ImageView Component');

        if (this.isDev) {
            $('#originImg', this.myDOM).src = `/images/test_asset/${this.imageId}.jpg`;
        } else {
            this.targetInfo = await imageAPI.getImageDetail(this.imageId);
            // $('#originImg').src = this.targetInfo.imageUrl;
            const originImg = await this.loadImage(this.targetInfo.imageUrl);
            originImg.setAttribute('id', 'originImg');

            $('div.origin-image-container').classList.remove('loading');
            $('div.origin-image-container').appendChild(originImg);
        }

        this.appendTags();
    };

    deattached = (event) => {
        console.log('Deattached ImageView Component');
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

    appendTags = () => {
        // <li class="tag-item">
        //     <a href="/search/무한도전">#무한도전</a>
        // </li>;

        for (let item of this.targetInfo.tags) {
            const newA = document.createElement('a');
            const newLi = document.createElement('li');

            newA.setAttribute('href', `/search/${item}`);
            newA.textContent = item;

            newLi.setAttribute('class', 'tag-item');
            newLi.appendChild(newA);

            $('ul.tag-list').appendChild(newLi);
        }
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
