export default class {
    isDev = false;

    BASE_URL = 'https://imbilly.site/api/v1';
    TEST_BASE_URL = 'http://localhost:8080/api/v1';

    abortController = null;
    isSearch = false;

    constructor() {}

    getImage = async (query, page = 1, size = 15) => {
        let fetchPromise = await this.myfetch(`/image?query=${query}&size=${size}&page=${page}`);
        return await fetchPromise.json();
    };

    getImagePopular = async (size = 10) => {
        let fetchPromise = await this.myfetch(`/image/popular?size=${size}`);
        return await fetchPromise.json();
    };

    getImageNew = async (size = 10) => {
        let fetchPromise = await this.myfetch(`/image/new?size=${size}`);
        return await fetchPromise.json();
    };

    getImageRandom = async (size = 50) => {
        let fetchPromise = await this.myfetch(`/image/random?size=${size}`);
        return await fetchPromise.json();
    };

    getImageDetail = async (id) => {
        let fetchPromise = await this.myfetch(`/image/${id}`);
        return await fetchPromise.json();
    };

    getImageRelated = async (tags, page = 1, size = 15) => {
        let fetchPromise = await this.myfetch(`/image/related?size=${size}`);
        return await fetchPromise.json();
    };

    postImage = async (size = 10) => {
        let formdata = new FormData();
        formdata.append('image', fileInput.files[0]);
        formdata.append('tags', '["하하","악플러","죄송한데악플러세요?"]');

        // image는 blob, tags는 json으로

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
        };

        fetch('https://imbilly.site/api/v1/image', requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
    };

    patchImageViewCount = async (size = 10) => {
        let fetchPromise = await this.myfetch(`/image/popular?size=${size}`);
        return await fetchPromise.json();
    };

    getImageKeyword = async (signal, query, size = 5) => {
        try {
            let fetchPromise = await fetch(this.BASE_URL + `/tag?query=${query}&size=${size}`, {
                signal,
            });
            return await fetchPromise.json();
        } catch (err) {}

        // let fetchPromise = await this.myfetch(`/tag?query=${query}&size=${size}`);
        // return await fetchPromise.json();
    };

    myfetch = (url) => {
        if (this.isDev) {
            return fetch(this.TEST_BASE_URL + url);
        } else {
            return fetch(this.BASE_URL + url);
        }
    };
}
