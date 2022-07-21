import AbstractView from './AbstractView';
import CreateView from './CreateView.html';
import '../scss/create.scss';

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    async getHtml() {
        return CreateView;
    }
}
