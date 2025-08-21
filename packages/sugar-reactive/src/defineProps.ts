// 运行时模拟 defineProps (仅演示)
export function defineProps<T extends Record<string, any>>(options?: T): T {
  // 编译时会替换成 props 参数
  // 这里简化为直接返回传入定义，模拟 props 数据
  return options || ({} as T);
}
