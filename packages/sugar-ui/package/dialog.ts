// @ts-expect-error
const { useEffect, useState } = SUGAR;

const dialog = {
  name: 'sugar-dialog',
  render: `<div>
        <div class="sugar-dialog-mode" :style="style" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close" :style="'transform:' + transform">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,
  bulk (ctx) {
    const [show, setShow]: any = useState(false);
    const [opacity, setOpacity]: any = useState(0);
    const direction = ctx.direction?.value ?? 'center';
    const [style, setStyle]: any = useState('');
    const [transform, setTransform] = useState(getInitDirection(direction));
    useEffect(() => {
      if (ctx.model.value) {
        setShow(true);
        setTimeout(() => {
          setOpacity(1);
        }, 50);
      } else {
        setOpacity(0);
        setTimeout(() => {
          if (!ctx.model.value) {
            setShow(false);
          }
        }, 300);
      }

      setStyle(`opacity:${opacity.value};`);
      if (show.value) {
        setTimeout(() => {
          setTransform(getInitDirection(direction, show.value));
        }, 50);
      } else {
        setTransform(getInitDirection(direction, show.value));
      }
    }, [ctx.model, opacity, show], true);

    function close () {
      ctx.close();
    }

    function getInitDirection (type, show = false) {
      if (type === 'center') {
        return '';
      }
      if (type === 'top') {
        return show ? 'translateY(0)' : 'translateY(-100%)';
      }
      return '';
    }

    return {
      show,
      close,
      opacity,
      style,
      transform
    };
  }
};

export default dialog;
