const {
  useEffect,
  ref
} = SUGAR;

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
    const show: any = ref(ctx.model.value);
    const opacity: any = ref(0);
    const direction: any = ctx.direction?.value ?? 'center';
    const style: any = ref('');
    const transform: any = ref(getInitDirection(direction));
    useEffect(() => {
      if (ctx.model.value) {
        show.value = true;
        setTimeout(() => {
          opacity.value = 1;
          style.value = `opacity:${opacity.value};`;
        }, 50);
      } else {
        opacity.value = 0;
        style.value = `opacity:${opacity.value};`;
        setTimeout(() => {
          if (!ctx.model.value) {
            show.value = false;
          }
        }, 300);
      }

      if (show.value) {
        setTimeout(() => {
          transform.value = getInitDirection(direction, show.value);
        }, 50);
      } else {
        transform.value = getInitDirection(direction, show.value);
      }
    }, [ctx.model], true);

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
