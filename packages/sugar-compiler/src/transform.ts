import * as vm from 'vm';

export function transform (context, helpers) {
  function work (context) {
    const props = context.props;
    props?.forEach((prop) => {
      if (prop.name === 's-if') {
        helpers.sIf(context, prop);
      }

      if (prop.name === 's-for') {
        helpers.sFor(context, prop);
      }

      if (prop.name === 's-model') {
        helpers.sModel(context, prop);
      }

      if (prop.name === 'on') {
        helpers.transformEvent(context, prop);
      }
    });

    helpers.transformComponents(context, helpers.components, helpers.vm);

    if (context.children) {
      context.children.forEach((child, index) => {
        work(child);
      });
    }
  }

  work(context);
}
