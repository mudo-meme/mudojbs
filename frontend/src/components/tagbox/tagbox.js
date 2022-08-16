import tagboxDOM from './tagbox.html';
import './tagbox.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

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
        this.myTags = [];
    };

    attached = async (event) => {
        console.log('Attached tagbox Component');

        $('input#tag-query').addEventListener('keyup', this.keyUpEvent);
        $('div.tag-input-container').addEventListener('click', this.clickEvent);
    };

    keyUpEvent = (event) => {
        if (event.defaultPrevented) return;

        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter') {
            const tagQuery = $('input#tag-query').value.trim();
            if (tagQuery !== '') this.appendTagItem(tagQuery);
        } else if (event.code === 'Backspace') {
            if (this.myTags.length < 1) return;

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
    };

    clickEvent = (event) => {
        const tagItem = event.target.closest('.inputed-tag-item');

        if (tagItem) {
            const tagItemId = +tagItem.dataset.id;
            this.myTags = this.myTags.filter((item) => item.id !== tagItemId);
            console.log(this.myTags);
            tagItem.parentNode.removeChild(tagItem);
        }

        $('input#tag-query').focus();
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
