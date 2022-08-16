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
    currentPage = 1;

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
        this.searchQuery = decodeURIComponent(urlParams[0]);
    }

    init = async () => {
        myDOM = new DOMParser().parseFromString(SearchView, 'text/html');

        window.addEventListener('ATTACHED_VIEW', this.attached, { once: true });
        window.addEventListener('CONTENT_LOAD', this.contentLoad);

        await this.attachComponent();
    };

    attached = async (event) => {
        if (event.detail.target === 'search') {
            console.log('Attached Search View');
            // TODO Spread the event to components
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('masonrylist', 'search'));

            this.contentLoad();
            // const reponseData = await imageAPI.getImage(this.searchQuery, this.currentPage, 30);

            // if (reponseData.empty) {
            //     alert('없어용');
            //     // TODO show the error page
            //     return;
            // }

            // if (!reponseData.last) {
            //     this.appendImages(reponseData.content);
            //     window.dispatchEvent(CustomEvents.CONTENT_LOAD('Asd'));
            // } else {
            // }
        }
    };

    contentLoad = async (event) => {
        const reponseData = await imageAPI.getImage(this.searchQuery, this.currentPage, 30);

        console.log(reponseData);

        if (reponseData.empty) {
            alert('없어용');
            return;
        }
        masonryComponent.appendImages(reponseData.content);

        window.addEventListener('CONTENT_LOAD', this.contentLoad, { once: true });
        this.currentPage++;
    };

    attachComponent = async () => {
        masonryComponent = new MasonryList('search', `${this.searchQuery}에 관한 검색결과`);

        // masonryComponent.setLoadFunction(
        //     async function (params) {
        //         // console.log(params.query, params.page);

        //         const reponseData = await imageAPI.getImage(params.query, params.page, 30);

        //         console.log(reponseData);

        //         if (reponseData.empty) {
        //             alert('없어용');
        //         }

        //         if (!reponseData.last) {
        //             this.appendImages(reponseData.content);
        //             window.dispatchEvent(CustomEvents.CONTENT_LOADED('Asd'));
        //         } else {
        //         }
        //     },
        //     { query: this.searchQuery, page: this.currentPage }
        // );

        const root = $('.page-inside', myDOM);
        root.innerHTML = '';

        root.appendChild(await masonryComponent.getComponent());
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
