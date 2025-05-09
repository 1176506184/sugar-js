const {
  useState,
  onMounted,
  instance,
  nextTick,
  useEffect
  // @ts-expect-error
} = SUGAR;
const picker = {
  name: 'sugar-picker',
  render: `<div>
                <div s-for="(item,index) in options" instance="pickerRefs[index]">
                    <div s-for="(son,i) in item">
                        {{son.value}}
                    </div>
                </div>
           </div>`,
  bulk (ctx: any) {
    const [options, setOptions] = useState([]);
    const pickerRefs = instance();
    useEffect(() => {
      setOptions(ctx.options.value);
    }, [ctx.options], true);

    onMounted(() => {

    });

    return {
      options,
      pickerRefs
    };
  }
};

export default picker;
