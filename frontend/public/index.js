import commonInstance from './js/utils';

import './scss/mediaquery.scss';
import './scss/common.scss';
import './scss/fonts.scss';

import './components/_components.js';

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

const myHeader = commonInstance.myHeader;
const myRouter = commonInstance.myRouter;

const init = async () => {
    window.addEventListener('popstate', (event) => {
        myRouter.route();
        myHeader.updateMenuState(location.pathname);
    });

    window.addEventListener('DOMContentLoaded', async (event) => {
        console.log('DOMContentLoaded');

        myHeader.init();
        myHeader.attachDOM();
        myRouter.route();
    });
};

init();
