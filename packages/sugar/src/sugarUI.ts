import { useEffect, useState } from '@sugar/sugar-hook';

const button = {
  name: 'sugar-button',
  render: `<button class="sugar-button" style="margin: 5px 5px 0;" @click="click">
                    <slot name="default"></slot>
                    <slot name="label"></slot>
                 </button>`,
  bulk (ctx) {
    const [text, setText]: any = useState(0);

    function click () {
      setText(text.value + 1);
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
    const [show, setShow]: any = useState(false);
    const [opacity, setOpacity]: any = useState(0);

    useEffect(() => {
      if (ctx.model.value) {
        setShow(true);
        setTimeout(() => {
          setOpacity(1);
        }, 50);
      } else {
        setOpacity(0);
        setTimeout(() => {
          setShow(false);
        }, 300);
      }
    }, [ctx.model], true);

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
