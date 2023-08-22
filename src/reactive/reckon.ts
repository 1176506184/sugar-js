import {reactive} from "../main";
import {isArray} from "@sugar/sugar-shared";

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

function ref(fun: Function | Object) {
    let result = {};
    if (typeof fun === 'function') {

        let proxy: any = new Proxy(result, {
            get: () => {
                try {
                    return eval2(fun());
                } catch (e) {
                    return fun();
                }
            }
        })

        return proxy.value
    } else if (typeof fun === 'string' || typeof fun === 'number' || isArray(fun)) {

        let data = reactive({
            value: fun
        })


        return Object.defineProperty(result, 'value', {
            get() {
                return data.value
            },
            set(newValue) {
                if (newValue !== data.value) {
                    data.value = newValue
                }
            }
        })

    } else {
        return Array.from(reactive({
            ...fun
        }))
    }


}

export default reckon
export {
    ref
}