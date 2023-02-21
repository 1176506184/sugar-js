let data = {
    facebook: {},
    video: '',
    name: '',
    uid: 0,
    tk: ''
}
const dingTalkAppId = 'dingoac12xjewgmuqs2sea'
const nameDiv = $('#username')
const menu = $('#menu')
const loading = useLoading({})

$(function () {
    if (!localStorage.getItem("tk")) {
        initDingLogin()
        nameDiv.html("钉钉未登录");
    } else {
        nameDiv.html(`已登录：${localStorage.getItem("name")}`);
        initMenu();
    }
})


function initMenu() {
    menu.css('display', 'block');
}


function initDingLogin() {
    let origin = location.origin
    let base = origin + '/login'
    let redirectUrl = encodeURIComponent(base + '?type=dingding')
    const state = 'http://192.168.205.34:57968/';
    let goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${dingTalkAppId}&response_type=code&scope=snsapi_login&state=${state}&redirect_uri=http://ddlogin.anyelse.com/logincallback.ashx`)
    DDLogin({
        id: 'login_container', // 这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
        goto: goto, // 请参考注释里的方式
        style: 'border:none;background-color:#FFFFFF;',
        width: '365',
        height: '300'
    })
    let handleMessage = function (event) {
        let origin = event.origin
        if (origin === 'https://login.dingtalk.com') { // 判断是否来自ddLogin扫码事件。
            let loginTmpCode = event.data // 拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
            let redirectURL = new URL('/connect/oauth2/sns_authorize', 'https://oapi.dingtalk.com')
            redirectURL.searchParams.set('appid', dingTalkAppId)
            redirectURL.searchParams.set('response_type', 'code')
            redirectURL.searchParams.set('scope', 'snsapi_login')
            redirectURL.searchParams.set('state', state)
            redirectURL.searchParams.set('redirect_uri', goto)
            redirectURL.searchParams.set('loginTmpCode', loginTmpCode)
            $.ajax({
                url: redirectURL.href,
                type: 'get'
                // , beforeSend: function (XMLHttpRequest) {
                //     XMLHttpRequest.setRequestHeader("token", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxOD…");
                // }
                , success: function (data) {
                    if (data.StatusCode === 200) {
                        console.log(data.Data)
                        localStorage.setItem("name", data.Data.username);
                        localStorage.setItem("uid", data.Data.id);
                        localStorage.setItem("tk", data.Data.token);
                        nameDiv.html(`已登录：${localStorage.getItem("name")}`);
                        $('#login_container').remove();
                    }
                }
            })
        }
    }
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('message', handleMessage, false)
    }
}


// document.querySelector('#collect').addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {
//             Message: 'collect'
//         });
//     });
// })
//
document.querySelector('#trumpet_video').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            Message: 'video'
        });
    });
})

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'callbackData') {
        data.facebook = Message.data;
        sendResponse("ok");
    } else if (Message.Message === 'video') {
        data.video = Message.url;

    }
});
