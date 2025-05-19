const {
  onMounted,
  instance,
  useState
} = SUGAR;
const lazy = {
  name: 'sugar-lazy',
  render: `<div instance="node">
                 <slot name="default" s-if="show" ></slot>
           </div>`,
  bulk (ctx) {
    const [show, setShow] = useState(false);
    const node = instance();
    onMounted(() => {
      window.addEventListener('scroll', () => {
        if (node.value.getBoundingClientRect().top < window.innerHeight) {
          setShow(true);
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
