import AbstractView from '../AbstractView';
import DetailView from './DetailView.html';
import './DetailView.scss';

import MasonryList from '../../components/masonrylist/masonrylist';
let masonryComponent = null;

import ImageView from '../../components/imageview/imageview';
let imageViewComponent = null;

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

import CustomEvents from '../../js/events';

let myDOM = null;

const $ = (param, defaultDOM = myDOM) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = myDOM) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    imageId = null;

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
        this.imageId = urlParams[0];
    }

    init = async () => {
        myDOM = new DOMParser().parseFromString(DetailView, 'text/html');

        window.addEventListener(`ATTACHED_VIEW_view`, this.attached, { once: true });
        window.addEventListener('DEATTACHED_VIEW_view', this.deattached, { once: true });

        window.addEventListener(`CONTENT_LOAD`, this.contentLoad);

        await this.attachComponent();
    };

    attachComponent = async () => {
        const root = $('.page-inside', myDOM);
        root.innerHTML = '';

        imageViewComponent = new ImageView(this.imageId);
        masonryComponent = new MasonryList('related', '관련 이미지');
        // masonryComponent.appendImages(await imageAPI.getImage('임시', 1, 30), true);
        masonryComponent.appendImages(await imageAPI.getImageRandom(), true);

        root.appendChild(await imageViewComponent.getComponent());
        root.appendChild(await masonryComponent.getComponent());
    };

    contentLoad = async (event) => {
        console.log('from DetailView');
        masonryComponent.appendImages(await imageAPI.getImageRandom());
    };

    attached = (event) => {
        console.log('Attached Detail View');

        window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('imageview'));
        window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('masonrylist', 'related'));
    };

    deattached = (event) => {
        console.log('Deattached Detail View');
        // TODO Spread the event to components
        window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('imageview'));
        window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('masonrylist', 'related'));

        window.removeEventListener(`CONTENT_LOAD`, this.contentLoad);
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
