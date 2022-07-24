import AbstractView from './AbstractView';
import ExploreView from './ExploreView.html';
import '../scss/explore.scss';

export default class extends AbstractView {
    myDOM = new DOMParser().parseFromString(ExploreView, 'text/html');

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = () => {};

    async getView() {
        return this.myDOM.body.childNodes[0];
    }
}
