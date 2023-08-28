export function sIf(context, prop) {

    context.if = {
        value: prop.value.content,
        type: prop.value.type
    }

}