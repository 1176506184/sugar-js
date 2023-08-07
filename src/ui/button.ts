import {findEmits} from "../event/findEmits";

const button = {
    name: 'sugar-button',
    render: `<button s-on:click="click" class="sugar-button">
                 {{prop.label}}
             </button>`,
    bulk() {
        const emits = findEmits(this);

        function click() {
            emits['click']();
        }

        return {
            click
        }
    }
}

export default button