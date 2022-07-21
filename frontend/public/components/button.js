import ButtonDOMSource from './button.html';

export default class extends HTMLElement {
    constructor() {
        super();

        let ButtonDOM = new DOMParser().parseFromString(ButtonDOMSource, 'text/html');

        const template = ButtonDOM.querySelector('#button-basic');
        const templateContent = template.content;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
}
