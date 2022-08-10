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
        // 나중에 API 호출에서 Image Info 얻어오기
    };

    attached = async (event) => {
        console.log('Attached ImageView Component');

        if (this.isDev) {
            $('#originImg', this.myDOM).src = `/images/test_asset/${this.imageId}.jpg`;
        } else {
            this.targetInfo = await imageAPI.getImageDetail(this.imageId);
            $('#originImg').src = this.targetInfo.imageUrl;
        }
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
