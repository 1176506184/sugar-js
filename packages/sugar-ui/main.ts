import dialog from './package/dialog';
import button from './package/button';
import image from './package/image';
import checkbox from './package/checkbox';
import pageNation from './package/pageNation';

export const sugarUI = [dialog, button, image, checkbox, pageNation];

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
