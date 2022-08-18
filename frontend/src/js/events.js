// -----------------FOR VIEW------------------ //
const ATTACHED_VIEW = (target) => {
    return new CustomEvent(`ATTACHED_VIEW_${target}`, {
        detail: {
            target,
        },
    });
};

const DEATTACHED_VIEW = (target) => {
    return new CustomEvent(`DEATTACHED_VIEW_${target}`, {
        detail: {
            target,
        },
    });
};

// -----------------FOR COMPONENT------------------ //
const ATTACHED_COMPONENT = (type, target = '') => {
    return new CustomEvent(`ATTACHED_COMPONENT_${type}_${target}`, {
        detail: {
            type,
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

// -----------------FOR MASONRYLIST------------------ //
const CONTENT_LOAD = (target) => {
    return new CustomEvent('CONTENT_LOAD', {
        detail: {
            target,
        },
    });
};

// -----------------FOR PREVIEWLIST & FILEPREVIEW------------------ //
const ADDED_PRVIEW_ITEM = (files) => {
    return new CustomEvent('ADDED_PREVIEW_ITEM', {
        detail: {
            files,
        },
    });
};

const DELETED_PRVIEW_ITEM = (id) => {
    return new CustomEvent('DELETED_PRVIEW_ITEM', {
        detail: {
            id,
        },
    });
};

const SELECTED_PREVIEW_ITEM = (id) => {
    return new CustomEvent('SELECTED_PREVIEW_ITEM', {
        detail: {
            id,
        },
    });
};

// -----------------FOR TAGBOX------------------ //
const DELETED_TAGLIST = (tags) => {
    return new CustomEvent('DELETED_TAGLIST', {
        detail: {
            tags,
        },
    });
};

const UPDATED_TAGLIST = (tags) => {
    return new CustomEvent('UPDATED_TAGLIST', {
        detail: {
            tags,
        },
    });
};

export default {
    ATTACHED_VIEW,
    ATTACHED_COMPONENT,
    DEATTACHED_VIEW,
    DEATTACHED_COMPONENT,
    CONTENT_LOAD,
    ADDED_PRVIEW_ITEM,
    DELETED_PRVIEW_ITEM,
    SELECTED_PREVIEW_ITEM,
    DELETED_TAGLIST,
    UPDATED_TAGLIST,
};
