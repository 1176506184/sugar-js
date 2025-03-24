// @ts-expect-error
const { useState } = SUGAR;

const button = {
  name: 'sugar-button',
  render: `<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,
  bulk (ctx) {
    const [text, setText]: any = useState(0);

    function click () {
      setText(text.value + 1);
      ctx.click?.();
    }

    return {
      click,
      ctx,
      text
    };
  }
};

export default button;
