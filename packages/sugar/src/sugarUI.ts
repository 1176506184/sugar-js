import { nextTick, reckon, ref, watch } from '@sugar/sugar-reactive';

const button = {
  name: 'sugar-button',
  render: `<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,
  bulk (ctx) {
    const text: any = ref(0);

    function click () {
      text.value += 1;
      ctx.click();
    }

    return {
      click,
      ctx,
      text
    };
  }
};

const dialog = {
  name: 'sugar-dialog',
  render: `<div>
        <div class="sugar-dialog-mode" :style="'opacity:'+opacity" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show" @click.self="close">
                <slot name="default"></slot>
            </div>
        </div>
</div>`,
  bulk (ctx) {
    const show: any = ref(false);
    const opacity: any = ref(0);
    watch(ctx.model, (value) => {
      if (value) {
        show.value = true;
        setTimeout(() => {
          opacity.value = 1;
        }, 50);
      } else {
        opacity.value = 0;
        setTimeout(() => {
          show.value = false;
        }, 300);
      }
    }, {
      deep: true,
      immediate: true
    });

    function close () {
      ctx.close();
    }
    return {
      show,
      close,
      opacity
    };
  }
};

export const sugarUI = [button, dialog];
