import { NodeTypes } from '../parse';

export function transformRef (context, toDisPlay) {
  context.props?.forEach((prop) => {
    if (prop.name === 'bind' && prop.arg.content !== 'instance') {
      prop.exp.content = toDisPlay(prop.exp.content);
    }
  });

  if (context.if) {
    context.if.value = toDisPlay(context.if.value);
  }

  if (context.forStatment) {
    context.forStatment.exp = toDisPlay(context.forStatment.exp);
  }

  if (context.type === NodeTypes.INTERPOLATION) {
    context.content.content = toDisPlay(context.content.content);
  }
}
//
// export function toDisPlay (context) {
//   // for (let i = 0; i < lockItem.length; i++) {
//   //   //   const testReg = new RegExp(`\\${lockItem[i]}`, 'g');
//   //   //   const is
//   //   // }
//   let temp = '';
//   let tempOnce = '';
//   let index = 0;
//   let lock = true;
//   let _pointLock = false;
//   while (index <= context.length) {
//     if (context[index] === '.' || context[index] === '"' || context[index] === '`' || context[index] === '\'') {
//       lock = false;
//       _pointLock = true;
//       tempOnce = '';
//     } else if (!lock && !_pointLock && (!isValid(context[index]) || index === context.length) && !isNumber(tempOnce)) {
//       lock = true;
//       temp += '.value';
//       tempOnce = '';
//     } else if (isValid(context[index])) {
//       lock = false;
//     } else if (_pointLock && !isValid(context[index])) {
//       _pointLock = false;
//       lock = true;
//       tempOnce = '';
//     }
//     isValid(context[index]) && (tempOnce += context[index]);
//     (index < context.length) && (temp += context[index]);
//     index += 1;
//   }
//
//   return temp;
// }
//
// function isValid (str) {
//   return /^\w+$/.test(str);
// }
//
// function isNumber (str) {
//   return /^\d+$/.test(str);
// }
