import button from './package/button';
import dialog from './package/dialog';
export const sugarUI = [button, dialog];
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
