import headerDOM from './header.html';
import logoImage from '../images/logo_type1.png';
import '../scss/header.scss';

export default class {
    myDOM = new DOMParser().parseFromString(headerDOM, 'text/html');
    myRouter = null;

    $ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelector(param);
    $$ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelectorAll(param);

    constructor(srcRouter) {
        this.setRouter(srcRouter);
        this.init();
    }

    init = async () => {
        this.$('#logo').src = logoImage;

        window.addEventListener('click', this.windowClickEvent);
    };

    windowClickEvent = (event) => {
        let container = event.target.closest('[data-container]');

        if (!container) {
            this.$(`#related-box`, document).classList.remove('show');
            this.$(`#search-box`, document).classList.remove('focus');
        } else {
            this.$(`#related-box`, document).classList.add('show');
            this.$(`#search-box`, document).classList.add('focus');
        }
    };

    handleEvent = (event) => {
        this[`${event.type}Event`](event);
    };

    updateMenuState = () => {
        [...this.$$('header #menu-list li', document)].forEach((item) =>
            item.classList.remove('now')
        );

        let path = `/${location.pathname.split('/')[1]}`;

        if (['/', '/search', '/view'].includes(path)) {
            this.$(`header li a[href='/']`, document).parentNode.classList.add('now');
        } else {
            this.$(`header li a[href='${path}']`, document).parentNode.classList.add('now');
        }
    };

    setRouter = (srcRouter) => {
        this.myRouter = srcRouter;
    };

    setSearchQuery = (searchQuery) => {
        let searchBox = this.$('#search-query') || this.$('#search-query', document);
        searchBox.value = searchQuery;
    };

    attachDOM = async () => {
        this.$('header', document).innerHTML = '';
        this.$('header', document).appendChild(await this.getComponent());
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0];
    }
}
