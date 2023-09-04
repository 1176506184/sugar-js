export function transform(context, helpers) {


    function work(context) {

        let props = context.props


        props?.forEach((prop) => {

            if (prop.name === 's-if') {
                helpers.sIf(context, prop)
            }

            if (prop.name === 's-for') {
                helpers.sFor(context, prop)
            }

            if (prop.name === 's-model') {
                helpers.sModel(context, prop)
            }

            if (prop.name === 'on') {
                helpers.transformEvent(context, prop)
            }

        })

        if (!!context.children) {
            context.children.forEach((child) => {
                work(child)
            })
        }

    }


    work(context)

}