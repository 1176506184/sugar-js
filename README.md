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
        
            <div class="article_body">
                <div class="title">
                    {{state.title}}
                </div>
                <div class="content" s-html="state.content" ref="htmlRef">
                </div>
            </div>
        
            <div class="article_join">
                <div class="item" s-for="(item,index) in list" :style="index === (list.length - 1) ? 'border:0' : ''">
                    <div class="image_box">
                        <img :src="item.cover" @click="showImage(item)"/>
                    </div>
                    <div class="label_box">
                        {{item.title}}
                    </div>
                </div>
            </div>
        
            <sugar-dialog :model="active" @close="close" :instance="htmlRef">
                <div class="menu_fixed_box">
        
                </div>
            </sugar-dialog>
        
            <sugar-dialog :model="showImageActive" @close="closeImage">
                <img :src="popImage" style="width: 100%;height: auto"/>
            </sugar-dialog>
        
        </div>


        <script>


            const {
                makeSugar,
                onMounted,
                ref,
                instance,
                sugarUI,
                useState,
                useEffect
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
        
                    const [list, setList] = useState([]);
        
                    const [active, setActive] = useState(false);
        
                    const htmlRef = instance(null);
        
                    const [showImageActive, setShowImageActive] = useState(false);
        
                    const [popImage, setPopImage] = useState('');
        
                    function close() {
                        setActive(false);
                    }
        
                    function open() {
                        setActive(true);
                    }
        
                    function closeImage() {
                        setShowImageActive(false);
                    }
        
                    function showImage(item) {
                        setPopImage(item.cover);
                        setShowImageActive(true);
                    }
        
                    onMounted(() => {
                        setList([{
                            title: '你要悄悄的變好，然後驚豔所有人：真正厲害的人，會懂得「蘑菇定律」！',
                            cover: '//cdn.supertime01.com/thumb.ashx?path=%2fdpxs%2f20240520%2f2DA622C0761Ew800h1200.Jpeg&width=150&height=200'
                        }, {
                            title: '#耽美 釣系yyds！汪嘰的雅正徹底離家出走了',
                            cover: '//cdn.sweetastes.com/thumb.ashx?path=%2fdpxs%2f20221007%2f6F15A9339A07w300h400.Jpeg&width=150&height=200'
                        }]);
                    });
        
                    useEffect(() => {
                        console.log('检测到了', active.value);
                    }, [active]);
        
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
                        showImage
                    };
                }
            });
        
            sugar.install(sugarUI);
        
            sugar.mount('#app');
        
        
        </script>
