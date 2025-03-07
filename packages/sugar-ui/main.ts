import dialog from './package/dialog';
import button from './package/button';
import image from './package/image';
import checkbox from './package/checkbox';

export const sugarUI = [dialog, button, image, checkbox];

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
