const eval2 = eval;

function reckon(fun: Function) {

    let result = {};
    return new Proxy(result, {
        get: () => {
            try {
                return eval2(fun());
            } catch (e) {
                return fun();
            }
        }
    })
}

export default reckon