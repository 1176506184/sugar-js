var pending = "lock"
var fbMax = ""
var timer = null;
chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    console.log(Message)
    if (Message.Message === 'Group') {
        await getGroup();
        sendResponse({state: 200});
    } else if (Message.Message === 'GroupScroll') {
        await getGroupAndScroll();
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'facebook',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})

function getGroupAndScroll() {
    setInterval(() => {
        let members = []
        let temp = Array.from(document.querySelectorAll('.xt0psk2 .x1s688f')).map(r => {
            let userRealId = r.href.split('user/')[1]
            return {
                name: r.innerText,
                href: r.href,
                fbid: userRealId.replace(/[^0-9]/ig, "")
            }
        })
        members.push(...temp);
        chrome.runtime.sendMessage({
            Message: 'group',
            data: members
        })
        document.querySelectorAll('.xt0psk2 .x1s688f').forEach(r => {
            r.remove();
        })
        window.scrollTo(0, document.documentElement.scrollHeight)
    }, 3000);
}

function getGroup() {
    let members = []
    let temp = Array.from(document.querySelectorAll('.xt0psk2 .x1s688f')).map(r => {
        let userRealId = r.href.split('user/')[1]
        return {
            name: r.innerText,
            href: r.href,
            fbid: userRealId.replace(/[^0-9]/ig, "")
        }
    })
    members.push(...temp);
    chrome.runtime.sendMessage({
        Message: 'group',
        data: members
    })

}


var facebookData = []

async function startGetPageTask() {

    let pages = document.querySelectorAll('div[aria-posinset]');

    for (let i = 0; i < pages.length; i++) {
        let p = pages[i];

        let title = p.querySelector(dealClass("xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"))?.innerHTML

        if (findDivWithText('展开', p)) {
            findDivWithText('展开', p).click();
            await wait(0.3);
        }

        if (!title) {
            title = p.querySelector(dealClass("x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h"))?.innerText
        }

        if (!!title && facebookData.filter(f => {
            return f.title === title
        }).length === 0) {

            FireEvent(p.querySelector('a' + dealClass("x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm")), 'pointerover')
            await wait(1);
            var str = document.querySelector("[role='tooltip']")?.innerText  // 日期

            let good = p.querySelector(dealClass("xt0b8zv x1jx94hy xrbpyxo xl423tq"))?.innerText;
            let comment = p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xsyo7zv x16hj40l x10b6aqq x1yrsyyn") + " [id]")?.innerText
            let share = 0;
            if (p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"))?.length > p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xsyo7zv x16hj40l x10b6aqq x1yrsyyn") + " [id]")?.length) {
                share = p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"))?.innerText
            }

            let data = {
                "source": 3,
                isSend: false,
                author: p.querySelector(`h2${dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz x1gslohp x1yc453h")} a span`)?.innerText,
                articleUrl: p.querySelector('a' + dealClass("x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm"))?.href,
                title: title,
                publish_time: timeOk(str),
                upvote: good,
                comment: comment,
                share: share,
                articleId: 0
            }

            facebookData.push(data);
            await wait(1);
            FireEvent(p.querySelector('a' + dealClass("x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm")), 'pointerout')
            console.log(data);

            if ((facebookData.length < fbMax && pending === "start") || (!fbMax && pending === "start")) {
                sendData();
            }

        }


    }

}

function findDivWithText(text, el = document.body, css = null) {
    if (el && el.innerText === text && !css) {
        return el;
    } else if (css && el && el.innerText === text && css === el.className) {
        return el;
    } else {

        for (var i = 0; i < el.children.length; i++) {
            let result = findDivWithText(text, el.children[i], css);
            if (result) return result
        }
    }
}


function dealClass(className) {
    className = className.replaceAll(' ', '.');
    className = '.' + className
    return className;

}

async function wait(s) {
    return new Promise(r => {
        setTimeout(() => {
            r(true)
        }, s * 1000)
    })
}

function FireEvent(node, EventName) {
    if (node != null) {
        if (node.fireEvent) {
            node.fireEvent('on' + EventName);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(EventName, true, false);
            node.dispatchEvent(evObj);
        }
    }
}

function timeOk(str) {

    try {

        var year = str.split("年")[0];

        var month = str.split("年")[1].split("月")[0];

        var day = str.split("年")[1].split("月")[1].split("日")[0];

        var hour;

        var min = str.split(":")[1];
        if (str.contains("上午")) {
            hour = parseInt(str.split(":")[0].split("上午")[1]);
        } else if (str.contains("下午")) {
            hour = parseInt(str.split(":")[0].split("午")[1])
            if (hour < 12) {
                hour = hour + 12;
            }
        } else if (str.contains("周日")) {
            hour = str.split(":")[0].split("日")[2].replace(/[^0-9]/ig, "");
        } else if (str.contains("日曜日")) {
            hour = str.split(":")[0].split("日曜日")[1].replace(/[^0-9]/ig, "");
        } else if (str.contains("曜日")) {
            hour = str.split(":")[0].split("日")[2].replace(/[^0-9]/ig, "");
        } else {
            hour = str.split(":")[0].split("日")[1].replace(/[^0-9]/ig, "");
        }

        return year + "-" + month + "-" + day + " " + hour + ":" + min;

    } catch (e) {
        return "";
    }
}


async function startCollect(max) {
    // console.log(max)
    if ((facebookData.length < max && pending === "start") || (!max && pending === "start")) {
        sendData();
        await scrollBottom()
        await wait(2);
        await startCollect(max);
    } else {
        // facebookData数据量一下子超过max
        // 需要进行处理
        facebookData = []
        sendData();
        chrome.runtime.sendMessage({
            Message: 'stop',
            type: 'facebook',
            data: facebookData
        }).then(r => {
            pending = "lock";
        })
    }
}

async function scrollBottom() {
    // await startGetPageTask();
    window.scrollTo(0, document.documentElement.scrollHeight)
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        startCollect(Message.fbMax).then()
        fbMax = Message.fbMax
        sendResponse({state: 200});
    } else if (Message.Message === 'video') {
        console.log("获取采集视频任务");
        dealVideoData().then();
        sendResponse({state: 200});
    } else if (Message.Message === 'stop') {
        facebookData = []
        pending = "end";
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200,
            pending: pending,
            fbMax: fbMax
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'facebook',
        }).then(r => {
        })
        sendResponse({state: 200});
    } else if (Message.Message === 'history') {
        sendResponse({state: 200});
        dealHistoryData().then();
    }
})

function sendData() {
    facebookData.forEach((t) => {
        if (!t['isSend']) {
            t['isSend'] = true;
            chrome.runtime.sendMessage({
                Message: 'sendData',
                type: 'toutiao',
                data: t
            }).then(r => {

            })

        }
    })
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

        return result;
    }
}

var facebookVideo = [];
var facebookVideoHref = [];

async function dealVideoData() {

    let nodes = document.querySelectorAll('.x1mh8g0r .x78zum5.x1q0g3np.x1a02dak ' + dealClass('x9f619 x1r8uery x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6'));
    nodes.forEach((node) => {
        if (!!node.querySelector('a')) {

            let d = {
                title: '',
                cover: '',
                url: '',
                play: '',
                author: ''
            }

            d.cover = node.querySelector('img[alt="视频缩略图"],img[alt="動画サムネイル"]').src;
            d.url = node.querySelector('a').href;
            d.title = node.querySelector('a ' + dealClass('x1lliihq x6ikm8r x10wlt62 x1n2onr6')).innerText;
            d.play = node.querySelectorAll(dealClass("x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm x12scifz x1yc453h"))[1].innerText
            d.play = dealNum(d.play);
            d.author = document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText;

            if (!facebookVideoHref.includes(d.url)) {
                facebookVideoHref.push(d.url);
                facebookVideo.push(d);
            }

        }
    })

    chrome.runtime.sendMessage({
        Message: 'Video',
        type: 'facebook',
        data: facebookVideo,
        author: document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText
    }).then(r => {

    })
    // if (data && typeof data === 'object') {
    //     Object.keys(data).forEach(key => {
    //         if (key === 'video') {
    //
    //         }
    //     })
    // }
}

// FB采历史
async function dealHistoryData() {
    console.log("获取采集FB历史任务");
    let nodes = document.querySelectorAll('.x1mh8g0r .x78zum5.x1q0g3np.x1a02dak ' + dealClass('x9f619 x1r8uery x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6'));
    nodes.forEach((node) => {
        if (!!node.querySelector('a')) {

            let d = {
                title: '',
                cover: '',
                url: '',
                play: '',
                author: ''
            }

            d.cover = node.querySelector('img[alt="视频缩略图"],img[alt="動画サムネイル"]').src;
            d.url = node.querySelector('a').href;
            d.title = node.querySelector('a ' + dealClass('x1lliihq x6ikm8r x10wlt62 x1n2onr6')).innerText;
            d.play = node.querySelectorAll(dealClass("x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm x12scifz x1yc453h"))[1].innerText
            d.play = dealNum(d.play);
            d.author = document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText;
        }
    })

    chrome.runtime.sendMessage({
        Message: 'history',
        type: 'facebook',
        data: '',
        author: document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText,
        authorLink: location.href
    }).then(r => {

    })
}

let historyCollectIndex = 1;

function collectHistory() {

    let needCollect = document.querySelector(`div[aria-posinset=${historyCollectIndex}]`)
    needCollect.scrollIntoViewIfNeeded();

}


window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/graphql/") !== -1)) {
            try {
                let data = res.data.data;

                if (data.indexOf('{"label":"ProfileCometTimelineFeed_user$stream$ProfileCometTimelineFeed_user_timeline_list_feed_units"') !== -1) {
                    try {
                        data = data.substring(0, data.indexOf('{"label":"ProfileCometTimelineFeed_user$stream$ProfileCometTimelineFeed_user_timeline_list_feed_units"'));
                        data = JSON.parse(data);
                        console.log(data);
                        let result = getData(data);
                        if (result.articleId > 0) {
                            facebookData.push(result);
                            console.log(result);
                        }
                    } catch (e) {

                    }
                } else {
                    try {
                        data = JSON.parse(data);
                        console.log(data);
                        let result = getData(data);
                        if (result.articleId > 0) {
                            facebookData.push(result);
                            console.log(result);
                        }
                        dealVideoData(data);
                    } catch (e) {

                    }
                }


            } catch (e) {

            }
        }
    }
})


function getData(data) {

    let result = {
        isSend: false,
        source: 3,
        upvote: 0,
        comment: 0,
        author: '',
        title: '',
        articleId: 0,
        share: 0,
        articleUrl: '',
        cover: '',
        "publish_time": ''
    }

    function work(d) {

        if (typeof d === 'object' && !!d) {

            Object.keys(d).forEach(o => {
                if (o === 'reactors') {
                    if (d[o]?.count > result.upvote) {
                        result.upvote = d[o]?.count;
                    }
                }

                if (o === 'photo_image' && !result.cover) {
                    result.cover = d[o]?.uri;
                }

                if (o === 'creation_time' && !result.publish_time) {
                    result.publish_time = t2t(d[o]);
                }

                if (o === 'total_comment_count') {
                    if (d[o] > result.comment) {
                        result.comment = d[o];
                    }
                }

                if (o === 'share_count') {
                    if (d[o]?.count > result.share) {
                        result.share = d[o]?.count;
                    }
                }


                if (o === 'owning_profile') {
                    if (d[o]?.name) {
                        result.author = d[o].name
                    }
                }

                if (o === 'preferred_body') {
                    if (d[o]?.text) {
                        result.title = d[o]?.text
                    }
                }

                if (o === 'message') {
                    if (d[o]?.text) {
                        result.title = d[o]?.text
                    }
                }

                if (o === 'post_id') {
                    result.articleId = d[o];
                    result.articleUrl = `https://www.facebook.com/${d[o]}`
                }

                if (typeof d[o] === 'object' && !!d[o]) {
                    work(d[o]);
                }


            })

        }

    }

    work(data);

    return result

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


