const {
  useState,
  onMounted,
  instance,
  nextTick
  // @ts-expect-error
} = SUGAR;
const swiperItem = {
  name: 'sugar-swiper-item',
  render: `<div class="sugar-swiper-item" :style="'width:'+width" instance="swiper">
                <slot name="default"></slot>
          </div>`,
  bulk () {
    const [width, setWidth] = useState('');
    const swiper = instance();
    onMounted(() => {
      nextTick(() => {
        setWidth(swiper.value.clientWidth + 'px');
      });
    });

    return {
      width,
      swiper
    };
  }
};
export default swiperItem;
