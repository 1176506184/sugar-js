
var souhuData = []

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/cisv4/feeds") !== -1)) {
            try {
                function handleData(data) {
                    if (typeof data === 'object') {
                        Object.keys(data).forEach(key => {
                            if (typeof data[key] === 'object') {
                                // console.log(data[key].data)
                                var resList = data[key].data
                                for (var i in resList) {
                                    var tempObj = {}
                                    if (resList[i].resourceData && resList[i].resourceData.contentData) {
                                        var contentData = resList[i].resourceData.contentData
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
    // console.log(max)
    timer = setInterval(() => {
        if ((souhuData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom()
        } else {
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'sohu',
                data: souhuData
            }).then(r => {
                pending = "lock";
            })

            clearInterval(timer)
        }
    }, 5000)
}

function scrollBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight)
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
