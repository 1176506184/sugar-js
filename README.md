# sugar-js

This is a library that provides responsive capabilities

## Install

npm install sugar-reactive-js

## Use

        <div id="app">

        <div class="nav">
            <div class="web_name">
                <img src="//store.44finefood.com/logo/2022-04-27/306EFED3C8A8.png" class="headling_logo" alt="">
            </div>
            <img src="https://666.44finefood.com/Content/images/menu.svg" class="menu" @click="open" alt=""/>
        </div>
    
        <div class="article_body" s-loading="loading">
            <div class="title">
                {{state.title}}
            </div>
            <div class="content" s-html="state.content">
            </div>
        </div>
    
        <div class="article_join">
            <div class="item" s-for="(item,index) in list" :style="index === (list.length - 1) ? 'border:0' : ''">
                <div class="image_box">
                    <img :src="item.cover" @click="showImage(item)" alt=""/>
                </div>
                <div class="label_box">
                    {{item.title}}
                </div>
            </div>
        </div>
    
        <sugar-dialog :model="active" @close="close">
            <div class="menu_fixed_box" :style="'top:' + top + 'vh'">
                <div s-for="(item,index) in cateList"
                     style="border: 1px solid #666;border-radius: 3px;font-size: 13px;color:#666;text-align: center;line-height: 28px;margin: 10px;width: 80px;height: 28px;float: left">
                    {{item}}
                </div>
            </div>
        </sugar-dialog>
    
        <sugar-dialog :model="showImageActive" @close="closeImage" :instance="htmlRef">
            <img :src="popImage" style="width: 100%;height: auto"/>
        </sugar-dialog>
    
    </div>


        <script>


            const {
                makeSugar,
                onMounted,
                instance,
                useState,
                useEffect,
                nextTick
            } = SUGAR;
        
            var sugar = makeSugar({
                bulk() {
        
                    const [state, setState] = useState({
                        name: 0,
                        title: '狗狗因為太害怕人類，被安排于兩天后安樂死，幸好她出現了..',
                        content: `<p>自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業自曝遭富婆大額打賞！TVB知名男星內地連續直播12小時！被贊太敬業<span id="vft" data-wordc="231"></span></p><p style="font-weight: 600; color: #CC6633;font-size:15px !important ">
                        版權所有，禁止轉載。 違者必究法律責任。
                    </p>`
                    });
        
                    const [cateList, setCateList] = useState(['娱乐', '新闻']);
        
                    const [list, setList] = useState([{
                        title: '你要悄悄的變好，然後驚豔所有人：真正厲害的人，會懂得「蘑菇定律」！',
                        cover: 'https://fastly.picsum.photos/id/1044/200/200.jpg?hmac=HB3e6tTss6J_9wexZ1v1psMlccdyQIrHrrijUgWXFhg'
                    }, {
                        title: '#耽美 釣系yyds！汪嘰的雅正徹底離家出走了',
                        cover: 'https://picsum.photos/200/200?random=1'
                    }, {
                        title: '#耽美 釣系yyds！汪嘰的雅正徹底離家出走了',
                        cover: 'https://picsum.photos/300/200?random=2'
                    }]);
        
                    const [active, setActive] = useState(false);
        
                    const htmlRef = instance(null);
        
                    const [showImageActive, setShowImageActive] = useState(false);
        
                    const [popImage, setPopImage] = useState('');
        
                    const [top, setTop] = useState(-50);
        
                    const [loading, setLoading] = useState(false);
        
                    function close() {
                        setTop(-50);
                        setActive(false);
                    }
        
                    function open() {
                        setActive(true);
                        setTimeout(() => {
                            setTop(0);
                        }, 200);
                    }
        
                    function closeImage() {
                        setShowImageActive(false);
                    }
        
                    function showImage(item) {
                        setPopImage(item.cover);
                        setShowImageActive(true);
                    }
        
                    onMounted(() => {
        
                    });
        
                    useEffect(() => {
                        console.log(showImageActive.value);
                    }, [showImageActive]);
        
                    return {
                        state,
                        active,
                        list,
                        close,
                        open,
                        htmlRef,
                        showImageActive,
                        closeImage,
                        popImage,
                        showImage,
                        top,
                        cateList,
                        loading,
                        setLoading
                    };
                }
            });
        
            sugar.install(sugarUI);
        
            sugar.mount('#app');
        
        
        </script>

## SSR

        createSSRApp({
            render: `<div>
                    <div @click="change" :style="'font-size:' + state.fontSize + 'px'">{{state.name}}</div>
                    <div s-for="(item,index) in state.list">{{index}}</div>
                    </div>`,
            bulk: () => {
                        const [state, setState] = useState({
                            name: '张三',
                            list: [{}, {}, {}],
                            fontSize: 14
                        });
            
                        function change() {
                            setState({
                                ...state.value,
                                fontSize: state.value.fontSize + 1
                            })
                        }
                        return {
                            state,
                            change
                        };
                    }
        });