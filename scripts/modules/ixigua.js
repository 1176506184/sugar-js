
























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
    }
})


function scrollBottom() {
    var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    window.scrollTo(0, pageHeight - 50);
}
