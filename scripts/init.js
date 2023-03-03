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

injectedScript('scripts/xhr/xhr.js')


var G = {};
var cacheData = {init: true};
chrome.storage.local.set({iframeVisible: true});
G.scriptList = new Map();
G.scriptList.set("facebook.js", {refresh: true, allFrames: true, world: "MAIN", name: "facebook"});


if (location.href.indexOf("facebook") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'facebook.js'
    }).then(() => {
        console.log("注入完成")
    })

}


if (location.href.indexOf("douyin") !== -1) {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'douyin.js'
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
} else {
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'empty.js'
    }).then(() => {
        console.log("注入完成")
    })
}


chrome.storage.local.set({iframeVisible: true});



