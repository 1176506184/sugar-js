import {extend, isArray, NO} from "./utils";
import {generate} from "./codegen";
import {transform} from "./transform";
import {sIf} from "./transform/sIf";
import {sFor} from "./transform/sFor";
import {sModel} from "./transform/sModel";

export function baseCompile(template: string, components?: any[], data?: any) {

    const ast = toAst(template);
    transform(ast, {
        sIf,
        sFor,
        sModel
    });
    parseComponent(ast, components, data)
    return generate(ast, {})

}

function toAst(template: string) {

    const context = createBaseContent(template);
    return parse(context, [])[0]

}

function parseComponent(ast: any, components: any[], data: any) {

    if (isComponent(ast.tag, components)) {
        ast.type = NodeTypes.COMPONENT
        let sugar = getComponentBulk(ast.tag, components, data)
        sugar.render = toAst(sugar.render);
        Object.keys(ast).forEach((key) => {
            if (key !== 'type') {
                ast[key] = sugar.render[key]
            }
        })
        ast.bulk = sugar.bulk;
    }

    if (ast.children?.length) {
        ast.children.forEach((child) => {
            parseComponent(child, components, data)
        })
    }

}

function isComponent(tag, components) {

    let componentNames = components.map((component) => {
        return component.name
    })
    return componentNames.includes(tag)

}


function getComponentBulk(tag, components, data) {

    for (let i = 0; i < components.length; i++) {
        if (components[i].name === tag) {
            return {
                render: components[i].render,
                bulk: components[i].bulk(data)
            };
        }
    }

    return {}

}

function parse(context: any, ancestors: any) {
    const parent: any = last(ancestors)
    const ns = parent ? parent.ns : Namespaces.HTML
    const nodes = []

    while (!isEnd(context, ancestors)) {
        const s = context.source
        let node: any = undefined
        if (!context.inVPre && startsWith(s, context.options.delimiters[0])) {
            node = parseInterpolation(context)
        } else if (s[0] === '<') {

            if (s.length === 1) {

            } else if (s[1] === '/') {
                if (s.length === 2) {

                } else if (s[2] === '>') {
                    advanceBy(context, 3)
                    continue
                } else if (/[a-z]/i.test(s[2])) {
                    parseTag(context, TagType.End, parent)
                    continue
                } else {
                    node = parseComment(context)
                }
            } else if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors)
            } else if (s[1] === '?') {
                node = parseComment(context)
            }

        }

        if (!node) {
            node = parseText(context)
        }

        if (isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                pushNode(nodes, node[i])
            }
        } else {
            pushNode(nodes, node)
        }


    }

    let removedWhitespace = false

    const shouldCondense = context.options.whitespace !== 'preserve'
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.type === NodeTypes.TEXT) {
            if (!context.inPre) {
                if (!/[^\t\r\n\f ]/.test(node.content)) {
                    const prev = nodes[i - 1]
                    const next = nodes[i + 1]
                    if (
                        !prev ||
                        !next ||
                        (shouldCondense &&
                            ((prev.type === NodeTypes.COMMENT &&
                                    next.type === NodeTypes.COMMENT) ||
                                (prev.type === NodeTypes.COMMENT &&
                                    next.type === NodeTypes.ELEMENT) ||
                                (prev.type === NodeTypes.ELEMENT &&
                                    next.type === NodeTypes.COMMENT) ||
                                (prev.type === NodeTypes.ELEMENT &&
                                    next.type === NodeTypes.ELEMENT &&
                                    /[\r\n]/.test(node.content))))
                    ) {
                        removedWhitespace = true
                        nodes[i] = null as any
                    } else {
                        // Otherwise, the whitespace is condensed into a single space
                        node.content = ' '
                    }
                } else if (shouldCondense) {
                    // in condense mode, consecutive whitespaces in text are condensed
                    // down to a single space.
                    node.content = node.content.replace(/[\t\r\n\f ]+/g, ' ')
                }
            } else {
                // #6410 normalize windows newlines in <pre>:
                // in SSR, browsers normalize server-rendered \r\n into a single \n
                // in the DOM
                node.content = node.content.replace(/\r\n/g, '\n')
            }
        } else if (node.type === NodeTypes.COMMENT && !context.options.comments) {
            removedWhitespace = true
            nodes[i] = null as any
        }
    }

    if (context.inPre && parent && context.options.isPreTag(parent.tag)) {
        // remove leading newline per html spec
        // https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
        const first = nodes[0]
        if (first && first.type === NodeTypes.TEXT) {
            first.content = first.content.replace(/^\r?\n/, '')
        }
    }

    return removedWhitespace ? nodes.filter(Boolean) : nodes

}

function parseAttributes(context: any, type: any) {
    const props = []
    const attributeNames = new Set<string>()
    while (context.source.length > 0 &&
    !startsWith(context.source, '>') &&
    !startsWith(context.source, '/>')) {
        if (startsWith(context.source, '/')) {
            advanceBy(context, 1)
            advanceSpaces(context)
            continue
        }


        const attr = parseAttribute(context, attributeNames)

        if (
            attr.type === NodeTypes.ATTRIBUTE &&
            attr.value &&
            attr.name === 'class'
        ) {
            attr.value.content = attr.value.content.replace(/\s+/g, ' ').trim()
        }

        if (type === TagType.Start) {
            props.push(attr)
        }
        advanceSpaces(context)
    }
    return props
}

function parseAttribute(context: any, nameSet: any) {
    const start = getPos(context)

    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!

    const name = match[0]
    nameSet.add(name)
    advanceBy(context, name.length)
    let value = undefined
    if (/^[\t\r\n\f ]*=/.test(context.source)) {
        advanceSpaces(context)
        advanceBy(context, 1)
        advanceSpaces(context)
        value = parseAttributeValue(context)
    }

    const loc = getSelection(context, start)
    if (!context.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(name)) {
        const match =
            /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(
                name
            )!
        let isPropShorthand = startsWith(name, '.')
        let dirName =
            match[1] ||
            (isPropShorthand || startsWith(name, ':')
                ? 'bind'
                : startsWith(name, '@')
                    ? 'on'
                    : 'slot')
        let arg
        if (match[2]) {
            const isSlot = dirName === 'slot'
            const startOffset = name.lastIndexOf(
                match[2],
                name.length - (match[3]?.length || 0)
            )

            const loc = getSelection(
                context,
                getNewPosition(context, start, startOffset),
                getNewPosition(
                    context,
                    start,
                    startOffset + match[2].length + ((isSlot && match[3]) || '').length
                )
            )

            let content = match[2]
            let isStatic = true

            if (content.startsWith('[')) {
                isStatic = false

                if (!content.endsWith(']')) {
                    content = content.slice(1)
                } else {
                    content = content.slice(1, content.length - 1)
                }
            } else if (isSlot) {
                content += match[3] || ''
            }

            arg = {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content,
                isStatic,
                constType: isStatic
                    ? ConstantTypes.CAN_STRINGIFY
                    : ConstantTypes.NOT_CONSTANT,
                loc
            }

        }

        if (value && value.isQuoted) {
            const valueLoc = value.loc
            valueLoc.start.offset++
            valueLoc.start.column++
            valueLoc.end = advancePosWithClone(valueLoc.start, value.content)
            valueLoc.source = valueLoc.source.slice(1, -1)
        }

        const modifiers = match[3] ? match[3].slice(1).split('.') : []
        if (isPropShorthand) modifiers.push('prop')


        return {
            type: NodeTypes.DIRECTIVE,
            name: dirName,
            exp: value && {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content: value.content,
                isStatic: false,
                // Treat as non-constant by default. This can be potentially set to
                // other values by `transformExpression` to make it eligible for hoisting.
                constType: ConstantTypes.NOT_CONSTANT,
                loc: value.loc
            },
            arg,
            modifiers,
            loc
        }

    }

    return {
        type: NodeTypes.ATTRIBUTE,
        name,
        value: value && {
            type: NodeTypes.TEXT,
            content: value.content,
            loc: value.loc
        },
        loc
    }
}

function getNewPosition(
    context: any,
    start: any,
    numberOfCharacters: number
) {
    return advancePosWithClone(
        start,
        context.originalSource.slice(start.offset, numberOfCharacters),
        numberOfCharacters
    )
}


const enum ConstantTypes {
    NOT_CONSTANT = 0,
    CAN_SKIP_PATCH,
    CAN_HOIST,
    CAN_STRINGIFY
}

function parseAttributeValue(context: any) {
    const start = getPos(context)
    let content: string

    const quote = context.source[0]
    const isQuoted = quote === `"` || quote === `'`

    if (isQuoted) {
        // Quoted value.
        advanceBy(context, 1)

        const endIndex = context.source.indexOf(quote)
        if (endIndex === -1) {
            content = parseTextData(
                context,
                context.source.length
            )
        } else {
            content = parseTextData(context, endIndex)
            advanceBy(context, 1)
        }
    } else {
        // Unquoted
        const match = /^[^\t\r\n\f >]+/.exec(context.source)
        if (!match) {
            return undefined
        }
        const unexpectedChars = /["'<=`]/g
        let m: RegExpExecArray | null
        content = parseTextData(context, match[0].length)
    }

    return {content, isQuoted, loc: getSelection(context, start)}

}

function pushNode(nodes: any, node: any): void {
    if (node.type === NodeTypes.TEXT) {
        const prev: any = last(nodes)
        // Merge if both this and the previous node are text and those are
        // consecutive. This happens for cases like "a < b".
        if (
            prev &&
            prev.type === NodeTypes.TEXT &&
            prev.loc.end.offset === node.loc.start.offset
        ) {
            prev.content += node.content
            prev.loc.end = node.loc.end
            prev.loc.source += node.loc.source
            return
        }
    }

    nodes.push(node)
}

function parseElement(context: any, ancestors: any) {

    const wasInPre = context.inPre
    const wasInVPre = context.inVPre
    const parent = last(ancestors)
    const element: any = parseTag(context, TagType.Start, parent)
    const isPreBoundary = context.inPre && !wasInPre
    const isVPreBoundary = context.inVPre && !wasInVPre
    if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
        if (isPreBoundary) {
            context.inPre = false
        }
        if (isVPreBoundary) {
            context.inVPre = false
        }
        return element
    }
    ancestors.push(element)

    const children = parse(context, ancestors)
    ancestors.pop()
    // @ts-ignore
    element.children = children

    if (startsWithEndTagOpen(context.source, element.tag)) {
        parseTag(context, TagType.End, parent)
    }

    element.loc = getSelection(context, element.loc.start)

    if (isPreBoundary) {
        context.inPre = false
    }
    if (isVPreBoundary) {
        context.inVPre = false
    }
    return element

}

function parseTag(context, type, parent) {

    const start = getPos(context)
    const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!
    const tag = match[1]
    const ns = context.options.getNamespace(tag, parent)

    advanceBy(context, match[0].length)
    advanceSpaces(context)

    if (context.options.isPreTag(tag)) {
        context.inPre = true
    }

    let props = parseAttributes(context, type);

    let isSelfClosing = false

    if (context.source.length !== 0) {
        isSelfClosing = startsWith(context.source, '/>')
        advanceBy(context, isSelfClosing ? 2 : 1)
    }

    if (type === TagType.End) {
        return
    }

    let tagType = ElementTypes.ELEMENT

    return {
        type: NodeTypes.ELEMENT,
        ns,
        tag,
        tagType,
        children: [],
        props,
        loc: getSelection(context, start)
    }
}

const enum TagType {
    Start,
    End
}

export const enum ElementTypes {
    ELEMENT,
    COMPONENT,
    SLOT,
    TEMPLATE
}


export const enum Namespaces {
    HTML
}


function parseComment(context: any) {
    const start = getPos(context)
    const contentStart = context.source[1] === '?' ? 1 : 2
    let content: string

    const closeIndex = context.source.indexOf('>')
    if (closeIndex === -1) {
        content = context.source.slice(contentStart)
        advanceBy(context, context.source.length)
    } else {
        content = context.source.slice(contentStart, closeIndex)
        advanceBy(context, closeIndex + 1)
    }

    return {
        type: NodeTypes.COMMENT,
        content,
        loc: getSelection(context, start)
    }
}

function isEnd(context, ancestors) {
    const s = context.source
    if (startsWith(s, '</')) {
        for (let i = ancestors.length - 1; i >= 0; --i) {
            if (startsWithEndTagOpen(s, ancestors[i].tag)) {
                return true
            }
        }
    }
    return !s
}


function parseInterpolation(context) {
    const [open, close] = context.options.delimiters
    const closeIndex = context.source.indexOf(close, open.length)
    const start = getPos(context)
    advanceBy(context, open.length)
    const innerStart = getPos(context)
    const innerEnd = getPos(context)
    const rawContentLength = closeIndex - open.length
    const rawContent = context.source.slice(0, rawContentLength)
    const preTrimContent = matchText(context, rawContentLength)
    const content = preTrimContent.trim()
    const startOffset = preTrimContent.indexOf(content)
    if (startOffset > 0) {
        advancePos(innerStart, rawContent, startOffset)
    }
    const endOffset =
        rawContentLength - (preTrimContent.length - content.length - startOffset)
    advancePos(innerEnd, rawContent, endOffset)
    advanceBy(context, close.length)
    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content,
            loc: getSelection(context, innerStart, innerEnd)
        },
        loc: getSelection(context, start)
    }

}

function parseText(context) {
    const endTokens = ['<', context.options.delimiters[0]]
    let endIndex = context.source.length
    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i], 1)
        if (index !== -1 && endIndex > index) {
            endIndex = index
        }
    }

    const start = getPos(context)
    const content = parseTextData(context, endIndex)

    return {
        type: NodeTypes.TEXT,
        content,
        loc: getSelection(context, start)
    }
}

function parseTextData(context: any, length: any) {
    const rawText = context.source.slice(0, length)
    advanceBy(context, length)
    if (
        !rawText.includes('&')
    ) {
        return rawText
    } else {
        // DATA or RCDATA containing "&"". Entity decoding required.
        return context.options.decodeEntities(
            rawText
        )
    }

}


function getSelection(context: any,
                      start: any,
                      end?: any) {
    end = end || getPos(context)
    return {
        start,
        end,
        source: context.originalSource.slice(start.offset, end.offset)
    }
}

function matchText(context: any, length: any) {
    const rawText = context.source.slice(0, length)
    advanceBy(context, length)
    return rawText
}

function advanceBy(context: any, numberOfCharacters: number): void {
    const {source} = context
    advancePos(context, source, numberOfCharacters)
    context.source = source.slice(numberOfCharacters)
    context.source = source.slice(numberOfCharacters)
}


export function advancePos(pos, source, numberOfCharacters = source.length) {
    let linesCount = 0
    let lastNewLinePos = -1
    for (let i = 0; i < numberOfCharacters; i++) {
        if (source.charCodeAt(i) === 10 /* newline char code */) {
            linesCount++
            lastNewLinePos = i
        }
    }
    pos.offset += numberOfCharacters
    pos.line += linesCount
    pos.column =
        lastNewLinePos === -1
            ? pos.column + numberOfCharacters
            : numberOfCharacters - lastNewLinePos

    return pos
}

function advancePosWithClone(
    pos: any,
    source: string,
    numberOfCharacters: number = source.length
) {
    return advancePos(
        extend({}, pos),
        source,
        numberOfCharacters
    )
}

function advanceSpaces(context: any): void {
    const match = /^[\t\r\n\f ]+/.exec(context.source)
    if (match) {
        advanceBy(context, match[0].length)
    }
}

function startsWith(source: string, searchString: string): boolean {
    return source.startsWith(searchString)
}

function startsWithEndTagOpen(source: string, tag: string): boolean {
    return (
        startsWith(source, '</') &&
        source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
        /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
    )
}

function last<T>(xs: T[]): T | undefined {
    return xs[xs.length - 1]
}

function createBaseContent(content) {
    return {
        column: 1,
        line: 1,
        offset: 0,
        originalSource: content,
        source: content,
        inPre: false,
        inVPre: false,
        options: {
            delimiters: [`{{`, `}}`],
            isVoidTag: NO,
            isPreTag: NO,
            isCustomElement: NO,
            getNamespace: (tag: string, parent: any) => Namespaces.HTML,
        }
    }
}


function getPos(context) {
    const {column, line, offset} = context
    return {column, line, offset}
}


export const enum NodeTypes {
    ROOT,
    ELEMENT,
    TEXT,
    COMMENT,
    SIMPLE_EXPRESSION,
    INTERPOLATION,
    ATTRIBUTE,
    DIRECTIVE,
    // containers
    COMPOUND_EXPRESSION,
    IF,
    IF_BRANCH,
    FOR,
    TEXT_CALL,
    // codegen
    VNODE_CALL,
    COMPONENT
}