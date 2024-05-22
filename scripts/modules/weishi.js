function checkIsIframe() {
    let iframe = document.querySelector('.mobile iframe')
    if (iframe) {
        location.href = iframe.src + '&history=1'
    }
}

let scrollNum = 0;
const videoDataList = []
let hasMore = true;

if (location.href.includes('&history=1')) {
    div = document.createElement('div');
    div.style = 'color:#000;border:1px solid #cdcdcd;position:fixed;top:10px;right:10px;background:#fff;z-index:99999999999;border-radius:5px;display:flex;justify-content:center;align-items:center;padding:10px'
    window.addEventListener('load', () => {
        document.body.append(div)
        div.innerText = '正在初始化采集系统...'
    })
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var params = new URLSearchParams(url);
    return params.get(name);
}

async function scrollBottom() {
    document.querySelector('.pc-container').scrollTop = document.querySelector('.pc-container').scrollHeight;
    window.scrollTo(0, document.documentElement.scrollHeight);
    await wait(2);
    console.log(scrollNum, hasMore, videoDataList.length)
    if (videoDataList.length < 400 && scrollNum < 180 && hasMore) {
        scrollNum++;
        await scrollBottom();
    } else {
        div.innerText = '采集完成，请关闭当前页面，待插件页面显示采集完成后再关闭插件页面'
        console.log(videoDataList)
        const result = videoDataList.filter(r => r.video && r.poster_id === getParameterByName('id')).map((r) => {
            return {
                id: r.id,
                images: r.images[0]?.url,
                poster_id: r.poster_id,
                createtime: r.createtime,
                ding_count: r.ding_count,
                playNum: r.playNum,
                video_url: r.video_url,
                feed_desc: r.feed_desc,
                duration: r.video.duration
            }
        })

        chrome.runtime.sendMessage({
            Message: 'result',
            result
        }).then(() => {

        })
    }
}


async function wait(s) {
    return new Promise(r => {
        setTimeout(() => {
            r(true)
        }, s * 1000)
    })
}


window.addEventListener('load', () => {
    if (location.href.includes('&history=1')) {

        chrome.runtime.sendMessage({
            Message: 'authorInfo',
            author: document.querySelector('.name')?.innerText,
            homepage: location.href
        }).then(() => {

        })

        scrollBottom().then()
    }
})

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/GetPersonalFeedList") !== -1)) {
            let data = JSON.parse(res.data.data)
            if (data.rsp_body?.feeds) {
                hasMore = !data.rsp_body.isFinished;
                if (!hasMore) {
                    div.innerText = '采集完成，请关闭当前页面，待插件页面显示采集完成后再关闭插件页面'
                }
                videoDataList.push(...data.rsp_body.feeds)
                div.innerText = `当前已采集${videoDataList.length}条数据，目标数量400，已尝试下拉${scrollNum}次，最大下拉180次`;
            }
        }
    }
})


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {

    if (Message.Message === 'getHistory') {
        checkIsIframe();
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'weishi',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }

});