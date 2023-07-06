
var souhuData = []

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/cisv4/feeds") !== -1)) {
            try {
                souhuData.push(JSON.parse(res.data.data))
                console.log(souhuData)
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
