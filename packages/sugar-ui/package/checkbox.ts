import { useEffect, useState, onMounted } from '@sugar/sugar-hook';

const checkbox = {
  name: 'sugar-checkbox',
  render: `
    <div class="sugar-checkbox-container" :style="style" @click.self="click">
     <div class="sugar-checked" s-if="checked" ></div>
    </div>
  `,
  bulk (ctx: any) {
    onMounted(() => {
      console.log(ctx);
    });

    const [checked, setChecked]: any = useState(false);
    const [style, setStyle]: any = useState('');
    useEffect(() => {
      setChecked(ctx.model.value);
    }, [ctx.model], true);

    function click () {
      console.log(ctx);
    }

    return {
      checked,
      ctx,
      style,
      click
    };
  }
};

export default checkbox;
