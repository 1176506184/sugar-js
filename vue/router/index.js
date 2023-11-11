import Home from "../view/index.vue"
import TrumpetVideo from "../view/trumpetVideo.vue";
import TwitterImage from "../view/twitterImage.vue"
import YoutubeVideo from "../view/youtubeVideo.vue"
import YoutubeVideoFrame from "../view/youtubeVideoFrame.vue"
import ShortsVideo from "../view/shortsVideo.vue";
import WebCollect from "../view/webCollect.vue";
import TiktokVideo from "../view/tiktokVideo.vue";
import FacebookVideo from "../view/FacebookVideoFrame.vue";
import douyinVideo from "../view/douyinVideo.vue"
import TiktokFrame from "../view/tiktokFrame.vue";
import novel from "../view/novel.vue";
import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
    {
        name: 'Home',
        path: '/',
        component: Home,
        meta: {
            keepAlive: true
        }
    },
    {
        name: 'TrumpetVideo',
        path: '/TrumpetVideo',
        component: TrumpetVideo,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'TwitterImage',
        path: '/TwitterImage',
        component: TwitterImage,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'YoutubeVideo',
        path: '/YoutubeVideo',
        component: YoutubeVideo,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'YoutubeVideoFrame',
        path: '/YoutubeVideoFrame',
        component: YoutubeVideoFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'ShortsVideo',
        path: '/ShortsVideo',
        component: ShortsVideo,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'WebCollect',
        path: '/WebCollect',
        component: WebCollect,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'TiktokVideo',
        path: '/TiktokVideo',
        component: TiktokVideo,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'douyinVideo',
        path: '/douyinVideo',
        component: douyinVideo,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'FBCollect',
        path: '/FBCollect',
        component: FacebookVideo,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'Novel',
        path: '/Novel',
        component: novel,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'TiktokFrame',
        path: '/TiktokFrame',
        component: TiktokFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;
