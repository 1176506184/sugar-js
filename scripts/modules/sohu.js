
var souhuData = []

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/cisv4/feeds") !== -1)) {
            try {
                function handleData(data) {
                    if (typeof data === 'object') {
                        Object.keys(data).forEach(key => {
                            if (typeof data[key] === 'object') {
                                console.log(data[key].data)
                                var resList = data[key].data
                                for (var i in resList) {
                                    var tempObj = {}
                                    if (resList[i].resourceData && resList[i].resourceData.contentData) {
                                        var contentData = resList[i].resourceData.contentData
                                        tempObj.id = contentData.id
                                        tempObj.url = contentData.url
                                        tempObj.author = contentData.authorName
                                        tempObj.title = contentData.title
                                        tempObj.postTime = contentData.postTime
                                        tempObj.cover = contentData.templateInfo ? contentData.templateInfo.url :''
                                        tempObj.pv = contentData.pv
                                        tempObj.like = contentData.likeCount
                                        tempObj.comment = contentData.comments
                                        tempObj.share = 0
                                        // console.log(tempObj)
                                        souhuData.push(tempObj)
                                    }
                                }
                            }
                        })
                    }
                }

                handleData(JSON.parse(res.data.data))
            } catch (e) {

            }
        }
    }
})

var pending = "lock"
var sohuMax = ""
var timer = null;

function startCollect(max) {
    var num = max? parseInt(max): 0
    timer = setInterval(() => {
        if ((souhuData.length < num && pending === "start") || (!num && pending === "start")) {
            scrollBottom()
            sendData(souhuData);
        } else {
            // souhuData数据量一下子超过max
            var postData = souhuData
            if (souhuData.length > num) {
                postData = souhuData.slice(0, num)
            }
            sendData(postData);
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'sohu'
            }).then(r => {
                pending = "lock";
            })

            clearInterval(timer)
        }
    }, 5000)
}

function sendData(data) {
    data.forEach((t) => {
        if (!t['isSend']) {
            t['isSend'] = true;

            let postdata = {
                "source": 2,
                "articleId": t.id.toString(),
                "articleUrl": t.url? 'https://www.sohu.com' + t.url: '',
                "author": t.author,
                "title": t.title,
                "publish_time": t.postTime? t2t(t.postTime): '',
                "cover": t.cover? 'https:' + t.cover : '',
                "read": t.pv,
                "comment": t.comment,
                "upvote": t.like,
                "share": t.share
            }

            chrome.runtime.sendMessage({
                Message: 'sendData',
                type: 'sohu',
                data: postdata
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
    let date = new Date(parseInt(timestamp));
    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Year + '-' + Moth + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Sechond;
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        startCollect(Message.sohuMax)
        sohuMax = Message.sohuMax
        sendResponse({ state: 200 });
    } else if (Message.Message === 'stop') {
        pending = "end";
        sendResponse({ state: 200 });
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200,
            pending: pending,
            sohuMax: sohuMax
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({ state: 200 });
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'sohu',
        }).then(r => {
        })
        sendResponse({ state: 200 });
    }
})
