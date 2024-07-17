// import { createEffect } from './effect/createEffect';
//
// function reckon (fun: Function) {
//   const result = {};
//   let lock = false;
//   let cacheValue = null;
//   createEffect(() => {
//     lock = false;
//     cacheValue = fun();
//   });
//   return new Proxy(result, {
//     get: () => {
//       if (lock) {
//         return cacheValue;
//       } else {
//         lock = true;
//         return fun();
//       }
//     }
//   });
// }
//
// export default reckon;
