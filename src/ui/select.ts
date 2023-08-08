import {findEmits} from "../event/findEmits";
import {onMounted, reactive, reckon} from "../main";
import {guid} from "../utils/guid";

const select = {
    name: 'sugar-select',
    render: `<div>
                 <input  class="sugar-select"  :value="state.textValue" s-on:click="click" :ref="componentId.value" readonly placeholder="请选择"/>
                 <div class="sugar-select-options-box" s-if="state.open" :style="state.styleText" >
                   #default
                 </div>
                 
             </div>`,
    bulk(ctx, prop) {
        const emits = findEmits(this);
        let cid = guid();
        const componentId: any = reckon(() => {
            return cid;
        });

        const initVal = reckon(() => {
            return prop.value
        })

        const state = reactive({
            open: false,
            styleText: 'width:300px',
            textValue: "",
            value: ""
        })

        function click(e) {
            state.open = true;
            e.stopPropagation();
        }

        document.addEventListener('click', () => {
            state.open = false;
        })

        onMounted(() => {
            state.styleText = `width:${document.querySelector(`[ref="${componentId.value}"]`).clientWidth}px`
        })

        function update(text, value) {
            state.textValue = text;
            state.value = value;
            emits['change'](value);
        }

        return {
            state,
            click,
            componentId,
            update,
            initVal
        }
    }
}

export default select