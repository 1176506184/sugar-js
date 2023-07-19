import eventCenter from "./eventCenter";

function updateDom(viscus, data) {

    let _this = this;
    console.log(`开始根据脏值更新DOM`)
    console.log(viscus)
    Object.keys(viscus).forEach(v => {

        let vis = viscus[v]['viscus'];
        let html = viscus[v]['text'];
        let guid = viscus[v]['guid'];
        let directive = viscus[v]['directive'];
        let children = viscus[v]['children'];
        BindEvent.apply(_this, [directive, guid]);

        if (directive['s-for']) {
            BindForElement(directive['s-for'], viscus[v], data)
        } else {
            BindTextElement(vis, html, data, guid);
        }

    })


}

function BindTextElement(vis, html, data, guid) {

    let htmStr = html.toString();

    vis.forEach(s => {


        let value = getDataWithKeyStr(data, s);


        htmStr = htmStr.replace(`{{${s}}}`, value)

        if (s === 'b.box') {
            console.log(s, value, htmStr);
        }

    })

    document.querySelector(`[s-guid="${guid}"]`).innerHTML = htmStr;


}

function BindForElement(vis, viscus, data) {

    let v = vis.split(' in ');
    v = v.map(s => {
        return s.trim()
    })
    let list = getDataWithKeyStr(data, v[1]);

    console.log(`%c${list}`, "color:red");
    console.log(viscus);

    let OldNodes = document.querySelectorAll(`[s-for-pid="${viscus['guid']}"]`);
    console.log(OldNodes);
    list.forEach((item, index) => {
        if (OldNodes[index]) {
            OldNodes[index].innerHTML = item;
        } else {
            let div = document.createElement(viscus.nodeName);
            div.setAttribute('s-for-pid', viscus['guid'])
            Object.keys(viscus).forEach(v => {
                if (v === 'style') {

                    let styleStr = '';
                    Object.keys(viscus[v]).map(k => {
                        styleStr += ` ${k}:${viscus[v][k]};`
                    })
                    div.setAttribute(v, styleStr);
                }
            })
            div.innerHTML = item;
            document.querySelector(`[s-guid="${viscus['guid']}"]`).before(div);
        }
    })

    if (OldNodes.length > list.length) {

        OldNodes.forEach((item, index) => {
            if (index >= list.length) {
                OldNodes[index].remove();
            }
        })

    }


}


export function BindEvent(directive, guid) {
    let _this = this;
    console.log(this.methods);

    Object.keys(directive).forEach(key => {

        console.log("key", key)
        if (eventCenter.getEvent(guid, key)) {
            return;
        } else if (key === 's-click') {
            // console.log("是否绑定事件",directive)
            let handle = _this.methods[directive[key]];
            eventCenter.pushEvent(guid, key, handle);
            document.querySelector(`[s-guid="${guid}"]`).addEventListener('click', (...args) => {
                handle.apply(_this, args);
            });
        } else if (key === 's-change') {
            let handle = _this.methods[directive[key]];
            eventCenter.pushEvent(guid, key, handle);
            document.querySelector(`[s-guid="${guid}"]`).addEventListener('input', (...args) => {
                handle.apply(_this, args);
            });
        }
    })

}

function getDataWithKeyStr(data, keyStr) {
    let dataClone = JSON.parse(JSON.stringify(data));
    keyStr = keyStr.split('.');
    console.log("键值对数组", keyStr);
    for (let i = 0; i < keyStr.length; i++) {
        console.log(keyStr[i]);
        console.log(dataClone)
        dataClone = dataClone[keyStr[i]];

        if (!dataClone) {
            break;
        }
    }
    return dataClone;
}

export default updateDom;