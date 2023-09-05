export function transformEvent(content, prop) {


    if (prop.exp.content.includes('(') && prop.exp.content.includes(')')) {
        let eventStr = prop.exp.content;
        prop.exp.content = prop.exp.content.substring(0, eventStr.indexOf('('))
        prop.exp.parameters = eventStr.substring(eventStr.indexOf('(') + 1, eventStr.length - 1).split(',')
    }

}