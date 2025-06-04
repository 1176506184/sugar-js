const col = {
  name: 'sugar-col',
  render: `<div :class="'sugar-col sugar-col-' + span">
            <slot name="default"></slot>
          </div>`,
  bulk (ctx) {
    return {
      span: ctx.span
    };
  }
};

export default col;
