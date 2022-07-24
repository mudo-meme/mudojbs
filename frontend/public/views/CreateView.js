import AbstractView from './AbstractView';
import CreateView from './CreateView.html';
import '../scss/create.scss';

export default class extends AbstractView {
    myDOM = new DOMParser().parseFromString(CreateView, 'text/html');

    $ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelector(param);
    $$ = (param, defaultDOM = this.myDOM) => defaultDOM.querySelectorAll(param);

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        this.$('.file-preview-container').addEventListener('dragenter', this);
        this.$('.file-preview-container').addEventListener('dragover', this);
        this.$('.file-preview-container').addEventListener('drop', this);
    };

    dragenterEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    dragoverEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    dropEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const dt = event.dataTransfer;
        const files = dt.files;

        this.handleFiles(files);
    };

    handleFiles = (files) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.startsWith('image/')) {
                continue;
            }

            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                this.$('#preview-image', document).src = event.target.result;
                this.$('.file-preview-container > .image-wrapper', document).classList.add(
                    'loaded'
                );
                this.$('.file-preview-container > p', document).classList.add('hide');
            });

            reader.readAsDataURL(file);
        }
    };

    handleEvent = (event) => {
        this[`${event.type}Event`](event);
    };

    async getView() {
        return this.myDOM.body.childNodes[0];
    }
}
