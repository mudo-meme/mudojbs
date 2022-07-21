import HeaderComponent from './components/header';
import Router from './js/router';

import './scss/common.scss';
import './scss/fonts.scss';

import './components/_components.js';

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

const myHeader = new HeaderComponent();
const myRouter = new Router();

const init = () => {
    window.addEventListener('popstate', (event) => {
        myRouter.route();
        myHeader.updateMenuState(location.pathname);
    });

    window.addEventListener('DOMContentLoaded', async (event) => {
        $('header').innerHTML = await myHeader.getComponent();
        myHeader.init();
        myRouter.route();
    });
};

init();
