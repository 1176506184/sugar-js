let toutiaoPending = "lock";
const Map302 = new Map();

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'loadScript') {
        await chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['scripts/modules/' + Message.script],
            injectImmediately: true,
        });
        sendResponse("ok");
    } else if (Message.Message === 'group') {
        console.log(Message.data)
    } else if (Message.Message === 'web') {
        console.log(Message.data)
    } else if (Message.Message === 'kuaishouUrl') {
        console.log(Message)
        sendResponse(Map302.get(Message.url));
    } else if (Message.Message === 'xiaohongshuUrl') {
        console.log(Message)
        // sendResponse(Map302.get(Message.url));
    }
})

async function getActive() {
    return new Promise((r) => {
        chrome.tabs.query({
            active: true
        }, (tabs) => {
            r(tabs[0])
        })
    })
}

// 创建
chrome.contextMenus.create({
    "id": "tool_ow",
    "title": "tool源视频排文",
    "contexts": ["page", "selection"],
    type: 'normal'
});

//中控
chrome.contextMenus.create({
    "id": "center_control",
    "title": "煎蛋插件中控",
    "contexts": ["page", "selection"],
    type: 'normal'
});

// 监听重定向事件
chrome.webRequest.onBeforeRedirect.addListener(
    function (details) {
        // details 包含了重定向前的 URL (details.requestId) 和重定向后的 URL (details.redirectUrl)
        console.log("原始 URL: " + details.url);
        console.log("重定向到: " + details.redirectUrl);
        Map302.set(details.redirectUrl, details.url);
    },
    { urls: ["<all_urls>"] } // 监听所有 URL
);


// 他的点击事件
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    if (info.menuItemId === "tool_ow") {
        console.log(info.pageUrl)
        if (info.pageUrl.includes("tiktok.com")) {
            chrome.tabs.create({
                url: '/html/out.html#/TiktokVideoFrame?activeId=' + (await getActive()).id,
                active: true
            }, (tab) => {

            })
        } else if (info.pageUrl.includes("youtube.com/")) {
            chrome.tabs.create({
                url: '/html/out.html#/YoutubeVideoFramePW?activeId=' + (await getActive()).id,
                active: true
            }, (tab) => {

            })
        }
    } else if (info.menuItemId === 'center_control') {
        chrome.tabs.create({
            url: '/html/out.html#/CenterControl',
            active: true
        }, () => {

        })
    }
});

//
// function refreshSession() {
//     function task() {
//         chrome.tabs.query({}).then(tabs => {
//             tabs.forEach((tab) => {
//                 if (tab.url.includes("truvid.com")) {
//                     chrome.tabs.reload(tab.id).then(() => {
//
//                     });
//                 }
//             })
//         })
//
//         chrome.cookies.getAll({
//             domain: 'truvid.com'
//         }, (cookies) => {
//             cookies.map((c) => {
//                 if (c.name === 'ci_session') {
//                     console.log(c.value);
//                     fetch("http://captureapi.anyelse.com/SysConfig/update?key=truvid_cookie_from_plug&value=" + c.value + "&remarks=插件自动获取", {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     }).then((res) => {
//
//                     })
//                 }
//             })
//         })
//     }
//
//     setInterval(() => {
//         task();
//     }, 1000 * 60 * 10)
//     task();
// }

// refreshSession();
