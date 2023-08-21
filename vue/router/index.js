import Home from "../view/index.vue"
import TrumpetVideo from "../view/trumpetVideo.vue";
import TwitterImage from "../view/twitterImage.vue"
import YoutubeVideo from "../view/youtubeVideo.vue"
import {createRouter, createWebHashHistory} from "vue-router";
const routes = [
    {
        name:'Home',
        path: '/',
        component: Home,
        meta:{
            keepAlive:true
        }
    },
    {
        name: 'TrumpetVideo',
        path: '/TrumpetVideo',
        component: TrumpetVideo,
        props: route => ({ query: route.query.q }),
        meta:{

        }
    },
    {
        name: 'TwitterImage',
        path: '/TwitterImage',
        component: TwitterImage,
        props: route => ({ query: route.query.q }),
        meta:{

        }
    },
    {
        name: 'YoutubeVideo',
        path: '/YoutubeVideo',
        component: YoutubeVideo,
        props: route => ({ query: route.query.q }),
        meta:{

        }
    }
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;