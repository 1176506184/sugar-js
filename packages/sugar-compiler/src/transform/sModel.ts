import { toDisPlay } from './transformRef';

export function sModel (context, prop) {
  context.props.push({
    name: 'bind',
    type: 7,
    arg: {
      type: 4,
      content: 'value'
    },
    exp: {
      type: 4,
      content: toDisPlay(prop.value.content)
    }
  });

  context.props.push({
    name: 'on',
    type: 7,
    arg: {
      type: 4,
      content: 'input',
      isStatic: true,
      constType: 3
    },
    exp: {
      type: 4,
      content: `if(typeof ${toDisPlay(prop.value.content)} === 'number' && ${toDisPlay(prop.value.content)}){${toDisPlay(prop.value.content)} = Number(e.target.value)}else{${toDisPlay(prop.value.content)} = e.target.value}`,
      isStatic: true,
      constType: 0
    }
  });
}
