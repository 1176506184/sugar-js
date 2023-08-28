import {createComponent} from "@sugar/sugar-component";

const button = createComponent({
    name: 'sugar-button',
    render: `<button class="sugar-button" @click="event">
    <slot name="default"></slot>
</button>`,
    bulk(ctx) {

        function event(e) {
            ctx.click(e);
        }

        return {
            event
        }

    }
})

export {button}