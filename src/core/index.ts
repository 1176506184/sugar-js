import {Core} from "./types";
import parse from "../parser/parse";
import {mountHandleList, clearMounted} from "../hooks/onMounted";
import {clearReactive} from "../reactive/reactive";
import {guid} from "../utils/guid";

const makeSugar = function (options: Core) {
    let initHTML = ``;
    let initNode;
    let appId = guid();
    let Components = []
    window[`sugarBulkComponents_${appId}`] = [];
    options.appId = appId;
    let data = options.bulk();

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
            if (!m.used) {
                m.fun();
                m.used = true;
            }
        })
    }

    function unmount() {
        initNode.innerHTML = initHTML
        clearReactive();
        clearMounted();
    }

    function use(options: Core | Core[]) {
        if (options instanceof Array) {

            options.forEach((o: Core) => {
                Components.push(o)
                window[`sugarBulkComponents_${appId}`].push(o)
            })

            if (initNode) {
                parse(initNode, data, appId, 2);
            }

        } else {
            Components.push(options)
            window[`sugarBulkComponents_${appId}`].push(options)
            if (initNode) {
                parse(initNode, data, appId, 2);
            }
        }
    }

    if (!!options.renderDom) {
        window[`sugarBulkProp_${appId}`] = options.prop
        mount(options.renderDom);
        if (options.components.length > 0) {
            use(options.components)
        }

    }

    return {
        mount,
        data,
        unmount,
        appId,
        use,
        Components

    }
}

export default makeSugar