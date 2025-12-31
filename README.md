# Sugar-js 🍬

Sugar-js 是一个极简、高性能的 JavaScript 库，专注于提供**响应式数据驱动**能力与**轻量级模板引擎**。它让你能够以声明式的方式构建用户界面，同时保持极小的体积。

---

## ✨ 核心特性

* **极简响应式**：基于 `ref` 的响应式系统，轻松实现数据与视图同步。
* **组合式 API**：提供 `bulk` 函数组织逻辑，类似于 Vue 3 的 Composition API。
* **组件化**：支持自定义组件与插槽（Slot），构建复杂的 UI 结构。
* **零依赖**：不依赖任何第三方库，原生 JS 编写，兼容性良好。

---

## 🚀 快速上手

### 1. 浏览器直接引入

通过 `<script>` 标签引入编译后的文件即可开始使用。

```html
<div id="app">
    <h1>计数器：{{num}}</h1>
</div>

<script src="/dist/sugar.js"></script>
<script>
    const { makeSugar, ref } = SUGAR;

    const app = makeSugar({
        bulk() {
            // 定义响应式数据
            const num = ref(0);
        
            // 暴露给模板
            return {
                num
            }
        }
    });

    // 挂载到 DOM
    app.mount('#app');
</script>

```

---

## 🧩 组件化开发

Sugar-js 支持通过 `Component` 方法定义可复用的组件，并支持插槽机制。

### 定义与注册组件

```javascript
const { Component } = SUGAR;

// 1. 定义组件
const exSpan = Component({
    name: 'ex-span',
    render: `
        <span class="ex-span-wrapper">
            <slot name="default"></slot>
        </span>
    `,
    bulk(ctx) {
        return {
            name: 'exSpan'
        };
    }
});

// 2. 注册并使用组件
app.use(exSpan);

```

---

## 🛠 运行机制

Sugar-js 的核心由以下部分组成：

1. **Reactive System**: 利用 `Proxy` 或数据劫持监听变化。
2. **Template Engine**: 解析 `{{}}` 插槽及指令，生成动态 DOM。
3. **Component System**: 管理组件生命周期、作用域隔离及插槽分发。

---

## 📂 目录结构

* `/dist`: 包含编译后的生产环境 JS 文件。
* `/src`: 核心源代码，包含响应式模块与模板编译器。
* `index.html`: 示例文件。

---

## 📄 开源协议

[MIT License](https://www.google.com/search?q=LICENSE)

```

---

**下一步建议：**
如果你需要，我可以为你补充 **Conditional Rendering (条件渲染)** 或 **List Rendering (列表循环)** 的文档示例，这些通常是模板引擎最常用的部分。需要我加上吗？

```