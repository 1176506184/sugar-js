import { store } from './store';
const {
  ref,
  instance,
  onMounted
} = SUGAR;
const percentage = {
  name: 'sugar-percentage',
  render: `<div style="width:100%;height:100%%;position:relative" :id="id" :sugar-wh="sugarWh">
            <img alt="" :src="background" style="width: 100%;height: 100%" instance="bg" :id="'bg' + id"/>
            <div style="position: absolute;top:0;left: 0;right: 0;bottom: 0"><slot name="default"></slot></div>
          </div>`,
  bulk (ctx: any) {
    const bg = instance();

    if (!store.value.percentage[ctx.id.value]) {
      store.value = {
        ...store.value,
        percentage: {
          ...store.value.percentage,
          [ctx.id.value]: {
            id: ctx.id.value
          }
        }
      };
    }

    onMounted(() => {
      store.value = {
        ...store.value,
        percentage: {
          ...store.value.percentage,
          [ctx.id.value]: {
            id: ctx.id.value
          }
        }
      };
    });

    return {
      background: ctx.background,
      id: ctx.id,
      bg,
      sugarWh: ctx['sugar-wh']
    };
  }
};

export default percentage;
