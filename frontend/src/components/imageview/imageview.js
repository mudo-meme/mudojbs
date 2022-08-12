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
    };

    attached = async (event) => {
        console.log('Attached ImageView Component');

        if (this.isDev) {
            $('#originImg', this.myDOM).src = `/images/test_asset/${this.imageId}.jpg`;
        } else {
            this.targetInfo = await imageAPI.getImageDetail(this.imageId);
            $('#originImg').src = this.targetInfo.imageUrl;
        }

        this.appendTags();
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
