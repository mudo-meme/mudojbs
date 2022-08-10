import headerDOM from './header.html';
import './header.scss';

import Router from '../../js/router';
const myRouter = new Router();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(headerDOM, 'text/html');

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
        if (event.key === 'Enter') {
            const myQuery = $('#search-query').value;
            if (myQuery === '') return;

            this.closeRelatedBox();
            myRouter.navigate(`/search/${encodeURIComponent(myQuery)}`);
        } else {
            // TODO Get related keyword
        }
    };

    listClickEvent = (event) => {
        event.stopImmediatePropagation();
        this.closeRelatedBox();

        const myQuery = event.target.closest('li').dataset.item;
        $('#search-query').value = myQuery;
        myRouter.navigate(`/search/${encodeURIComponent(myQuery)}`);
    };

    windowClickEvent = (event) => {
        let container = event.target.closest('[data-search-container]');

        if (!container) {
            this.closeRelatedBox();
        } else {
            let nowMedia = getComputedStyle(document.documentElement)
                .getPropertyValue('--now-media')
                .trim();

            let isMobile = nowMedia == `mobile`;

            if (isMobile && container) {
                if (event.target.closest('.mobile-back')) {
                    this.closeRelatedBox(isMobile);
                    // this.setSearchQuery('');
                } else {
                    this.openRelatedBox(isMobile);
                }
            } else {
                this.openRelatedBox(isMobile);
            }
        }
    };

    openRelatedBox = (isMobile = false) => {
        if (isMobile) $('.search-container').classList.add('mobile');

        $(`#related-box`).classList.add('show');
        $(`#search-box`).classList.add('focus');
    };

    closeRelatedBox = (isMobile = false) => {
        if (isMobile) $('.search-container').classList.remove('mobile');

        $(`#related-box`).classList.remove('show');
        $(`#search-box`).classList.remove('focus');
    };

    updateMenuState = () => {
        [...$$('header #menu-list li')].forEach((item) => item.classList.remove('now'));

        let path = `/${location.pathname.split('/')[1]}`;

        if (['/', '/search', '/view'].includes(path)) {
            $(`header li a[href='/']`).parentNode.classList.add('now');
        } else {
            $(`header li a[href='${path}']`).parentNode.classList.add('now');
        }
    };

    setSearchQuery = (searchQuery) => {
        let searchBox = $('#search-query') || $('#search-query', this.myDOM);
        searchBox.value = searchQuery;
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
