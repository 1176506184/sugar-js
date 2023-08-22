const videoData = []
const videoIds = []

function getVideo() {
    console.log("开始返回数据")

    chrome.runtime.sendMessage({
        Message: 'youtubeVideo',
        data: videoData,
        author: document.querySelector('.style-scope.ytd-channel-name')?.innerText
    }).then()
}


window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {

        if (res.data.url && (res.data.url.indexOf("browse") !== -1)) {
            parseVideo(res.data.data)
        }
    }
})

function parseVideo(data) {

    function work(d) {

        if (typeof d === 'object') {

            Object.keys(d).forEach((key) => {
                if (key === 'videoRenderer') {

                    if(!videoIds.includes(d[key]?.videoId)){
                        videoIds.push(d[key]?.videoId)
                        videoData.push(d[key]);
                    }

                } else {
                    work(d[key]);
                }
            })

        }

    }

    work(data)

}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'video') {
        console.log("获取任务");
        getVideo();
        sendResponse({state: 200});
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'youtube',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})
