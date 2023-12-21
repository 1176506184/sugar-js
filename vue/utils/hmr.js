let fileList = [
    'css/index.css',
    'css/style.css',
    'html/index.html',
    'html/out.html',
    'script/version.js',
    'script/init.js',
    'script/background.js',
    'script/popup.js',
    'script/modules/baidu.js',
    'script/modules/douyin.js',
    'script/modules/empty.js',
    'script/modules/facebook.js',
    'script/modules/novel.js',
    'script/modules/sohu.js',
    'script/modules/tiktok.js',
    'script/modules/tiktokOld.js',
    'script/modules/toutiao.js',
    'script/modules/twitter.js',
    'script/modules/web.js',
    'script/modules/youtube.js',
    'script/utils/jquery.js',
    'script/vue/main.js',
    'script/vue/main.js.map',
    'script/vue/vMin.js',
    'script/vue/vMin.js.map',
    'xhr/xhr.js',
    'utils/formatDate.js',
    'manifest.json'
];

let downLoadUrl = 'http://152.32.188.85/hmr/';

function hmr(module) {
}

function downLoad(url, fileName) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let blob = xhr.response;
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function () {
            let base64 = reader.result;
            let a = document.createElement('a');
            a.href = base64;
        }
    }
}