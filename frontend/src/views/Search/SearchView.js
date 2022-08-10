import AbstractView from '../AbstractView';
import SearchView from './SearchView.html';
import './SearchView.scss';

import MasonryList from '../../components/masonrylist/masonrylist';
let masonryComponent = null;

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

import CustomEvents from '../../js/events';

let myDOM = null;

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    searchQuery = null;

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
        this.searchQuery = decodeURIComponent(urlParams[0]);
    }

    init = async () => {
        myDOM = new DOMParser().parseFromString(SearchView, 'text/html');

        window.addEventListener('ATTACHED_VIEW', this.attached, { once: true });

        await this.attachComponent();
    };

    attached = (event) => {
        if (event.detail.target === 'search') {
            console.log('Attached Search View');
            // TODO Spread the event to components
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('masonrylist', 'search'));
        }
    };

    attachComponent = async () => {
        masonryComponent = new MasonryList('search', `${this.searchQuery}에 관한 검색결과`);

        const root = $('.page-inside', myDOM);
        root.innerHTML = '';

        masonryComponent.appendImages(
            (await imageAPI.getImage(this.searchQuery, 1, 30)).content,
            true
        );

        root.appendChild(await masonryComponent.getComponent());
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
