import Home from "../view/index.vue"
import TrumpetVideo from "../view/trumpetVideo.vue";
import TwitterImage from "../view/twitterImage.vue"
import YoutubeVideo from "../view/youtubeVideo.vue"
import YoutubeVideoFrame from "../view/youtubeVideoFrame.vue"
import YoutubeVideoFramePW from "../view/youtubeVideoFramePW.vue"
import ShortsVideo from "../view/shortsVideo.vue";
import WebCollect from "../view/webCollect.vue";
import WebCollectFrame from "../view/webCollectFrame.vue";
import TiktokVideo from "../view/tiktokVideo.vue";
import FacebookVideo from "../view/FacebookVideoFrame.vue";
import FBCollectHistory from "../view/FacebookHistoryFrame.vue";
import TTCollectHistory from "../view/twitterHistoryFrame.vue";
import InsCollectHistory from "../view/insHistoryFrame.vue";
import douyinVideo from "../view/douyinVideo.vue";
import TiktokFrame from "../view/tiktokFrame.vue";
import TiktokVideoFrame from "../view/tiktokVideoFrame.vue";
import TiktokVideoCommunitySchedulingFrame from "../view/tiktokVideoCommunitySchedulingFrame.vue";
import ToutiaoCommunitySchedulingFrame from "../view/ToutiaoCommunitySchedulingFrame.vue";
import YoutubeVideoCommunitySchedulingFramePW from "../view/youtubeVideoCommunitySchedulingFramePW.vue";
import DouyinVideoCommunitySchedulingFrame from "../view/douyinVideoCommunitySchedulingFrame.vue";
import TwitterImageCommunitySchedulingFram from "../view/twitterImageCommunitySchedulingFrame.vue";
import TwitterVideoCommunitySchedulingFram from "../view/twitterVideoCommunitySchedulingFrame.vue";
import TwitterVideoPW from "../view/twitterVideoPW.vue";
import ToutiaoHistory from "../view/ToutiaoHistory.vue";
import pinterestHistoryFrame from "../view/pinterestHistoryFrame.vue";
import ixiguaVideoFrame from "../view/ixiguaVideoFrame.vue";
import ixiguaHistoryFrame from "../view/ixiguaHistoryFrame.vue";
import ImageCreate from "../view/imageCreate.vue"
import CenterControl from '../view/centerControl.vue';


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
        name: 'WebCollectFrame',
        path: '/WebCollectFrame',
        component: WebCollectFrame,
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
        name: 'FBCollectHistory',
        path: '/FBCollectHistory',
        component: FBCollectHistory,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'TTCollectHistory',
        path: '/TTCollectHistory',
        component: TTCollectHistory,
        props: route => ({query: route.query.q}),
        meta: {}
    },
    {
        name: 'InsCollectHistory',
        path: '/InsCollectHistory',
        component: InsCollectHistory,
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
    }, {
        name: 'YoutubeVideoFramePW',
        path: '/YoutubeVideoFramePW',
        component: YoutubeVideoFramePW,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'TiktokVideoFrame',
        path: '/TiktokVideoFrame',
        component: TiktokVideoFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'TiktokVideoCommunitySchedulingFrame',
        path: '/TiktokVideoCommunitySchedulingFrame',
        component: TiktokVideoCommunitySchedulingFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'ToutiaoCommunitySchedulingFrame',
        path: '/ToutiaoCommunitySchedulingFrame',
        component: ToutiaoCommunitySchedulingFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'YoutubeVideoCommunitySchedulingFramePW',
        path: '/YoutubeVideoCommunitySchedulingFramePW',
        component: YoutubeVideoCommunitySchedulingFramePW,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'DouyinVideoCommunitySchedulingFrame',
        path: '/DouyinVideoCommunitySchedulingFrame',
        component: DouyinVideoCommunitySchedulingFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'TwitterImageCommunitySchedulingFram',
        path: '/TwitterImageCommunitySchedulingFram',
        component: TwitterImageCommunitySchedulingFram,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'TwitterVideoCommunitySchedulingFram',
        path: '/TwitterVideoCommunitySchedulingFram',
        component: TwitterVideoCommunitySchedulingFram,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'TwitterVideoPW',
        path: '/TwitterVideoPW',
        component: TwitterVideoPW,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'ToutiaoHistory',
        path: '/ToutiaoHistory',
        component: ToutiaoHistory,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'pinterestHistoryFrame',
        path: '/pinterestHistoryFrame',
        component: pinterestHistoryFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'ixiguaVideoFrame',
        path: '/ixiguaVideoFrame',
        component: ixiguaVideoFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'ixiguaHistoryFrame',
        path: '/ixiguaHistoryFrame',
        component: ixiguaHistoryFrame,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'imageCreate',
        path: '/imageCreate',
        component: ImageCreate,
        props: route => ({query: route.query.q}),
        meta: {}
    }, {
        name: 'CenterControl',
        path: '/CenterControl',
        component: CenterControl,
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
