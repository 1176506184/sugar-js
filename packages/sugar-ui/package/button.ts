// @ts-expect-error
const { useSignal } = SUGAR;

const button = {
  name: 'sugar-button',
  render: `<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,
  bulk (ctx) {
    function click (e: any) {
      ctx.click?.(e);
    }

    return {
      click,
      ctx
    };
  }
};

export default button;
