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
        if (location.href.indexOf('douyin') !== -1 || location.href.indexOf('twitter') !== -1 || location.href.indexOf('toutiao') !== -1 || location.href.indexOf('sohu') !== -1 || location.href.indexOf('youtube') !== -1
            || location.href.indexOf('facebook') !== -1 || location.href.indexOf('youtube') !== -1 || location.href.indexOf('tiktok') !== -1) {
            injectedScript('scripts/xhr/xhr.js').then(r => {

            })
        }
    }
})


var G = {};
var cacheData = {init: true};
chrome.storage.local.set({iframeVisible: true});
G.scriptList = new Map();
G.scriptList.set("facebook.js", {refresh: true, allFrames: true, world: "MAIN", name: "facebook"});


if (location.href.indexOf('twtest.anyelse.com') !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'empty.js'
    }).then(() => {
        console.log("注入empty完成")
    })
}
if (location.href.indexOf("douyin") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'douyin.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.href.indexOf("facebook") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'facebook.js'
    }).then(() => {
        console.log("注入完成")
    })

} else if (location.href.indexOf("twitter") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'twitter.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.href.indexOf("toutiao") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'toutiao.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.href.indexOf("sohu") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'sohu.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.href.indexOf("youtube") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'youtube.js'
    }).then(() => {
        console.log("注入完成")
    })
} else if (location.href.indexOf("tiktok") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'tiktok.js'
    }).then(() => {
        console.log("注入完成")
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



