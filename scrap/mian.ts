import {createExtends} from "./modules/createExtends";
import {SugarOptions} from "./types/types";
import {initDom} from "./modules/InitDom"
import patchData from "./modules/patchData";
import SNode2Html from "./modules/SNode2Html";
import {NotifyViscus} from "./modules/NotifyViscus";
import InitEvents from "./modules/InitEvents";

class Sugar {
    private InitialValue: any = {};
    private el: any;
    private readonly viscusArr: any[];
    private setData: Function;
    private data: any = {};
    private methods: any = {};
    private eventArr: any[] = [];

    constructor(options: SugarOptions) {
        console.log("sugar start")
        let _this = this;
        this.el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        const template = typeof options.el === 'string' ? document.querySelector(options.el).innerHTML : options.el.innerHTML
        this.InitialValue = options.data();
        this.data = options.data();
        this.methods = options.methods;

        Object.keys(this.data).forEach(key => {

            Object.defineProperty(this as any, key, {

                get() {
                    return this.data[key]
                },
                set(value) {
                    this.data[key] = value;
                }

            })

        })

        const {extendsArr, viscusArr, events} = createExtends(template);
        this.viscusArr = viscusArr;
        this.eventArr = events;
        console.log('脏值依赖', this.viscusArr)
        console.log('sNode', extendsArr)
        console.log('事件收集', this.eventArr)
        initDom(extendsArr);
        this.setData = (handle) => {
            handle.call(_this);
            patchData.apply(_this, [_this.InitialValue, _this.data, _this.viscusArr])
            _this.InitialValue = JSON.parse(JSON.stringify(_this.data));
        };

        this.el.innerHTML = SNode2Html(extendsArr);

        Object.keys(_this.data).forEach(key => {
            NotifyViscus.apply(_this, [_this.data[key], key, viscusArr]);
        })

        InitEvents.call(_this)

        this.el.removeAttribute('s-block')
        if (typeof options.mounted === 'function') {
            options.mounted.call(_this);
        }
    }
}

window["Sugar"] = Sugar;