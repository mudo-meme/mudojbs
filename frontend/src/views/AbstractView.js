export default class {
    constructor(pageName = 'default') {
        // window.addEventListener(`ATTACHED_VIEW_${pageName}`, this.attached, { once: true });
        // window.addEventListener(`DEATTACHED_VIEW_${pageName}`, this.deattached, { once: true });
    }

    init = () => {
        // this.attached.bind(thisObject);
    };

    attached = (event) => {
        // console.log('Attach ');
    };

    deattached = (event) => {
        // console.log('Deattach');
    };

    setTitle = (newTitle) => {
        document.title = newTitle;
    };

    attachComponent = async () => {};

    async getView() {}
}
