import { arrow as arrowFun } from './utils';
const { useEffect, useState } = SUGAR;
const text = {
  name: 'sugar-text',
  render: `<div :class="'sugar-text ' + (open ? '':'sugar-text__ellipsis')" :style="style">
                <slot name="default"></slot>
                <div s-if="arrow" class="sugar-arrow" @click="click">
                  <div :class="open ? 'open':''" s-html="arrowHtml">
                    
                  </div>
                </div>
           </div>`,
  bulk (ctx: any) {
    console.log(ctx);
    const [style, setStyle] = useState('') as any;
    const [arrow, setArrow] = useState(false) as any;
    const [open, setOpen] = useState(false) as any;
    useEffect(() => {
      setStyle(ctx.style.value ?? '');
      if (ctx.rows.value > 0) {
        setStyle((style.value + ';' + getEllipsis(ctx.rows.value)));
      }
      ctx.arrow && setArrow(ctx.arrow.value);
    }, [ctx.style, ctx.rows, ctx.arrow], true);

    function getEllipsis (rows) {
      return `-webkit-line-clamp: ${rows};`;
    }

    function click () {
      setOpen(!open.value);
    }

    return {
      style,
      rows: ctx.rows,
      arrow,
      open,
      click,
      arrowHtml: arrowFun('bottom')
    };
  }
};

export default text;
