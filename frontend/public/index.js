import commonInstance from './js/utils';

import './scss/common.scss';
import './scss/fonts.scss';

import './components/_components.js';

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

const myHeader = commonInstance.myHeader;
const myRouter = commonInstance.myRouter;

const init = () => {
    window.addEventListener('popstate', (event) => {
        myRouter.route();
        myHeader.updateMenuState(location.pathname);
    });

    window.addEventListener('DOMContentLoaded', async (event) => {
        myHeader.init();
        myRouter.route();
    });
};

init();
