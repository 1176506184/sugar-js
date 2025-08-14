export function sLoading(context, prop) {
  context.loading = {
    value: prop.value.content,
    type: prop.value.type,
  };
}
