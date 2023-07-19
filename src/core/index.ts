import {Core} from "./types";
import parse from "../parser/parse";
import {mountHandleList} from "../hooks/onMounted";
import {clearReactive} from "../reactive/reactive";

const makeSugar = function (options: Core) {
    let data = options.bulk();
    let initHTML = ``;
    let initNode;

    function mount(node) {

        if (typeof node === 'string') {
            node = document.querySelector(node);
            if (!node) {
                console.error('did you make true node to sugar?')
                return
            }
        }

        initHTML = node.innerHTML;
        initNode = node;
        parse(node, data);
        document.body.setAttribute('s-load', "true")
        mountHandleList.map(m => {
            m();
        })
    }

    function unmount() {
        initNode.innerHTML = initHTML
        clearReactive();
    }

    return {
        mount,
        data,
        unmount
    }
}

export default makeSugar