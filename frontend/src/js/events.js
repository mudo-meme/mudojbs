const ATTACHED_VIEW = (target) => {
    return new CustomEvent('ATTACHED_VIEW', {
        detail: {
            target,
        },
    });
};

const ATTACHED_COMPONENT = (type, target = '') => {
    return new CustomEvent(`ATTACHED_COMPONENT_${type}_${target}`, {
        detail: {
            type,
            target,
        },
    });
};

const DEATTACHED_VIEW = (target) => {
    return new CustomEvent('DEATTACHED_VIEW', {
        detail: {
            target,
        },
    });
};

const DEATTACHED_COMPONENT = (type, target = '') => {
    return new CustomEvent(`DEATTACHED_COMPONENT_${type}_${target}`, {
        detail: {
            type,
            target,
        },
    });
};

const CONTENT_LOAD = (target) => {
    return new CustomEvent('CONTENT_LOAD', {
        detail: {
            target,
        },
    });
};

export default {
    ATTACHED_VIEW,
    ATTACHED_COMPONENT,
    DEATTACHED_VIEW,
    DEATTACHED_COMPONENT,
    CONTENT_LOAD,
};
