import filePreviewDOM from './filepreview.html';
import './filepreview.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(filePreviewDOM, 'text/html');

    constructor() {
        this.init();
    }

    init = async () => {
        window.addEventListener(`ATTACHED_COMPONENT_filepreview_`, this.attached, { once: true });
    };

    attached = async (event) => {
        console.log('Attached filepreview Component');
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
                // $('#preview-image').src = event.target.result;
                this.showImage(event.target.result);
            });

            reader.readAsDataURL(file);
        }
    };

    showImage = (imageData) => {
        $('#preview-image').src = imageData;
        $('.file-preview-container > .image-wrapper').classList.add('loaded');
        $('.file-preview-container > p').classList.add('hide');
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
