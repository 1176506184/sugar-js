function SNode2Html(obj) {
    let htmlStr = "";

    function work(obj) {
        const children = obj.children;
        let attrStr = "";
        let isFor = false;
        Object.keys(obj).map(key => {
            if (key !== 'nodeName' && key !== 'text' && key !== "children") {
                if (key !== 'style' && key !== 'viscus' && key !== 'guid' && key !== 'directive') {
                    attrStr += ` ${key}=${obj[key]}`
                } else if (key === 'style') {
                    let styleStr = ' style="';
                    Object.keys(obj[key]).map(k => {
                        styleStr += ` ${k}:${obj[key][k]};`
                    })
                    styleStr += `"`
                    attrStr += styleStr;
                } else if (key === 'guid') {
                    attrStr += ` s-guid=${obj[key]}`
                } else if (key === 'directive') {
                    if (obj[key]['s-for']) {
                        isFor = true;
                    }
                }
            }
        })

        if (!isFor) {
            htmlStr += `<${obj.nodeName}${attrStr}>${obj.text ? obj.text : ''}`;
        } else {
            htmlStr += `<${obj.nodeName} s-for s-guid="${obj['guid']}">`
        }


        if (children && children.length && !isFor) {
            children.map(c => {
                work(c)
            });
        }
        htmlStr += `</${obj.nodeName}>`;
    }

    work(obj);
    return htmlStr
}


function SNode2RNode(obj) {

    const root = this.el;

    function work(obj, parentNode) {
        const children = obj.children;
        let isFor = false;
        const node = document.createElement(obj['nodeName']);
        Object.keys(obj).map(key => {
            if (key !== 'nodeName' && key !== 'text' && key !== "children") {
                if (key !== 'style' && key !== 'viscus' && key !== 'directive') {
                    node.setAttribute(key, obj[key])
                } else if (key === 'style') {
                    let styleStr = '';
                    Object.keys(obj[key]).map(k => {
                        styleStr += ` ${k}:${obj[key][k]};`
                    })
                    styleStr += ``
                    node.setAttribute(key, styleStr)
                } else if (key === 'directive') {
                    if (obj[key]['s-for']) {
                        isFor = true;
                    }
                }
            }
        })

        if (children && children.length && !isFor) {
            children.map(c => {
                work(c, node)
            });
        }
    }

    work(obj, root);
}

export default SNode2Html