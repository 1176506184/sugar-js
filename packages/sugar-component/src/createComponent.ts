export function createComponent(options: any) {

    let bulk = options.bulk;
    let render = options.render
    let name = options.name


    return {
        bulk,
        render,
        name
    }

}