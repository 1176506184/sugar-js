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

        let week = ["周一", "周二", "周三", "周四", "周五", "周六", "周日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
        week.forEach((w) => {
            str.replace(w, '')
        })

        var year = str.split("年")[0];

        var month = str.split("年")[1].split("月")[0];

        var day = str.split("年")[1].split("月")[1].split("日")[0];

        var hour;

        var min = str.split(":")[1];
        if (str.includes("上午")) {
            hour = parseInt(str.split(":")[0].split("上午")[1]);
        } else if (str.includes("下午")) {
            hour = parseInt(str.split(":")[0].split("午")[1])
            if (hour < 12) {
                hour = hour + 12;
            }
        } else if (str.includes("周日")) {
            hour = str.split(":")[0].split("日")[2].replace(/[^0-9]/ig, "");
        } else if (str.includes("日曜日")) {
            hour = str.split(":")[0].split("日曜日")[1].replace(/[^0-9]/ig, "");
        } else if (str.includes("曜日")) {
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
        dealHistoryData(Message).then();
    } else if (Message.Message === 'startCollectHistory') {
        sendResponse({state: 200});
        startCollectHistory(Message);
    } else if (Message.Message === 'pauseCollectHistory') {
        sendResponse({state: 200});
        pauseCollectHistory(Message);
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

    let result = num;

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

        if (num.toString().includes(',')) {
            result = (+num.split(',')[0]) * 1000 + parseInt(num.split(',')[1])
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
                author: '',
                create_time: ''
            }

            d.cover = node.querySelector('img[alt="视频缩略图"],img[alt="動画サムネイル"]').src;
            d.url = node.querySelector('a').href;
            d.title = node.querySelector('a ' + dealClass('x1lliihq x6ikm8r x10wlt62 x1n2onr6')).innerText;
            d.play = node.querySelectorAll(dealClass("x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm x12scifz x1yc453h"))[1].innerText
            d.play = dealNum(d.play);
            d.author = document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText;
            d.timeNum = node.querySelector(dealClass('x18l40ae xm3z3ea x1x8b98j x131883w x16mih1h xqo3gd x1923su1 xyqdw3p xsyo7zv xg8j3zb x16hj40l x47corl x10l6tqk xudsgdi')).innerText
            d.create_time = node.querySelector(dealClass('x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm x12scifz x1yc453h')).innerText
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
        author: document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText,
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
                        dealVideoData(data).then();
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


/*
* 获取历史帖子
* */

function waitCondition(check_func, max_sec, msg) {
    msg = msg ? `(${msg})` : '';
    console.log(msg + " 条件检测 【开始】 最多等待" + max_sec + " 秒");
    return new Promise(resolve => {
        var count = 0;
        var inteval = setInterval(function () {
            var state = check_func();
            count++;
            if (state) {
                console.log(msg + ' 条件检测 【结束】 耗时 ' + count + " 秒");
                resolve(true);
                clearInterval(inteval);
            } else {
                console.log(msg + ' 条件检测 【进行中】......');
            }
            if (count > max_sec) {
                console.log(msg + ' 条件检测 【超时】!!!!!!');
                resolve(false);//失败
                clearInterval(inteval);
            }
        }, 1000);
    });
}


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

setInterval(() => {

    if (state === 1) {
        if (data_map.length === data_last_length) {
            no_art_time += 1;
            if (no_art_time > finishTime && !noticed) {
                noticed = true;
                chrome.runtime.sendMessage({
                    Message: 'error',
                    type: 'facebook',
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

async function collectHistory() {
    if (state === 1) {

        try {
            if (!document.querySelector(`div[aria-posinset="${historyCollectIndex}"]`)) {
                await scrollBottom();
                await waitCondition(() => {
                    return document.querySelector(`div[aria-posinset="${historyCollectIndex}"]`)
                }, 100, `第${historyCollectIndex}页`)
            }

            let needCollect = document.querySelector(`div[aria-posinset="${historyCollectIndex}"]`)
            needCollect.scrollIntoViewIfNeeded();
            if (needCollect.querySelectorAll(dealClass(`x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1a2a7pz xt0b8zv`)).length > 1) {
                needCollect.querySelectorAll(dealClass(`x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1a2a7pz xt0b8zv`))[1].click();
                await wait(2);
            }

            if (needCollect.querySelectorAll("div" + dealClass(`x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xzsf02u x1s688f`)).length > 1) {
                needCollect.querySelectorAll("div" + dealClass(`x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xzsf02u x1s688f`))[1].click();
                await wait(2);
            }

            let upBtn = findDivWithText('展开', needCollect);
            if (upBtn) {
                upBtn.click();
                await wait(2);
            }

            let tagType = 0;
            let tag = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.innerText;
            if (needCollect.querySelector('div' + ".x1yx25j4 x13crsa5 x6x52a7 x1rxj1xn xxpdul3".replaceAll(' ', '.'))?.textContent && (needCollect.querySelector('div' + ".x1yx25j4 x13crsa5 x6x52a7 x1rxj1xn xxpdul3".replaceAll(' ', '.'))?.textContent.length > tag?.length || !tag)) {
                tag = needCollect.querySelector('div' + ".x1yx25j4 x13crsa5 x6x52a7 x1rxj1xn xxpdul3".replaceAll(' ', '.'))?.textContent;
            }

            if (needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.innerText && (needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.innerText?.length > tag?.length || !tag)) {
                tag = needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.innerText;
                tagType = 1;
            }

            if (needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.innerText && (needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.textContent?.length > tag?.length || !tag)) {
                tag = needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.textContent;
                tagType = 1;
            }

            if (needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.textContent && (needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.textContent.length > tag?.length || !tag)) {
                tag = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.textContent;
                tagType = 2;
            }

            if (needCollect.querySelector('div' + ".x1iorvi4 x1pi30zi x1l90r2v x1swvt13".replaceAll(' ', '.'))?.textContent && (needCollect.querySelector('div' + ".x1iorvi4 x1pi30zi x1l90r2v x1swvt13".replaceAll(' ', '.'))?.textContent > tag?.length || !tag)) {
                tag = needCollect.querySelector('div' + ".x1iorvi4 x1pi30zi x1l90r2v x1swvt13".replaceAll(' ', '.'))?.textContent;
                tagType = 2;
            }

            if (needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x17z8epw".replaceAll(' ', '.'))?.textContent && (needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x17z8epw".replaceAll(' ', '.'))?.textContent.length > tag?.length || !tag)) {
                tag = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm x17z8epw".replaceAll(' ', '.'))?.textContent;
                tagType = 3;
            }

            if (needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.textContent && (needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.textContent.length > tag?.length || !tag)) {
                tag = needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.textContent;
                tagType = 3;
            }


            //查看更多
            if (tag || checkItIsReel(needCollect)) {
                let beforeTag = tag;
                let moreTag = needCollect.querySelector('div' + ".x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv xzsf02u x1s688f".replaceAll(' ', '.'))
                if (moreTag) {
                    console.log("找到了moreTag");
                    moreTag.click()
                    await wait(1)
                    switch (tagType) {
                        case 0:
                            tag = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.innerText;
                            break
                        case 1:
                            tag = needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.innerText;
                            break
                        case 2:
                            tag = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.textContent;
                            break
                        case 3:
                            tag = needCollect.querySelector('div' + ".xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs".replaceAll(' ', '.'))?.textContent;
                            break
                    }
                }

                if (!tag || tag === 'undefined') {
                    tag = beforeTag
                }

                console.log(`tagType为${tagType},tag为${tag}`)

                let dateMin = needCollect.querySelector('span' + ".x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j".replaceAll(' ', '.') + " a span");
                if (!dateMin) {
                    dateMin = needCollect.querySelector('span' + ".x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84".replaceAll(' ', '.') + " span span" + ".x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j".replaceAll(' ', '.'));
                }
                if (!dateMin) {
                    dateMin = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x676frb x1nxh6w3 x1sibtaa xo1l8bm xi81zsa x1yc453h".replaceAll(' ', '.') + " a")
                }

                let post = needCollect.querySelector('a' + ".x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm".replaceAll(' ', '.'));
                FireEvent(post, 'pointerover');
                await wait(0.5);
                let posturl = needCollect.querySelector('a' + ".x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm".replaceAll(' ', '.'))?.getAttribute("href");

                if (!posturl) {
                    posturl = needCollect.querySelector('a' + ".x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm".replaceAll(' ', '.'))?.getAttribute("href");
                }

                if (!posturl || posturl === '#') {
                    posturl = needCollect.querySelector('a' + ".x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm".replaceAll(' ', '.'))?.getAttribute("href");
                }

                if (!posturl || posturl === '#') {
                    posturl = needCollect.querySelector('a' + ".x1i10hfl x9f619 xe8uvvx x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv xjbqb8w x76ihet xwmqs3e x112ta8 xxxdfa6 x1ypdohk x1rg5ohu x1qx5ct2 x1k70j0n x1w0mnb xzueoph x1mnrxsn x1iy03kw xexx8yu x4uap5 x18d9i69 xkhd6sd x1o7uuvo x1a2a7pz x1qo4wvw".replaceAll(' ', '.'))?.getAttribute("href");
                }

                if (!posturl || posturl === '#') {
                    posturl = needCollect.querySelector('a' + ".x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1q0g3np x87ps6o x1lku1pv x1rg5ohu x1a2a7pz x1n2onr6 xh8yej3".replaceAll(' ', '.'))?.getAttribute("href");
                    posturl = 'https://www.facebook.com' + posturl;
                }

                FireEvent(dateMin, 'pointerover');
                await wait(1);
                let dateMax = ''
                try {
                    dateMax = document.querySelector(".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1nxh6w3 x1sibtaa xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.'))?.innerText;
                    if (!dateMax) {
                        dateMax = document.querySelector(".xu96u03 xm80bdy x10l6tqk x13vifvy x47corl".replaceAll(' ', '.'))?.innerText;
                    }
                } catch (e) {
                    console.log(e)
                }

                FireEvent(dateMin, 'pointerout');

                await wait(1);

                let share = 0;
                let comment = 0;
                let good = $(needCollect).find($("span.xrbpyxo.x6ikm8r.x10wlt62.xlyipyv.x1exxlbk"))[0]?.innerText;
                var cofs = [0, 0, 0, 0, 0, 0];
                good = dealNum(good);
                if (good === '0') {
                    good = needCollect.querySelector('span' + ".xt0b8zv x2bj2ny xrbpyxo xl423tq".replaceAll(' ', '.')).innerText
                }

                let COF = $(needCollect).find($("div.x9f619 x1n2onr6 x1ja2u2z x78zum5 x2lah0s x1qughib x1qjc9v5 xozqiw3 x1q0g3np xykv574 xbmpl8g x4cne27 xifccgj".replaceAll(' ', '.') + " " + "span.x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xi81zsa".replaceAll(' ', '.')));
                if (COF.length > 0) {
                    for (let i = 0; i < COF.length; i++) {
                        if (COF[i].innerText.includes('分享')) {
                            share = dealNum(COF[i].innerText);
                        } else if (COF[i].innerText.includes('评论') || COF[i].innerText.includes('留言')) {
                            comment = dealNum(COF[i].innerText);
                        }
                    }
                    if (share === 0 && comment === 0 && COF.length === 2) {
                        for (let i = 0; i < COF.length; i++) {
                            if (i === 1) {
                                share = dealNum(COF[i].innerText);
                            } else if (i === 0) {
                                comment = dealNum(COF[i].innerText);
                            }
                        }
                    }
                } else {
                    COF = $(needCollect).find('[class="x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w x6s0dn4 x1gslohp x12nagc xzboxd6 x14l7nz5"]');
                    if (COF.length > 0) {
                        for (let i = 1; i < 6; i += 2) {
                            try {
                                cofs[i] = +dealNum(COF[i].innerText);
                            } catch (e) {
                                cofs[i] = 0;
                            }
                        }
                        good = cofs[1];
                        comment = cofs[3];
                        share = cofs[5];
                    } else {

                    }
                }

                let totalmove = Number(share) + Number(comment) + Number(good);
                let PageType = 0;

                let imgs = [];
                Array.from(needCollect.querySelectorAll('.xqtp20y.x6ikm8r.x10wlt62.x1n2onr6')).forEach((item) => {
                    if (item.querySelector('img')?.src) {
                        imgs.push(item.querySelector('img')?.src);
                    }
                });

                //隐藏起来的多余的图片
                let moreImg = needCollect.querySelector('div' + ".x6s0dn4 x18l40ae x1ey2m1c x78zum5 xds687c xdt5ytf xl56j7k x47corl x10l6tqk x17qophe x13vifvy".replaceAll(' ', '.'));
                if (moreImg && openImage) {
                    let moreImgCount = +dealNum(moreImg.innerText);
                    if (moreImgCount > 30) {
                        moreImgCount = 30;
                    }
                    moreImg.click();
                    await wait(1)
                    for (let i = 0; i < moreImgCount; i++) {
                        let btn = document.querySelectorAll('div' + ".x14yjl9h xudhj91 x18nykt9 xww2gxu x6s0dn4 x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x3nfvp2 xl56j7k x1n2onr6 x1qhmfi1 xsdox4t x1useyqa".replaceAll(' ', '.'))[1]
                        btn.click();
                        await wait(1)
                        let newImg = document.querySelector('img' + ".x1bwycvy x193iq5w x4fas0m x19kjcj4".replaceAll(' ', '.'))
                        imgs.push(newImg.src);
                    }
                    await wait(1)
                    let closeBtn = document.querySelector('div' + ".x1i10hfl x6umtig x1b1mbwd xaqea5y xav7gou x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x14yjl9h xudhj91 x18nykt9 xww2gxu x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x18l40ae x14ctfv".replaceAll(' ', '.'))

                    if (!closeBtn) {
                        closeBtn = document.querySelector('div' + ".x1i10hfl x1ejq31n xd10rxx x1sy0etr x17r0tee x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x14yjl9h xudhj91 x18nykt9 xww2gxu x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x18l40ae x14ctfv".replaceAll(' ', '.'))
                    }

                    if (!closeBtn) {
                        closeBtn = document.querySelector('div[aria-label="关闭"] i')
                    }

                    closeBtn.click();
                }

                if ((posturl.indexOf('watch/') > -1 || posturl.indexOf('reel') > -1 || !!needCollect.querySelector('.x78zum5.xdt5ytf.x6ikm8r.x10wlt62.x1n2onr6 video') || !!needCollect.querySelector(dealClass('x6s0dn4 xatbrnm x9f619 x78zum5 x5yr21d xl56j7k x6ikm8r x10wlt62 x889kno x1iji9kk x1a8lsjc x1sln4lm xh8yej3')))) {
                    PageType = 3;
                } else if (needCollect.querySelector('span' + dealClass('x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84'))?.clientHeight > 0 || (needCollect.querySelector('a' + dealClass('x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv x5yr21d x10l6tqk x17qophe x13vifvy xh8yej3 x1vjfegm')))) {
                    PageType = 1;
                } else if (imgs.length > 0) {
                    PageType = 2;
                }

                let imgurl = '';
                for (let i = 0; i < imgs.length; i++) {
                    imgurl += imgs[i] + ';';
                }

                let articleurl = ''

                if (PageType === 1) {
                    console.log("查询原文链接")
                    if (needCollect.querySelector('div' + ".x2atdfe xb57i2i x1q594ok x5lxg6s x6ikm8r x1n2onr6 x1ja2u2z x78zum5 x1q0g3np x10wlt62".replaceAll(' ', '.'))) {
                        console.log("查询原文链接 - 1")
                        let articleurlArr = await getUlArticle(needCollect)
                        articleurlArr.forEach((item) => {
                            articleurl += item + ';'
                        })
                        if (!!articleurl) {
                            PageType = 1;
                        }
                    } else {
                        console.log("查询原文链接 - 2")
                        articleurl = await getFeedUrl(needCollect);
                        if (!!articleurl) {
                            articleurl = articleurl + ';'
                            PageType = 1;
                        }
                    }
                }

                let video_url = "";
                if (PageType === 3) { //链接和reel视频<span class="x1lliihq x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1j85h84">标签重复，会造成reel视频被判定为链接
                    let {url, title} = await getVideoUrl(needCollect);
                    video_url = url + ';'
                    if (title) {
                        tag = title;
                    }
                }

                var postTime = timeOk(dateMax.toString());
                let returnmsg = ''
                let materialRemark = ''

                try {
                    let data = {
                        article_type: PageType,
                        title: encodeURI(tag),
                        source_urls: PageType === 2 ? imgurl : video_url,
                        post_url: posturl,
                        article_url: articleurl,
                        move_total: totalmove,
                        likes: good,
                        shares: share,
                        comments: comment,
                        return_msg: returnmsg,
                        remark: materialRemark,
                        publish_time: postTime
                    };
                    console.log(data);
                    data_map.push(data);
                    div.innerText = `当前已采集${data_map.length}条数据，最大采集数量${max_collect}`;
                    chrome.runtime.sendMessage({
                        Message: 'history_data',
                        frameId: frameId,
                        type: 'facebook',
                        data: data
                    }).then(r => {

                    })

                } catch (e) {
                    console.log(e);
                }

                if (document.querySelectorAll('[aria-posinset]').length > 3) {
                    needCollect.remove();
                }

                historyCollectIndex += 1;

                if (state === 1) {
                    collectHistory().then();
                }

            } else {
                if (document.querySelectorAll('[aria-posinset]').length > 3) {
                    needCollect.remove();
                }
                historyCollectIndex += 1;

                if (state === 1) {
                    collectHistory().then();
                }
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

// FB采历史
async function dealHistoryData(data) {


    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    chrome.runtime.sendMessage({
        Message: 'history',
        frameId: frameId,
        type: 'facebook',
        data: '',
        author: document.querySelector('div.x1e56ztr.x1xmf6yo h1' + dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz")).innerText,
        authorLink: location.href.includes('profile.php') ? location.href.split('&')[0] : (location.origin + (location.pathname[location.pathname.length - 1] === '/' ? location.pathname.slice(0, -1) : location.pathname)),
    }).then(r => {

    })
}

function checkItIsReel(needCollect) {
    return !!needCollect.querySelector('.x78zum5.xdt5ytf.x6ikm8r.x10wlt62.x1n2onr6 video') || !!needCollect.querySelector(dealClass('x6s0dn4 xatbrnm x9f619 x78zum5 x5yr21d xl56j7k x6ikm8r x10wlt62 x889kno x1iji9kk x1a8lsjc x1sln4lm xh8yej3'))
}


async function getUlArticle(page) {
    let ul = page.querySelector('ul' + ".x78zum5 x1q0g3np xozqiw3 x1n2onr6".replaceAll(' ', '.'))
    let articles = []
    if (ul) {
        let articleNodes = ul.querySelectorAll('a' + ".x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv".replaceAll(' ', '.'))
        for (let i = 0; i < articleNodes.length; i += 2) {
            if (articleNodes[i].href) {
                articles.push(articleNodes[i].href)
            }
        }
    }

    return articles
}

async function getFeedUrl(needCollect) {
    let result = '';
    try {
        await Promise.all([getFeedUrlInTitle(needCollect), getFeedUrlInLink(needCollect)]).then((values) => {
            result = values[0] ? values[0] : values[1]
        });
    } catch (e) {
        console.log(e)
    }
    return result;
}

async function getFeedUrlInTitle(needCollect) {
    let arturl = ''
    try {
        FireEvent(needCollect.querySelector('a' + '.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.x1lliihq.x1lku1pv[target="_blank"]'), 'pointerover')
        await wait(2);
    } catch (e) {

    }
    arturl = needCollect.querySelector('a' + '.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.x1lliihq.x1lku1pv[target="_blank"]')?.href;
    await wait(2);
    let outHrefDom = needCollect.querySelector('a.' + 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g x1lliihq x1lku1pv'.replaceAll(' ', '.'));
    if (!outHrefDom) {
        outHrefDom = needCollect.querySelector('a.' + 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv x5yr21d x10l6tqk x17qophe x13vifvy xh8yej3 x1vjfegm'.replaceAll(' ', '.'));
    }

    if (!outHrefDom) {
        outHrefDom = needCollect.querySelector('a.' + 'x1i10hfl xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g x1lliihq x1lku1pv'.replaceAll(' ', '.'))
    }

    if (!arturl && outHrefDom) {
        FireEvent(outHrefDom, 'pointerover');
        await wait(2);   //时间不能太短
        arturl = outHrefDom?.href;
    }
    return arturl
}

async function getFeedUrlInLink(needCollect) {
    console.log("从链接模块中找链接");
    if (needCollect.querySelector('[data-ad-preview="message"] .x1s688f[role="button"]')) {
        needCollect.querySelector('[data-ad-preview="message"] .x1s688f[role="button"]')?.click();
    }
    await wait(2);
    let arturl = needCollect.querySelector('span' + ".x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h".replaceAll(' ', '.') + ' a[target="_blank"]')?.href;
    let hrefDomSec = needCollect.querySelector('a' + dealClass('x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv x5yr21d x10l6tqk x17qophe x13vifvy xh8yej3 x1vjfegm'))
    if (!arturl && hrefDomSec) {
        FireEvent(hrefDomSec, 'pointerover');
        await wait(2);
        arturl = hrefDomSec.href
    }
    hrefDomSec = needCollect.querySelector('a' + dealClass('x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g x1lliihq x1lku1pv'))
    if (!arturl && hrefDomSec) {
        FireEvent(hrefDomSec, 'pointerover');
        await wait(2);
        arturl = hrefDomSec.href
    }
    let hrefDom = $('[role="dialog"] div.x1n2onr6 a[role="link"].' + 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g x1lliihq x1lku1pv'.replaceAll(' ', '.'));
    if (!arturl && !!hrefDom.length > 0) {
        FireEvent(hrefDom[0], 'pointerover');
        await wait(2);
        arturl = hrefDom[0]?.href;
    }
    if (!arturl) {
        arturl = needCollect.querySelector(`[data-ad-preview="message"] a.` + 'x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz xt0b8zv x1fey0fg'.replaceAll(' ', '.'))?.href;
    }
    return arturl
}

setInterval(() => {
    try {
        document.querySelector('[style="position: absolute; top: -10000px;"]').style.display = 'none'
    } catch (e) {

    }
}, 60000)

async function getVideoUrl(needCollect) {
    let url = ''
    let title = ''
    let elem = needCollect.querySelector('a' + ".x1i10hfl x9f619 xe8uvvx x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv xjbqb8w x76ihet xwmqs3e x112ta8 xxxdfa6 x1ypdohk x1rg5ohu x1qx5ct2 x1k70j0n x1w0mnb xzueoph x1mnrxsn x1iy03kw xexx8yu x4uap5 x18d9i69 xkhd6sd x1o7uuvo x1a2a7pz".replaceAll(' ', '.'));
    if (elem) {
        // elem.click();
        // await wait(3);
        // if (document.querySelector('[data-pagelet="TahoeRightRail"] [class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xtoi2st x3x7a5m x1603h9y x1u7k74 x1xlr1w8 xzsf02u x1yc453h"]')) {
        //     title = document.querySelector('[data-pagelet="TahoeRightRail"] [class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xtoi2st x3x7a5m x1603h9y x1u7k74 x1xlr1w8 xzsf02u x1yc453h"]').textContent
        // }
        if (elem.href.indexOf('/videos/') > -1) {
            //采集机器采集会丢视频链接
            url = elem.href.split('/videos/')[0] + '/videos/' + elem.href.split('/videos/')[1].split('/')[0];
        } else if (elem.href.indexOf('reel') > -1) {
            url = elem.href.split('/?s=')[0];
        }

        // let closeBtn = document.querySelector('div' + ".x1i10hfl x6umtig x1b1mbwd xaqea5y xav7gou x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x14yjl9h xudhj91 x18nykt9 xww2gxu x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x18l40ae x14ctfv".replaceAll(' ', '.')).querySelector('i')
        // await waitCondition(() => {
        //     return closeBtn;
        // }, 20, '等待关闭按钮加载完成');
        // closeBtn.click();
        return {url, title}
    }

    elem = needCollect.querySelector('a' + ".x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1q0g3np x87ps6o x1lku1pv x1rg5ohu x1a2a7pz x1n2onr6 xh8yej3".replaceAll(' ', '.'));
    if (elem) {
        // elem.click();
        // await wait(3);
        // if (document.querySelector('[data-pagelet="TahoeRightRail"] [class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xtoi2st x3x7a5m x1603h9y x1u7k74 x1xlr1w8 xzsf02u x1yc453h"]')) {
        //     title = document.querySelector('[data-pagelet="TahoeRightRail"] [class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xtoi2st x3x7a5m x1603h9y x1u7k74 x1xlr1w8 xzsf02u x1yc453h"]').textContent
        // }

        if (elem.href.indexOf('/videos/') > -1) {
            //采集机器采集会丢视频链接
            url = elem.href.split('/videos/')[0] + '/videos/' + elem.href.split('/videos/')[1].split('/')[0];
        } else if (elem.href.indexOf('reel') > -1) {
            url = elem.href.split('/?s=')[0];
        }
        // let closeBtn = document.querySelector('div' + ".x1i10hfl x6umtig x1b1mbwd xaqea5y xav7gou x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x14yjl9h xudhj91 x18nykt9 xww2gxu x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x78zum5 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1vqgdyp x100vrsf x18l40ae x14ctfv".replaceAll(' ', '.')).querySelector('i')
        // await waitCondition(() => {
        //     return closeBtn;
        // }, 20, '等待关闭按钮加载完成');
        // await wait(2);
        return {url, title}
    }

    elem = needCollect.querySelector('a' + ".x1i10hfl x9f619 xe8uvvx x16tdsg8 x1hl2dhg xggy1nq x1o1ewxj x3x9cwd x1e5q0jg x13rtm0m x1n2onr6 x87ps6o x1lku1pv xjbqb8w x76ihet xwmqs3e x112ta8 xxxdfa6 x1ypdohk x1rg5ohu x1qx5ct2 x1k70j0n x1w0mnb xzueoph x1mnrxsn x1iy03kw xexx8yu x4uap5 x18d9i69 xkhd6sd x1o7uuvo x1a2a7pz x1qo4wvw".replaceAll(' ', '.'));
    if (elem) {
        if (elem.href.indexOf('/videos/') > -1) {
            url = elem.href.split('/videos/')[0] + '/videos/' + elem.href.split('/videos/')[1].split('/')[0];
        } else if (elem.href.indexOf('reel') > -1) {
            url = elem.href.split('/?s=')[0];
        }
        return {url, title}
    }
    return {url, title}
}