async function addMore() {
    window.scrollTo(0, document.body.scrollHeight)
    if (document.querySelector('.see-more')) {
        document.querySelector('.see-more').click();
        await wait(10);
        return true
    } else {
        return false
    }
}

function getBlogger() {
    chrome.runtime.sendMessage({
        Message: 'lemon8appBlogger',
        author: document.querySelector('.navbar_title span').textContent,
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

let history = []

async function startGetHistory() {
    let list = Array.from(document.querySelectorAll('#user-post .article-list .article_card')).map(item => {
        return {
            title: item.querySelector('.article_card_main_body_content').textContent,
            article_url: item.href,
            post_url: item.href,
            likes: dealNum(item.querySelector('.article_card_like').textContent),
            article_type: 2
        }
    });
    list = list.filter(item => !(history.find(h => h.article_url === item.article_url)));
    history.push(...list);


    chrome.runtime.sendMessage({
        Message: 'lemon8appData',
        data: JSON.stringify(list)
    }).then(r => {

    })

    let haveMore = await addMore();
    if (haveMore) {
        await startGetHistory();
    } else {
        chrome.runtime.sendMessage({
            Message: 'StopLemon8app',
            type: 'lemon8app',
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
        getBlogger();
        sendResponse({
            state: 200
        });
    }

});