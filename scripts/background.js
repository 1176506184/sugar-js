chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'loadScript') {
        await chrome.scripting.executeScript({
            target: {tabId: sender.tab.id},
            files: ['scripts/modules/' + Message.script],
            injectImmediately: true,
        });
        sendResponse("ok");
    }
});

