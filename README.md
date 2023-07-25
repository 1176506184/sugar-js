# sugar-js

This is a library that provides responsive capabilities

    <div id="app">

        {{title.value}}

        <title :title="state.num"></title>

        <label>
            <input s-model="state.num">
        </label>
    
        <button s-on:click="update" s-if="state.num < 20" :style="styleText.value"></button>
    
        {{state.num}}
    
        <div s-for="item in state.list">
            {{item.d}}
        </div>

    </div>

    var sugar = makeSugar({
        bulk() {

            const state = reactive({
                num: 0,
                list:[{d:0}],
                fontSize:15
            })
            
            const title = reckon(() => {
                return state.num + '计算属性测试'
            })

            const styleText = reckon(() => {
                return `font-size:${state.fontSize}px`;
            })

            onMounted(() => {
                state.num = 1
            })

            function update() {
                state.num += 1
            }

            return {
                state,
                update,
                title
            }
        }
    })

    sugar.mount('#app')

    sugar.use({
        name: 'title',
        render: `<div s-on:click="update">{{state.title}}
                    <span>{{prop.title}}</span>
                </div>`,
        bulk() {

            const state = reactive({
                title: '测试组件'
            })

            function update() {
                state.title = "测试组件UPDATE"
            }

            return {
                state,
                update
            }
        }
    })
