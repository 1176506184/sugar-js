interface SugarOptions {
    el: string | HTMLDivElement,
    data: Function,
    mounted: Function,
    methods: Object
}

interface SNode {
    nodeType: number,
    nodeName: string,
    children: SNode[],
    uid: number,
    attrs: any[]
}

export {
    SugarOptions, SNode
}