import AbstractView from './AbstractView';
import ExploreView from './ExploreView.html';
import '../scss/explore.scss';

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    async getHtml() {
        return ExploreView;
    }
}
