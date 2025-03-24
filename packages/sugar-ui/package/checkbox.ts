// @ts-expect-error
const { useEffect, useState, onMounted } = SUGAR;

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
