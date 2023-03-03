const Vue = require("vue")
import App from "./app.vue";
import ElementPlus from 'element-plus'
import router from "./router/index"
require("element-plus/dist/index.css");
const app = Vue.createApp(App)
app.use(ElementPlus)
app.use(router);
app.mount('#root');
