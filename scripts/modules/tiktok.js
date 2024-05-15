const videoDataCode = []
const videoIdsCode = []


let videoData = {}
let isCollected = false;
let needScroll = false;
let isOnload = false;
let hasMore = true;
let scrollNum = 0;
let videoDataList = []
let quick = false;
let collectTimeNum = 0;
let div;
if (location.href.includes('#isCollect|quick')) {
    div = document.createElement('div');
    div.style = 'border:1px solid #cdcdcd;position:fixed;top:10px;right:10px;background:#fff;z-index:99999999999;border-radius:5px;display:flex;justify-content:center;align-items:center;padding:10px'
    window.addEventListener('load', () => {
        document.body.append(div)
        div.innerText = '开始中'
    })
}

async function wait(s) {
    return new Promise(r => {
        setTimeout(() => {
            r(true)
        }, s * 1000)
    })
}

setInterval(() => {
    collectTimeNum += 1;
}, 1000)

async function scrollBottom() {

    scrollNum += 1;
    window.scrollTo(0, document.documentElement.scrollHeight);
    if (!quick) {
        await wait(60 * 3.5);
    } else {
        await wait(2);
    }

    console.log(scrollNum, hasMore, videoDataList.length)
    if (scrollNum < 12 && hasMore || quick && videoDataList.length < 400 && collectTimeNum < 120 && hasMore) {
        await scrollBottom();
    }
}


window.onload = async function () {
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
                height: data[d].video.height,
                create_time: data[d].createTime
            }
        }))
        videoIdsCode.push(...Object.keys(data))
    } catch (e) {

    }

    if (location.href.includes('|scroll')) {
        needScroll = true;
    }

    if (location.href.includes('|quick')) {
        quick = true;
        needScroll = true;
    }

    if (location.href.includes('#isCollect')) {
        isCollected = true;
        if (needScroll) {
            await scrollBottom();
        }
        try {
            let data = document.querySelector('#SIGI_STATE')?.innerHTML
            if (data) {
                data = JSON.parse(data).ItemModule;
                if (!data) {
                    getVideoFrame();
                    return;
                }

                if (!needScroll) {
                    videoData = {
                        itemList: Object.values(data).map((d) => {
                            return d
                        })
                    }
                } else {
                    videoDataList.push(...Object.values(data).map((d) => {
                        return d
                    }));
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
            videoDataList.push(...res.data.data.itemList);
            try {
                div.innerText = `当前已采集${videoDataList.length}条数据，目标数量400，已采集${collectTimeNum}秒，最大采集120秒`;
            } catch (e) {

            }
            parseVideo(res.data.data)
        }
    }
})


function getVideoFrame() {
    try {

        console.log(videoDataList)

        if (!videoData && videoDataList.length === 0) {
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
            return;
        }

        videoData.itemList = videoData.itemList.map((item) => {
            item.challenges = []
            return {
                ...item
            }
        })

        if (videoData && !needScroll) {
            chrome.runtime.sendMessage({
                Message: 'tiktokFrame',
                data: videoData,
                author: document.querySelector('h1[data-e2e="user-title"]')?.innerText,
                homepage: location.href.replace('#isCollect', '').replace('|scroll', '')
            }).then(() => {
                isCollected = false;
            })
        } else if (needScroll) {
            chrome.runtime.sendMessage({
                Message: 'tiktokFrame',
                data: {
                    itemList: removeDuplicatesById(videoDataList.map((item) => {
                        return {
                            authorId: item.author.id,
                            stats: item.stats,
                            video: {
                                duration: item.video.duration,
                                cover: item.video.cover,
                                downloadAddr: item.video.downloadAddr
                            },
                            desc: item.desc,
                            id: item.id
                        }
                    }))
                },
                author: document.querySelector('h1[data-e2e="user-title"]')?.innerText,
                homepage: location.href.replace('#isCollect', '').replace('|scroll', '')
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
                homepage: location.href.replace('#isCollect', '').replace('|scroll', '')
            }).then(() => {
                isCollected = false;
            })
        }
    } catch (e) {
        console.log(e)
    }

}

function removeDuplicatesById(array) {
    return [...new Set(array.map(item => item.id))].map(id => {
        // Assuming there is a function or way to retrieve an object by its id
        return getObjectById(array, id);
    });
}

function getObjectById(array, id) {
    return array.find(obj => obj.id === id);
}

function parseVideo(data) {

    function work(d) {

        if (typeof d === 'object' && !!d) {

            Object.keys(d).forEach((key) => {

                if (key === 'hasMore') {
                    hasMore = d[key];
                    if (!hasMore) {
                        div.innerTextdiv.innerText = `采集已结束，当前已采集${videoDataList.length}条数据，请回到插件等待数据上传完成`
                    }
                }

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
                                height: item.video.height,
                                create_time: item.createTime
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
                isCollected: isCollected
            });
        } else {
            sendResponse({
                state: 200,
                isCollected
            });
        }

        location.href = Message.nextHref + '#isCollect' + (Message.Scroll ? '|scroll' : '')
    } else if (Message.Message === 'video_frame_quick') {
        location.href = Message.nextHref + '#isCollect|quick'
        sendResponse({
            state: 200
        });
    }
})
