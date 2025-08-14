export function sModel(context, prop) {
  context.props.push({
    type: 7,
    name: 'on',
    exp: {
      type: 4,
      content: `_ctx_.${prop.value.content} = e.target.value`,
      isStatic: true,
    },
    arg: {
      type: 4,
      content: 'input',
    },
    modifiers: [],
  });
  context.props.push({
    type: 7,
    name: 'bind',
    exp: {
      type: 4,
      content: `_ctx_.${prop.value.content}`,
    },
    arg: {
      type: 4,
      content: 'value',
    },
    modifiers: [],
  });
}
