const {
  onMounted,
  ref
} = SUGAR;
const lazy = {
  name: 'sugar-lazy',
  render: `<div ref="node">
                 <slot name="default" s-if="show" ></slot>
           </div>`,
  bulk (ctx) {
    const show = ref(false);
    const node = ref(null);
    onMounted(() => {
      window.addEventListener('scroll', () => {
        if (node.value.getBoundingClientRect().top < window.innerHeight) {
          show.value = true;
        }
      });
    });
    return {
      show,
      node
    };
  }
};
export default lazy;
