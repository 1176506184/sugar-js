import dialog from './package/dialog';
import button from './package/button';
import image from './package/image';
import checkbox from './package/checkbox';
import pageNation from './package/pageNation';
import text from './package/text';
import upload from './package/upload';
import { message, showToast } from './package/message';

export const sugarUI = [dialog, button, image, checkbox, pageNation, text, upload, showToast, message];

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
