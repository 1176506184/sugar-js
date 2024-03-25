// const log = (...args) => chrome.extension.sendRequest({
//     tabId: chrome.devtools.tabId,
//     args,
// });
// // 注册回调，每一个http请求响应后，都触发该回调
// chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
//     try {
//         const [{
//             // 请求的类型，查询参数，以及url
//             request: { method, queryString, url },
//
//             // 该方法可用于获取响应体
//             getContent,
//         }] = args;
//
//         log(method, queryString, url);
//
//         // 将callback转为await promise
//         // warn: content在getContent回调函数中，而不是getContent的返回值
//         const content = await new Promise((res, rej) => getContent(res));
//         log(content);
//     } catch (err) {
//         log(err.stack || err.toString());
//     }
// });

// // 在页面上插入代码
async function injectedScript(path) {
    const scriptNode = document.createElement('script');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.async = true;
    scriptNode.setAttribute('data-eden-async-asset', 'true')
    scriptNode.setAttribute('src', chrome.runtime.getURL(path));
    document.documentElement.appendChild(scriptNode);
    return scriptNode;
}

chrome.storage.local.get('open', (res) => {
    if (res.open !== 0) {
        if (location.href.indexOf('instagram') !== -1 || location.href.indexOf('douyin') !== -1 || location.href.indexOf('twitter') !== -1 || location.href.indexOf('toutiao') !== -1 || location.href.indexOf('sohu') !== -1 || location.href.indexOf('youtube') !== -1
            || location.href.indexOf('facebook') !== -1 || location.href.indexOf('youtube') !== -1 ||
            location.href.indexOf('tiktok') !== -1 || location.href.indexOf('ce.xinli001.com') !== -1
            || location.href.indexOf('beta.console.truvid.com') !== -1 || location.href.indexOf('pinterest') !== -1
            || location.href.indexOf('ixigua') !== -1) {

            injectedScript('scripts/xhr/xhr.js').then(r => {

            })

            chrome.runtime.sendMessage({
                Message: "loadScript",
                script: 'jquery.js'
            }).then(() => {
                console.log("注入query完成")
            })

        }
    }
})


var G = {};
var cacheData = {init: true};
chrome.storage.local.set({iframeVisible: true});
G.scriptList = new Map();
G.scriptList.set("facebook.js", {refresh: true, allFrames: true, world: "MAIN", name: "facebook"});
const webList = ['https://movieweb.com', 'https://collider.com', 'https://fandomwire.com',
    'https://www.tvinsider.com', 'https://www.foxnews.com', 'https://screenrant.com', 'https://nypost.com',
    'https://www.cbr.com', 'https://tasteofcountry.com', 'https://people.com', 'https://outsider.com', 'https://www.outsider.com',
    'https://ew.com', 'https://countrynow.com', 'https://www.dicasdemulher.com.br',
    'https://www.purewow.com', 'https://deadline.com', 'https://pagesix.com', 'https://variety.com','https://www.cheatsheet.com']

const novelList = ['https://www.wfxs.tw', 'https://www.wfxs.com.tw']

if (location.href.indexOf('twtest.anyelse.com') !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'empty.js'
    }).then(() => {
        console.log("注入empty完成")
    })
}
if (location.origin.indexOf("douyin") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'douyin.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("facebook") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'facebook.js'
    }).then(() => {
        console.log("注入完成")
    })

} else if (location.origin.indexOf("twitter") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'twitter.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("toutiao") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'toutiao.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("sohu") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'sohu.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("youtube") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'youtube.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("tiktok") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'tiktok.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("pinterest") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'pinterest.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.origin.indexOf("ixigua") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'ixigua.js'
    }).then(() => {
        console.log("注入ixigua完成")
    })
} else if (location.origin.indexOf("instagram") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'ins.js'
    }).then(() => {
        console.log("注入ins完成")
    })
} else if (location.origin.indexOf("truvid") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'truvid.js'
    }).then(() => {
        console.log("注入truvid完成")
    })
} else if (webList.includes(location.origin)) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'web.js'
    }).then(() => {
        console.log("注入web完成")
    })
} else if (novelList.includes(location.origin)) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'novel.js'
    }).then(() => {
        console.log("注入小说采集完成")
    })
} else if (location.href) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'empty.js'
    }).then(() => {
        console.log("注入empty完成")
    })
}


chrome.storage.local.set({iframeVisible: true});


