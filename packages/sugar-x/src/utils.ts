export const nodeUtils = {
    cElm: (tag) => {
        return document.createElement(tag)
    },
    cText: (text = "") => {
        return document.createTextNode(text)
    }
}

export function toUnderLine(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export const eventMap = ['click', 'dblclick', 'click.right', 'change', 'focus', 'blur',
    'mouseover', 'mouseenter', 'select', 'fullscreenchange', 'mousedown',
    'mousemove', 'mouseup', 'resize', 'abort', 'error', 'keydown', 'keypress',
    'keyup', 'reset', 'submit', 'load', 'unload']