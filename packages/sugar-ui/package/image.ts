import { useState } from '@sugar/sugar-hook';

const image = {
  name: 'sugar-image',
  render: `<div class="sugar-image-container">
                <img :src="ctx.src"/>
          </div>`,
  bulk (ctx) {
    const [className, setClassName] = useState('sugar-image-container');

    return {
      ctx,
      className
    };
  }
};

export default image;
