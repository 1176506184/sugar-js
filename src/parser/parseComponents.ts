import makeSugar from "../core";

function parseComponents(n, appId) {
    let componentNode = document.createElement('div');
    let componentSugar = window[`sugarBulkComponents_${appId}`].filter(c => {
        return c.name === n.nodeName.toLocaleLowerCase();
    })[0];
    componentNode.innerHTML = componentSugar.render
    n.after(componentNode);
    n.remove();


    componentSugar.renderDom = componentNode;
    componentSugar.emits = {}

    let attributes = n.attributes;
    let prop = {}
    let createdAttr = []
    Array.from(attributes).forEach((a: any) => {
        if (a.name.charAt(0) === ':') {
            let reactiveSon = `window['sugarBulk_${appId}'].${a.value}`;

            if (reactiveSon) {
                prop[a.name.slice(1)] = reactiveSon;
                createdAttr.push(a.name.slice(1))
            } else {
                console.warn(`are you ture ${a.name.slice(1)} should use at there?`)
            }
        } else if (a.name.indexOf('emit:') > -1) {

            componentSugar.emits[`${a.name.split('emit:')[1]}`] = window[`sugarBulk_${appId}`][`${a.value}`];

        } else if (createdAttr.indexOf(a.name) === -1) {

            prop[a.name] = a.value;
            if (componentNode.children?.length === 1) {
                componentNode.children[0].setAttribute(a.name, a.value)
            }

        }
    })

    console.log(prop)
    componentSugar.prop = prop
    makeSugar(componentSugar)

}


export default parseComponents