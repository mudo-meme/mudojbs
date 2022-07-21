import headerDOM from './header.html';
import logoImage from '../images/logo_type1.png';
import '../scss/header.scss';

import Router from '../js/router';

const myRouter = new Router();

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

export default class {
    constructor() {}

    init = () => {
        $('#logo').src = logoImage;

        $('header').addEventListener('click', this);
        window.addEventListener('click', this);
    };

    clickEvent = (event) => {
        if (event.target.matches('[data-link]')) {
            event.preventDefault();

            let linkUrl = event.target.dataset.link;
            myRouter.navigate(linkUrl);
            this.updateMenuState(linkUrl);
        }

        let container = event.target.closest('[data-container]');

        if (!container) {
            $(`#related-box`).classList.remove('show');
            $(`#search-box`).classList.remove('focus');
        } else {
            $(`#related-box`).classList.add('show');
            $(`#search-box`).classList.add('focus');
        }
    };

    handleEvent = (event) => {
        this[`${event.type}Event`](event);
    };

    updateMenuState = (path) => {
        [...$$('header #menu-list li')].forEach((item) => item.classList.remove('now'));

        if (['/', '/search', '/view'].includes(path)) {
            $(`button[data-link='/']`).parentNode.classList.add('now');
        } else {
            $(`button[data-link='${path}']`).parentNode.classList.add('now');
        }
    };

    async getComponent() {
        return headerDOM;
    }
}
