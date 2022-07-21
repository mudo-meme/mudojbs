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
        console.log('Created Router ');
    }

    route = async () => {
        let match = routes.find((route) => location.pathname === route.path) || routes[0];

        const view = new match.view();
        $('#app').innerHTML = await view.getHtml();
    };

    navigate = (url) => {
        history.pushState(null, null, url);
        this.route();
    };
}
