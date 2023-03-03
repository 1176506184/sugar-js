import Home from "../view/index.vue"
import TrumpetVideo from "../view/trumpetVideo.vue";

const VueRouter = require("vue-router")
const routes = [
    {
        name:'Home',
        path: '/',
        component: Home
    },
    {
        name: 'TrumpetVideo',
        path: '/TrumpetVideo',
        component: TrumpetVideo,
        props: route => ({ query: route.query.q })
    }
]

const router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;