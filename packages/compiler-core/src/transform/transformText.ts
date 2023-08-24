import {ElementTypes, NodeTypes} from "../compile";
import {createCompoundExpression, isText} from "../utils";

export const transformText = (node, context) => {

    if (node.type === NodeTypes.ROOT ||
        node.type === NodeTypes.ELEMENT ||
        node.type === NodeTypes.FOR ||
        node.type === NodeTypes.IF_BRANCH
    ) {

        return () => {

            const children = node.children
            let currentContainer: any = undefined
            let hasText = false

            for (let i = 0; i < children.length; i++) {
                const child = children[i]
                if (isText(child)) {
                    hasText = true
                    for (let j = i + 1; j < children.length; j++) {
                        const next = children[j]
                        if (isText(next)) {
                            currentContainer = children[i] = createCompoundExpression(
                                [child],
                                child.loc
                            )

                            currentContainer.children.push(` + `, next)
                            children.splice(j, 1)
                            j--

                        } else {
                            currentContainer = undefined
                            break
                        }
                    }
                }
            }


            if (!hasText || (children.length === 1 &&
                (node.type === NodeTypes.ROOT ||
                    (node.type === NodeTypes.ELEMENT &&
                        node.tagType === ElementTypes.ELEMENT &&
                        // #3756
                        // custom directives can potentially add DOM elements arbitrarily,
                        // we need to avoid setting textContent of the element at runtime
                        // to avoid accidentally overwriting the DOM elements added
                        // by the user through custom directives.
                        !node.props.find(
                            p =>
                                p.type === NodeTypes.DIRECTIVE &&
                                !context.directiveTransforms[p.name]
                        ) &&
                        // in compat mode, <template> tags with no special directives
                        // will be rendered as a fragment so its children must be
                        // converted into vnodes.
                        !(node.tag === 'template'))))) {

                return
            }


            for (let i = 0; i < children.length; i++) {
                const child = children[i]

                if (isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
                    const callArgs = []
                    if (child.type !== NodeTypes.TEXT || child.content !== ' ') {
                        callArgs.push(child)
                    }


                }

            }

        }

    }

}