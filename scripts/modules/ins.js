var insData = [];
var pending = "lock"
var insMax = ""
var timer = null;
var reels = []

var autoSort = false;
var isSorted = false;
var rightContainer = null;

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/graphql") !== -1 || res.data.url.indexOf("/graphql/query") !== -1)) {
            try {
                if (Object.keys(JSON.parse(res.data.data).data).includes("xdt_api__v1__feed__user_timeline_graphql_connection")) {
                    insData.push(...JSON.parse(res.data.data).data["xdt_api__v1__feed__user_timeline_graphql_connection"].edges)
                }
            } catch (e) {
            }
        }

        if (res.data.url && (res.data.url.indexOf("/api/graphql") !== -1 || res.data.url.indexOf("/graphql/query") !== -1)) {
            try {
                if (Object.keys(JSON.parse(res.data.data).data).includes("xdt_api__v1__clips__user__connection_v2")) {
                    reels.push(...JSON.parse(res.data.data).data["xdt_api__v1__clips__user__connection_v2"].edges.map(r => {
                        return r.node.media
                    }))
                    sort().then()
                    isSorted = false;
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


async function sort() {

    rightContainer.innerHTML = ''
    const reelsSorted = quickSortByKey(reels, 'play_count');

    for (let i = 0; i < reelsSorted.length; i++) {
        const reel = reelsSorted[i];
        const tNode = document.createElement('a');
        tNode.style.marginBottom = '2px'
        tNode.style.marginLeft = '2px'
        tNode.style.float = 'left'
        tNode.href = `/reel/${reel.code}/`
        tNode.style.width = '195px';
        tNode.background = '#c0c0c0'
        tNode.innerHTML = `<div style="width:100%;position: relative;height:250px;background: url('${reel.image_versions2.candidates[0].url}');background-size: cover;background-position: center center;">

    <div class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1yztbdb x1d52u69 x10l6tqk x1ey2m1c x1plvlek xryxfnj x1c4vz4f x2lah0s x1q0g3np xqjyukv x6s0dn4 x1oa3qoh x1nhvcw1">
        <div class="x9f619 xjbqb8w x78zum5 x168nmei x13lgxp2 x5pf9jr xo71vjh x1emribx x1n2onr6 x1plvlek xryxfnj x1c4vz4f x2lah0s xdt5ytf xqjyukv x1qjc9v5 x1oa3qoh x1nhvcw1">
            <svg aria-label="播放次数图标" class="x1lliihq x1n2onr6 x9bdzbf" fill="currentColor" height="16" role="img"
                 viewBox="0 0 24 24" width="16"><title>播放次数图标</title>
                <path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"></path>
            </svg>
        </div>
        <span class="x1lliihq x1plvlek xryxfnj x1n2onr6 x193iq5w xeuugli x1fj9vlw x13faqbe x1vvkbs x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x1i0vuye xl565be x1s688f x9bdzbf x1tu3fi x3x7a5m x10wh9bi x1wdrske x8viiok x18hxmgj"
              dir="auto"
              style="line-height: var(--base-line-clamp-line-height); --base-line-clamp-line-height: 20px;"><span
                class="html-span xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1hl2dhg x16tdsg8 x1vvkbs">${reel.play_count}</span></span>
    </div>
</div>`
        rightContainer.append(tNode)
    }
    // const reelsSorted = quickSortByKey(reels, 'play_count');
    // const nodes = Array.from(document.querySelectorAll('a[href*="/reel/"]'));
    //
    // console.log(reelsSorted)
    // console.log(nodes)
    //
    // for (let i = 0; i < reelsSorted.length; i++) {
    //     let iNode = nodes[i]
    //     let rNode = document.querySelector(`a[href*="/reel/${reelsSorted[i].code}/"]`)
    //     if (iNode !== rNode) {
    //         let rIndex = getIndexInArrayNode(nodes, rNode);
    //         swapNodes(iNode, rNode);
    //         swapArrayElements(nodes, i, rIndex);
    //     }
    // }

}

function swapArrayElements(array, index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
}

function getIndexInArrayNode(nodes, n) {
    return nodes.findIndex(t => t === n)
}

function swapNodes(node1, node2) {
    const temp = document.createElement('div');
    node1.after(temp);
    node2.after(node1);
    temp.after(node2)
    temp.remove()
}

function quickSortByKey(arr, key) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[0];
    const less = [];
    const equal = [];
    const greater = [];

    for (let item of arr) {
        if (item[key] > pivot[key]) {
            less.push(item);
        } else if (item[key] === pivot[key]) {
            equal.push(item);
        } else {
            greater.push(item);
        }
    }

    return [...quickSortByKey(less, key), ...equal, ...quickSortByKey(greater, key)];
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        insData = []
        startCollect(Message.insMax)
        insMax = Message.insMax
        sendResponse({state: 200});
    } else if (Message.Message === 'sort') {
        sendResponse({state: 200});
        autoSort = true;
        rightContainer = document.createElement('div');
        rightContainer.style = 'position: fixed;right:0;top:0;height:100vh;width:411px;text-align:center;background: #fff;box-shadow:-3px 0px 5px #ccc;overflow-y: scroll;'
        document.body.append(rightContainer)
        await sort();

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
        type: 'ins',
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
