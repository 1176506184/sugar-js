import { useState } from '@sugar/sugar-hook';

const Image = {
  name: 'sugar-image',
  render: `<div class="sugar-image-container">
    <img alt="" :src="ctx.src.value" @load="finish"/>
    <div s-if="!loaded" class="sugar-image-preload">加载中</div>
</div>`,
  bulk (ctx) {
    const [loaded, setLoaded]: any = useState(false);

    function finish () {
      setLoaded(true);
    }

    return {
      ctx,
      loaded,
      finish
    };
  }
};

export default Image;
