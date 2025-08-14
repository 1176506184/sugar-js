import { NodeTypes } from './parse';

export function transform(context, helpers) {
  function work(context) {
    const props = context.props;
    props?.forEach((prop) => {
      if (prop.name === 's-if') {
        helpers.sIf(context, prop);
      }

      if (prop.name === 's-for') {
        helpers.sFor(context, prop);
      }

      if (prop.name === 's-html') {
        helpers.sHtml(context, prop);
      }

      if (prop.name === 's-model') {
        helpers.sModel(context, prop);
      }

      if (prop.name === 's-loading') {
        helpers.sLoading(context, prop);
      }

      // if (prop.name === 'on') {
      //   helpers.transformEvent(context, prop);
      // }
    });

    if (context.tag === 'slot') {
      context.type = NodeTypes.SLOT;
    }

    if (context.children) {
      context.children.forEach((child) => {
        work(child);
      });
    }
  }

  work(context);
  return context;
}
