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
const select = useSelect({
    el: '#username',
    options: [{
        label: '退出登录',
        handle: () => {
            removeMenu()
            initDingLogin()
        }
    }]
})

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

function removeMenu(){
    nameDiv.html("钉钉未登录");
    localStorage.removeItem("tk")
    menu.css('display', 'none');
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
                        localStorage.setItem("name", data.Data.username);
                        localStorage.setItem("uid", data.Data.id);
                        localStorage.setItem("tk", data.Data.token);
                        nameDiv.html(`已登录：${localStorage.getItem("name")}`);
                        $('#login_container').remove();
                        initMenu();
                    }
                }
            })
        }
    }
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('message', handleMessage, false)
    }
}


document.querySelector('#trumpet_video').addEventListener('click', () => {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            Message: 'video'
        }, function (response) {
            if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面")
            }
        });

    });

})

chrome.runtime.onMessage.addListener(function (Message, sender, sendResponse) {
    if (Message.Message === 'callbackData') {
        data.facebook = Message.data;
        sendResponse("ok");
    } else if (Message.Message === 'video') {
        loading.open();
        data.video = Message.url;
        let realData = Message.data;
        let domData = Message.domData
        if (Object.keys(realData).length > 0) {
            try {
                http('Video/SaveVideo', {
                    platform: 1,
                    title: realData.preview_title ? realData.preview_title : realData.desc,
                    resouce_url: (function () {
                        if (realData.video.download_addr?.url_list[0]) {
                            return realData.video.download_addr?.url_list[0]
                        } else {
                            return realData.video.play_addr?.url_list[0]
                        }
                    })(),
                    resouce_link:'' ,
                    times: realData.video.duration / 1000,
                    play_count: realData.statistics.play_count,
                    like_count: realData.statistics.digg_count,
                    share_count: realData.statistics.share_count,
                    collect_count: realData.statistics.collect_count,
                    comment_count: realData.statistics.comment_count,
                    publish_time: parseDate(realData.create_time),
                    author_name: realData.author.nickname,
                    author_url: `https://douyin.com/user/${realData.author.sec_uid}?vid=${realData.group_id}`,
                    author_id: realData.group_id,
                }).then(res => {
                    console.log(res.newid);
                })
            } catch (e) {
                console.log(e);
            }
        } else {
            http('Video/SaveVideo', {
                platform: 1,
                resouce_link: domData.video,
                author_url: domData.author_url,
                title: domData.title,
                author_name: domData.author
            }).then(res => {

            });
        }

        loading.close();
    }
});

function parseDate(times) {
    //日期
    times = new Date(times * 1000);
    let DD = String(times.getDate()).padStart(2, '0'); // 获取日
    let MM = String(times.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
    let yyyy = times.getFullYear(); // 获取年

    // 时间
    let hh = String(times.getHours()).padStart(2, '0');       //获取当前小时数(0-23)
    let mm = String(times.getMinutes()).padStart(2, '0');     //获取当前分钟数(0-59)
    let ss = String(times.getSeconds()).padStart(2, '0');     //获取当前秒数(0-59)
    return yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
}


