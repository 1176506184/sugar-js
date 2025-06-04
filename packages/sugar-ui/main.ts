import button from './package/button';
import dialog from './package/dialog';
import backtop from './package/backtop';
import pageNation from './package/pageNation';
import { showMessageBox, showToast } from './package/message';
import lazy from './package/lazy';
import upload from './package/upload';
import row from './package/row';
import col from './package/col';

export const sugarUI = [button, dialog, backtop, pageNation, showMessageBox, showToast, upload, lazy, row, col];
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
