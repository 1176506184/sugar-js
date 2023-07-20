import getDataWithKeyStr from "../parser/getDataWithKeyStr";

function BindEvent(node, appId) {

    Array.from(node.attributes).forEach((a: any) => {
        if (a.name.indexOf('s-on:') > -1) {
            node.addEventListener(a.name.replace('s-on:', ''), () => {
                window[`sugarBulk_${appId}`][a.value]();
                node.removeAttribute(a.name);
            })
        }
    })

}

export {
    BindEvent
}