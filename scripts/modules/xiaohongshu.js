let eid = '';
let userid = ''
let userName = '';
const url = location.href;
let hasMore = true
let history = []
let historyNum = 0
let max = 10000
let frameId = ''
let toolId = ''

setTimeout(() => {
    document.querySelectorAll('script').forEach((r) => {
        if (r.innerHTML.includes('window.__INITIAL_STATE__=')) {
            let json = r.innerHTML.replace('window.__INITIAL_STATE__=', '')
            json = json.replaceAll('undefined', '1')
            let preData = JSON.parse(json);

            let feed = preData.user.notes[0];
            console.log(feed)
            history.push(...feed.map((item) => {
                return {
                    title: item.noteCard.displayTitle,
                    article_url: location.origin + location.pathname + '/' + item.noteCard.noteId + '?xsec_token=' + item.noteCard.xsecToken,
                    post_url: location.origin + location.pathname + '/' + item.noteCard.noteId + '?xsec_token=' + item.noteCard.xsecToken,
                    likes: dealNum(item.noteCard.interactInfo.likedCount),
                    article_type: item.noteCard.type === 'normal' ? 2 : 3
                }
            }))
            hasMore = preData.user.noteQueries[0].hasMore
            console.log(hasMore)
        }
    })
}, 300)

window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {

        if (res.data.url.includes("/api/sns/web/v1/user_posted")) {
            let data = res.data.data
            let list = JSON.parse(data).data.notes
            history.push(...list.map((item) => {
                return {
                    title: item.display_title,
                    article_url: location.origin + location.pathname + '/' + item.note_id + '?xsec_token=' + item.xsec_token,
                    post_url: location.origin + location.pathname + '/' + item.note_id + '?xsec_token=' + item.xsec_token,
                    likes: dealNum(item.interact_info.liked_count),
                    article_type: item.type === 'normal' ? 2 : 3
                }
            }))

            hasMore = JSON.parse(data).data.has_more
            console.log(hasMore)
        }
    }
})


function getBlogger() {

    if (location.href.indexOf('/user/profile') === -1) {
        chrome.runtime.sendMessage({
            Message: 'CantRedBook',
            type: 'redBook',
        }).then(r => {

        })
        return
    } else if (document.querySelectorAll('[class="user side-bar-component"] [href*="/user/profile/"]').length === 0) {
        chrome.runtime.sendMessage({
            Message: 'CantRedBook',
            type: 'redBook',
        }).then(r => {

        })
        return
    }


    chrome.runtime.sendMessage({
        Message: 'redBookBlogger',
        author: document.querySelector('.user-name')?.textContent,
        authorLink: location.href
    }).then(r => {

    })
}

function xhs_getData() {

    var userName = ''
    var userid = ''
    var cover = ''
    let msg = ''

    try {
        userName = document.querySelectorAll('[class="user-name"]')[0].innerText;
        userid = location.href.split('https://www.xiaohongshu.com/user/profile/')[1].split('?')[0];
        cover = document.querySelectorAll('[class="user-info"] [class="avatar-wrapper"] img')[0].src;
    } catch (error) {

    }


    if (location.href.indexOf('/user/profile') == -1) {
        msg = '未在博主主页'
    } else if (document.querySelectorAll('[class="user side-bar-component"] [href*="/user/profile/"]').length == 0) {
        msg = '请先登录'
    }

    console.log('博主名字：' + userName + "  ID: " + userid);

    // return { userid: userid, userName: userName }
    chrome.runtime.sendMessage({
        Message: 'xiaohongshuData',
        type: 'xiaohongshu',
        data: {
            userid,
            userName,
            cover,
            msg
        }
    }).then(r => {

    })
}


async function addMore() {
    window.scrollTo(0, document.body.scrollHeight)
    await wait(2);
    return hasMore
}

async function startGetHistory() {
    let haveMore = await addMore();
    historyNum += history.length
    chrome.runtime.sendMessage({
        Message: 'redBookData',
        data: JSON.stringify(history),
        toolId: toolId
    }).then(r => {

    })
    history = []
    if (haveMore && (historyNum < max)) {
        await startGetHistory();
    } else {
        chrome.runtime.sendMessage({
            Message: 'StopRedBook',
            type: 'redBook',
            toolId: toolId
        }).then(r => {

        })
        history = []

    }
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {

    if (Message.Message === 'getData') {
        sendResponse({ state: 200 });
        xhs_getData();
    } else if (Message.Message === 'checkType') {

        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'xiaohongshu',
            // data: data,
        }).then(r => {

        })
        sendResponse({ state: 200 });

        if (location.href.indexOf('/user/profile') === -1) {
            chrome.runtime.sendMessage({
                Message: 'CantRedBook',
                type: 'redBook',
            }).then(r => {

            })
        } else if (document.querySelectorAll('[class="user side-bar-component"] [href*="/user/profile/"]').length === 0) {
            chrome.runtime.sendMessage({
                Message: 'CantRedBook',
                type: 'redBook',
            }).then(r => {

            })
        }


    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });

    } else if (Message.Message === 'getBlogger') {
        getBlogger();
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'getDataRedBook') {
        sendResponse({ state: 200 });
        startGetHistory().then();
    } else if (Message.Message === 'startCollectHistory') {
        sendResponse({ state: 200 });
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
        sendResponse({ state: 200 });
        max = 0;
    } else if (Message.Message === 'collect') {

        sendResponse({ state: 200 });
        if (document.querySelectorAll('[class="user side-bar-component"] [href*="/user/profile/"]').length != 0) {
            await XHS_Collect_article_list();
        } else {
            await CallBackData('账号未登录', -1, 'article_list');
        }


    }

});


/**采集主函数 */
async function XHS_Collect_article_list() {
    /**采集数量 */
    let article_num = 0;
    /**采集列表 */
    let article_list = [];
    /**缓存列表 */
    let data_list = [];

    await wait(2.5, '准备开始采集帖子')

    let pageheight = 0;
    let page = 0;
    let count = 5;

    while (true) {

        page = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        /**帖子列表 */
        let art_list = document.querySelectorAll('section');

        for (i = 0; i < art_list.length; i++) {
            try {
                /**本帖 */
                let art = art_list[i];

                if (art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1].length != 0) {


                    if (article_list.length == 0) {
                        article_list.push({
                            vid: art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1],
                            url: art.querySelectorAll('[class="cover ld mask"],[class="cover mask ld"]')[0].href
                        });
                        data_list.push({ vid: art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1] });
                        article_num++
                    } else {
                        /**帖子已收录 */
                        let if_have = false;

                        data_list.forEach(obj => {

                            if (art.querySelectorAll('[href*="explore"]')[0].href.indexOf(obj.vid) != -1) {
                                if_have = true;
                            }

                        });
                        if (!if_have) {
                            article_list.push({
                                vid: art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1],
                                url: art.querySelectorAll('[class="cover ld mask"],[class="cover mask ld"]')[0].href
                            });
                            data_list.push({ vid: art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1] });
                            article_num++
                        }
                    }
                }

            } catch {
            }

            if (article_list.length == 100) {
                await CallBackData(article_list, article_num, 0, 'article_list', 'continue');
                article_list = [];
            } else if (article_num >= 200) {

                await CallBackData(article_list, article_num, 0, 'article_list', 'over');
                return;
            }


        }

        if (pageheight < page) {
            count = 5;
            pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
            page = pageheight
        } else {

            if (count <= 0) {
                console.log('完成所有的采集任务了');
                break;
            } else {
                pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                page = pageheight
                count--;
                console.log('页面到底，重试次数：' + count);
            }
            window.scrollTo({
                top: pageheight,    // 目标位置
                behavior: 'smooth'  // 平滑滚动
            });

            await wait(6.5, '等待下滑加载')
        }
    }

    await CallBackData(article_list, article_num, 0, 'article_list', 'over');


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

/**回传任务信息 */
async function CallBackData(callback_data, article_num, state, type, order) {

    if (state == 0) {
        // 定义要发送的数据
        var data = {
            author_id: location.href.split('/profile/')[1].split('?')[0],
            article_list: callback_data,
            num: article_num,
            order: order
        };
    } else {
        var data = {
            author_id: 'false',
            article_list: [],
            msg: callback_data,
            num: article_num,
            order: order
        };
    }


    chrome.runtime.sendMessage({
        Message: 'xiaohongshuData',
        type: type,
        data: data
    }).then(r => {

    })
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

