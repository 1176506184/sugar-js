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

function startGetPageTask() {

    let pages = document.querySelectorAll('div[aria-posinset]');
    pages.forEach()


}


var pending = "lock"
var fbMax = ""
var timer = null;

function startCollect(max) {
    // console.log(max)
    timer = setInterval(() => {
        if ((facebookData.length < max && pending === "start") || (!max && pending === "start")) {
            scrollBottom()
        } else {
            // facebookData数据量一下子超过max
            console.log('fb停了')
            // 需要进行处理
            chrome.runtime.sendMessage({
                Message: 'stop',
                type: 'facebook',
                data: facebookData
            }).then(r => {
                pending = "lock";
            })

            clearInterval(timer)
        }
    }, 5000)
}

function scrollBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight)
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'article') {
        console.log("获取任务");
        pending = "start";
        startCollect(Message.fbMax)
        fbMax = Message.fbMax
        sendResponse({ state: 200 });
    } else if (Message.Message === 'stop') {
        pending = "end";
        sendResponse({ state: 200 });
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200,
            pending: pending,
            fbMax: fbMax
        });
    } else if (Message.Message === 'xhr') {
        sendResponse({ state: 200 });
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'facebook',
        }).then(r => {
        })
        sendResponse({ state: 200 });
    }
})
