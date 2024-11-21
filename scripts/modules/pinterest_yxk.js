
let eid = '';
let userid = ''
let userName = '';
const url = location.href;
window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("https://www.pinterest.com/") !== -1)) {
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


function Pinterest_getData() {

    var userName = ''
    var userid = ''
    var cover = ''
    let msg = ''

    try {
        userName = document.querySelectorAll('[data-test-id="profile-name"]')[0].innerText;
        userid = location.href.split('https://www.pinterest.com/')[1].split('/')[0];
        let str = `[alt="` + userid + `"],[alt="用户头像"]`;
        cover = document.querySelectorAll(str)[0].src;
    } catch (error) {

    }



    if (location.href.indexOf('_created') == -1) {
        msg = '未在"已创建"板块'
    }

    console.log('博主名字：' + userName + "  ID: " + userid);

    // return { userid: userid, userName: userName }
    chrome.runtime.sendMessage({
        Message: 'PinterestData',
        type: 'Pinterest',
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
        Pinterest_getData();
    } else if (Message.Message === 'checkType') {

        // let data=

        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'Pinterest',
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
        // if (document.querySelectorAll('[class="user side-bar-component"] [href*="/user/profile/"]').length != 0) {
        await Pinterest_Collect_article_list();
        // } else {
        //await Pinterest_CallBackData('账号未登录', -1, 'article_list');
        //  }


    }

});



/**采集主函数 */
async function Pinterest_Collect_article_list() {
    /**采集数量 */
    let article_num = 0;
    /**采集列表 */
    let article_list = [];
    /**缓存列表 */
    let data_list = []

    await wait(2.5, '准备开始采集帖子')

    let pageheight = 0;
    let page = 0;
    let count = 5;

    while (true) {

        page = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        /**帖子列表 */
        let art_list = document.querySelectorAll('[data-test-id="pin"]');

        for (i = 0; i < art_list.length; i++) {
            try {
                /**本帖 */
                let art = art_list[i];
                let post_id = art.dataset.testPinId;

                let path = '';
                let title = '';
                let desc = ''
                let type = 0;



                if (art.querySelectorAll('video').length != 0) {
                    continue;
                    /**视频跳过 */
                } else {

                    if (document.querySelectorAll('[data-test-id="login-button"]').length == 0) {/**登录 */
                        try {
                            path = art.querySelectorAll('img').length != 0 ? art.querySelectorAll('img')[0].src : '';
                            if (path.indexOf('/videos/') != -1 || path == '') {
                                continue;
                            }
                            path = path.replace('236x', '736x');
                            path = path.replace('474x', '736x');
                            // let parentNode = art.parentNode.parentNode;
                            title = art.querySelectorAll('[href*="/pin/"]').length != 0 ? art.querySelectorAll('[href*="/pin/"]')[0].ariaLabel.split(' Pin')[0] : '';
                            desc = art.querySelectorAll('img').length != 0 ? art.querySelectorAll('img')[0].alt.indexOf('其中包括图片') == -1 ? art.querySelectorAll('img')[0].alt : '' : '';

                        } catch (error) { }

                    } else {/**未登录 */
                        try {
                            path = art.querySelectorAll('[class="PinCard__imageWrapper"] img').length != 0 ? art.querySelectorAll('[class="PinCard__imageWrapper"] img')[0].src : '';
                            if (path.indexOf('/videos/') != -1 || path == '') {
                                continue;
                            }
                            path = path.replace('236x', '736x');
                            let parentNode = art.parentNode.parentNode;
                            title = parentNode.querySelectorAll('[data-test-id="related-pins-title"]').length != 0 ? parentNode.querySelectorAll('[data-test-id="related-pins-title"]')[0].innerText : '';
                            desc = parentNode.querySelectorAll('[data-test-id="desc"]').length != 0 ? parentNode.querySelectorAll('[data-test-id="desc"]')[0].innerText : '';

                        } catch (error) { }
                    }

                    if (article_list.length == 0) {
                        article_list.push({ post_id: post_id, path: path, title: title, desc: desc });
                        data_list.push({ post_id: post_id });
                        article_num++;
                    } else {
                        /**帖子已收录 */
                        let if_have = false;

                        data_list.forEach(obj => {
                            if (art.dataset.testPinId == obj.post_id) {
                                if_have = true;
                            }
                        });
                        if (!if_have) {
                            article_list.push({ post_id: post_id, path: path, title: title, desc: desc });
                            data_list.push({ post_id: post_id });
                            article_num++;
                        }
                    }
                }
            } catch { }
            if (article_list.length == 200) {
                await Pinterest_CallBackData(article_list, article_num, 0, 'article_list', 'continue');
                article_list = [];
            } else if (article_num >= 1000) {

                await Pinterest_CallBackData(article_list, article_num, 0, 'article_list', 'over');
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
                //  art_list[art_list.length-1].scrollIntoView

                pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                page = pageheight
                count--;
                console.log('页面到底，重试次数：' + count);
            }

            // art_list[art_list.length - 1].scrollIntoViewIfNeeded();
            art_list[art_list.length - 1].scrollIntoView({
                behavior: 'smooth', // 平滑滚动
                block: 'center',    // 滚动到视口中央位置
                inline: 'nearest'   // 水平方向最近位置
            });
            // window.scrollTo({
            //     top: pageheight,    // 目标位置
            //     behavior: 'smooth'  // 平滑滚动
            // });

            await wait(6.5, '等待下滑加载')
        }
    }

    await Pinterest_CallBackData(article_list, article_num, 0, 'article_list', 'over');


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
async function Pinterest_CallBackData(callback_data, article_num, state, type, order) {

    if (state == 0) {
        // 定义要发送的数据
        var data = {
            author_id: location.href.split('https://www.pinterest.com/')[1].split('/')[0],
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
        Message: 'PinterestData',
        type: type,
        data: data,

    }).then(r => {

    })
}

