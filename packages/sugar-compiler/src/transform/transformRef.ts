import { NodeTypes } from '../parse';

export function transformRef (context) {
  context.props?.forEach((prop) => {
    if (prop.name === 'bind' && prop.arg.content !== 'instance') {
      prop.exp.content = toDisPlay(prop.exp.content);
    }
  });

  if (context.if && !context.forStatment) {
    context.if.value = toDisPlay(context.if.value);
  }

  if (context.type === NodeTypes.INTERPOLATION) {
    context.content.content = toDisPlay(context.content.content);
  }
}

function toDisPlay (context) {
  let temp = '';
  let tempOnce = '';
  let index = 0;
  let lock = true;
  let _pointLock = false;
  while (index <= context.length) {
    if (context[index] === '.' || context[index] === '"' || context[index] === '`' || context[index] === '\'') {
      lock = false;
      _pointLock = true;
      tempOnce = '';
    } else if (!lock && !_pointLock && (!isValid(context[index]) || index === context.length) && !isNumber(tempOnce)) {
      lock = true;
      temp += '.value';
      tempOnce = '';
    } else if (isValid(context[index])) {
      lock = false;
    } else if (_pointLock && !isValid(context[index])) {
      _pointLock = false;
      lock = true;
      tempOnce = '';
    }
    isValid(context[index]) && (tempOnce += context[index]);
    (index < context.length) && (temp += context[index]);
    index += 1;
  }

  return temp;
}

function isValid (str) { return /^\w+$/.test(str); }
function isNumber (str) { return /^\d+$/.test(str); }
