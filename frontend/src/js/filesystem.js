export default class FileSystem {
    constructor() {}

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
}
