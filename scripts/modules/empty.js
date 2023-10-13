chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'empty',
        }).then(r => {

        })
        sendResponse({state: 200});
    }
    sendResponse({state: 200});
})


