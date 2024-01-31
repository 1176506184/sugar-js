import { NodeTypes } from './parse';

export function transform (context, helpers) {
  function work (context, forItem = []) {
    const props = context.props;
    props?.forEach((prop) => {
      if (prop.name === 's-if') {
        helpers.sIf(context, prop);
      }

      if (prop.name === 's-for') {
        helpers.sFor(context, prop);
        forItem.push(context.forStatment.item);
      }

      if (prop.name === 's-model') {
        helpers.sModel(context, prop);
      }

      if (prop.name === 's-html') {
        helpers.sHtml(context, prop);
      }

      if (prop.name === 'on') {
        helpers.transformEvent(context, prop);
      }
    });

    if (context.tag === 'slot') {
      context.type = NodeTypes.SLOT;
    }

    helpers.transformRef(context, forItem);

    if (context.children) {
      context.children.forEach((child, index) => {
        work(child, forItem);
      });
    }
  }

  work(context);
}
