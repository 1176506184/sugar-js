import {isArray} from "@sugar/sugar-shared";

export function sugarCompiler(template) {

    function compile(template = '') {
        const ast = parse(template);
        const code = generate(ast);
        console.log(code)
        return createFunction(code);
    }

    function parse(template = '') {
        // 获取元素所有属性
        function getAttrs(el) {
            const attributes = el.attributes;
            const attrs = []; // 收集属性
            const attrMap = {}; // 收集属性的map
            const events = {}; // 收集事件@xxx
            let ifStatment = {}; // 收集v-if
            let forStatment = {}; // 收集s-for
            for (const key in attributes) {
                if (Object.hasOwnProperty.call(attributes, key)) {
                    const item = attributes[key];
                    attrMap[item.name] = item.value;
                    attrs.push({
                        name: item.name,
                        value: item.value,
                    });
                    if (item.name.startsWith('@')) { // 处理事件
                        events[item.name.replace('@', '')] = {value: item.value}
                    }
                    if (item.name === 's-if') { // 处理s-if
                        ifStatment = {exp: item.value}
                    }

                    if (item.name === 's-for') {
                        let forMatch = item.value.split(' in ');
                        const reg = /(?<=\()(.+?)(?=\))/;
                        forMatch[0] = forMatch[0].match(reg) ? forMatch[0].match(reg)[0].split(',') : forMatch[0];
                        forStatment = {
                            exp: forMatch[1],
                            item: isArray(forMatch[0]) ? forMatch[0][0] : forMatch[0],
                            index: isArray(forMatch[0]) ? forMatch[0][1] : null
                        }
                    }

                }
            }

            return {attrs, attrMap, events, ifStatment, forStatment};
        }

        // 解析插值
        function parseExpressionVar(str: any = "") {
            const content = ".*?";
            const reg = new RegExp(`{{(${content})}}`, "g");
            const matchs = [...str.matchAll(reg)] || [];
            const res = [];
            if (matchs?.length) {
                matchs.forEach((item) => {
                    res.push({
                        raw: item[0],
                        name: String(item[1]).trim(),
                        index: item.index,
                    });
                });
            }

            return res;
        }

        // 遍历元素
        function walkElement(el, parent) {
            const ast = createASTElement();
            ast.parent = parent;
            ast.tag = el.tagName.toLowerCase();
            // 获取当前元素的所有属性
            const {attrs, attrMap, events, ifStatment, forStatment} = getAttrs(el);
            ast.attrs = attrs;
            ast.attrMap = attrMap;
            ast.events = events;
            if (ifStatment && Object.keys(ifStatment).length) { // 收集v-if
                ast.if = ifStatment
            }
            if (forStatment && Object.keys(forStatment).length) {
                ast.for = forStatment
            }
            const children = Array.from(el.children);
            const childNodes = el.childNodes
            if (children.length) { // 如果有子元素，递归遍历收集所有子元素

                childNodes.forEach((child) => {
                    if (child.nodeType === 3) {
                        const text = child.nodeValue
                            // .trim()
                            // .replace(" ", "")
                            .replaceAll("\n", " ")
                            // .trim(); // 去除空格和换行

                        if (text) {
                            // 创建空的ast，文本节点增加text属性
                            const textAst = createASTElement();
                            textAst.text = text;
                            textAst.expression = {
                                values: parseExpressionVar(text), // 解析插值{{}}中的值，如果有{{}}
                            };
                            ast.children.push(textAst);
                        }

                    } else if (child.nodeType === 1) {
                        const childAST = walkElement(child, ast);
                        ast.children.push(childAST);
                    }
                })

                // children.forEach((child) => {
                //     const childAST = walkElement(child, ast);
                //     ast.children.push(childAST);
                // });
            } else { // 没有子元素，那么就是文本内容，例如：<div>123</div>中的123
                const childVNodes = [...el.childNodes];
                if (childVNodes.length) {
                    const text = childVNodes[0].nodeValue
                        // .trim()
                        // .replace(" ", "")
                        .replaceAll("\n", " ")
                        // .trim(); // 去除空格和换行
                    // 创建空的ast，文本节点增加text属性
                    const textAst = createASTElement();
                    textAst.text = text;
                    textAst.expression = {
                        values: parseExpressionVar(el.innerText), // 解析插值{{}}中的值，如果有{{}}
                    };

                    ast.children.push(textAst);
                }
            }
            return ast;
        }

        const tempDOM = document.createElement("div");
        tempDOM.innerHTML = template;

        const templateDOM = tempDOM.children[0];
        return walkElement(templateDOM, null);
    }


    function createASTElement(tag?, attrs?, parent?): any {
        return {
            tag,
            attrsMap: {},
            parent,
            children: [],
        }
    }

    function generate(ast = {}, exclude?) {

        // 构建子元素
        const genElmChildren = (children = []) => {
            let str = "[";
            children.forEach((child, i) => {
                str += genElm(child) + `${i == children.length - 1 ? "" : ", "}`;
            });
            return str + "]";
        };

        // 构建data
        const genData = (ast: any = {}) => {
            const data: any = {}
            // 处理事件
            if (ast.events && Object.keys(ast.events).length) {
                data.on = ast.events;
            }
            // 处理属性
            if (ast.attrs && ast.attrs.length) {
                data.attrs = {}
                ast.attrs.forEach(item => {
                    const skip = item.name.startsWith('@') || item.name === 's-if' || item.name === 's-for'; // 跳过@xxx和v-if
                    let key;
                    let value;
                    if (!skip) {
                        if (item.name.startsWith(':')) { // parse :class
                            key = item.name.replace(':', '');
                            if (data.attrs[key]) {
                                const oldVal = data.attrs[key]
                                const valList = JSON.parse(item.value.replaceAll(`'`, `"`) || '[]');
                                value = `${oldVal} ${valList.join(' ')}`
                            }
                        } else {
                            key = item.name;
                            value = item.value;
                        }
                    }
                    data.attrs[key] = value;
                })
            }

            return data;
        };

        // 构建_c()
        const genElm = (ast) => {
            let str = "";
            if (ast['if'] && ast['if'].exp) { // 处理v-if
                let elStr = ''
                if (ast.tag) {
                    elStr += `_c('${ast.tag}', ${JSON.stringify(genData(ast))}, ${ast.children ? genElmChildren(ast.children) || "[]" : "[]"})`;
                }
                // v-if构造出来，就是拼接一个三元运算符，例如count % 2 === 0 ? _c(xxx) : _e()
                str += `${ast['if'].exp} ? ${elStr} : _e()`

            } else if (ast['for'] && ast['for'].exp) {

                let son = `_c('${ast.tag}',${JSON.stringify(genData(ast))},[`;
                ast.children.forEach((astChild, index) => {

                    son += generate(astChild, ast['for'].item);

                    if (index < ast.children.length - 1) {
                        son += ','
                    } else {
                        son += '])'
                    }

                })

                str += transformFor(ast, son);

            } else if (ast.tag) {
                // 处理元素节点，data参数通过genData函数处理，children通过genElmChildren处理
                str += `_c('${ast.tag}', ${JSON.stringify(genData(ast))}, ${ast.children ? genElmChildren(ast.children) || "[]" : "[]"})`;
            } else if (ast.text) { // 处理文本节点

                // 处理文本中插值语法，例如：将countVal：{{count}}解析生成'countVal：'+ _s(count)
                if (ast.expression && ast.expression.values.length) {

                    // 解析插值语法
                    const replaceVarWithFn = (name, target: any = "") => {
                        const toReplace = `' + _s(${name}) + '`;
                        const content = ".*?";
                        const reg = new RegExp(`{{(${content})}}`, "g");
                        let newStr = "";
                        newStr = target.replaceAll(reg, (item) => {
                            const matchs = [...item.matchAll(reg)] || [];
                            let tempStr = "";
                            if (matchs.length) {
                                matchs.forEach((matItem) => {
                                    const mated = matItem[1];
                                    if (mated && mated.trim() === name) {
                                        tempStr = item.replaceAll(reg, toReplace);
                                    }
                                });
                            }


                            return tempStr;
                        });

                        return newStr;
                    };
                    let varName = "";
                    let parsed = []
                    ast.expression.values.forEach((item) => {
                        if (parsed.includes(item.name)) {
                            return
                        }
                        varName += replaceVarWithFn(item.name, ast.text);
                        parsed.push(item.name)
                    });
                    str += `_v('${varName}')`;

                } else {
                    // 静态文本
                    str += `_v('${ast.text}')`;
                }
            }


            return str;
        };

        return genElm(ast);
    }

    function createFunction(code = '') {
        return new Function(`
            with(this) {
              return ${code};
            }
        `)
    }

    function transformFor(ast, content) {

        return `_for((${ast.for.item})=>{
        return ${content}
                            },${ast.for.exp})`
    }


    // 执行编译
    return compile(template)

}