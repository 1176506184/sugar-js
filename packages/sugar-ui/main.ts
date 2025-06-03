import button from './package/button';
import dialog from './package/dialog';
import backtop from './package/backtop';
import pageNation from './package/pageNation';
export const sugarUI = [button, dialog, backtop, pageNation];
if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = sugarUI;
  })(window);
}
