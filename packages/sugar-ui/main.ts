import button from './package/button';
import dialog from './package/dialog';
import { showMessageBox, showToast } from './package/message';
import pageNation from './package/pageNation';

export const sugarUI = [button, dialog, showMessageBox, showToast, pageNation];
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
