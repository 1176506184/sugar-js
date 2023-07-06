
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


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        startCollect(Message.toutiaoMax)
        toutiaoMax = Message.toutiaoMax
        sendResponse({ state: 200 });
    } else if (Message.Message === 'stop') {
        pending = "end";
        sendResponse({ state: 200 });
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({ state: 200 });
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'toutiao',
        }).then(r => {

        })
        sendResponse({ state: 200 });
    }
})
