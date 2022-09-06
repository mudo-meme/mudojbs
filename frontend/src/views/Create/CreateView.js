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
    myFiles = [];
    myFileCount = 0;
    currentId = -1;

    constructor(urlParams = null, queryParams = null) {
        super('create');
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        myDOM = new DOMParser().parseFromString(CreateView, 'text/html');

        window.addEventListener(`ATTACHED_VIEW_create`, this.attached, { once: true });
        window.addEventListener(`DEATTACHED_VIEW_create`, this.deattached, { once: true });

        window.addEventListener(`ADDED_PREVIEW_ITEM`, this.addedItem);
        window.addEventListener(`DELETED_PRVIEW_ITEM`, this.deletedItem);
        window.addEventListener(`SELECTED_PREVIEW_ITEM`, this.selectedItem);

        window.addEventListener(`UPDATED_TAGLIST`, this.updatedTagList);
        window.addEventListener(`DELETED_TAGLIST`, this.deletedTagList);

        await this.attachComponent();
    };

    attached = (event) => {
        console.log('Attached Create View');

        window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('filepreview'));
        window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('tagbox'));
        window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('previewlist'));

        $('ul.previewlist-list').addEventListener('click', this.clickEvent);
        $('#upload').addEventListener('click', this.uploadItem);
    };

    deattached = (event) => {
        console.log('Deattached Create View');

        window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('filepreview'));
        window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('tagbox'));
        window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('previewlist'));

        window.removeEventListener(`ADDED_PREVIEW_ITEM`, this.addedItem);
        window.removeEventListener(`DELETED_PRVIEW_ITEM`, this.deletedItem);
        window.removeEventListener(`SELECTED_PREVIEW_ITEM`, this.selectedItem);

        window.removeEventListener(`UPDATED_TAGLIST`, this.updatedTagList);
        window.removeEventListener(`DELETED_TAGLIST`, this.deletedTagList);
    };

    addedItem = (event) => {
        console.log(event.detail.files);

        for (let file of event.detail.files) {
            if (this.isExist(file)) continue;

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.addEventListener('load', (item) => {
                let newItem = {
                    id: this.myFileCount++,
                    name: file.name,
                    file,
                    size: file.size,
                    data: item.target.result,
                    tags: null,
                };

                this.myFiles.push(newItem);

                // filePreview.showImage(this.myFiles[0].data);
                previewList.appendPreviewItem(newItem);
                this.selectedItem({ detail: { id: this.myFiles[0].id } });
            });
        }
    };

    deletedItem = (event) => {
        console.log(event);
        this.myFiles = this.myFiles.filter((item) => item.id !== event.detail.id);
        previewList.deletePreviewItem(event.detail.id);

        const currentIndex = this.myFiles.findIndex((item) => item.id === this.currentId);

        if (currentIndex === -1) {
            filePreview.hideImage();
        } else {
            filePreview.pagination(currentIndex + 1, this.myFiles.length);
        }
    };

    isExist = (file) =>
        this.myFiles.some((item) => item.name === file.name && item.size === file.size);

    selectedItem = (event) => {
        this.currentId = event.detail.id;
        const selectedTargetItem = $(`li.previewlist-item.selected`);

        if (selectedTargetItem) {
            selectedTargetItem.classList.remove('selected');
        }

        const targetItem = $(`li[data-item-id='${this.currentId}']`);
        targetItem.classList.add('selected');
        filePreview.showImage(
            this.myFiles.find((item) => item.id === +targetItem.dataset.itemId).data
        );
        $('div.file-preview-container').classList.add('loaded');

        const targetTag = this.myFiles.find((item) => item.id === this.currentId).tags;
        tagBox.clearTags();

        if (targetTag !== null) {
            targetTag.forEach((item) => {
                tagBox.appendTagItem(item.text);
            });
        }

        if ($('div.navigate').classList.contains('hide')) {
            $('div.navigate').classList.remove('hide');
        }

        const currentIndex = this.myFiles.findIndex((item) => item.id === this.currentId);
        filePreview.pagination(currentIndex + 1, this.myFiles.length);
    };

    updatedTagList = (event) => {
        console.log(event.detail.tags);
        this.myFiles[this.myFiles.findIndex((item) => item.id === this.currentId)].tags =
            event.detail.tags;
    };

    deletedTagList = (event) => {
        this.myFiles.find((item) => item.id === this.currentId).tags = event.detail.tags;
    };

    clickEvent = (event) => {};

    uploadItem = async (event) => {
        const isBlank = this.myFiles.some((item) => item.tags === null || item.tags.length === 0);

        if (isBlank) {
            alert('태그를 최소한 한 개 이상 작성해주세요.');
            // TODO Select the item that has no item
            return;
        }

        const uploadPromises = [];

        for (let uploadItem of this.myFiles) {
            const formData = new FormData();
            formData.append('image', uploadItem.file);
            formData.append(
                'tags',
                new Blob([JSON.stringify(uploadItem.tags.map((item) => item.text))], {
                    type: 'application/json',
                })
            );

            const requestOptions = {
                method: 'POST',
                body: formData,
                contentType: 'multipart/form-data',
                redirect: 'follow',
            };

            uploadPromises.push(fetch('https://imbilly.site/api/v1/image', requestOptions));
        }

        const responseList = await Promise.all(uploadPromises);
        responseList.forEach(async (item) => {
            console.log(await item.json());
        });
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
