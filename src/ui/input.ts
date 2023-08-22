const input = {
    name: 'sugar-input',
    render: `<input  class="sugar-input"  :value="prop.value" s-on:change="change"/>`,
    bulk(ctx) {

        function change(e) {
            ctx.change();
        }

        return {
            change
        }
    }
}

export default input