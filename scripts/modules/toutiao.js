var toutiaoData = []
var pending = "lock"
var toutiaoMax = ""
var timer = null;

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/pc/list/feed") !== -1 || (res.data.url.indexOf("/api/pc/list/user/feed") !== -1))) {
            try {
                toutiaoData.push(...JSON.parse(res.data.data).data)
            } catch (e) {

            }
        }
    }
})



function startCollect(max) {
    timer = setInterval(() => {
        if ((toutiaoData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom()
            sendData();

        } else {
            sendData();
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'toutiao',
            }).then(r => {
                pending = "lock"
            })
            clearInterval(timer)
        }
    }, 2000)
}

function sendData() {
    toutiaoData.forEach((t) => {
        if (!t['isSend']) {
            t['isSend'] = true;

            let data = {
                "source": 1,
                "author": t.source,
                "title": t.title,
                "publish_time": t2t(t.publish_time),
                "cover": t?.middle_image?.url,
                "read": t.read_count,
                "comment": t.comment_count,
                "upvote": t.like_count,
                "share": 0,
                "articleId": t.id,
                "articleUrl": t.display_url
            }

            chrome.runtime.sendMessage({
                Message: 'sendData',
                type: 'toutiao',
                data: data
            }).then(r => {

            })

        }
    })
}

function scrollBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight)
}

function t2t(timestamp) {
// 此处时间戳以毫秒为单位
    let date = new Date(parseInt(timestamp) * 1000);
    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Year + '-' + Moth + '-' + Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        toutiaoData = []
        startCollect(Message.toutiaoMax)
        toutiaoMax = Message.toutiaoMax
        sendResponse({state: 200});
    } else if (Message.Message === 'stop') {
        try {
            clearInterval(timer);
        } catch (e) {

        }
        pending = "end";
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200,
            pending: pending,
            toutiaoMax: toutiaoMax
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'toutiao',
        }).then(r => {

        })
        sendResponse({state: 200});
    }
})

//采集历史

let historyCollectIndex = 1;
let state = 0;
let max_collect = 1000;
let finishTime = 10 * 60;
let data_map = []
let data_last_length = 0;
let no_art_time = 0
let noticed = false;
let div = document.createElement('div');
div.style = 'border:1px solid #cdcdcd;position:fixed;top:10px;left:10px;background:#fff;z-index:99999999999;border-radius:5px;display:flex;justify-content:center;align-items:center;padding:10px'
let isInBody = false;
let frameId = '';
let openImage = true;

setInterval(() => {

    if (state === 1) {
        if (data_map.length === data_last_length) {
            no_art_time += 1;
            if (no_art_time > finishTime && !noticed) {
                noticed = true;
                chrome.runtime.sendMessage({
                    Message: 'error',
                    type: 'toutiao',
                }).then(r => {

                })
            }
        } else {
            no_art_time = 0;
            data_last_length = data_map.length;
        }
    }

}, 1000)