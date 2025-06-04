const row = {
  name: 'sugar-row',
  render: '<div class="sugar-row"><slot name="default"></slot></div>',
  bulk (ctx) {
    return {};
  }
};

export default row;
