// @ts-expect-error
const { instance } = SUGAR;

const upload = {
  name: 'sugar-upload',
  render: `<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" instance="fileRef" type="file"/>
           </div>`,
  bulk (ctx: any) {
    const fileRef = instance() as any;
    function fileInput (e) {
      ctx.change(e.target.files);
      fileRef.value.value = '';
    }

    function uploadFile () {
      fileRef.value.click();
    }

    return {
      fileInput,
      fileRef,
      uploadFile
    };
  }
};

export default upload;
