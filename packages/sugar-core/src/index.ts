import {Core} from "./types";
import onMounted, {mountHandleList, clearMounted, updateActiveId} from "./hooks/onMounted";
import {sugarRender} from "@sugar/sugar-render";
import {guid} from "./utils/guid";

function makeSugar(options: Core) {
    let appId = guid();
    updateActiveId(appId);
    let data = options.bulk();
    const {mounted} = sugarRender();
    const vm = {
        _vnode: null,
        data: data,
        $el: null as any,
        appId: appId
    }

    function mount(el) {
        vm.$el = document.querySelector(`${el}`)
        mounted(vm, vm.$el, data);
        mountHandleList[appId].forEach((item) => {
            item.fun();
            item.used = true;
        })
    }

    return {
        mount,
        ...data
    }

}


export {
    makeSugar,
    onMounted
}