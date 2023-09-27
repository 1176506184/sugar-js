const videoData = []
const videoIds = []
window.onload = function () {
    let data = document.querySelector('#SIGI_STATE').innerHTML
    data = JSON.parse(data).ItemModule;
    videoData.push(...Object.keys(data).map(d => {
        return {
            title: data[d].desc,
            href: location.href + `/video/${data[d].id}`,
            playCount: data[d].stats.playCount
        }
    }))
    videoIds.push(...Object.keys(data))
    console.log(videoData);
}

function getVideo() {
    chrome.runtime.sendMessage({
        Message: 'tiktokVideo',
        data: videoData,
        author: document.querySelector('h1[data-e2e="user-title"]')?.innerText
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

        if (typeof d === 'object' && !!d) {

            Object.keys(d).forEach((key) => {
                if (key === 'itemList') {
                    d[key].map(item => {
                        videoIds.push(item.id);
                        if (!videoIds.includes(item.id)) {
                            videoIds.push(item.id)
                            videoData.push({
                                title: item.desc,
                                href: location.href + `/video/${item.id}`,
                                playCount: item.stats.playCount
                            });
                        }
                    })
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
            type: 'tiktok',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})
