import {createEffect} from "../main";
import {getDataWithKeyExtra} from "./getDataWithKeyStr";
import deepClone from "../utils/deepClone";
import parse from "./parse";
import {guid} from "../utils/guid";

function bindSForElement(n, appId?, data?: any) {

    let forMatch = getMatch(n.getAttribute('s-for'))
    n.removeAttribute('s-for')
    forMatch.if = n.getAttribute('s-if')
    n.removeAttribute('s-if')
    forMatch.appId = appId
    forMatch.fragment = n
    let comment = document.createComment('s-for');
    n.before(comment);
    forMatch.comment = comment;
    forMatch.reactive = n.innerHTML?.match(/{{(.+?)}}/ig) ? n.innerHTML?.match(/{{(.+?)}}/ig) : []
    n.remove();

    createEffect(() => {
        update(forMatch.signal, forMatch)
    })

}

function getMatch(attr: any) {

    attr = attr.split(' in ');
    let row = attr[0].split(',');

    return {
        row: row[0],
        index: row.length > 1 ? row[1] : null,
        signal: attr[1],
        if: null as any,
        appId: '',
        oldNode: [],
        mount: false,
        fragment: null,
        comment: null,
        reactive: [],
        listId: guid()
    }
}

function update(signal, forMatch) {


    if (!forMatch.mounted) {
        forMatch.mounted = true;
    } else {
        for (let i = 0; i < forMatch.oldNode.length; i++) {
            forMatch.oldNode[i]?.remove();
        }
        forMatch.oldNode = []
    }


    let lastNode = forMatch.comment;

    let list = getDataWithKeyExtra(forMatch.signal, forMatch.appId);

    list.forEach((item, index): any => {


        if (forMatch.if) {

            let ifFun = replaceIf(forMatch, index);
            if (!getDataWithKeyExtra(ifFun, forMatch.appId)) {
                return
            }

        }

        let newNode = forMatch.fragment.cloneNode(true);
        replaceAttr(newNode, forMatch.row, forMatch.signal, forMatch.appId, index)
        replaceHtml(newNode, forMatch, index)
        forMatch.oldNode.push(newNode);
        lastNode.after(newNode)
        parse(newNode, window[`sugarBulk_${forMatch.appId}`], forMatch.appId)
        lastNode = newNode
    })


}

function replaceIf(forMatch, i) {

    return forMatch.if.replace(forMatch.row, `${forMatch.signal}[${i}]`)

}

function replaceHtml(n, forMatch, i) {

    function work(n) {

        n.childNodes.forEach((ns, index) => {

            if (ns.nodeType === 3) {
                updateHtml(ns)
            }

            if (ns.childNodes.length > 0) {
                work(ns);
            }

        })

    }

    function updateHtml(na) {
        if (getFirstKey(na.textContent.match(/{{(.+?)}}/)[1]) === forMatch.row) {
            na.textContent = na.textContent.replace(forMatch.row, `${forMatch.signal}[${i}]`)
        }

    }

    work(n);

}

function getFirstKey(keyStr) {

    let keyArr = keyStr.split('.');
    let keyExArr = keyStr.split('[')
    return keyArr[0].length > keyExArr[0].length ? keyExArr[0] : keyArr[0]
}

function replaceAttr(n, d, dc, appId, i) {

    updateAttr(n)

    function work(n) {

        n.childNodes.forEach((ns, index) => {

            updateAttr(ns)

            if (ns.childNodes.length > 0) {
                work(ns)
            }
        })

    }

    function updateAttr(na) {
        if (na.attributes) {

            let attributes = Array.from(na.attributes).map((a: any) => {
                return {
                    name: a.name,
                    value: a.value
                }
            });

            attributes.forEach((attr: any) => {

                if (attr.value.indexOf(d) > -1) {
                    na.removeAttribute(attr.name)
                    na.setAttribute(attr.name, attr.value.replace(d, `window['sugarBulk_${appId}'].${dc}[${i}]`))
                }

            })

        }
    }

    work(n)

}


export default bindSForElement

export {getFirstKey}