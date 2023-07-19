# sugar-js

This is a library that provides responsive capabilities

    <div id="app">

        <label>
            <input s-model="state.num">
        </label>
    
        <button s-on:click="update" s-if="state.num < 20"></button>
    
        {{state.num}}
    
        <div s-for="item in state.list">
            {{item.d}}
        </div>

    </div>

    var sugar = makeSugar({
        bulk() {

            const state = reactive({
                num: 0,
                list:[{d:0}]
            })


            onMounted(() => {
                state.num = 1
            })

            function update() {
                state.num += 1
            }


            return {
                state,
                update
            }
        }
    })

    sugar.mount('#app')
