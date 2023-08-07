# sugar-js

This is a library that provides responsive capabilities

## Install

npm install sugar-reactive-js

## Use

    <div id="app">

        {{title.value}}

        <title :title="state.num"></title>

        <label>
            <input s-model="state.num">
        </label>
    
        <sugar-input :value="state.num" emit:change="changeNum"></sugar-input>

        <sugar-button label="测试" emit:click="update" :style="styleText.value"></sugar-button>        

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

            function changeNum(e) {
                console.log(e)
                state.num = e.target.value
            }

            return {
                state,
                update,
                title,
                changeNum
            }
        }
    })

    sugar.mount('#app')

## Component

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

## Sugar-UI

    sugar.use(sugarUI);

## Sugar-UI example

    const button = {
            name: 'sugar-button',
            render: `<button s-on:click="click">
            {{prop.label}}
            </button>`,
            bulk() {
                    const emits = findEmits(this);
            
                    function click() {
                        emits['click']();
                    }
            
                    return {
                        click
                    }
            }
    }

    const input = {
        name: 'sugar-input',
        render: `<input  class="sugar-input"  :value="prop.value" s-on:change="change"/>`,
        bulk() {
            const emits = findEmits(this);
    
            function change(e) {
                emits['change'](e);
            }
    
            return {
                change
            }
        }
    }
