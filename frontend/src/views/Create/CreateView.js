import AbstractView from '../AbstractView';
import CreateView from './CreateView.html';
import './CreateView.scss';

import FilePreviewComponent from '../../components/filepreview/filepreview';
let filePreview = null;

import PreviewListComponent from '../../components/previewlist/previewlist';
let previewList = null;

import TagBoxComponent from '../../components/tagbox/tagbox';
let tagBox = null;

import CustomEvents from '../../js/events';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

let myDOM = null;

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        window.addEventListener(`ATTACHED_VIEW`, this.attached, { once: true });
        myDOM = new DOMParser().parseFromString(CreateView, 'text/html');
        await this.attachComponent();
    };

    attached = (event) => {
        if (event.detail.target === 'create') {
            console.log('Attached Create View');

            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('filepreview'));
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('tagbox'));
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('previewlist'));

            $('ul.previewlist-list').addEventListener('click', this.clickEvent);

            $('.file-preview-container').addEventListener('dragenter', this.dragenterEvent);
            $('.file-preview-container').addEventListener('dragover', this.dragoverEvent);
            $('.file-preview-container').addEventListener('drop', this.dropEvent);
        }
    };

    clickEvent = (event) => {
        if (event.target.closest('li.previewlist-item')) {
            if ($('li.previewlist-item.selected')) {
                $('li.previewlist-item.selected').classList.remove('selected');
            }

            const targetItem = event.target.closest('li');
            if (!targetItem.classList.contains('add')) {
                targetItem.classList.add('selected');
                filePreview.showImage(previewList.myPreviewItem[+targetItem.dataset.itemId].data);

                $('div.file-preview-container').classList.add('loaded');
            }
        }
    };

    attachComponent = async () => {
        const root = $('.page-inside', myDOM);

        filePreview = new FilePreviewComponent();
        previewList = new PreviewListComponent();
        tagBox = new TagBoxComponent();

        $('div.upload-container', myDOM).insertBefore(
            await filePreview.getComponent(),
            $('div.upload-section', myDOM)
        );

        $('div.upload-section', myDOM).insertBefore(
            await previewList.getComponent(),
            $('div.writing-tag-container', myDOM)
        );

        $('div.upload-section', root).appendChild(await tagBox.getComponent());
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
