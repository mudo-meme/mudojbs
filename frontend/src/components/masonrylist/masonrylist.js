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

    setLoadFunction = (func, params) => {
        func.bind(this, params);
        this.loadFunc = func;
        // this.loadFunc.bind(this);
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
        for (let item of imageList) {
            this.loadImage(item.imageUrl).then((element) => {
                this.createMasonryItem({ element, id: item.id });
            });
        }
    };

    createMasonryItem = (itemInfo) => {
        let newDiv = document.createElement('div');
        let newA = document.createElement('a');

        newA.setAttribute('href', `/view/${itemInfo.id}`);
        newA.appendChild(itemInfo.element);
        newDiv.setAttribute('class', 'masonry-item');
        newDiv.appendChild(newA);

        $('.masonry-container').appendChild(newDiv);
        this.masonryLayout();
    };

    loadImage = async (url) => {
        return new Promise((resolve, reject) => {
            const tmpImg = document.createElement('img');
            tmpImg.setAttribute('src', url);

            tmpImg.addEventListener('load', (event) => resolve(tmpImg), {
                once: true,
            });

            tmpImg.src = url;
        });
    };

    // waitForImages = () => {
    //     const allMasonryItems = [...$$('.masonry-item img')];
    //     const allPromises = allMasonryItems.map(
    //         (item) =>
    //             new Promise((res) => {
    //                 if (item.complete) return res();
    //                 item.onload = () => res();
    //                 item.onerror = () => res();
    //             })
    //     );

    //     return Promise.all(allPromises);
    // };

    attached = async (event) => {
        switch (event.detail.target) {
            case 'new':
                console.log(`Attached masonrylist(${event.detail.target}) component`);
                break;

            case 'related':
                console.log(`Attached masonrylist(${event.detail.target}) component`);
                break;
        }

        // await this.waitForImages();
        // this.masonryLayout();

        // const config = { attributes: true, childList: true, subtree: true };
        // const observer = new MutationObserver((mutation, observer) => {
        //     let lastItem = $('.masonry-item:last-child');

        //     // console.log(lastItem);
        //     const io = new IntersectionObserver(
        //         async (entry, observer) => {
        //             const ioTarget = entry[0].target;
        //             // console.log(ioTarget);
        //             io.unobserve(ioTarget);

        //             //         if (entry[0].isIntersecting) {
        //             //             io.unobserve(lastItem);

        //             //             await this.loadFunc();
        //             //             // await this.waitForImages();

        //             //             lastItem = $('.masonry-item:last-child');
        //             //             io.observe(lastItem);
        //             //         }
        //         },
        //         {
        //             threshold: 0.5,
        //         }
        //     );

        //     io.disconnect();
        //     io.observe(lastItem);
        // });

        // observer.observe($('div.masonry-container'), config);
    };

    deattached = (event) => {
        window.removeEventListener('resize', this.resizeEvent);
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
