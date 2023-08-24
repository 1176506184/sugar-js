import {NodeTypes} from "./compile";
import {serial_num_11} from "../../../src/utils/utils";


export function treeCompile(ast: any, realNode: any) {

    let domTree = {
        type: NodeTypes.ROOT,
        children: [],
        dataId: serial_num_11()
    }

    work(ast, domTree, realNode)

    return domTree

}

function work(astNode, domTree, realNode) {


    if ((astNode.type === NodeTypes.ELEMENT || astNode.type === NodeTypes.ROOT) && astNode.children.length > 0) {

        for (let i = 0; i < astNode.children.length; i++) {

            let node = astNode.children[i];

            let domTreeObj = {
                type: node.type,
                tag: node.tag,
                dataId: serial_num_11(),
                props: node.props
            }


            dealDomTreeObj(node, domTreeObj)

            domTree.children.push(domTreeObj);

            work(node, domTree.children[domTree.children.length - 1], realNode)


        }

    }


}

function dealDomTreeObj(node, domTreeObj) {

    if (node.type === NodeTypes.ELEMENT || node.type === NodeTypes.ROOT) {
        domTreeObj['children'] = []
    } else if (node.type === NodeTypes.INTERPOLATION) {
        domTreeObj['content'] = node.content.content
    } else if (node.type === NodeTypes.TEXT) {
        domTreeObj['content'] = node.content
    }

}

function createElement(domTreeObj) {

    let dom = document.createElement(domTreeObj.tag)


}