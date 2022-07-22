export default class {
    constructor() {}

    getImage = async (query, page = 1, size = 15) => {
        let fetchPromise = await fetch(`/api/image?count=${size}`);
        return await fetchPromise.json();
    };
}
