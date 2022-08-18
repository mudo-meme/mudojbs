import masonryListDOM from './masonrylist.html';
import './masonrylist.scss';

import CustomEvents from '../../js/events';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(masonryListDOM, 'text/html');
    isAttached = false;
    containerName = null;
    isDev = false;

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

    appendImages = async (imageList) => {
        let loadPromises = [];

        for (let item of imageList) {
            loadPromises.push(this.loadImage(item.imageUrl));
        }

        let listObject = await Promise.all(loadPromises);

        listObject = listObject.map((item, index) => {
            return { index, element: item, id: imageList[index].id };
        });

        listObject.forEach((item) => {
            this.createMasonryItem({ element: item.element, id: item.id });
        });
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

    attached = async (event) => {
        console.log(`Attached masonrylist(${event.detail.target}) component`);

        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver((mutation, observer) => {
            let lastItem = $('.masonry-item:last-child');

            const io = new IntersectionObserver(
                async (entry, observer) => {
                    const ioTarget = entry[0].target;

                    if (entry[0].isIntersecting) {
                        io.unobserve(lastItem);
                        window.dispatchEvent(CustomEvents.CONTENT_LOAD());
                    }
                },
                {
                    threshold: 0.5,
                }
            );

            io.observe(lastItem);
        });

        observer.observe($('div.masonry-container'), config);
    };

    deattached = (event) => {
        console.log(`Dattached masonrylist(${event.detail.target}) component`);
        window.removeEventListener('resize', this.resizeEvent);
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
