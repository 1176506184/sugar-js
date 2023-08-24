import {helperNameMap} from "./runtimeHelpers";
import {isSimpleIdentifier, locStub} from "./utils";
import {advancePos, NodeTypes} from "./compile";
import {isArray} from "@sugar/sugar-shared";

export function generate(ast, options) {

    console.log(ast)

    const genElmChildren = (children = []) => {
        let str = "[";
        children.forEach((child, i) => {
            if (child.type === 1 || child.type === 5) {
                str += getElm(child) + `${i == children.length - 1 ? "" : ","}`;
            } else if (child.type === 2 && !!child.content.trim()) {
                str += getElm(child) + `${i == children.length - 1 ? "" : ","}`;
            }
        });
        return str + "]";
    };

    function getElm(ast) {
        let str = "";
        let props = ast.props
        if (ast.type === 1) {
            let elStr = ""
            let ex = false
            let loop = false

            elStr += `_c('${ast.tag}',{ "attr":{`

            elStr += dealAttr(props)

            elStr += '},"on":{'

            elStr += dealEvent(props)

            elStr += "}},"


            if (ast.children) {
                elStr += genElmChildren(ast.children);
            }

            elStr += ')'

            let propsName = props.map((prop) => {
                return prop.name
            })

            props.forEach((prop) => {


                if (prop.name === 's-for') {

                    ex = true

                    str += transformFor(ast, prop, props)
                }

                if (prop.name === 's-if' && !propsName.includes('s-for')) {

                    ex = true

                    str = `${prop.value.content} ? ${str + elStr} : _e()`
                }

            })

            if (!ex) {
                str += elStr
            }

        } else if (ast.type === 5) {
            str += `_v(_s(${ast.content.content}))`
        } else if (ast.type === 2) {
            str += `_v('${ast.content}')`
        }


        return str
    }

    return getElm(ast)
}

function transformFor(ast, prop, props) {


    let forMatch = prop.value.content.split(' in ');
    const reg = /(?<=\()(.+?)(?=\))/;
    forMatch[0] = forMatch[0].match(reg) ? forMatch[0].match(reg)[0].split(',') : forMatch[0];
    let forStatment = {
        exp: forMatch[1],
        item: isArray(forMatch[0]) ? forMatch[0][0] : forMatch[0],
        index: isArray(forMatch[0]) ? forMatch[0][1] : null
    }

    console.log(forStatment)

    let son = `_c('${ast.tag}',{ "attr":{`;
    son += dealAttr(props)

    son += '},"on":{'

    son += dealEvent(props)

    son += "}},["


    ast.children.forEach((astChild, index) => {

        son += generate(astChild, forStatment.item);

        if (index < ast.children.length - 1) {
            son += ','
        } else {
            son += '])'
        }

    })

    if (ast.children.length === 0) {
        son += '])'
    }

    props.forEach((prop) => {


        if (prop.name === 's-if') {

            son = `${prop.value.content} ? ${son} : _e()`
        }

    })

    return `_for((${forStatment.item})=>{
        return ${son}
                            },${forStatment.exp})`

}

function dealAttr(props) {

    let str = ""

    props = props.filter(prop => {
        return prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on'
    })

    props.forEach((prop, index) => {

        if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && prop.name !== 'bind') {

            console.log(prop.value)
            str += `"${prop.name}":"${prop.value.content}"`

        } else if (prop.name === 'bind') {
            str += `"${prop.arg.content}":${prop.exp.content}`
        }

        if (prop.name !== 's-if' && prop.name !== 's-for' && prop.name !== 'on' && index < props.length - 1) {
            str += ","
        }

    })


    return str
}

function dealEvent(props) {

    let str = ""

    props = props.filter(prop => {
        return prop.name === 'on'
    })

    props.forEach((prop, index) => {

        if (prop.name === 'on') {

            str += `"${prop.arg.content}":{"value":"${prop.exp.content}"}`

            if (prop.name === 'on' && index < props.length - 1) {
                str += ","
            }
        }


    })

    return str
}


