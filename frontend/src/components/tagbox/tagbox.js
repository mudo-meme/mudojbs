import tagboxDOM from './tagbox.html';
import './tagbox.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

import CustomEvents from '../../js/events';

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    tagCount = 0;
    myTags = [];

    myDOM = new DOMParser().parseFromString(tagboxDOM, 'text/html');

    constructor() {
        this.init();
    }

    init = async () => {
        window.addEventListener(`ATTACHED_COMPONENT_tagbox_`, this.attached, { once: true });
        window.addEventListener(`DEATTACHED_COMPONENT_tagbox_`, this.deattached, { once: true });
        this.myTags = [];
    };

    attached = async (event) => {
        console.log('Attached tagbox Component');

        $('input#tag-query').addEventListener('keydown', this.keyDownEvent);
        $('input#tag-query').addEventListener('keyup', this.keyUpEvent);
        $('div.tag-input-container').addEventListener('click', this.clickEvent);
    };

    deattached = (event) => {
        console.log('Deattached tagbox Component');
    };

    preText = null;

    keyDownEvent = (event) => {
        this.preText = $('input#tag-query').value.trim();
    };

    keyUpEvent = (event) => {
        if (event.defaultPrevented) return;

        const tagQuery = $('input#tag-query').value.trim();
        console.log(tagQuery);

        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter') {
            if (tagQuery !== '') this.appendTagItem(tagQuery);
        } else if (event.code === 'Backspace') {
            if (this.myTags.length < 1) return;
            if (tagQuery !== '') return;
            if (this.preText !== '') return;

            this.myTags.pop();
            const targetItem = $('.inputed-tag-item:last-of-type');
            targetItem.parentNode.removeChild(targetItem);
        }

        event.preventDefault();
    };

    appendTagItem = (tagText) => {
        const existItem = this.myTags.filter((item) => item.text === tagText);

        if (existItem.length > 0) {
            const targetItem = $(`div.inputed-tag-item[data-id='${existItem[0].id}']`);
            targetItem.addEventListener('animationend', (event) => {
                targetItem.classList.remove('highlight');
            });
            targetItem.classList.add('highlight');
            $('input#tag-query').value = '';
            return;
        }

        this.myTags.push({
            id: this.tagCount++,
            text: tagText,
        });

        const newDiv = document.createElement('div');
        const newSpanClose = document.createElement('span');
        const newSpanText = document.createElement('span');

        newSpanClose.setAttribute('class', 'material-symbols-rounded');
        newSpanClose.textContent = 'close';

        newSpanText.setAttribute('class', 'tag-item');
        newSpanText.textContent = tagText;

        newDiv.setAttribute('class', 'inputed-tag-item');
        newDiv.dataset.id = this.tagCount - 1;
        newDiv.appendChild(newSpanClose);
        newDiv.appendChild(newSpanText);

        // $('div.tag-input-inside').appendChild(newDiv);
        $('div.tag-input-inside').insertBefore(newDiv, $('input#tag-query'));
        $('input#tag-query').value = '';

        window.dispatchEvent(CustomEvents.UPDATED_TAGLIST(this.myTags));
    };

    clickEvent = (event) => {
        const tagItem = event.target.closest('.inputed-tag-item');

        if (tagItem) {
            const tagItemId = +tagItem.dataset.id;
            this.myTags = this.myTags.filter((item) => item.id !== tagItemId);
            console.log(this.myTags);
            tagItem.parentNode.removeChild(tagItem);
            window.dispatchEvent(CustomEvents.DELETED_TAGLIST(this.myTags));
        }

        $('input#tag-query').focus();
    };

    getTags = () => this.myTags;

    clearTags = () => {
        this.tagCount = 0;
        this.myTags = [];

        $$('div.inputed-tag-item').forEach((item) => {
            item.parentNode.removeChild(item);
        });
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
