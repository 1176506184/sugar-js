const sanboxDiv = document.createElement('div');
sanboxDiv.style.width = '300px';
sanboxDiv.style.height = '300px';
document.body.appendChild(sanboxDiv);

// 构造执行环境
function sandbox(code) {
    code = 'with (sandbox) {' + code + '}'
    const fn = new Function('sandbox', code)
    return function (sandbox) {
        const documentProxy = new Proxy(sandbox.document, {
            "get": function (oTarget, sKey) {
                if (sKey === 'body') return sanboxDiv;
                if (typeof Reflect.get(oTarget, sKey) === 'function') {
                    return Reflect.get(oTarget, sKey).bind(oTarget);
                }
                return Reflect.get(oTarget, sKey);
            },
        })
        const sandboxProxy = new Proxy(sandbox, {
            "has": function (oTarget, sKey) {
                return true;
            },
            "get": function (oTarget, sKey) {
                if (sKey === Symbol.unscopables) return undefined
                if (sKey === 'document') return documentProxy;
                return Reflect.get(oTarget, sKey);
            },
        })
        console.log(sandboxProxy.document.createElement('p'));

        return fn(sandboxProxy);
    }
}

// 模拟原生浏览器对象
const frame = document.body.appendChild(document.createElement('iframe'))
frame.src = 'about:blank';
frame.style.display = 'none';
frame.sandbox.add(...['allow-scripts', 'allow-same-origin', 'allow-popups', 'allow-presentation', 'allow-top-navigation'])

const globalVar = "you can not get";
// 将sanboxDiv作为根节点执行一段独立代码
var code = `
const p = document.createElement('p');
p.style.color = 'red';
p.innerText = 'Thank you';
document.body.appendChild(p);
const a = new Object();
console.log(globalVar,a);//undefined
`;
sandbox(code)(frame.contentWindow);