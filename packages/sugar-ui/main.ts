import button from './package/button';
import dialog from './package/dialog';
import { showMessageBox, showToast } from './package/message';

export const sugarUI = [button, dialog, showMessageBox, showToast];
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
