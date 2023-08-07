import {findEmits} from "../event/findEmits";
import {onMounted, reactive, reckon} from "../main";
import {guid} from "../utils/guid";

const select = {
    name: 'sugar-select',
    render: `<div>
                 <input  class="sugar-select"  :value="textValue.value" s-on:change="change" s-on:click="click" :ref="componentId.value" readonly placeholder="请选择"/>
                 <div class="sugar-select-options-box" s-if="state.open" :style="state.styleText" >
                   #default
                 </div>
                 
             </div>`,
    bulk() {
        const emits = findEmits(this);
        let cid = guid();
        const componentId: any = reckon(() => {
            return cid;
        });
        const state = reactive({
            open: false,
            styleText: 'width:300px'
        })

        const textValue = reckon(() => {
            return ""
        })

        function change(e) {
            emits['change'](e);
        }

        function click(e) {
            state.open = true;
            e.stopPropagation();
        }

        document.addEventListener('click', () => {
            state.open = false;
        })

        onMounted(() => {
            state.styleText = `width:${document.querySelector(`[ref="${componentId.value}"]`).clientWidth}px`
            console.log(this.renderDom)
            console.log(this.renderDom.querySelectorAll('.sugar-option'));
            // let options =
        })

        return {
            change,
            state,
            click,
            componentId,
            textValue
        }
    }
}

export default select