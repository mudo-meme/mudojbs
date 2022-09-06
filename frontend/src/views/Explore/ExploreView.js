import AbstractView from '../AbstractView';
import ExploreView from './ExploreView.html';
import './ExploreView.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

let myDOM = null;

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        myDOM = new DOMParser().parseFromString(ExploreView, 'text/html');

        window.addEventListener('ATTACHED_VIEW_explore', this.attached, { once: true });
        window.addEventListener('DEATTACHED_VIEW_explore', this.deattached, { once: true });

        await this.attachComponent();
    };

    attached = async (event) => {
        console.log('Attached Explore View');
    };

    deattached = (event) => {
        console.log('Deattached Explore View');
    };

    attachComponent = async () => {
        const root = $('.page-inside', myDOM);
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
