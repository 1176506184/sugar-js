
let eid = '';
let userid = ''
let userName = '';
const url = location.href;
window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("https://www.xiaohongshu.com/") !== -1)) {
            console.log(res.data.data);
            if (res.data.data.feeds[0].user) {
                userid = res.data.data.user_id;
                userName = res.data.data.user_name;
            } else {

                userid = res.data.data.userId;
                userName = res.data.data.userName;
            }
            console.log(userid, userName);
        }
    }
})


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

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {

    if (Message.Message === 'getData') {
        sendResponse({ state: 200 });
        xhs_getData();
    } else if (Message.Message === 'checkType') {

        // let data=

        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'xiaohongshu',
            // data: data,
        }).then(r => {

        })
        sendResponse({ state: 200 });


    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });

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
                        article_list.push({ vid: art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1], url: art.querySelectorAll('[class="cover ld mask"]')[0].href });
                    } else {
                        /**帖子已收录 */
                        let if_have = false;

                        article_list.forEach(obj => {

                            if (art.querySelectorAll('[href*="explore"]')[0].href.indexOf(obj.vid) != -1) {
                                if_have = true;
                            }

                        });
                        if (!if_have) {
                            article_list.push({ vid: art.querySelectorAll('[href*="explore"]')[0].href.split('explore/')[1], url: art.querySelectorAll('[class="cover ld mask"]')[0].href });
                        }
                    }

                }


            } catch { }

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

    await CallBackData(article_list, 0, 'article_list');


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
async function CallBackData(callback_data, state, type) {

    if (state == 0) {
        // 定义要发送的数据
        var data = {
            author_id: location.href.split('/profile/')[1].split('?')[0],
            article_list: callback_data
        };
    } else {
        var data = {
            author_id: 'false',
            article_list: [],
            msg: callback_data
        };
    }


    chrome.runtime.sendMessage({
        Message: 'xiaohongshuData',
        type: type,
        data: data
    }).then(r => {

    })
}

