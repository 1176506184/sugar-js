const videoDataCode = []
const videoIdsCode = []


let videoData = {}
const videoIds = []
let isCollected = false;
let isOnload = false;
// console.log(chrome.tabs.)
window.onload = function () {
    try {
        let data = document.querySelector('#SIGI_STATE').innerHTML
        data = JSON.parse(data).ItemModule;
        videoDataCode.push(...Object.keys(data).map(d => {
            return {
                title: data[d].desc,
                href: location.origin + location.pathname + `/video/${data[d].id}`,
                playCount: data[d].stats.playCount,
                duration: data[d].video.duration,
                width: data[d].video.width,
                height: data[d].video.height
            }
        }))
        videoIdsCode.push(...Object.keys(data))
    } catch (e) {

    }
    if (location.href.includes('#isCollect')) {
        isCollected = true;
        try {
            let data = document.querySelector('#SIGI_STATE')?.innerHTML
            if (data) {
                data = JSON.parse(data).ItemModule;
                if (!data) {
                    getVideoFrame();
                    return;
                }
                videoData = {
                    itemList: Object.values(data).map((d) => {
                        return d
                    })
                }
                getVideoFrame();
            } else {

                setTimeout(() => {
                    getVideoFrame();
                }, 3000)

            }
        } catch (e) {
            getVideoFrame();
        }
    }
    isOnload = true;
}

function getVideo() {
    chrome.runtime.sendMessage({
        Message: 'douyinVideo',
        data: videoDataCode,
        author: document.querySelector('h1[data-e2e="user-title"]')?.innerText,
        locationHref: location.href
    }).then()
}

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/post/item_list") !== -1)) {
            videoData = res.data.data;
            parseVideo(res.data.data)
        }
    }
})


function getVideoFrame() {
    try {
        videoData.itemList = videoData.itemList.map((item) => {
            item.challenges = []
            return {
                ...item
            }
        })

        if (videoData) {
            chrome.runtime.sendMessage({
                Message: 'tiktokFrame',
                data: videoData,
                author: document.querySelector('h1[data-e2e="user-title"]')?.innerText,
                homepage: location.href.replace('#isCollect', '')
            }).then(() => {
                isCollected = false;
            })
        } else {
            chrome.runtime.sendMessage({
                Message: 'tiktokFrame',
                data: {
                    itemList: []
                },
                author: document.querySelector('h1[data-e2e="user-title"]')?.innerText,
                homepage: location.href.replace('#isCollect', '')
            }).then(() => {
                isCollected = false;
            })
        }
    } catch (e) {

    }

}


function parseVideo(data) {

    function work(d) {

        if (typeof d === 'object' && !!d) {

            Object.keys(d).forEach((key) => {
                if (key === 'itemList') {
                    console.log(d[key])
                    d[key].map(item => {
                        if (!videoIdsCode.includes(item.id)) {
                            videoIdsCode.push(item.id)
                            videoDataCode.push({
                                title: item.desc,
                                href: location.origin + location.pathname + `/video/${item.id}`,
                                playCount: item.stats.playCount,
                                duration: item.video.duration,
                                width: item.video.width,
                                height: item.video.height
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
    } else if (Message.Message === 'video_frame') {
        let noLoad = !isOnload
        if (noLoad) {
            sendResponse({
                state: 200,
                isCollected: true
            });
        } else {
            sendResponse({
                state: 200,
                isCollected
            });
        }

        if (!isCollected && !noLoad) {
            location.href = Message.nextHref + '#isCollect'
        }
    }
})
