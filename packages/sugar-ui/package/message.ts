import dialog from './dialog';
const {
  makeSugar,
  useSignal,
  onMounted
} = SUGAR;

export const showToast = {
  fun: 'showToast',
  bulk (text: string, timeout = 2000, style = '') {
    let root = document.createElement('div');
    document.body.appendChild(root);
    let MessageApp = makeSugar({
      render: '<div class="sugar-toast" :style="style">{{text}}</div>',
      bulk () {
        return {
          text,
          style
        };
      }
    });
    MessageApp.mount(root);
    setTimeout(() => {
      MessageApp = null;
      root.remove();
      root = null;
    }, timeout);
  }
};

export const showMessageBox = {
  fun: 'showMessageBox',
  bulk (options = {
    title: '提示',
    content: '这是一条提示的内容',
    confirmText: '确认',
    cancelText: '取消',
    confirm: () => {
    },
    cancel: () => {
    }
  }) {
    let root = document.createElement('div');
    document.body.appendChild(root);
    let MessageApp = makeSugar({
      render: `<sugar-dialog :model="show" @close="cancel">
                    <div class="sugar-message-box">
                        <div class="sugar-message-title">
                            {{title}}
                        </div>
                        <div class="sugar-message-box-content">
                            {{content}}
                        </div>
                        <div class="sugar-message-toolbar">
                            <div class="sugar-message-box-btn" @click="cancel">{{cancelText}}</div>
                            <div class="sugar-message-box-btn sugar-message-box-confirm" @click="confirm">{{confirmText}}</div>
                        </div>
                    <div>
                </sugar-dialog>`,
      bulk () {
        const show = useSignal(false);

        function cancel () {
          options.cancel();
          show.value = false;
          setTimeout(() => {
            MessageApp = null;
            root.remove();
            root = null;
          }, 300);
        }

        function confirm () {
          options.confirm();
          show.value = false;
          setTimeout(() => {
            MessageApp = null;
            root.remove();
            root = null;
          }, 300);
        }

        onMounted(() => {
          show.value = true;
        });

        return {
          title: options.title ?? '提示',
          content: options.content ?? '',
          show,
          cancel,
          confirm,
          confirmText: options.confirmText ?? '确定',
          cancelText: options.cancelText ?? '取消'
        };
      }
    });
    MessageApp.install([dialog]);
    MessageApp.mount(root);
  }
};
