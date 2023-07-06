var toutiaoData = []


window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/pc/list/feed") !== -1 || (res.data.url.indexOf("/api/pc/list/user/feed") !== -1))) {
            try {
                toutiaoData.push(...JSON.parse(res.data.data).data)
                console.log(toutiaoData)
            } catch (e) {

            }
        }
    }
})

var pending = "lock"
var toutiaoMax = ""
var timer = null;

function startCollect(max) {
    timer = setInterval(() => {
        if ((toutiaoData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom()
        } else {
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'toutiao',
            }).then(r => {

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
        startCollect(Message.toutiaoMax)
        toutiaoMax = Message.toutiaoMax
        sendResponse({state: 200});
    } else if (Message.Message === 'stop') {
        try{
            clearInterval(timer);
        }catch(e){
            
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
