import masonryListDOM from './masonrylist.html';
import './masonrylist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(masonryListDOM, 'text/html');
    isAttached = false;
    containerName = null;
    isDev = false;

    loadFunc = null;

    constructor(containerName, title = '') {
        this.containerName = containerName;
        this.init(title);
    }

    init = async (title) => {
        if (title === '') {
            $('p.title', this.myDOM).classList.add('hide');
        } else {
            $('p.title', this.myDOM).textContent = title;
        }

        window.addEventListener(
            `ATTACHED_COMPONENT_masonrylist_${this.containerName}`,
            this.attached,
            {
                once: true,
            }
        );

        window.addEventListener(
            `DEATTACHED_COMPONENT_masonrylist_${this.containerName}`,
            this.deattached,
            {
                once: true,
            }
        );

        window.addEventListener('resize', this.resizeEvent);
    };

    setLoadFunction = (func) => {
        this.loadFunc = func;
    };

    resizeEvent = (event) => {
        this.debounce(this.masonryLayout(event), 5);
    };

    debounce = (func, duration) => {
        let timeout = null;

        return (argument) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                func(argument);
                timeout = null;
            }, duration);
        };
    };

    masonryLayout = () => {
        const masonryContainerStyle = getComputedStyle($('.masonry-container'));

        const columnGap = parseInt(masonryContainerStyle.getPropertyValue('column-gap'));
        const autoRows = parseInt(masonryContainerStyle.getPropertyValue('grid-auto-rows'));

        $$('.masonry-item').forEach((elt) => {
            elt.style.gridRowEnd = `span ${Math.ceil(
                $('img', elt).scrollHeight / autoRows + columnGap / autoRows
            )}`;
        });
    };

    appendImages = async (imageList, initial = false) => {
        let listObject = null;

        if (!this.isDev) {
            listObject = imageList;
        } else {
            listObject = imageList;
        }

        for (let imageItem of listObject) {
            let newDiv = initial ? this.myDOM.createElement('div') : document.createElement('div');
            let newA = initial ? this.myDOM.createElement('a') : document.createElement('a');
            let newImg = initial ? this.myDOM.createElement('img') : document.createElement('img');

            if (this.isDev) {
                newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
                newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            } else {
                newA.setAttribute('href', `/view/${imageItem.id}`);
                newImg.setAttribute('src', `${imageItem.imageUrl}`);
            }

            newDiv.setAttribute('class', 'masonry-item');
            newImg.addEventListener('load', this.masonryLayout, { once: true });
            newA.appendChild(newImg);
            newDiv.appendChild(newA);

            if (initial) {
                $('.masonry-container', this.myDOM).appendChild(newDiv);
            } else {
                $('.masonry-container').appendChild(newDiv);
            }
        }
    };

    waitForImages = () => {
        const allMasonryItems = [...$$('.masonry-item img')];
        const allPromises = allMasonryItems.map(
            (item) =>
                new Promise((res) => {
                    if (item.complete) return res();
                    item.onload = () => res();
                    item.onerror = () => res();
                })
        );

        return Promise.all(allPromises);
    };

    attached = async (event) => {
        switch (event.detail.target) {
            case 'new':
                console.log(`Attached masonrylist(${event.detail.target}) component`);
                break;

            case 'related':
                console.log(`Attached masonrylist(${event.detail.target}) component`);
                break;
        }

        await this.waitForImages();
        this.masonryLayout();

        let lastItem = $('.masonry-item:last-child');

        const io = new IntersectionObserver(
            async (entry, observer) => {
                const ioTarget = entry[0].target;

                if (entry[0].isIntersecting) {
                    io.unobserve(lastItem);
                    // this.appendImages(await imageAPI.getImageRandom());
                    console.log(this.loadFunc);
                    this.loadFunc();

                    lastItem = $('.masonry-item:last-child');
                    io.observe(lastItem);
                }
            },
            {
                threshold: 0.5,
            }
        );

        io.observe(lastItem);
    };

    deattached = (event) => {
        window.removeEventListener('resize', this.resizeEvent);
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
