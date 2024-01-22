var imgData = [];
var user = {};
var bozhuNameA = '';

function getImage() {

    if (location.href.indexOf("fetcherx.com") === -1) {
        imgData.forEach(r => {
            r.author_url = `https://twitter.com/${user.screen_name}`;
            r.resource_link = `https://twitter.com/${user.screen_name}/status/${r.id_str}`;
            r.author_name = user.name
            // r.author_name =
        })

    }

    chrome.runtime.sendMessage({
        Message: 'image',
        data: imgData
    })

}

window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {
        
        function swiftData(data) {

            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object') {

                    // if (key === 'tweets') {
                    //     Object.keys(data[key]).forEach(k=>{
                    //         if(data[key][k].entities?.media){
                    //             imgData.unshift(data[key][k]);
                    //         }
                    //     })
                    // }
                    // else

                    if (data[key]?.medias?.length && data[key]?._id && data[key]?.user) {
                        imgData.unshift({
                            resource_link: data[key].url,
                            author_url: `https://twitter.com/${data[key].user.username}`,
                            author_name: data[key].user.nickname,
                            full_text: data[key].context,
                            created_at: data[key].ts,
                            id_str: data[key]._id,
                            entities: {
                                media: data[key].medias.map(r => {
                                    return {
                                        media_url_https: r.url
                                    }
                                })
                            }
                        })
                    }

                    try {
                        if (key === 'tweet_results') {
                            if (data[key]['result']['legacy'].entities?.media) {
                                imgData.unshift(data[key]['result']['legacy']);
                            }
                        } else if (key === 'legacy') {
                            if (data[key]?.name && data[key]?.friends_count) {
                                user = data[key];
                            }
                        } else {

                            if (data[key] !== null && data[key] !== undefined) {
                                swiftData(data[key]);
                            }

                        }
                    }catch(e) {

                    }
                    

                }
            })

        }

        if (res.data.data) {
            try {
                res.data.data = JSON.parse(res.data.data);
            } catch (e) {

            }
        }

        try {
            if (typeof res.data.data === 'object') {
                swiftData(res.data.data);
            }
        }catch(e) {

        }
        

        // 采集历史数据
        if (typeof res.data.data === 'object' && res.data.url && (res.data.url.indexOf("/UserTweets?") !== -1)) {
            
            try {
                async function handleData(data) {
                    // console.log(data);
                    let Data = data;
                    var json_num = data.user.result.timeline_v2.timeline.instructions.length - 1;
                    // 开始采集
                    await CacheMertial(Data, json_num);
                }

                // 取视频博主名字
                try {
                    let resdata = res.data.data.data;
                    let len = resdata.user.result.timeline_v2.timeline.instructions.length - 1;
                    let bozhuName = resdata.user.result.timeline_v2.timeline.instructions[len].entries[0].content.itemContent.tweet_results.result.core.user_results.result.legacy.name;
                    bozhuNameA = bozhuName;
                }catch (e) {
                    console.log(e);
                }

                handleData(res.data.data.data);
            } catch (e) {

                console.log(e)
            }
        }

    }
})

let frameId = '';
// 排程的图文数组
var photo_urls_PaiCheng = []

var CJtimer = null;
var timeout = null;
// 所有变量的声明
var max_collect_send = 1000
var max_collect_send_copy = 1000
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

async function CacheMertial(Data, json_num) {
    console.log('cj1', Data);

    var num = Data.user.result.timeline_v2.timeline.instructions[json_num].entries.length;
    console.log('帖子数' + num);

    
    for (var i = 0; i < num; i++) {
        var notes = "";
        var views = 0;
        var likes = 0;
        var comments = 0;
        var retweets = 0;
        var quotes = 0;
        var move_total = 0;
        var article_url = ''
        var video_url = '';
        var photo_url = '';
        var post_url = '';
        var post_time = '';
        var article_type = 0;
        // 转推贴
        var ifretweeted = false;

        if (Data.user.result.timeline_v2.timeline.instructions[json_num].entries[i].entryId.indexOf('tweet-') == -1) {
            continue;
        }

        let resultOrtweet = null;
        
        // 判断报文两种结构
        if (Data.user.result.timeline_v2.timeline.instructions[json_num].entries[i].content.itemContent.tweet_results.result.tweet) {
            resultOrtweet = Data.user.result.timeline_v2.timeline.instructions[json_num].entries[i].content.itemContent.tweet_results.result.tweet
        } else {
            resultOrtweet = Data.user.result.timeline_v2.timeline.instructions[json_num].entries[i].content.itemContent.tweet_results.result
        }

        try {
            console.log('第' + i);
            //过滤掉可能出现的广告帖子
            try {
                if (resultOrtweet.core.user_results.result.legacy.name != blogger_name) {
                    continue;
                }

            } catch { }


            try {//转推帖过滤
                //data.user.result.timeline_v2.timeline.instructions[1].entries[0].content.itemContent.tweet_results.result.legacy.retweeted_status_result.result
                if (resultOrtweet.legacy.retweeted_status_result.result != '') {
                    ifretweeted = true;
                    continue;
                } else {
                    ifretweeted = false;
                }
            } catch (ex) {
                ifretweeted = false;
            }


            if (notes == '') {
                notes = resultOrtweet.legacy.full_text;
            }


            if (notes.indexOf('http') != -1 || notes.indexOf('https') != -1) {
                try {
                    
                    if (resultOrtweet.legacy.entities.urls[0].expanded_url != '') {
                        article_url = article_url + resultOrtweet.legacy.entities.urls[0].expanded_url + ';';
                    } else {
                        article_url = '';
                    }
                    
                    

                } catch {
                    article_url = '';
                }
                //极端情况（一个推中含有两个不同的外链），虽然它是上面代码的完善版本，但是没有找到真正的案例佐证，上面目前能跑就别动！
                //try {
                //    let article_urls = Data.user.result.timeline_v2.timeline.instructions[json_num].entries[i].content.itemContent.tweet_results.result.legacy.entities.urls;
                //    for (var i = 0; i < article_urls.length; i++){
                //        if (article_urls[i].expanded_url != '') {
                //            article_url = article_url + article_urls[i].expanded_url + ';';
                //        } else {
                //            article_url = '';
                //        }
                //    }
                //} catch {
                //    article_url = '';
                //}

            } else {
                article_url = '';
            }

            // full_text的文本超长时会转存到其他节点，获取长文本
            try {
                if (resultOrtweet.note_tweet != '') {
                    notes = resultOrtweet.note_tweet.note_tweet_results.result.text;
                    console.log(notes);
                }
            } catch {

            }
            if (notes == '') {
                notes = resultOrtweet.legacy.full_text;
            }


            likes = resultOrtweet.legacy.favorite_count;
            console.log('点赞：' + likes);

            retweets = resultOrtweet.legacy.quote_count;
            quotes = resultOrtweet.legacy.retweet_count;
            shares = retweets + quotes;
            console.log('分享：' + shares);

            comments = resultOrtweet.legacy.reply_count;
            console.log('回复：' + comments);
            move_total = likes + shares + comments;

            if (resultOrtweet.views.count != '') {
                views = resultOrtweet.views.count;
            } else {
               views = 0;
            }
            console.log('观看：' + views);

            post_url = location.href + '/status/' + resultOrtweet.rest_id;
            console.log('帖子链接：' + post_url);

            post_time = resultOrtweet.legacy.created_at;
            var posttime = new Date(post_time);
            post_time = posttime.toISOString();
            console.log('发送时间：' + post_time);


            try {
                video_url = await Video(Data, i, json_num);   //视频
            } catch { }
            if (video_url != '') {
                console.log('视频：' + video_url);
            }

            try {
                photo_url = await Picture(Data, i, json_num); //图片

            }
            catch { }
            if (photo_url != '') {
                console.log('图片：' + photo_url);
            }

            // 图文排程
            await PictureToPaicheng(Data, i, json_num, notes, views, likes, comments);
        } catch { }


        if (video_url != '') {
            article_type = 3;
            var source_urls = video_url;
            article_url = '';

        } else if (photo_url != '') {
            article_type = 2;
            var source_urls = photo_url;
            article_url = '';

        }
        else if (article_url != '') {
            article_type = 1;
            var source_urls = '';

        } else {
            article_type = 0;
            var source_urls = '';
            article_url = '';
        }
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


        if (post_url != '') {
            /////  POST把抓包内容打包成数组，调用回传
            await Post(blogger_id_send, notes, article_type, article_url, source_urls, post_url, views, likes, shares, comments, move_total, post_time);
            
        } else {
            continue;
        }

    }
}

//////////找视频
async function Video(jsonData, x, json_num) {
    let resultOrtweet = null;
    // 判断报文两种结构
    if (jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result.tweet) {
        resultOrtweet = jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result.tweet
    } else {
        resultOrtweet = jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result
    }


    var videoInfo = resultOrtweet.legacy.extended_entities.media[0].video_info.variants[2].url;
    video_num = resultOrtweet.legacy.extended_entities.media.length;
    for (var j = 0; j < video_num; j++) {
        var videoInfo = resultOrtweet.legacy.extended_entities.media[j].video_info.variants[2].url;
        if (videoInfo.includes('m3u8')) {
            videoInfo = resultOrtweet.legacy.extended_entities.media[j].video_info.variants[1].url;
            // 打印视频信息
            if (videoInfo.includes('m3u8')) {
                videoInfo = resultOrtweet.legacy.extended_entities.media[j].video_info.variants[0].url;
                // 打印视频信息
                if (videoInfo.indexOf('m3u8') == 0) {
                    console.log(videoInfo);
                    video_url = videoInfo + ';';
                    return video_url;
                    // return videoInfo;
                }
            }
            else {
                // 打印视频信息
                console.log(videoInfo);
                video_url = videoInfo + ';';
                return video_url;
                // return videoInfo;
            }
        }
        else {
            // 打印视频信息
            console.log(videoInfo);
            video_url = videoInfo + ';';
            return video_url;
            // return videoInfo;
        }
    }
    return video_url;
}

///////////找图片
async function Picture(jsonData, x, json_num) {
    let resultOrtweet = null;
    // 判断报文两种结构
    if (jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result.tweet) {
        resultOrtweet = jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result.tweet
    } else {
        resultOrtweet = jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result
    }

    let photo_url = '';
    var photo_num = resultOrtweet.legacy.entities.media.length;
    //var photo_url = '';
    for (var i = 0; i < photo_num; i++) {
        photo_url = photo_url + resultOrtweet.legacy.entities.media[i].media_url_https + ';';
    }

    return photo_url;

}

//////////社团图文排程
async function PictureToPaicheng(jsonData, x, json_num, notes, views, likes, comments) {
    let resultOrtweet = null;
    // 判断报文两种结构
    if (jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result.tweet) {
        resultOrtweet = jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result.tweet
    } else {
        resultOrtweet = jsonData.user.result.timeline_v2.timeline.instructions[json_num].entries[x].content.itemContent.tweet_results.result
    }

    let TempObj = {}
    let photo_url = '';
    var photo_num = resultOrtweet.legacy.entities.media.length;
    // var photo_url = '';

    var note = notes.split('https://t.co')[0];

    for (var i = 0; i < photo_num; i++) {
        photo_url = photo_url + resultOrtweet.legacy.entities.media[i].media_url_https;
        if (i !== (photo_num - 1)) {
            photo_url = photo_url + ',';
        }
    }

    TempObj = {
        href: photo_url,
        play: views,
        likes: likes,
        comments: comments,
        title: note
    }

    photo_urls_PaiCheng.push(TempObj)
}

//////POST把抓包内容打包成数组，调用回传
async function Post(blogger_id_send, note, article_type, article_url, source_urls, post_url, looks, likes, retweets, comments, move_total, post_time) {

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
            'return_msg': '',
            'remark': ''
        });

        publish_time_last = post_time;
    } catch (e) {
        console.log(e)
    }
}

////////////回调函数
async function taskCallBackData() {
    CJtimer = setInterval(async function() {
        if ((max_collect_count >= max_collect_send) || (finishTime_count >= finishTime_send)) {
            console.log('情况1结束', (max_collect_count >= max_collect_send));
            console.log('情况2结束', (finishTime_count >= finishTime_send));

            console.log('总帖子数' + max_collect_count + "完成采集");

            if(CJtimer) {
                clearInterval(CJtimer);
            }

            // 更新插件完成状态
            if ((max_collect_count >= max_collect_send)) {
                await UpdateFrameState(publish_time_last, 'end')
            } else if((finishTime_count >= finishTime_send)) {
                await UpdateFrameState(publish_time_last, 'stop')
            }
            
        }else {
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
                        type: 'twitter',
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
            setTimeout(function() {
                scrollBottom();
            }, 1000);
        }

        if (CollectFlag == true) {
            finishTime_count += 3;
            console.log('无数据计时：', finishTime_count);
            console.log('限时总计时：', finishTime_send);
        }
    }, 3000);
}

// 通知插件完成采集
async function UpdateFrameState(time, type) {
    // 状态置为关闭
    CollectFlag = false

    chrome.runtime.sendMessage({
        Message: 'endToAlert',
        AlertType: type,
        type: 'twitter',
        Data: time,
        FrameId: frameId
    }).then(r => {
    })
}


// 社团源素材排程
function getTwitterImageUrl() {
    let data = []
    // 排程数据
    data = photo_urls_PaiCheng

    let author = bozhuNameA ? bozhuNameA : (document.getElementsByClassName('css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1awozwy r-6koalj r-1udh08x')[0] ? document.getElementsByClassName('css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1awozwy r-6koalj r-1udh08x')[0].innerText : document.querySelector('div.css-175oi2r .r-1habvwh h2')?.innerText)

    chrome.runtime.sendMessage({
        Message: 'communityImage',
        data: data,
        author: author
    }).then()

}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'image') {
        getImage();
        sendResponse({state: 200});
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'twitter',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'history') {
        sendResponse({ state: 200 });
        dealHistoryData(Message).then();
        // 刷新计数清零
        max_collect_count = 0;
        finishTime_count = 0;
    } else if (Message.Message === 'sendBloggerid') {
        sendResponse({ state: 200 });
        console.log(Message.Data.id);
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
    } else if (Message.Message === 'community_image') {
        console.log('推特排程');

        // 社团图文排程
        getTwitterImageUrl();
        
        sendResponse({
            state: 200
        });
    }
})

// 推特采历史
async function dealHistoryData(data) {


    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    chrome.runtime.sendMessage({
        Message: 'history',
        type: 'twitter',
        frameId: frameId,
        data: '',
        author: bozhuNameA ? bozhuNameA : (document.getElementsByClassName('css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1awozwy r-6koalj r-1udh08x')[0] ? document.getElementsByClassName('css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1awozwy r-6koalj r-1udh08x')[0].innerText : document.querySelector('div.css-175oi2r .r-1habvwh h2')?.innerText),
        // author: document.getElementsByClassName('css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1awozwy r-6koalj r-1udh08x')[0] ? document.getElementsByClassName('css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-1vr29t4 r-1awozwy r-6koalj r-1udh08x')[0].innerText : document.querySelector('div.css-175oi2r .r-1habvwh h2')?.innerText,
        authorLink: location.href[location.href.length - 1] === '/' ? location.href.slice(0, -1) : location.href
    }).then(r => {
    })
}


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
