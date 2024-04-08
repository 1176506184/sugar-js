const videoData = []
const videoIds = []


//采集历史

var youtubeData = [];
var pending = "lock"
var timer = null;
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

    let author = document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText;
    if (!author) {
        author = document.querySelector('h1.dynamic-text-view-model-wiz__h1').textContent
    }

    let author_url = location.href + location.pathname

    chrome.runtime.sendMessage({
        Message: 'history',
        frameId: frameId,
        type: 'youtube',
        data: '',
        author: author,
        authorLink: author_url,
    }).then(r => {

    })
}


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


function getVideo(type) {
    console.log("开始返回数据")
    if (type === 'frame') {
        chrome.runtime.sendMessage({
            Message: 'youtubeVideo',
            data: videoData,
            author: document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText ? document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText : document.querySelector('h1.dynamic-text-view-model-wiz__h1').textContent
        }).then()
    } else {
        chrome.runtime.sendMessage({
            Message: 'youtubeVideo',
            data: videoData,
            author: document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText ? document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText : document.querySelector('h1.dynamic-text-view-model-wiz__h1').textContent
        }).then()
    }

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
                if (key === 'videoRenderer' || key === 'reelItemRenderer') {

                    if (!videoIds.includes(d[key]?.videoId)) {
                        videoIds.push(d[key]?.videoId)
                        d[key].author = document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText ? document.querySelector('div#channel-container .style-scope.ytd-channel-name')?.innerText : document.querySelector('h1.dynamic-text-view-model-wiz__h1').textContent
                        videoData.push(d[key]);
                        youtubeData.push(d[key])
                    }

                } else {
                    work(d[key]);
                }
            })

        }

    }

    work(data)

}

async function collectHistory() {
    if (state === 1) {
        try {
            await scrollBottom();
            await wait(5);
            for (let i = 0; i < youtubeData.length; i++) {
                if (youtubeData[i].videoId) {
                    let item = youtubeData[i]
                    item.article_url = `https://www.youtube.com/watch?v=${item.videoId}`;
                    if (!article_url_map.includes(item.article_url)) {
                        article_url_map.push(item.article_url);
                        let videoURL = item.article_url + ';';
                        let titleTemp = "";
                        try {
                            if (item.headline?.simpleText) {
                                titleTemp = item.headline?.simpleText
                            } else {
                                titleTemp = item.title?.runs[0].text
                            }
                        } catch (e) {
                            console.log('未知字符串');
                        }
                        let data = {
                            article_type: 3,
                            source_urls: videoURL,
                            title: titleTemp,
                            article_url: item.article_url,
                            post_url: item.article_url,
                            move_total: 0,
                            looks: dealNum(item.viewCountText?.simpleText),
                            likes: 0,
                            comments: 0,
                            shares: 0,
                            return_msg: '',
                            remark: '',
                            publish_time: word2time(item?.publishedTimeText?.simpleText)
                        }

                        data_map.push(data);
                        div.innerText = `当前已采集${data_map.length}条数据，最大采集数量${max_collect}`;
                        if (state === 1) {
                            chrome.runtime.sendMessage({
                                Message: 'history_data',
                                frameId: frameId,
                                type: 'youtube',
                                data: data
                            }).then(r => {

                            })
                        }
                    }
                }
            }
            youtubeData = [];
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

function word2time(text) {

    if (!text) {
        return "";
    }

    let time = "";
    let beforeTimeNum = parseInt(text);
    if (text.includes('年前')) {
        time = moment().subtract(beforeTimeNum, 'year').format('YYYY-MM-DD 00:00:00');
    }

    if (text.includes('月前')) {
        time = moment().subtract(beforeTimeNum, 'month').format('YYYY-MM-DD 00:00:00');
    }

    if (text.includes('周前')) {
        time = moment().subtract(beforeTimeNum, 'week').format('YYYY-MM-DD 00:00:00');
    }

    if (text.includes('天前')) {
        time = moment().subtract(beforeTimeNum, 'day').format('YYYY-MM-DD 00:00:00');
    }

    if (text.includes('小时前')) {
        time = moment().subtract(beforeTimeNum, 'hour').format('YYYY-MM-DD HH:00:00');
    }
    return time
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

        return Number(result);
    }
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'video') {
        console.log("获取任务");
        getVideo("pop");
        sendResponse({state: 200});
    } else if (Message.Message === 'video_frame') {
        console.log("获取任务");
        getVideo("frame");
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
    } else if (Message.Message === 'history') {
        sendResponse({state: 200});
        dealHistoryData(Message).then();
    } else if (Message.Message === 'startCollectHistory') {
        sendResponse({state: 200});
        startCollectHistory(Message);
    } else if (Message.Message === 'pauseCollectHistory') {
        sendResponse({state: 200});
        pauseCollectHistory(Message);
    }
})
