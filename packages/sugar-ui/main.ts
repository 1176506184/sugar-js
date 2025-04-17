import dialog from './package/dialog';
import button from './package/button';
import image from './package/image';
import checkbox from './package/checkbox';
import pageNation from './package/pageNation';
import text from './package/text';
import upload from './package/upload';
import { message, showToast, showMessageBox } from './package/message';
import backTop from './package/backTop';
import swiper from './package/swiper';
import swiperItem from './package/swiperItem';
import percentage from './package/percentage';
import { store } from './package/store';

export const sugarUI = [percentage, dialog, button, image, checkbox, pageNation, text, upload, showToast, message, showMessageBox, backTop, swiper, swiperItem];
export { store };
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
    global.sugarStore = store;
    global.getLoadFinish = store.value.getLoadFinish;
  })(window);
}
