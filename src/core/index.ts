import {Core} from "./types";
import parse from "../parser/parse";
import {mountHandleList} from "../hooks/onMounted";
import {clearReactive} from "../reactive/reactive";
import {guid} from "../utils/guid";

const makeSugar = function (options: Core) {
    let data = options.bulk();
    let initHTML = ``;
    let initNode;
    let appId = guid();
    let Components = []
    window[`sugarBulkComponents_${appId}`] = [];

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
        parse(node, data, appId);

        document.body.setAttribute('s-load', "true")
        mountHandleList.map(m => {
            m();
        })
    }

    function unmount() {
        initNode.innerHTML = initHTML
        clearReactive();
    }

    function use(options: Core) {
        Components.push(options)
        window[`sugarBulkComponents_${appId}`].push(options)
        if (initNode) {
            parse(initNode, data, appId, 2);
        }
    }

    if (!!options.renderDom) {
        window[`sugarBulkProp_${appId}`] = options.prop
        mount(options.renderDom);
    }

    function updateProp() {

    }

    return {
        mount,
        data,
        unmount,
        appId,
        use,
        updateProp
    }
}

export default makeSugar