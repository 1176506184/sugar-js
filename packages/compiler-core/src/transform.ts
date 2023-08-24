import {isArray, isString, locStub, PatchFlagNames, PatchFlags} from "./utils";
import {ElementTypes, NodeTypes} from "./compile";
import {FRAGMENT, TO_DISPLAY_STRING} from "./runtimeHelpers";

export function transform(root, options) {
    const context = createTransformContext(root, options);
    traverseNode(root, context)
    createRootCodegen(root, context)

    // @ts-ignore
    root.helpers = new Set([...context.helpers.keys()])

    console.log(root)

}

function createRootCodegen(root, context) {
    const {helper} = context
    const {children} = root
    if (children.length === 1) {
        const child = children[0]
        if (isSingleElementRoot(root, child) && child.codegenNode) {
            root.codegenNode = child.codegenNode
        } else {
            root.codegenNode = child
        }
    } else if (children.length > 1) {
        let patchFlag = PatchFlags.STABLE_FRAGMENT
        let patchFlagText = PatchFlagNames[PatchFlags.STABLE_FRAGMENT]

        root.codegenNode = createVNodeCall(
            context,
            helper(FRAGMENT),
            undefined,
            root.children,
            patchFlag,
            undefined,
            undefined,
            true,
            undefined,
            false /* isComponent */
        )

    }


}


export function createVNodeCall(
    context,
    tag,
    props?,
    children?,
    patchFlag?,
    dynamicProps?,
    directives?,
    isBlock = false,
    disableTracking = false,
    isComponent = false,
    loc = locStub
) {
    // if (context) {
    //     if (isBlock) {
    //         context.helper(OPEN_BLOCK)
    //         context.helper(getVNodeBlockHelper(context.inSSR, isComponent))
    //     } else {
    //         context.helper(getVNodeHelper(context.inSSR, isComponent))
    //     }
    //     if (directives) {
    //         context.helper(WITH_DIRECTIVES)
    //     }
    // }
    return {
        type: NodeTypes.VNODE_CALL,
        tag,
        props,
        children,
        patchFlag,
        dynamicProps,
        directives,
        isBlock,
        disableTracking,
        isComponent,
        loc
    }
}


function isSingleElementRoot(root, child) {
    const {children} = root
    return (
        children.length === 1 &&
        child.type === NodeTypes.ELEMENT &&
        !isSlotOutlet(child)
    )
}

export function isSlotOutlet(
    node
) {
    return node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.SLOT
}

function createTransformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(name) {
            // 这里会收集调用的次数
            // 收集次数是为了给删除做处理的， （当只有 count 为0 的时候才需要真的删除掉）
            // helpers 数据会在后续生成代码的时候用到
            const count = context.helpers.get(name) || 0;
            context.helpers.set(name, count + 1);
        },
        currentNode: root,
    };

    return context;
}

export function traverseNode(node, context) {

    context.currentNode = node
    const {nodeTransforms} = context
    const exitFns = []
    for (let i = 0; i < nodeTransforms.length; i++) {
        const onExit = nodeTransforms[i](node, context)
        if (onExit) {
            if (isArray(onExit)) {
                exitFns.push(...onExit)
            } else {
                exitFns.push(onExit)
            }
        }
        if (!context.currentNode) {
            // node was removed
            return
        } else {
            // node may have been replaced
            node = context.currentNode
        }
    }

    switch (node.type) {
        case NodeTypes.COMMENT:
            break
        case NodeTypes.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING)
            break
        case NodeTypes.ELEMENT:
        case NodeTypes.ROOT:
            traverseChildren(node, context)
            break
    }

    context.currentNode = node
    let i = exitFns.length
    while (i--) {
        exitFns[i]()
    }

}

export function traverseChildren(parent, context) {
    let i = 0
    const nodeRemoved = () => {
        i--
    }


    for (; i < parent.children.length; i++) {
        const child = parent.children[i]
        console.log(child)
        if (isString(child)) continue
        context.parent = parent
        context.childIndex = i
        context.onNodeRemoved = nodeRemoved
        traverseNode(child, context)
    }
}