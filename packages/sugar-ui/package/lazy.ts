const {
  useState,
  onMounted,
  instance,
  nextTick,
  useEffect
  // @ts-expect-error
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
      console.log(node.value);
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
