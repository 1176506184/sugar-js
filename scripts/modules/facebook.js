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

        if (facebookData.filter(f => {
            return f.title === p.querySelector(dealClass("xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"))?.innerHTML
        }).length === 0) {

            FireEvent(p.querySelector('a' + dealClass("x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm")), 'pointerover')
            await wait(5);
            var str = document.querySelector("[role='tooltip']")?.innerText  // 日期

            let good = p.querySelector(dealClass("xt0b8zv x1jx94hy xrbpyxo xl423tq")).innerText;
            let comment = p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xsyo7zv x16hj40l x10b6aqq x1yrsyyn") + " [id]")?.innerText
            let share = 0;
            if (p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xg83lxy x1h0ha7o x10b6aqq x1yrsyyn")).length > p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xsyo7zv x16hj40l x10b6aqq x1yrsyyn") + " [id]").length) {
                share = p.querySelector(dealClass("x9f619 x1n2onr6 x1ja2u2z x78zum5 xdt5ytf x2lah0s x193iq5w xeuugli xg83lxy x1h0ha7o x10b6aqq x1yrsyyn"))?.innerText
            }

            let data = {
                author: p.querySelector(`h2${dealClass("x1heor9g x1qlqyl8 x1pd3egz x1a2a7pz x1gslohp x1yc453h")} a span`)?.innerText,
                href: p.querySelector('a' + dealClass("x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm"))?.href,
                title: p.querySelector(dealClass("xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs"))?.innerHTML,
                publish_time: timeOk(str),
                good: good,
                comment: comment,
                share: share
            }

            facebookData.push(data);
            await wait(5);
            FireEvent(p.querySelector('a' + dealClass("x1i10hfl xjbqb8w x6umtig x1b1mbwd xaqea5y xav7gou x9f619 x1ypdohk xt0psk2 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x1heor9g xt0b8zv xo1l8bm")), 'pointerout')
            console.log(data);
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


var pending = "lock"
var fbMax = ""
var timer = null;

async function startCollect(max) {
    // console.log(max)
    if ((facebookData.length < max && pending === "start") || (!max && pending === "start")) {
        await scrollBottom()
        await wait(5);
        await startCollect(max);
    } else {
        // facebookData数据量一下子超过max
        // 需要进行处理
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
    await startGetPageTask();
    window.scrollTo(0, document.documentElement.scrollHeight)
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        startCollect(Message.fbMax).then()
        fbMax = Message.fbMax
        sendResponse({state: 200});
    } else if (Message.Message === 'stop') {
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
    }
})

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("/api/graphql/") !== -1)) {
            try {
                let data = res.data.data;


                data = data.substring(0, data.indexOf('{"label":"ProfileCometTimelineFeed_user$stream$ProfileCometTimelineFeed_user_timeline_list_feed_units"'));


            } catch (e) {

            }
        }
    }
})

function str(str, data) {

}