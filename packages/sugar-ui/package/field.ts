const {
  onMounted,
  instance,
  useState
} = SUGAR;
const field = {
  name: 'sugar-field',
  render: `<div class="sugar-field">
            <slot name="label" instance="labelRef"></slot>
            <div class="sugar-field-label" s-if="showLabel">{{label}}</div>
            <slot name="default" instance="defaultRef"></slot>
            <div class="sugar-field-input-container">
                <input class="sugar-field-input" s-if="showField" :placeholder="placeholder" @input="onInput" :value="value"/>
            </div>
          </div>`,
  bulk (ctx: any) {
    const label = ctx.label?.value || '文本';
    const placeholder = ctx.placeholder?.value || '请输入';
    const labelRef = instance();
    const defaultRef = instance();
    const [showLabel, setShowLabel] = useState(true);
    const [showField, setShowField] = useState(true);
    const [value, setValue] = useState(ctx.value?.value || '');
    onMounted(() => {
      if (labelRef.value?.children.length > 0) {
        setShowLabel(false);
      }
      if (defaultRef.value?.children.length > 0) {
        setShowField(false);
      }
    });

    function onInput (e) {
      setValue(e.target.value);
      ctx.input(e.target.value);
    }

    return {
      label,
      labelRef,
      showLabel,
      defaultRef,
      placeholder,
      showField,
      input: ctx.input,
      value,
      onInput
    };
  }
};
export default field;
