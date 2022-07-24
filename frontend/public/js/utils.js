import Header from '../components/header';
import Router from '../js/router';

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

const myRouter = new Router();
const myHeader = new Header(myRouter);

window.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
        event.preventDefault();

        let linkUrl = event.target.href;
        myRouter.navigate(linkUrl);
        myHeader.updateMenuState();
    }
});

window.addEventListener('keyup', (event) => {
    if (event.target.id === 'search-query') {
        if (event.code === 'Enter') {
            myRouter.navigate(`/search?query=${event.target.value}`);
            myHeader.updateMenuState('/search');

            $(`#related-box`).classList.remove('show');
            $(`#search-box`).classList.remove('focus');
        }
    }
});

export default { myRouter, myHeader };
