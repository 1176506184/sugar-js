const videoData = [];
const godComment = [];

function getVideo() {

    console.log(godComment);

    let video = document.querySelector('div[data-e2e="feed-active-video"] video');

    if (!video) {
        video = document.querySelector('video')
    }

    let url = video.childNodes[0]?.src;

    let pic = document.querySelector('div[data-e2e="feed-active-video"] .background img')

    if (!pic) {
        pic = document.querySelector('.background')
    }

    let author = document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="feed-video-nickname"]')?.innerText;

    if (!author) {
        author = document.querySelector('div[data-e2e="feed-video-nickname"]')?.innerText;
    }

    if (!author) {
        document.querySelectorAll('div[data-e2e="user-info"] a[href*="/user/"]').forEach(d => {
            if (d.innerText) {
                author = d.innerText
            }
        })
    }

    let author_url = document.querySelector('div[data-e2e="feed-active-video"] a[href*="/user/"][data-e2e="video-avatar"]')?.href;

    if (!author_url) {
        author_url = document.querySelector('a[href*="/user/"][data-e2e="video-avatar"]')?.href;
    }

    let title = document.querySelector('div[data-e2e="feed-active-video"] div.title')?.innerText;

    if (!title) {
        title = document.querySelector('div.title')?.innerText;
    }

    if (!title) {
        title = document.querySelector(`div[data-e2e="detail-video-info"] h2`)?.innerText;
    }

    if (!title) {
        title = document.querySelector(`div[data-e2e="detail-video-info"] h1`)?.innerText;
    }

    let realVideoData = {}
    let reUrl = ``;
    if (document.querySelector('div[data-e2e="detail-video-info"]')) {
        reUrl = `https://douyin.com/video/${document.querySelector('div[data-e2e="detail-video-info"]').getAttribute("data-e2e-aweme-id")}`
    } else if (document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]')) {
        reUrl = `https://douyin.com/video/${document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]').getAttribute("data-e2e-aweme-id")}`;
    } else {
        reUrl = location.href;
    }

    let aweme_id = document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]')?.getAttribute("data-e2e-aweme-id");
    if (!aweme_id) {
        document.querySelector('div[data-e2e="detail-video-info"]')?.getAttribute("data-e2e-aweme-id")
    }

    videoData.forEach(d => {
        let aweme_list = d.aweme_list;
        aweme_list.forEach((item) => {
            if (aweme_id.toString() === item.aweme_id.toString()) {
                realVideoData = item;
                realVideoData.reUrl = reUrl;
                realVideoData.pic = pic?.src;
            }
        })
    })

    try {


        if (Object.keys(realVideoData).length === 0 && !url) {
            alert("未检测到video标签下的素材院地址，请刷新当前页面");
            return;
        }

        if (!aweme_id && document.body.innerText.indexOf("直播中") !== -1) {
            alert("未检测到当前为直播");
            return;
        }

        chrome.runtime.sendMessage({
            Message: 'video',
            data: realVideoData,
            domData: {
                url: reUrl,
                video: url,
                author_url: author_url,
                title: title,
                author: author,
                pic: pic?.src,
            },
            godComment: godComment
        })
    } catch (e) {
        console.log(e);
    }

}


function getVideoUrl() {
    let data = []

    Array.from(document.querySelectorAll('a[href*="/video/"]')).map((n) => {
        if (n.querySelector('p')?.innerText) {
            data.push({
                href: n.href,
                play: dealNum(n.querySelector('.author-card-user-video-like')?.innerText),
                title: n.querySelector('p')?.innerText
            })
        }
    })

    let author = document.querySelector('[data-e2e="user-info"] .Nu66P_ba')?.innerText

    chrome.runtime.sendMessage({
        Message: 'tiktokVideo',
        data: data,
        author: author
    }).then()

}


// 社团源素材排程
function getDouyinVideoUrl() {
    let data = []

    Array.from(document.querySelectorAll('a[href*="/video/"]')).map((n) => {
        if (n.querySelector('p')?.innerText) {
            data.push({
                href: n.href,
                play: dealNum(n.querySelector('.author-card-user-video-like')?.innerText),
                title: n.querySelector('p')?.innerText
            })
        }
    })

    let author = document.querySelector('[data-e2e="user-info"] h1')?.innerText

    chrome.runtime.sendMessage({
        Message: 'communityVideo',
        data: data,
        author: author
    }).then()

}


function dealNum(num) {

    let result = num

    if (num === "" || num == null) {
        return 0;
    } else {

        result = num.replace(/[^\d.]/ig, "");

        if (num.toString().includes('万')) {
            result = result * 10000;
        }

        if (num.toString().includes('K')) {
            result = result * 1000;
        }

        return parseInt(result);
    }
}

let truvid_data = []

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("aweme/v1/web/aweme/post/?device_platform=webapp") !== -1 || res.data.url.indexOf("/aweme/v1/web/tab/feed/?device_platform=webapp") !== -1)) {
            videoData.push(JSON.parse(res.data.data))
            truvid_data.push(...JSON.parse(res.data.data).aweme_list)
            douyinData.push(...JSON.parse(res.data.data).aweme_list)
            console.log(douyinData)
        }
        try {
            getComment(JSON.parse(res.data.data))
        } catch (e) {
            // console.log(e);
        }
    }
})


function getComment(data) {
    if (typeof data === 'object' && data !== null && data !== undefined) {
        Object.keys(data).forEach(key => {
            if (key === "comments") {
                console.log(data[key])
                godComment.push(...data[key]);
            } else if (typeof data[key] === 'object') {
                getComment(data[key]);
            }
        })
    }
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'video') {
        console.log("获取任务");
        getVideo();
        sendResponse({state: 200});
    } else if (Message.Message === 'copy_video') {
        getVideoUrl();
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'douyin',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'community_video') {
        getDouyinVideoUrl();
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'history') {
        sendResponse({state: 200});
        dealHistoryData(Message).then();
    } else if (Message.Message === 'startCollectHistory') {
        sendResponse({state: 200});
        startCollectHistory(Message);
    } else if (Message.Message === 'pauseCollectHistory') {
        sendResponse({state: 200});
        pauseCollectHistory(Message);
    } else if (Message.Message === 'videoTruvid') {
        sendResponse({state: 200});
        truvidData();
    }
})


var douyinData = [];
var pending = "lock"
var timer = null;

function startCollect(max) {
    timer = setInterval(() => {
        if ((douyinData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom().then()
        } else {
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'douyin',
            }).then(r => {
                pending = "lock"
            })
            clearInterval(timer)
        }
    }, 2000)
}

//采集历史
let historyCollectIndex = 1;
let state = 0;
let max_collect = 1000;
let finishTime = 10 * 60;
let data_map = []
let data_last_length = 0;
let no_art_time = 0
let noticed = false;
let div = document.createElement('div');
div.style = 'border:1px solid #cdcdcd;position:fixed;top:10px;left:10px;background:#fff;z-index:99999999999;border-radius:5px;display:flex;justify-content:center;align-items:center;padding:10px'
let isInBody = false;
let frameId = '';
let openImage = true;
let article_url_map = []

// 抖音采历史
async function dealHistoryData(data) {


    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    let author = document.querySelector('div[data-e2e="user-info"] h1')?.innerText;

    let author_url = location.href + location.pathname

    chrome.runtime.sendMessage({
        Message: 'history',
        frameId: frameId,
        type: 'douyin',
        data: '',
        author: author,
        authorLink: author_url,
    }).then(r => {

    })
}

setInterval(() => {

    if (state === 1) {
        if (data_map.length === data_last_length) {
            no_art_time += 1;
            if (no_art_time > finishTime && !noticed) {
                noticed = true;
                chrome.runtime.sendMessage({
                    Message: 'error',
                    type: 'douyin',
                }).then(r => {

                })
            }
        } else {
            no_art_time = 0;
            data_last_length = data_map.length;
        }
    }

}, 1000)

function startCollectHistory(data) {

    if (frameId !== data.frameId && frameId !== "") {
        return
    }

    if (!isInBody) {
        isInBody = true;
        document.body.appendChild(div);
        div.innerText = `当前已采集${data_map.length}条数据，最大采集数量${max_collect}`;
    }


    if (state === 0) {
        state = 1;
        openImage = data.openImage;
        finishTime = data.finishTime * 60
        max_collect = data.max_collect
        collectHistory().then();
    }
}


function pauseCollectHistory(data) {
    if (frameId !== data.frameId && frameId !== "") {
        return
    }
    state = 0;
}

async function wait(s) {
    return new Promise(r => {
        setTimeout(() => {
            r(true)
        }, s * 1000)
    })
}

async function scrollBottom() {
    // await startGetPageTask();
    window.scrollTo(0, document.documentElement.scrollHeight)
}


async function collectHistory() {
    if (state === 1) {
        try {
            await scrollBottom();
            await wait(5);
            for (let i = 0; i < douyinData.length; i++) {
                if (douyinData[i].aweme_id) {
                    let item = douyinData[i]
                    item.article_url = `https://www.douyin.com/video/${item.aweme_id}`;
                    if (!article_url_map.includes(item.article_url)) {
                        article_url_map.push(item.article_url);
                        let videoURL = item.article_url + ';';
                        let data = {
                            article_type: 3,
                            source_urls: videoURL,
                            title: item.preview_title,
                            article_url: item.article_url,
                            post_url: item.article_url,
                            move_total: item.statistics.digg_count + item.statistics.comment_count + item.statistics.share_count,
                            likes: item.statistics.digg_count,
                            comments: item.statistics.comment_count,
                            shares: item.statistics.share_count,
                            return_msg: '',
                            remark: '',
                            publish_time: t2t(item.create_time)
                        }

                        data_map.push(data);
                        div.innerText = `当前已采集${data_map.length}条数据，最大采集数量${max_collect}`;
                        if (state === 1) {
                            chrome.runtime.sendMessage({
                                Message: 'history_data',
                                frameId: frameId,
                                type: 'douyin',
                                data: data
                            }).then(r => {

                            })
                        }
                    }
                }
            }
            douyinData = [];
            historyCollectIndex += 1;
            if (state === 1) {
                collectHistory().then();
            }
        } catch (e) {
            console.log(e);
            if (state === 1) {
                historyCollectIndex += 1;
                collectHistory().then();
            }
        }
    }
}

function t2t(timestamp) {
// 此处时间戳以毫秒为单位
    let date = new Date(parseInt(timestamp) * 1000);
    let Year = date.getFullYear();
    let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Year + '-' + Moth + '-' + Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
}

function truvidData() {
    let author = document.querySelector('div[data-e2e="user-info"] h1')?.innerText;

    let author_url = location.href + location.pathname

    chrome.runtime.sendMessage({
        Message: 'douyinVideo',
        type: 'douyin',
        data: truvid_data.map((item) => {
            return {
                title: item.preview_title,
                href: `https://www.douyin.com/video/${item.aweme_id}`,
                cover: item.video.cover.url_list[0],
                duration: item.duration / 1000,
                create_time: item.create_time,
                playCount: 0,
                upvotecount: item.statistics.digg_count,
                commentcount: item.statistics.comment_count,
                sharecount: item.statistics.share_count,
                author: author,
                authorLink: author_url
            }
        }),
        author: author,
        authorLink: author_url,
    }).then(r => {

    })
}

