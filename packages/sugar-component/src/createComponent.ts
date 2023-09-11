export function createComponent (options: any) {
  const bulk = options.bulk;
  const render = options.render;
  const name = options.name;

  return {
    bulk,
    render,
    name
  };
}
