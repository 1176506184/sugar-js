let max = 10000
let history = []
let historyNum = 0
let toolId = ''


async function addMore() {
    window.scrollTo(0, document.body.scrollHeight)
    if (document.querySelector('.see-more')) {
        document.querySelector('.see-more').click();
        await wait(5);
        return true
    } else {
        return false
    }
}

function getBlogger() {
    chrome.runtime.sendMessage({
        Message: 'lemon8appBlogger',
        author: document.querySelector('.user-desc-base-name').textContent,
        authorLink: location.origin + location.pathname
    }).then(r => {

    })
}

/** 等待 */
async function wait(s1, t) {  // 变量，波动范围
    // 计算等待时间（包含随机波动）
    let s = (s1 - Math.random() * 0.5).toFixed(2);
    console.log(`开始等待 ${s} 秒${t ? " " + t : ''}`);
    return new Promise(resolve => {
        setTimeout(function () {  // 使用原生 setTimeout
            console.log(`结束等待 ${s} 秒`);
            resolve(true);
        }, s * 1000);
    });
}

async function startGetHistory() {
    let list = Array.from(document.querySelectorAll('#user-post .article-list .article_card')).map(item => {
        let title = item.querySelector('.article_card_main_body_content').textContent;
        if (!title) {
            title = item.querySelector('.article_card_main_body_title').textContent
        }
        return {
            title,
            article_url: item.href,
            post_url: item.href,
            likes: dealNum(item.querySelector('.article_card_like').textContent),
            article_type: item.querySelector('.video-badge') ? 3 : 2,
            move_total: dealNum(item.querySelector('.article_card_like').textContent)
        }
    });
    list = list.filter(item => !(history.find(h => h.title === item.title)));
    history.push(...list)
    chrome.runtime.sendMessage({
        Message: 'lemon8appData',
        data: JSON.stringify(list),
        toolId
    }).then(r => {

    })

    let haveMore = await addMore();
    if (haveMore && history.length < max) {
        await startGetHistory();
    } else {
        chrome.runtime.sendMessage({
            Message: 'StopLemon8app',
            type: 'lemon8app',
            toolId
        }).then(r => {

        })
    }
}

function dealNum(num) {

    let result = num.replace(/\D/g, '');

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

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {

    if (Message.Message === 'getData') {
        sendResponse({state: 200});
        startGetHistory().then();
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'lemon8app',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'getBlogger') {
        sendResponse({
            state: 200
        });
        getBlogger();
    } else if (Message.Message === 'startCollectHistory') {
        sendResponse({state: 200});
        if (Message.max_collect) {
            max = Message.max_collect;
            console.log(max)
        }

        if (!toolId) {
            toolId = Message.toolId;
        } else if (parseInt(toolId) !== parseInt(Message.toolId)) {
            return
        }
        startGetHistory().then();
    } else if (Message.Message === 'pauseCollectHistory') {
        if (parseInt(Message.toolId) !== parseInt(toolId)) {
            return
        }
        sendResponse({state: 200});
        max = 0;
    }

});