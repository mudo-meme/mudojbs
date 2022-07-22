import HomeView from '../views/HomeView';
import SearchView from '../views/SearchView';
import ExploreView from '../views/ExploreView';
import DetailView from '../views/DetailView';
import CreateView from '../views/CreateView';

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

export default class {
    constructor() {
        console.log('Created Router');
    }

    route = async () => {
        let match = null;

        if (location.pathname.startsWith('/view/')) {
            match = routes.find((route) => route.path === '/view');
        } else {
            match = routes.find((route) => location.pathname === route.path) || routes[0];
        }

        let urlParams = location.pathname.split('/').splice(2);
        let queryParams = location.search.split('?')[1]?.split('&');

        console.log(queryParams);

        const view = new match.view(urlParams, queryParams);
        await view.init();

        $('#app').innerHTML = '';
        $('#app').appendChild(await view.getView());

        if (location.pathname.startsWith('/view/')) {
            window.scrollTo(0, 163);
        } else if (location.pathname.startsWith('/create')) {
        }
    };

    navigate = (url) => {
        history.pushState(null, null, url);
        this.route();
    };
}
