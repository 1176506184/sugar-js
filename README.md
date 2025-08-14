# sugar-js

这是一个轻量化提供响应式能力和模版引擎的js库

# 安装

### 浏览器直接引入

````
<div id="app">
    {{num}}
</div>
<script src="/dist/sugar.js"></script>
<script>
    const {
        makeSugar,
        ref
    } = SUGAR;
    const app = makeSugar({
        bulk(){
            const num = ref(0);
        
            return {
                num
            }
        }
    })
    app.mount('#app')
</script>
````

### 创建组件

````
 const exSpan = Component({
        name: 'ex-span',
        render: `<span class="exSpan">
                    <slot name="default"></slot>
                </span>`,
        bulk(ctx) {
            return {
                name: 'exSpan'
            };
        }
 });
 app.use(exSpan);