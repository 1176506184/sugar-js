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
    }
});


function refreshSession() {
    function task() {
        chrome.tabs.query({}).then(tabs => {
            tabs.forEach((tab) => {
                if (tab.url.includes("truvid.com")) {
                    chrome.tabs.reload(tab.id).then(() => {

                    });
                }
            })
        })

        chrome.cookies.getAll({
            domain: 'truvid.com'
        }, (cookies) => {
            cookies.map((c) => {
                if (c.name === 'ci_session') {
                    console.log(c.value);
                    fetch("http://captureapi.anyelse.com/SysConfig/update?key=truvid_cookie_from_plug&value=" + c.value + "&remarks=插件自动获取", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {

                    })
                }
            })
        })
    }

    setInterval(() => {
        task();
    }, 1000 * 60 * 10)
    task();
}

refreshSession();
