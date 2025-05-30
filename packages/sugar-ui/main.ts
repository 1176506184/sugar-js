import button from './package/button';
import dialog from './package/dialog';
import { showMessageBox, showToast } from './package/message';
import pageNation from './package/pageNation';
import backTop from './package/backTop';
import text from './package/text';
import upload from './package/upload';
import lazy from './package/lazy';
import field from './package/field';

export const sugarUI = [button, dialog, showMessageBox, showToast, pageNation, backTop, text, upload, lazy, field];
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
