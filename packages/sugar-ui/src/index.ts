import SugarButton from './components/Button';
import SugarDialog from './components/Dialog';
import SugarImage from './components/Image';
import SugarPagination from './components/Pagination';

const SUGAR_UI = [SugarButton, SugarDialog, SugarImage, SugarPagination];

if (typeof window !== 'undefined') {
  (function (global: any) {
    global.sugarUI = SUGAR_UI;
  })(window);
}

export default SUGAR_UI;
