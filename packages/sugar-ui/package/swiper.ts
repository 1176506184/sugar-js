const {
  useState,
  onMounted,
  instance,
  nextTick,
  useEffect
  // @ts-expect-error
} = SUGAR;
const swiper = {
  name: 'sugar-swiper',
  render: `<div class="sugar-swiper" instance="swiper">
                  <div class="sugar-swiper-wrapper" :style="style">
                        <slot name="default"></slot>
                  </div>
          </div>`,
  bulk () {
    const [style, setStyle] = useState('');
    const swiper = instance();
    const [width, setWidth] = useState('');
    const [transform, setTransform] = useState('translateX(0)');
    let loopNode = null;
    let active = 0;
    const [anime, setAnime] = useState('transform 0.3s');
    onMounted(() => {
      nextTick(() => {
        setWidth(swiper.value.clientWidth);
      });

      setInterval(() => {
        setAnime('transform 0.3s');
        if (active === (swiper.value.children[0].children.length - 1) && !loopNode) {
          loopNode = copyFirstNodeToLast();
          active += 1;
          setTimeout(() => {
            setAnime('none');
            active = 0;
            setTransform(`translateX(-${width.value * active}px)`);
          }, 300);
        } else if (active === (swiper.value.children[0].children.length - 1)) {
          loopNode = updateLastNodeToFirstNodeCopy();
          setAnime('none');
          active = 0;
          setTransform(`translateX(-${width.value * active}px)`);
          nextTick(() => {
            setAnime('transform 0.3s');
            active = 1;
            setTransform(`translateX(-${width.value * active}px)`);
          });
        } else {
          active += 1;
        }
        setTransform(`translateX(-${width.value * active}px)`);
      }, 2000);
    });

    const copyFirstNodeToLast = () => {
      const wrapper = swiper.value.children[0];
      if (wrapper.children.length > 0) {
        const firstNode = wrapper.children[0];
        const firstNodeCopy = firstNode.cloneNode(true);
        wrapper.appendChild(firstNodeCopy);
        return firstNodeCopy;
      }
    };

    const updateLastNodeToFirstNodeCopy = () => {
      const wrapper = swiper.value.children[0];
      if (wrapper.children.length > 0) {
        const firstNode = wrapper.children[0];
        const firstNodeCopy = firstNode.cloneNode(true);
        const lastNode = wrapper.children[wrapper.children.length - 1];
        wrapper.replaceChild(firstNodeCopy, lastNode);
        return firstNodeCopy;
      }
    };

    useEffect(() => {
      setStyle(`width:${width.value * swiper.value.children[0].children.length}px;transform:${transform.value};transition: ${anime.value};`);
    }, [width, transform]);

    return {
      style,
      swiper
    };
  }
};
export default swiper;
