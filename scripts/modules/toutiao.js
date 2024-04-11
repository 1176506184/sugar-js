var toutiaoData = []
var pending = "lock"
var toutiaoMax = ""
var timer = null;
var collectType = 0;

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        // 侧边栏
        // res.data.url.indexOf("/api/pc/list/feed") !== -1 ||
        if (res.data.url && (res.data.url.indexOf("/api/pc/list/user/feed") !== -1)) {
            try {
                toutiaoData.push(...JSON.parse(res.data.data).data)
            } catch (e) {

            }
        }
    }
})


function startCollect(max) {
    timer = setInterval(() => {
        if ((toutiaoData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom()
            sendData();

        } else {
            sendData();
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'toutiao',
            }).then(r => {
                pending = "lock"
            })
            clearInterval(timer)
        }
    }, 2000)
}

function sendData() {
    toutiaoData.forEach((t) => {
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
                type: 'toutiao',
                data: data
            }).then(r => {

            })

        }
    })
}

function scrollBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight)
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


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        toutiaoData = []
        startCollect(Message.toutiaoMax)
        toutiaoMax = Message.toutiaoMax
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
            toutiaoMax: toutiaoMax
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'toutiao',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'history') {
        sendResponse({state: 200});
        dealHistoryData(Message).then();
    } else if (Message.Message === 'startCollectHistory') {
        sendResponse({state: 200});
        collectType = Message.collectType ? Message.collectType : 0;
        startCollectHistory(Message);
    } else if (Message.Message === 'pauseCollectHistory') {
        sendResponse({state: 200});
        pauseCollectHistory(Message);
    } else if (Message.Message === 'community_frame') {
        sendResponse({state: 200});
        // console.log(Message);
        await touTiaoCommunityScheduling();
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

setInterval(() => {

    if (state === 1) {
        if (data_map.length === data_last_length) {
            no_art_time += 1;
            if (no_art_time > finishTime && !noticed) {
                noticed = true;
                chrome.runtime.sendMessage({
                    Message: 'error',
                    type: 'toutiao',
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

async function collectHistory() {
    if (state === 1) {
        try {
            await scrollBottom();
            await wait(5);
            for (let i = 0; i < toutiaoData.length; i++) {
                if (toutiaoData[i].id) {
                    let item = toutiaoData[i];
                    item.article_url = "https://www.toutiao.com/article/" + item.id;
                    let move_total = (item.like_count ? item.like_count : 0) + (item.share_count ? item.share_count : 0) + (item.comment_count ? item.comment_count : 0) + (item.digg_count ? item.digg_count : 0)
                    if (!article_url_map.includes(item.article_url)) {
                        article_url_map.push(item.article_url);

                        let text = '';
                        let imgs = []
                        let imgurl = '';
                        if (collectType !== 1) {
                            let result = await getArticleBody(toutiaoData[i].article_url.replace('https://toutiao.com', location.origin));
                            imgs = Array.from(result.querySelectorAll('article img')).map((item) => item.src);
                            text = result.querySelector('article').innerText;
                            for (let i = 0; i < imgs.length; i++) {
                                imgurl += imgs[i] + ';';
                            }
                        }

                        let data = {
                            article_type: imgs.length > 0 ? 2 : 0,
                            source_urls: imgurl,
                            title: text,
                            article_url: '',
                            post_url: "https://www.toutiao.com/w/" + item.id,
                            move_total,
                            looks: item.read_count,
                            likes: item.like_count ? item.like_count : item.digg_count,
                            shares: item.share_count,
                            comments: item.comment_count,
                            return_msg: '',
                            remark: '',
                            publish_time: item.create_time ? t2t(item.create_time) : t2t(item.publish_time)
                        }

                        if (collectType === 1) {
                            data.article_type = 1;
                            data.title = item.title;
                            data.article_url = "https://www.toutiao.com/article/" + item.id;
                            data.post_url = "https://www.toutiao.com/article/" + item.id;
                            if (item.large_image_list && item.large_image_list.length > 1) {
                                data.source_urls = item.large_image_list[0].url + ';';
                            } else if(item.detail_cover_list && item.detail_cover_list.length){
                                data.source_urls = item.detail_cover_list[0].url + ';';
                            }else {
                                data.source_urls = item.image_list[0].url + ';';
                            }

                            if (item.aggr_type !== 2) {
                                continue;
                            }
                        } else {
                            if (item.aggr_type === 2) {
                                continue;
                            }
                        }

                        data_map.push(data);
                        div.innerText = `当前已采集${data_map.length}条数据，最大采集数量${max_collect}`;
                        if (state === 1) {
                            chrome.runtime.sendMessage({
                                Message: 'history_data',
                                frameId: frameId,
                                type: 'toutiao',
                                data: data
                            }).then(r => {

                            })
                        }
                    }
                }
            }
            toutiaoData = [];
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


var bodyReg = /<body[^>]*>([\s\S]+?)<\/body>/i;

async function getArticleBody(url) {
    let data = await fetch(url);
    const tempBlob = await data.blob();
    const tempText = await readBlob(tempBlob);
    let tempEl = document.createElement('div');
    tempEl.innerHTML = bodyReg.exec(tempText)[1];
    return tempEl
}

function readBlob(blob) {
    return new Promise((r, j) => {
        const reader = new FileReader();
        reader.onload = function () {
            const text = reader.result;
            r(text);
        };
        reader.onerror = function () {
            j(false)
        }
        reader.readAsText(blob);
    })
}

// 微头条采历史
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
        author: document.querySelector('div.detail span.name').textContent,
        authorLink: location.origin + location.pathname,
    }).then(r => {

    })
}


// 头条社区排文
async function touTiaoCommunityScheduling() {
    // 重组发送数据
    let sendMessageData = [];
    let i = 0;
    toutiaoData.forEach(async (t) => {
        if (!t['isSend']) {
            t['index'] = i;
            i += 1;
            let result = await getArticleBody("https://www.toutiao.com/w/" + t.id);
            let imgs = Array.from(result.querySelectorAll('article img')).map((item) => item.src);
            console.log(t.index);
            let data = {
                "index": t['index'],
                "title": t.title,
                "content": t.content,
                "publish_time": t2t(t.publish_time),
                "coverList": t?.detail_cover_list,
                "imageString": imgs.join(','),
                "read": t.read_count,
                "comment": t.comment_count,
                "upvote": t.digg_count,
                "share": 0,
                "articleId": t.id,
                "articleUrl": "https://www.toutiao.com/w/" + t.id
            };

            sendMessageData.push(data);

            if (sendMessageData.length === toutiaoData.length) {
                chrome.runtime.sendMessage({
                    Message: 'Toutiao_community_frame',
                    data: sendMessageData,
                    author: document.querySelector('div.detail span.name').textContent
                }).then()
            }
        }
    })
}


async function scrollBottom() {
    // await startGetPageTask();
    window.scrollTo(0, document.documentElement.scrollHeight)
}
