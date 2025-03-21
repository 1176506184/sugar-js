import { makeSugar } from '@sugar/sugar-core';
import dialog from './dialog';
import { useState } from '@sugar/sugar-hook';

export const message = {
  name: 'sugar-message',
  render: '',
  bulk (ctx) {
    return {};
  }
};

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
    title: '',
    content: '',
    confirmText: '',
    cancelText: '',
    confirm: () => {
    },
    cancel: () => {
    }
  }) {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const MessageApp = makeSugar({
      render: `<sugar-dialog model="true" @close="cancel">
                    <div>
                        <div>
                            {{title}}
                        </div>
                        <div>
                            {{content}}
                        </div>
                        <div>
                        
                        </div>
                    <div>
                </sugar-dialog>`,
      bulk () {
        const [show, setShow] = useState(true) as any;

        function cancel () {
          setShow(false);
        }

        return {
          title: options.title ?? '提示',
          content: options.content ?? '',
          show,
          cancel
        };
      }
    });
    MessageApp.install(dialog);
    MessageApp.mount(root);
  }
};
