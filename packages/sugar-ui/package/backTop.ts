import { useState } from './utils';
const {
  onMounted
  // @ts-expect-error
} = SUGAR;
const BackTop = {
  name: 'sugar-back-top',
  render: `<div class="sugar-back-top" @click="goTop" :style="scale">
<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M832 165.76H192c-26.24 0-48 21.76-48 48s21.76 48 48 48h640c26.24 0 48-21.76 48-48s-21.76-48-48-48zM551.04 376.96A58.688 58.688 0 0 0 512 360.32c-12.8 0-29.44 7.04-38.4 16L254.08 595.84c-18.56 18.56-18.56 49.28 0 67.84s49.28 18.56 67.84 0l142.08-142.08v348.16c0 26.24 21.76 48 48 48s48-21.76 48-48V521.6l142.08 142.08c9.6 9.6 21.76 14.08 33.92 14.08s24.32-4.48 33.92-14.08c18.56-18.56 18.56-49.28 0-67.84L551.04 376.96z" p-id="2865" fill="#ffffff"></path></svg>
</div>`,
  bulk () {
    const [scale, setScale] = useState('');
    onMounted(() => {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          setScale('transform:scale(1)');
        } else {
          setScale('');
        }
      });
    });

    function goTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    return {
      goTop,
      scale
    };
  }
};

export default BackTop;
