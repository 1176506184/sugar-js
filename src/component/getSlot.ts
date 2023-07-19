export default function getSlot(node, CacheNode) {

    let result = ``;
    let slotName = getSlotName(node);

    function work(n) {
        n.childNodes.length && n.childNodes.forEach(no => {
            if (no.nodeType === 1 && no.getAttribute(slotName) !== null) {
                result = no;
            } else {
                work(no);
            }
        })

    }

    if (CacheNode.getAttribute(slotName) !== null) {
        result = CacheNode;
    } else {
        work(CacheNode);
    }


    return [result, slotName];

}

function getSlotName(n) {

    let slotName: any = Object.values(n.attributes)?.find((attr: any) => {
        return attr?.nodeName?.indexOf('#') > -1
    })

    if (!slotName) {
        console.error("undefined slotName");
    }

    return slotName?.nodeName
}