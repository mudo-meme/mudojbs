import HomeView from '../views/Home/HomeView';
import SearchView from '../views/Search/SearchView';
import ExploreView from '../views/Explore/ExploreView';
import DetailView from '../views/Detail/DetailView';
import CreateView from '../views/Create/CreateView';

import HeaderComponent from '../components/header/header';
let myHeader = null;

import CustomEvents from './events';

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

const routes = [
    {
        path: '/',
        view: HomeView,
    },
    {
        path: '/search',
        view: SearchView,
    },
    {
        path: '/explore',
        view: ExploreView,
    },
    {
        path: '/view',
        view: DetailView,
    },
    {
        path: '/create',
        view: CreateView,
    },
];

let currentPath = '';

export default class {
    constructor() {}

    route = async () => {
        let match = null;

        if (location.pathname.startsWith('/view/')) {
            match = routes.find((route) => route.path === '/view');
        } else if (location.pathname.startsWith('/search/')) {
            match = routes.find((route) => route.path === '/search');
        } else {
            match = routes.find((route) => location.pathname === route.path) || routes[0];
        }

        let urlParams = location.pathname.split('/').splice(2);
        let queryParams = location.search.split('?')[1]?.split('&');

        const view = new match.view(urlParams, queryParams);
        await view.init();

        let pageName = match.path.substring(1);
        if (pageName === '') pageName = 'home';

        const root = $('#app');

        // console.log('이전경로: ' + currentPath);
        // console.log('현재경로: ' + pageName);

        if (currentPath !== '') window.dispatchEvent(CustomEvents.DEATTACHED_VIEW(currentPath));

        root.innerHTML = '';
        root.className = pageName;

        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver((mutation, observer) => {
            observer.disconnect();
            window.dispatchEvent(CustomEvents.ATTACHED_VIEW(pageName));
        });

        observer.observe(root, config);

        root.appendChild(await view.getView());

        myHeader = new HeaderComponent();
        myHeader.updateMenuState();

        if (pageName === 'search') {
            myHeader.setSearchQuery(decodeURIComponent(urlParams[0]));
        }

        if (location.pathname.startsWith('/view/')) {
            window.scrollTo(0, 0);
        } else if (location.pathname.startsWith('/create')) {
        }

        currentPath = pageName;
    };

    navigate = (url) => {
        history.pushState(null, null, url);
        this.route();
    };
}
