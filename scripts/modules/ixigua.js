window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {
        // ixigua采集历史数据
        if (res.data && res.data.url && (res.data.url.indexOf("/author/new_video_list?") !== -1)) {
            // console.log('拦截接口成功！', res.data.data);
            try {
                async function handleData(data) {
                    let Data = data;
                    // 开始采集
                    CacheMertial(JSON.parse(Data), '0');
                    // console.log(typeof(Data));
                }

                handleData(res.data.data);
            } catch (e) {

                console.log(e);
            }
        }
    }
});

// 窗口ID
let frameId = '';

var CJtimer = null;
var timeout = null;
// 所有变量的声明
var max_collect_send = 900
var max_collect_send_copy = 900
var max_collect_count = 0
var finishTime_send = 10 * 60
var finishTime_count = 0
// 开始结束控制变量
var CollectFlag = false;
// 发送数据变量
var PostDataArray = [];
// 发送数据字段
var blogger_id_send = ''
var note = ''
var article_type = ''
var article_url = ''
var source_urls = ''
var post_url = ''
var likes = ''
var retweets = ''
var comments = ''
var move_total = ''
var post_time = ''
// 最后贴文发布时间
var publish_time_last = ''

// 第一屏数据
var first_page_data = {};
// 待解析数据
var toFenxiList = [];
// 刷新时是否处理过第一屏
var Flag = false;

async function CacheMertial(Data, type) {
    // type == 1 第一屏数据
    if (type === '1') {
        // 检验是否处理过
        if (!Flag) {
            Flag = true;
            console.log('西瓜视频：', Data.AuthorHomeVideoList);
            let videoList = Data.AuthorHomeVideoList;
            var num = videoList.videos.length;
            toFenxiList = videoList.videos;
            console.log('第一屏，视频帖子数' + num);
        }else {
            return;
        }
    }else {
        console.log('西瓜视频：', Data);
        // 拦截接口数据
        let videoList1 = Data.data;
        var num = videoList1.videoList.length;
        toFenxiList = videoList1.videoList;
        console.log('接口，视频帖子数' + num);
        // 第二屏数据封面地址与播放时长
        // coverUrl = data.videoList[0].video_detail_info.detail_video_large_image.url
        // duration = data.videoList[0].video_duration
    }
    

    for (var i = 0; i < num; i++) {
        var notes = "";
        var views = 0;
        var likes = 0;
        var comments = 0;
        var shares = 0;
        var move_total = 0;
        var article_url = ''
        var video_url = '';
        var source_urls = '';
        var post_url = '';
        var post_time = '';
        var old_post_time = '';
        var article_type = 3;
        var coverUrl = '';
        var duration = '';
        
        // 导语标题
        notes = toFenxiList[i].title;
        // 互动
        move_total = likes + shares + comments;
        // 观看
        if (type === '1') {
            // 封面地址
            coverUrl = toFenxiList[i].coverUrl;
            // 播放时长
            duration = +toFenxiList[i].duration;
            views = toFenxiList[i].playNum;
        } else {
            views = toFenxiList[i].video_detail_info?.video_watch_count; 
            // 封面地址
            coverUrl = toFenxiList[i].video_detail_info.detail_video_large_image.url;
            // 播放时长
            duration = +toFenxiList[i].video_duration;
        }
        console.log('播放：' + views);
        // 发文时间
        if (type === '1') {
            post_time = toFenxiList[i].publishTime;
            old_post_time = toFenxiList[i].publishTime;
        } else {
            post_time = toFenxiList[i].publish_time;
            old_post_time = toFenxiList[i].publish_time;
        }

        // 时间戳为10位需*1000，时间戳为13位不需乘1000
        var date = new Date(post_time * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        post_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        console.log('发送时间：' + post_time);

        // 帖子类型
        switch (article_type) {
            case 0:
                console.log('文本帖');
                break;
            case 1:
                console.log('链接帖');
                break;
            case 2:
                console.log('图片帖');
                break;
            case 3:
                console.log('视频帖');
                break;
        }

        if (type === '1') {
            // 视频地址
            source_urls = 'https://www.ixigua.com/' + toFenxiList[i].groupId + ';';

            // 视频地址
            post_url = 'https://www.ixigua.com/' + toFenxiList[i].groupId;
        }else {
            // 视频地址
            source_urls = 'https://www.ixigua.com/' + toFenxiList[i].group_id + ';';

            // 视频地址
            post_url = 'https://www.ixigua.com/' + toFenxiList[i].group_id;
        }

        if (post_url != '') {
            /////  POST把抓包内容打包成数组，调用回传
            await Post(blogger_id_send, notes, article_type, article_url, source_urls, post_url, views, likes, shares, comments, move_total, post_time, old_post_time, coverUrl, duration);

        } else {
            continue;
        }
    }
}


//////POST把抓包内容打包成数组，调用回传
async function Post(blogger_id_send, note, article_type, article_url, source_urls, post_url, looks, likes, retweets, comments, move_total, post_time, old_post_time, coverUrl, duration) {

    try {
        PostDataArray.push({
            // 接收较晚，发送时再组blogger_id
            // 'blogger_id': blogger_id_send,
            'title': note,
            'article_type': article_type,
            'article_url': article_url,//轉發的url
            'source_urls': source_urls,//图片、视频合集
            'post_url': post_url,//原贴鏈接
            'looks': looks,
            'likes': likes,
            'shares': retweets,
            'comments': comments,
            'move_total': move_total,
            'publish_time': post_time,
            'old_post_time': old_post_time,
            'return_msg': '',
            'remark': '',
            // 添加封面图片及视频时长
            'duration': duration,
            'cover': coverUrl

        });

        publish_time_last = post_time;
    } catch (e) {
        console.log(e)
    }
}


////////////回调函数
async function taskCallBackData() {
    CJtimer = setInterval(async function () {
        if ((max_collect_count >= max_collect_send) || (finishTime_count >= finishTime_send)) {
            console.log('情况1结束', (max_collect_count >= max_collect_send));
            console.log('情况2结束', (finishTime_count >= finishTime_send));

            console.log('总帖子数' + max_collect_count + "完成采集");

            if (CJtimer) {
                clearInterval(CJtimer);
            }

            // 更新插件完成状态
            if ((max_collect_count >= max_collect_send)) {
                await UpdateFrameState(publish_time_last, 'end')
            } else if ((finishTime_count >= finishTime_send)) {
                await UpdateFrameState(publish_time_last, 'stop')
            }

        } else {
            if (CollectFlag === true) {
                console.log('采集已开始');

                let post_num = Math.min(PostDataArray.length, max_collect_send_copy);
                // let post_num = PostDataArray.length
                if (post_num !== 0) {
                    for (let i = 0; i < post_num; i++) {
                        PostDataArray[i].blogger_id = blogger_id_send;
                        /* if (timeout) {
                            clearInterval(timeout);
                        } */
                    }

                    console.log("采集数据回传--->", PostDataArray);

                    chrome.runtime.sendMessage({
                        Message: 'sendData',
                        type: 'ixigua',
                        Data: PostDataArray,
                        FrameId: frameId
                    }).then(r => {
                        // 采集条数计数
                        max_collect_count += PostDataArray.length;
                        // 发送条数倒着计数
                        max_collect_send_copy -= PostDataArray.length;
                        // 下拉无数据计时
                        finishTime_count = 0;
                        // 传完清空
                        PostDataArray = [];
                    })
                }
            } else {
                console.log('采集当前停止');
            }
            // 保证数据传输，延时下拉
            setTimeout(function () {
                scrollBottom();
            }, 800);
        }

        if (CollectFlag == true) {
            finishTime_count += 5;
            console.log('无数据计时：', finishTime_count);
            console.log('限时总计时：', finishTime_send);
        }
    }, 5000);
}

// 通知插件完成采集
async function UpdateFrameState(time, type) {
    // 状态置为关闭
    CollectFlag = false

    chrome.runtime.sendMessage({
        Message: 'endToAlert',
        AlertType: type,
        type: 'ixigua',
        Data: time,
        FrameId: frameId
    }).then(r => {
    })
}

// 西瓜视频采历史
async function dealHistoryData(data) {
    console.log(data.frameId);

    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    first_page_data = JSON.parse(window.SSR_HYDRATED_DATA.innerText.replace('window._SSR_HYDRATED_DATA=', '').replaceAll(undefined, '""').replaceAll(null, '""'));
    // console.log(first_page_data);
    // 处理第一屏的数据
    CacheMertial(first_page_data, '1');
    
    // 去除链接多余参数
    let locationUrl = location.href;
    if (locationUrl.indexOf('?')>0) {
        locationUrl = locationUrl.split('?')[0];
    }
    chrome.runtime.sendMessage({
        Message: 'history',
        type: 'ixigua',
        frameId: frameId,
        data: '',
        author: first_page_data.AuthorDetailInfo?.name,
        authorLink: locationUrl[locationUrl.length - 1] === '/' ? locationUrl.slice(0, -1) : locationUrl
    }).then(r => {
    });
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    console.log('收到插件消息', Message);

    if (Message.Message === 'video') {
        console.log("获取任务");
        getVideo("ixigua");
        sendResponse({ state: 200 });
    }
    else if (Message.Message === 'xhr') {
        sendResponse({ state: 200 });
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'ixigua',
        }).then(r => {

        })
        sendResponse({ state: 200 });
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'history') {
        sendResponse({ state: 200 });
        console.log('进入history');

        dealHistoryData(Message).then();
        // 刷新计数清零
        max_collect_count = 0;
        finishTime_count = 0;

    } else if (Message.Message === 'sendBloggerid' && frameId == Message.frameId) {
        sendResponse({ state: 200 });
        console.log('数据库ID:', Message.Data.id);
        blogger_id_send = Message?.Data?.id;

    } else if (Message.Message === 'startCollectHistory' && frameId == Message.frameId) {
        sendResponse({ state: 200 });
        startCollectHistoryData(Message.Data).then();

    } else if (Message.Message === 'stopCollectHistory' && frameId == Message.frameId) {
        sendResponse({ state: 200 });
        // 关闭采集
        CollectFlag = false;
        if (CJtimer) {
            clearInterval(CJtimer);
        }
        /* if (timeout) {
            clearInterval(timeout);
        } */
    }
})


// 采集数据脚本
async function startCollectHistoryData(data) {
    // 开始采集
    CollectFlag = true;
    console.log('采集开始 - 限制条件', data);
    if (parseInt(data.max_collect)) {
        max_collect_send = parseInt(data.max_collect);
        max_collect_send_copy = parseInt(data.max_collect);
    }
    if (parseInt(data.finishTime)) {
        finishTime_send = parseInt(data.finishTime) * 60;
    }
    blogger_id_send = data.blogger_id;
    // 开启循环
    await taskCallBackData();
}


function scrollBottom() {
    var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    window.scrollTo(0, pageHeight - 50);
}

// 排程发送数据（接口）
var videoData = []
// 获取排程视频数据
function getVideo(type) {
    // console.log("开始返回数据")
    first_page_data = JSON.parse(window.SSR_HYDRATED_DATA.innerText.replace('window._SSR_HYDRATED_DATA=', '').replaceAll(undefined, '""').replaceAll(null, '""'));
    // 源视频排程
    // 处理第一屏的数据
    CacheMertial(first_page_data, '1');
    // 加2秒延时，等待第一屏处理结束
    setTimeout(function() {
        if (type === 'ixigua') {
            videoData = []
            // console.log(PostDataArray);
            for (let i = 0; i < PostDataArray.length; i++) {
                let TempObj = {
                    title: PostDataArray[i].title,
                    playCount: PostDataArray[i].looks,
                    create_time: PostDataArray[i].old_post_time,
                    href: PostDataArray[i].post_url,
                    duration: PostDataArray[i].duration,
                    cover: PostDataArray[i].cover,
                    author: first_page_data.AuthorDetailInfo?.name
                }
                videoData.push(TempObj);
            }

            // 发送转换后的数据
            chrome.runtime.sendMessage({
                Message: 'ixiguaVideo',
                data: videoData,
                author: first_page_data.AuthorDetailInfo?.name
            }).then()
        }
    }, 2000)
}