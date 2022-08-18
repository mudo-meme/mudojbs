import previewListDOM from './previewlist.html';
import './previewlist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

import CustomEvents from '../../js/events';

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(previewListDOM, 'text/html');

    constructor() {
        this.init();
    }

    init = async () => {
        window.addEventListener(`ATTACHED_COMPONENT_previewlist_`, this.attached, {
            once: true,
        });

        window.addEventListener(`DEATTACHED_COMPONENT_previewlist_`, this.deattached, {
            once: true,
        });
    };

    attached = async (event) => {
        console.log(`Attached previewlist component`);

        $('li.previewlist-item.add').addEventListener('click', (event) => {
            this.openSelector().then(this.loadImages);
        });

        $('ul.previewlist-list').addEventListener('click', this.clickEvent);
    };

    clickEvent = (event) => {
        if (event.target.tagName.toLowerCase() === 'ul') return;

        const targetItem = event.target.closest('li');
        const targetId = +targetItem.dataset.itemId;

        if (event.target.closest('div.delete-btn')) {
            window.dispatchEvent(CustomEvents.DELETED_PRVIEW_ITEM(targetId));

            // this.myPreviewItem = this.myPreviewItem.filter((item) => item.id !== targetId);

            // targetItem.parentNode.removeChild(targetItem);
        } else if (event.target.closest('li.previewlist-item')) {
            if (!event.target.closest('li.previewlist-item').classList.contains('add')) {
                window.dispatchEvent(CustomEvents.SELECTED_PREVIEW_ITEM(targetId));
            }
        }
    };

    loadImages = (files) => {
        // const fileList = [...files];
        window.dispatchEvent(CustomEvents.ADDED_PRVIEW_ITEM(files));
        // fileList.forEach((item) => {
        //     const fileReader = new FileReader();
        //     fileReader.readAsDataURL(item);

        //     fileReader.addEventListener('load', (event) => {
        //         console.log(`${item.name} / loaded`);

        //         let newItem = {
        //             id: this.myPreviewCount++,
        //             name: item.name,
        //             file: item,
        //             data: event.target.result,
        //         };

        //         this.myPreviewItem.push(newItem);
        //         this.appendPreviewItem(newItem);
        //     });
        // });
    };

    appendPreviewItem = (previewItem) => {
        const newSpan = document.createElement('span');
        const newDivDelete = document.createElement('div');
        const newImg = document.createElement('img');
        const newDivWrapper = document.createElement('div');
        const newLi = document.createElement('li');

        newSpan.setAttribute('class', 'material-symbols-rounded');
        newSpan.textContent = 'close';

        newDivDelete.setAttribute('class', 'delete-btn');
        newDivDelete.appendChild(newSpan);

        newImg.setAttribute('src', previewItem.data);
        newImg.setAttribute('file', previewItem.file);
        newDivWrapper.setAttribute('class', 'img-wrapper');
        newDivWrapper.appendChild(newImg);

        newLi.setAttribute('class', 'previewlist-item');
        newLi.dataset.itemId = previewItem.id;
        newLi.appendChild(newDivDelete);
        newLi.appendChild(newDivWrapper);

        $('ul.previewlist-list').insertBefore(newLi, $('li.previewlist-item.add'));
    };

    deletePreviewItem = (id) => {
        const targetItem = $(`li[data-item-id='${id}']`);
        if (!targetItem) return;

        targetItem.parentNode.removeChild(targetItem);
    };

    // <li class="previewlist-item" data-item-id="0">
    //     <div class="delete-btn">
    //         <span class="material-symbols-rounded"> close </span>
    //     </div>
    //     <div class="img-wrapper">
    //         <img src="../../assets/images/test_asset/106.jpg" alt="" />
    //     </div>
    // </li>

    openSelector = () => {
        let lock = false;

        return new Promise((resolve, reject) => {
            const inputElement = document.createElement('input');

            inputElement.setAttribute('type', 'file');
            inputElement.setAttribute('id', 'file-element');
            inputElement.setAttribute('multiple', '');
            inputElement.setAttribute('accept', 'image/*');
            inputElement.setAttribute('style', 'display: none;');

            inputElement.addEventListener(
                'change',
                () => {
                    lock = true;
                    resolve(inputElement.files);
                },
                { once: true }
            );

            inputElement.click();
        });
    };

    deattached = (event) => {
        console.log(`Deattached previewlist component`);
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
