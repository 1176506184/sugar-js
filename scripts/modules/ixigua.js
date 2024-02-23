// 窗口ID
let frameId = '';

var CJtimer = null;
var timeout = null;
// 所有变量的声明
var max_collect_send = 1000
var max_collect_send_copy = 1000
var max_collect_count = 0
var finishTime_send = 10 * 60
var finishTime_count = 0
// 开始结束控制变量
var CollectFlag = false;
// 发送数据变量
var PostDataArray = [];
// 第一屏数据
var first_data = {};





// 西瓜视频采历史
async function dealHistoryData(data) {

    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    console.log(window.SSR_HYDRATED_DATA.innerText.replace('window._SSR_HYDRATED_DATA=', ''))
    


    chrome.runtime.sendMessage({
        Message: 'history',
        type: 'ixigua',
        frameId: frameId,
        data: '',
        author: '123测试',
        authorLink: location.href[location.href.length - 1] === '/' ? location.href.slice(0, -1) : location.href
    }).then(r => {
    })
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    console.log('收到插件消息', Message);
    if (Message.Message === 'xhr') {
        sendResponse({ state: 200 });
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'ixigua',
        }).then(r => {

        })
        sendResponse({ state: 200 });
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'history') {
        sendResponse({ state: 200 });
        dealHistoryData(Message).then();
        // 刷新计数清零
        max_collect_count = 0;
        finishTime_count = 0;
    }
})


function scrollBottom() {
    var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    window.scrollTo(0, pageHeight - 50);
}
