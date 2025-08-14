export const isArray = Array.isArray;

export const extend = Object.assign;

// 判断一个字符串是否是合法的变量标识符（不能包含操作符、点、括号等）
function isSimpleIdentifier(exp: string): boolean {
  return /^[A-Za-z_$][\w$]*$/.test(exp);
}

// 判断表达式是否是“静态的”（即可以在编译期确定的）
export function isStaticExpression(exp: string): boolean {
  // 1. 如果是合法的变量名：静态（如 @click="handleClick"）
  if (isSimpleIdentifier(exp)) {
    return true;
  }

  // 2. 如果包含函数调用、操作符、箭头函数等，认为是动态
  // 这只是一个简单的启发式判断
  const dynamicKeywords = ['(', ')', '=>', '+', '-', '*', '/', '.', '[', ']'];

  for (const keyword of dynamicKeywords) {
    if (exp.includes(keyword)) {
      return false;
    }
  }

  // 默认认为是静态
  return true;
}
