var insData = [];
var pending = "lock"
var insMax = ""
var timer = null;

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/graphql") !== -1)) {
            try {
                if (Object.keys(JSON.parse(res.data.data).data).includes("xdt_api__v1__feed__user_timeline_graphql_connection")) {
                    insData.push(...JSON.parse(res.data.data).data["xdt_api__v1__feed__user_timeline_graphql_connection"].edges)
                    console.log(insData)
                }
            } catch (e) {
            }
        }
    }
})

function startCollect(max) {
    timer = setInterval(() => {
        if ((insData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom()
        } else {
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'ins',
            }).then(r => {
                pending = "lock"
            })
            clearInterval(timer)
        }
    }, 2000)
}


function sendData() {
    insData.forEach((t) => {
        if (!t['isSend']) {
            t['isSend'] = true;

            let data = {
                "source": 1,
                "author": t.source,
                "title": t.title,
                "publish_time": t2t(t.publish_time),
                "cover": t?.middle_image?.url,
                "read": t.read_count,
                "comment": t.comment_count,
                "upvote": t.like_count,
                "share": 0,
                "articleId": t.id,
                "articleUrl": t.display_url
            }

            chrome.runtime.sendMessage({
                Message: 'sendData',
                type: 'ins',
                data: data
            }).then(r => {

            })

        }
    })
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        insData = []
        startCollect(Message.insMax)
        insMax = Message.insMax
        sendResponse({state: 200});
    } else if (Message.Message === 'stop') {
        try {
            clearInterval(timer);
        } catch (e) {

        }
        pending = "end";
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200,
            pending: pending,
            insMax: insMax
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'ins',
        }).then(r => {

        })
        sendResponse({state: 200});
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

// ins采历史
async function dealHistoryData(data) {


    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    chrome.runtime.sendMessage({
        Message: 'history',
        frameId: frameId,
        type: 'toutiao',
        data: '',
        author: document.querySelector('h2').textContent,
        authorLink: location.origin + location.pathname,
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
                    type: 'ins',
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
            for (let i = 0; i < insData.length; i++) {
                if (insData[i].node.code) {
                    let item = insData[i].node;
                    item.article_url = `https://www.instagram.com/p/${item.code}`;
                    if (!article_url_map.includes(item.article_url)) {
                        article_url_map.push(item.article_url);
                        let imgurl = '';
                        let videoURL = '';
                        if (item.carousel_media) {
                            item.carousel_media.map((img) => {
                                imgurl += img.image_versions2.candidates[0].url + ';';
                            })
                        }

                        if (item.image_versions2 && !item.carousel_media) {
                            imgurl += item.image_versions2.candidates[0].url + ';';
                        }

                        if (item.video_versions) {
                            videoURL = item.video_versions[0].url + ';';
                        }

                        let data = {
                            article_type: videoURL ? 3 : 2,
                            source_urls: videoURL ? videoURL : imgurl,
                            title: item.caption?.text,
                            article_url: item.article_url,
                            post_url: item.article_url,
                            move_total: item.comment_count + item.like_count,
                            likes: item.like_count,
                            comments: item.comment_count,
                            return_msg: '',
                            remark: '',
                            publish_time: t2t(item.taken_at)
                        }

                        data_map.push(data);
                        div.innerText = `当前已采集${data_map.length}条数据，最大采集数量${max_collect}`;
                        if (state === 1) {
                            chrome.runtime.sendMessage({
                                Message: 'history_data',
                                frameId: frameId,
                                type: 'ins',
                                data: data
                            }).then(r => {

                            })
                        }
                    }
                }
            }
            insData = [];
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
