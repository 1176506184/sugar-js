import {isArray} from "@sugar/sugar-shared";

export function sFor(context, prop) {

    let forMatch = prop.value.content.split(' in ');
    const reg = /(?<=\()(.+?)(?=\))/;
    forMatch[0] = forMatch[0].match(reg) ? forMatch[0].match(reg)[0].split(',') : forMatch[0];

    context.forStatment = {
        exp: forMatch[1],
        item: isArray(forMatch[0]) ? forMatch[0][0] : forMatch[0],
        index: isArray(forMatch[0]) ? forMatch[0][1] : null
    }

}
