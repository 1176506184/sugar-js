function reckon(fun: Function) {

    let result = {};
    return new Proxy(result, {
        get: () => {
            return fun();
        }
    })
}

export default reckon