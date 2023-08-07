import {findEmits} from "../event/findEmits";

const input = {
    name: 'sugar-input',
    render: `<input  class="sugar-input"  :value="prop.value" s-on:change="change"/>`,
    bulk() {
        const emits = findEmits(this);

        function change(e) {
            emits['change'](e);
        }

        return {
            change
        }
    }
}

export default input