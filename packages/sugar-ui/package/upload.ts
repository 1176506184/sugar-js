const { ref } = SUGAR;

const upload = {
  name: 'sugar-upload',
  render: `<div @click="uploadFile">
                <slot name="default"></slot>
                <input style="display: none" @change="fileInput" ref="fileRef" type="file"/>
           </div>`,
  bulk (ctx: any) {
    const fileRef = ref(null);

    function fileInput (e) {
      const result = [];
      result.push(...e.target.files);
      ctx.change(result);
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
