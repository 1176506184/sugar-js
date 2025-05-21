# sugar-js
这是一个轻量化提供响应式能力和模版引擎的js库
# 安装
### 浏览器直接引入
````
<div id="app"></div>
<script src="/dist/sugar.js"></script>
<script>
    const app = makeSugar({
        bulk(){
            return {
            
            }
        }
    })
    app.mount('#app')
</script>
````