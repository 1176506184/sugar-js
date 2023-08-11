import {findEmits} from "../event/findEmits";
import {onMounted} from "../main";

const option = {
    name: 'sugar-option',
    render: `<div class="sugar-option" s-on:click="update">{{prop.label}}</div>`,
    bulk(ctx, prop) {


        onMounted(() => {
            if (ctx.initVal.value == prop.value) {
                update();
            }

        })

        function update() {
            ctx.update(prop.label, prop.value);
        }


        return {
            update
        }
    }
}

export default option