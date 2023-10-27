import { reckon, ref } from '@sugar/sugar-reactive';

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
    <transition name="easy-in">
        <div class="sugar-dialog-mode" s-if="show" @click.self="close">
            <div class="sugar-dialog" s-if="show">
                <slot name="default"></slot>
            </div>
        </div>
    </transition>
</div>`,
  bulk (ctx) {
    const show = reckon(() => {
      return ctx.model.value;
    });

    function close () {
      ctx.close();
    }

    return {
      show,
      close
    };
  }
};

export const sugarUI = [button, dialog];
