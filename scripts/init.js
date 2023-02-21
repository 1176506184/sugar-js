var G = {};
var cacheData = {init: true};
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


if(location.href.indexOf("douyin") !== -1){
    chrome.runtime.sendMessage({
        Message: "loadScript",
        script: 'douyin.js'
    }).then(() => {
        console.log("注入完成")
    })
}
