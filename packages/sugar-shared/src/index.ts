export const isArray = (val) => val instanceof Array

export const enum Namespaces {
    HTML
}

export const NO = (tag: string) => false

export function startsWith(source: string, searchString: string): boolean {
    return source.startsWith(searchString)
}

export function startsWithEndTagOpen(source: string, tag: string): boolean {
    return (
        startsWith(source, '</') &&
        source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
        /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
    )
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
}

export * from './nodeOps'