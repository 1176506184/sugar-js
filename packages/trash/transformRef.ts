// import { NodeTypes } from '../parse';
//
// export function transformRef (context, toDisPlay) {
//   context.props?.forEach((prop) => {
//     if (prop.name === 'bind' && prop.arg.content !== 'instance') {
//       prop.exp.content = toDisPlay(prop.exp.content);
//     }
//   });
//
//   if (context.if) {
//     context.if.value = toDisPlay(context.if.value);
//   }
//
//   if (context.forStatment) {
//     context.forStatment.exp = toDisPlay(context.forStatment.exp);
//   }
//
//   if (context.type === NodeTypes.INTERPOLATION) {
//     context.content.content = toDisPlay(context.content.content);
//   }
//
//   if (context.htmlStatment) {
//     context.htmlStatment.value.content = toDisPlay(context.htmlStatment.value.content);
//   }
// }
