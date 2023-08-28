import {helperNameMap} from "./runtimeHelpers";
import {isSimpleIdentifier, locStub} from "./utils";
import {advancePos, NodeTypes} from "./compile";
import {isArray} from "@sugar/sugar-shared";

export function generate(ast, options) {

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

            elStr += `_c('${ast.tag}',{ "attrs":{`

            elStr += dealAttr(props)

            elStr += '},"on":{'

            elStr += dealEvent(props)

            elStr += "}},"


            if (ast.children) {
                elStr += genElmChildren(ast.children);
            } else {
                elStr += '[]'
            }

            elStr += ')'

            if (ast.forStatment) {
                ex = true
                str += transformFor(ast)
            }

            if (ast.if && !ast.forStatment) {
                ex = true
                str = `${ast.if.value} ? ${str + elStr} : _e()`
            }


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


function transformFor(ast) {

    let forStatment = ast.forStatment
    let props = ast.props

    let son = `_c('${ast.tag}',{ "attrs":{`;
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


