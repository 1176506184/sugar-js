let toutiaoPending = "lock";

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'loadScript') {
        await chrome.scripting.executeScript({
            target: {tabId: sender.tab.id},
            files: ['scripts/modules/' + Message.script],
            injectImmediately: true,
        });
        sendResponse("ok");
    } else if (Message.Message === 'group') {
        console.log(Message.data)
    } else if (Message.Message === 'web') {
        console.log(Message.data)
    }
})


// chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e)=>{
//     console.log(e);
// })


// chrome.webRequest.onBeforeRequest.addListener((details) => {
//     if (details.url.indexOf('aweme/v1/web/tab/feed') !== -1) {
//         console.log(details)
//         chrome.tabs.query({
//             active: true,
//             currentWindow: true
//         }, function (tabs) {
//
//             chrome.tabs.sendMessage(tabs[0].id, {
//                 Message: 'xhr',
//                 data: details
//             }, function (response) {
//                 if (response?.state !== 200) {
//                     alert("插件已重新加载，请刷新页面")
//                 }
//             });
//         });
//     }
// }, {
//     urls: []
// })


// if (location.href.indexOf("facebook") !== -1) {
//     injectedScript("scripts/modules/facebook.js");
// }
//
// if(location.href.indexOf("douyin") !== -1){
//     injectedScript("scripts/modules/douyin.js");
// }
