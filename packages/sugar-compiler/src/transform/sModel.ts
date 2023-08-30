export function sModel(context, prop) {


    context.props.push({
        name: 'bind',
        type: 7,
        arg: {
            type: 4,
            content: 'value'
        },
        exp: {
            type: 4,
            content: prop.value.content
        }
    })

    context.props.push({
        name: "on",
        type: 7,
        arg: {
            type: 4,
            content: 'input',
            isStatic: true,
            constType: 3
        },
        exp: {
            type: 4,
            content: `${prop.name} = e.target.value`,
            isStatic: false,
            constType: 0
        }
    })


    console.log(context, context.props)
}