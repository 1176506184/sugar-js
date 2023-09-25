# sugar-js

This is a library that provides responsive capabilities

## Install

npm install sugar-reactive-js

## Use

        <div id="app">
            <div class="title">
                SUGAR-JS
            </div>
        
            <div>
                <button style="margin: 5px 5px 0;" class="sugar-button" @click="updateActive">切换界面:{{active}}</button>
            </div>
        
            <div s-if="active === 0">
                <p class="label">计算属性</p>
        
                <p class="label">{{title}}</p>
        
                <p class="label">外部状态值：{{store.num}}</p>
        
                <p class="label">s-for</p>
        
                <button class="sugar-button" style="margin: 5px 5px 0;" s-for="item in state.list" :key="item.d"
                        @click="update(item,state.num)">
                    {{item.d}}{{title}}
                </button>
        
                <button style="margin: 5px 5px 0;" class="sugar-button" @click="pushNode">新增</button>
        
                <!--测试注释-->
        
                <p class="label">s-model</p>
        
                <sugar-button s-for="(item,index) in state.list" :dataKey="state.num" @click="pushNode(state.num)"
                              s-if="index%2===0" :key="'sugar_btn_' + item.d" :instance="button">
                    <span #default>
                        <span>测试</span>
                        <span>{{item.d + state.num}}</span>
                    </span>
                </sugar-button>
        
                <input s-model="state.num" class="sugar-input" style="margin: 5px 5px 0;"/>
        
                <sugar-dialog :model="showDialog" @close="closeDialog">
                    <div style="width: 200px;height: 200px;background-color: #fff;border-radius: 5px;">
        
                    </div>
                </sugar-dialog>
        
                <p class="label">s-if</p>
        
                <div s-if="show">{{show}}</div>
        
                <p class="label">显示DiaLog</p>
        
                <sugar-button @click="showDialogFun">
                    {{showDialog}}
                </sugar-button>
            </div>
        
            <div s-if="active === 1">
        
            </div>
        
        </div>


        <script>
        
        
            const {
                makeSugar,
                reactive,
                reckon,
                onMounted,
                ref,
                createEffect,
                instance,
                sugarUI
            } = SUGAR;
        
            const store = reactive({
                num: 0
            });
        
            var sugar = makeSugar({
                bulk() {
        
                    const state = reactive({
                        num: 0,
                        list: [{d: 1}, {d: 2}, {d: 3}, {d: 4}],
                        classText: 'font-size:17px',
                        fontSize: 15,
                        choose: 1,
                        selectList: [{
                            label: '选项一',
                            value: 1
                        }, {
                            label: '选项二',
                            value: 2
                        }]
                    });
        
                    const active = ref(0);
        
                    const button = instance(null);
        
                    const show = ref(false);
        
                    const showDialog = ref(false);
        
                    function closeDialog() {
                        showDialog.value = false;
                    }
        
                    function pushNode(num) {
                        show.value = !show.value;
                        state.num += 1;
                        state.list.push({
                            d: state.list.length + 1
                        });
                    }
        
                    const title = reckon(() => {
                        return state.num + 2;
                    });
        
                    const styleText = reckon(() => {
                        return `font-size:${state.fontSize}px`;
                    });
        
                    onMounted(() => {
                        // state.num += 1;
                    });
        
                    function update(item, num) {
                        state.num += 1;
                    }
        
                    function changeNum(e) {
                        state.num = e.target.value;
                    }
        
                    function changeChoose(e) {
                        state.choose = e;
                    }
        
                    function updateActive() {
                        active.value = active.value === 1 ? 0 : 1;
                    }
        
                    function showDialogFun() {
                        showDialog.value = true;
                    }
        
                    const testRef = ref('testRef');
        
                    return {
                        state,
                        update,
                        title,
                        styleText,
                        changeNum,
                        changeChoose,
                        testRef,
                        pushNode,
                        active,
                        updateActive,
                        store,
                        button,
                        showDialog,
                        show,
                        closeDialog,
                        showDialogFun
        
                    };
                }
            });
        
            sugar.install(sugarUI);
        
            sugar.mount('#app');
        
        
        </script>
