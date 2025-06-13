const input = {
  name: 'sugar-input',
  render: `<div class="sugar-input">
<input/>
</div>`,
  bulk (ctx) {
    return {
      span: ctx.span
    };
  }
};

export default input;
