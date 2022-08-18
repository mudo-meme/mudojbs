import headerDOM from './header.html';
import './header.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

import Router from '../../js/router';
const myRouter = new Router();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(headerDOM, 'text/html');
    isOpend = false;
    currentQuery = null;

    constructor() {}

    init = async () => {
        window.addEventListener('ATTACHED_COMPONENT_header_', this.attached, { once: true });
        window.addEventListener('click', this.windowClickEvent);
    };

    attached = (event) => {
        if (event.detail.type === 'header') {
            console.log('Attached Header Component');
            $('#search-query').addEventListener('keyup', this.keyUpEvent);
            $('ul#related-list').addEventListener('click', this.listClickEvent);
        }
    };

    keyUpEvent = (event) => {
        this.currentQuery = $('#search-query').value.trim();

        console.log(this.currentQuery);

        if (!this.isOpend) {
            this.openRelatedBox(this.isMobileNow());
        }

        if (event.key === 'Enter') {
            if (this.currentQuery === '') return;

            this.closeRelatedBox(this.isMobileNow());
            myRouter.navigate(`/search/${encodeURIComponent(this.currentQuery)}`);
        } else {
            // TODO Get related keyword
            this.updateRelatedTags();
        }
    };

    listClickEvent = (event) => {
        console.log('여기로 와야하잖아~');
        event.stopImmediatePropagation();
        this.closeRelatedBox(this.isMobileNow());

        const myQuery = event.target.closest('li').dataset.item;
        this.setSearchQuery(myQuery);
        myRouter.navigate(`/search/${encodeURIComponent(myQuery)}`);
    };

    windowClickEvent = (event) => {
        let container = event.target.closest('[data-search-container]');

        if (!container) {
            this.closeRelatedBox(this.isMobileNow());
            this.isOpend = false;
        } else {
            const isMobile = this.isMobileNow();
            this.currentQuery = $('#search-query').value.trim();

            if (isMobile && container) {
                if (event.target.closest('.mobile-back')) {
                    this.closeRelatedBox(isMobile);
                    // this.setSearchQuery('');
                } else {
                    if (this.currentQuery !== '') {
                        this.updateRelatedTags();
                        console.log('여기 아뇨?');
                        this.openRelatedBox(isMobile);
                    }
                }
            } else {
                if (this.currentQuery !== '') {
                    this.updateRelatedTags();
                }
                this.openRelatedBox(isMobile);
            }

            this.isOpend = true;
        }
    };

    openRelatedBox = (isMobile = false) => {
        if (isMobile) $('.search-container').classList.add('mobile');

        $(`#related-box`).classList.add('show');
        $(`#search-box`).classList.add('focus');
        this.isOpend = true;
    };

    closeRelatedBox = (isMobile = false) => {
        if (isMobile) $('.search-container').classList.remove('mobile');

        $(`#related-box`).classList.remove('show');
        $(`#search-box`).classList.remove('focus');
        this.isOpend = false;
    };

    updateMenuState = () => {
        [...$$('header #menu-list li')].forEach((item) => item.classList.remove('now'));

        let path = `/${location.pathname.split('/')[1]}`;

        // console.log(path);

        if (['/', '/search', '/view'].includes(path)) {
            $(`header li a[href='/']`).parentNode.classList.add('now');
        } else {
            $(`header li a[href='${path}']`).parentNode.classList.add('now');
        }
    };

    isMobileNow = () => {
        return (
            getComputedStyle(document.documentElement).getPropertyValue('--now-media').trim() ===
            'mobile'
        );
    };

    isSearch = false;
    abortController = new AbortController();

    updateRelatedTags = async () => {
        // <li data-item="asdf">
        //     <div class="icon">
        //         <span class="material-symbols-rounded"> tag </span>
        //     </div>
        //     <div class="result-section">
        //         <p class="result-name">박명수</p>
        //         <p class="result-count">총 123개의 짤</p>
        //     </div>
        //     <div class="result-reword">
        //         <div class="icon">
        //             <span class="material-symbols-rounded"> north_west </span>
        //         </div>
        //     </div>
        // </li>;
        if (this.currentQuery === '') {
            if (this.isOpend) {
                this.closeRelatedBox(this.isMobileNow());
            }
            return;
        }

        if (this.isSearch) {
            this.abortController.abort();
            this.isSearch = false;
        }

        this.isSearch = true;
        this.abortController = new AbortController();

        const relatedTags = await imageAPI.getImageKeyword(
            this.abortController.signal,
            this.currentQuery
        );

        if (relatedTags === undefined) return;
        if (relatedTags.length === 0) {
            this.closeRelatedBox(this.isMobileNow());
        }

        const relatedFragment = new DocumentFragment();

        const newUl = document.createElement('ul');
        newUl.setAttribute('id', 'related-list');

        for (let tag of relatedTags) {
            const newSpan = document.createElement('span');
            newSpan.setAttribute('class', 'material-symbols-rounded');
            newSpan.textContent = 'tag';

            const newDivIcon = document.createElement('div');
            newDivIcon.setAttribute('class', 'icon');
            newDivIcon.appendChild(newSpan);

            const newPName = document.createElement('p');
            newPName.setAttribute('class', 'result-name');
            newPName.textContent = tag.tag;

            const newPCount = document.createElement('p');
            newPCount.setAttribute('class', 'result-count');
            newPCount.textContent = `총 ${tag.imageCount}개의 짤`;

            const newDivResultSection = document.createElement('div');
            newDivResultSection.setAttribute('class', 'result-section');
            newDivResultSection.appendChild(newPName);
            newDivResultSection.appendChild(newPCount);

            const newSpan2 = document.createElement('span');
            newSpan2.setAttribute('class', 'material-symbols-rounded');
            newSpan2.textContent = 'north_west';

            const newDivIcon2 = document.createElement('div');
            newDivIcon2.setAttribute('class', 'icon');
            newDivIcon2.appendChild(newSpan2);

            const newDivReword = document.createElement('div');
            newDivReword.setAttribute('class', 'result-reword');
            newDivReword.appendChild(newDivIcon2);

            const newLi = document.createElement('li');
            newLi.dataset.item = tag.tag;
            newLi.appendChild(newDivIcon);
            newLi.appendChild(newDivResultSection);
            newLi.appendChild(newDivReword);

            newUl.appendChild(newLi);
        }

        relatedFragment.appendChild(newUl);

        $('div#related-box').replaceChild(relatedFragment, $('ul#related-list'));
        $('ul#related-list').addEventListener('click', this.listClickEvent);
    };

    setSearchQuery = (searchQuery) => {
        let searchBox = $('#search-query') || $('#search-query', this.myDOM);
        searchBox.value = searchQuery;
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
