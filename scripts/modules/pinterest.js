var imgData = [];
var user = {};

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
        // res.data.data
        function filterData(data) {
            for (let k in data.resource_response) {
                if (k === 'endpoint_name') {
                    // endpoint_name:
                    // 1.v3_creator_profile_cover_pins 
                    // 2.v3_get_bizpro_feed  
                    // 3.v3_user_story_pins_feed
                    if (data.resource_response.endpoint_name.indexOf('v3_get_bizpro_feed') !== -1) {
                        return true;
                    }

                    return false;
                }
            }

            return false;
        }

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

                }
            })

        }

        if (res.data.data) {
            try {
                res.data.data = JSON.parse(res.data.data);
            } catch (e) {

            }
        }

        // if (typeof res.data.data === 'object') {
        //     swiftData(res.data.data);
        // }

        // 采集历史数据
        if (typeof res.data.data === 'object' && res.data.url && filterData(res.data.data)) {
            try {
                async function handleData(data) {
                    let Data = data;
                    // 开始采集
                    await CacheMertial(Data);
                }

                handleData(res.data.data.resource_response.data);
            } catch (e) {

                console.log(e)
            }
        }

    }
})

let frameId = '';

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

let packageIndex = 0;
let NoScrollCount = 0;

// let timer = setInterval(() => {
//     NoScrollCount += 1;

//     if (PostDataArray.length > 0) {
//         NoScrollCount = 0;
//     }

//     if (packageIndex >= 300) {
//         clearInterval(timer);
//         console.log('已超过500条数据，停止抓包');
//     }

//     if (NoScrollCount > 5) {
//         clearInterval(timer);
//         console.log('无数据停止');
//     }

//     setTimeout(() => {
//         scrollBottom();        
//     }, 1);
// }, 1000);

async function CacheMertial(Data) {
    console.log('cj1', Data);

    var num = Data.length;
    // console.log('帖子数' + num);

    for (var i = 0; i < num; i++) {
        var notes = "";
        var views = 0;
        var likes = 0;
        var comments = 0;
        var retweets = 0;
        var quotes = 0;
        var shares = 0;
        var move_total = 0;
        var article_url = ''
        var video_url = '';
        var photo_url = [];
        var post_url = '';
        var post_time = '';
        var article_type = 0;
        var source_urls = '';

        try {
            console.log('第' + (packageIndex + 1) + '个帖子');

            //标题
            notes = Data[i].title;
            if (!notes) {
                notes = Data[i].grid_title;
            }

            console.log(`title:${notes}`);

            //点赞数
            for (let k in Data[i].reaction_counts) {
                likes += Data[i].reaction_counts[k];
            }
            console.log(`likes:${likes}`);

            //评论数(目前评论数采集为0)
            comments = Data[i].comment_count;

            //分享数
            shares = Data[i].repin_count;

            //互动数
            move_total = likes + comments + shares;

            //发布时间
            post_time = Data[i].created_at;
            post_time = new Date(post_time).toISOString();
            // console.log('发布时间：' + post_time);

            //帖子链接
            post_url = `https://www.pinterest.com/pin/${Data[i].id}/`;
            console.log(`post_url:${post_url}`);

            if (Data[i].videos) {
                article_type = 3;
            }
            else if (Data[i].story_pin_data?.pages[0]?.blocks[0]?.block_type === 3 || Data[i].story_pin_data?.pages_preview[0]?.blocks[0]?.block_type === 3) {
                article_type = 3;
            }
            else if (Data[i].story_pin_data?.pages[0]?.blocks[0]?.block_type === 2 || Data[i].story_pin_data?.pages_preview[0]?.blocks[0]?.block_type === 2) {
                // if (Data[i].story_pin_data?.page_count === 1) {
                //     article_type = 2;
                // } 
                // else {  //内容是视频但是抓包数据的结构里定义为了图片，且多张图片无具体链接，这种情况出现的很少，故不要此类数据
                //     article_type = -1;
                // }
                article_type = 2;
            }
            else if (Data[i].images) {
                article_type = 2;
            }

            if (article_type === 3) {
                //视频链接
                console.log('-----视频贴-----');
                video_url = await getVideoUrl();
                console.log(`video_url:${video_url}`);
            }
            else if (article_type === 2) {
                //图片链接
                console.log('-----图片贴-----');
                if (Data[i].story_pin_data?.page_count > 1) {
                    photo_url = await getPhotosInPages();
                }
                else if (Data[i].images?.orig?.url) {
                    photo_url.push(Data[i].images.orig.url);
                }
                console.log(`photo_url:${photo_url}`);
            }

            if (video_url) {
                source_urls = video_url + ';';
            }
            else if (photo_url.length) {
                photo_url.forEach(url => {
                    source_urls += url + ';';
                });
            }
            // 无数据情况，错误
            else {
                console.log('此贴有问题，不上传');
                article_type = -1;
                source_urls = '';
            }

            console.log(`source_urls:${source_urls}`);
            console.log(`article_type:${article_type}`);

            if (!!post_url && article_type > -1) {
                //  POST把抓包内容打包成数组，调用回传
                await Post(blogger_id_send, notes, article_type, article_url, source_urls, post_url, views, likes, shares, comments, move_total, post_time);
                // console.log('抓包数据', PostDataArray[i]);
            }

            packageIndex++;

            async function getVideoUrl() {
                let video_url = await getVideoInVideo();

                if (!video_url) {
                    console.log('getVideoInPages');
                    video_url = await getVideoInPages();
                }

                if (!video_url) {
                    console.log('getVideoInPagesPreview');
                    video_url = await getVideoInPagesPreview();
                }

                return video_url;
            }

            async function getVideoInVideo() {
                let video_url = '';

                if (Data[i].videos) {
                    // article_type = 3;
                    const videoList = Data[i].videos.video_list;
                    for (let k in videoList) {
                        if (videoList[k].url?.indexOf('m3u8') === -1) {
                            video_url = videoList[k].url;
                            console.log(`video_url1:${video_url}`);
                            return video_url;
                        }
                    }
                }

                return video_url;
            }

            async function getVideoInPages() {
                let video_url = '';

                if (Data[i].story_pin_data?.pages?.length) {
                    for (let j = 0; j < Data[i].story_pin_data.pages.length; j++) {
                        const page = Data[i].story_pin_data.pages[j];
                        if (page.blocks?.length) {
                            for (let k = 0; k < page.blocks.length; k++) {
                                const block = page.blocks[k];
                                if (block.video?.video_list) {
                                    // article_type = 3;
                                    for (let key in block.video.video_list) {
                                        if (block.video.video_list[key].url.indexOf('m3u8') === -1) {
                                            video_url = block.video.video_list[key].url;
                                            console.log(`video_url2:${video_url}`);
                                            return video_url;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return video_url;
            }

            async function getVideoInPagesPreview() {
                let video_url = '';

                if (Data[i].story_pin_data?.pages_preview?.length) {
                    for (let j = 0; j < Data[i].story_pin_data.pages_preview.length; j++) {
                        const page = Data[i].story_pin_data.pages_preview[j];
                        if (page.blocks?.length) {
                            for (let k = 0; k < page.blocks.length; k++) {
                                const block = page.blocks[k];
                                if (block.video?.video_list) {
                                    // article_type = 3;
                                    for (let key in block.video.video_list) {
                                        if (block.video.video_list[key].url.indexOf('m3u8') === -1) {
                                            video_url = block.video.video_list[key].url;
                                            console.log(`video_url3:${video_url}`);
                                            return video_url;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return video_url;
            }

            async function getPhotosInPages() {
                let photo_urls = [];

                if (Data[i].story_pin_data?.pages?.length) {
                    for (let j = 0; j < Data[i].story_pin_data.pages.length; j++) {
                        const page = Data[i].story_pin_data.pages[j];
                        if (page.blocks?.length) {
                            for (let k = 0; k < page.blocks.length; k++) {
                                const block = page.blocks[k];
                                if (block.image_signature) {
                                    const imageSignature = block.image_signature;
                                    const key = await getPenultimateKeyOfObject(Data[i].images);
                                    let photo_url = `https://i.pinimg.com/${key}/${imageSignature.slice(0, 2)}/${imageSignature.slice(2, 4)}/${imageSignature.slice(4, 6)}/${imageSignature}.jpg`;
                                    console.log(`photo_url in pages:${photo_url}`);
                                    photo_urls.push(photo_url);
                                }
                            }
                        }
                    }
                }

                return photo_urls;
            }

            // 获得对象的倒数第二个属性，主要为了获得images里面的originals的上面尺寸(一般为736x)的图片链接，使用originals获取不到
            async function getPenultimateKeyOfObject(obj) {
                const keys = Object.keys(obj);
                return keys[keys.length - 2];
            }

        } catch (e) {
            console.log(e)
        }
    }
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
                let send_count = 0;
                if (post_num > 0) {
                    while (post_num > 30) {
                        await sendData(30, send_count);   
                        post_num -= 30;
                        send_count++;
                    }

                    if (post_num > 0) {
                        await sendData(post_num, send_count);
                    } 

                    // 传完清空
                    PostDataArray = [];
                }
            } else {
                console.log('采集当前停止');
            }
            // 保证数据传输，延时下拉
            setTimeout(function () {
                scrollBottom();
            }, 1000);
        }

        if (CollectFlag == true) {
            finishTime_count += 3;
            console.log('无数据计时：', finishTime_count);
            console.log('限时总计时：', finishTime_send);
        }
    }, 3000);

    async function sendData(post_num, send_count) {
        let postDataToSend = [];

        for (let i = 0; i < post_num; i++) {
            PostDataArray[i + 30 * send_count].blogger_id = blogger_id_send;

            console.log("采集数据回传--->", PostDataArray[i + 30 * send_count]);
            postDataToSend.push(PostDataArray[i + 30 * send_count]);

            //必须批量传，不能单独传
            // chrome.runtime.sendMessage({
            //     Message: 'sendData',
            //     type: 'pinterest',
            //     Data: PostDataArray[i],
            //     FrameId: frameId
            // }).then(r => {
            // })

            // 采集条数计数
            max_collect_count += 1;
            // 发送条数倒着计数
            max_collect_send_copy -= 1;
            // 下拉无数据计时
            finishTime_count = 0;
            /* if (timeout) {
                clearInterval(timeout);
            } */
        }

        //必须批量传，不能单独传
        chrome.runtime.sendMessage({
            Message: 'sendData',
            type: 'pinterest',
            Data: postDataToSend,
            FrameId: frameId
        }).then(r => {
        })
    }
}

// 通知插件完成采集
async function UpdateFrameState(time, type) {
    // 状态置为关闭
    CollectFlag = false

    chrome.runtime.sendMessage({
        Message: 'endToAlert',
        AlertType: type,
        type: 'pinterest',
        Data: time,
        FrameId: frameId
    }).then(r => {
    })
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    console.log('收到插件消息', Message);
    if (Message.Message === 'image') {
        getImage();
        sendResponse({ state: 200 });
    } else if (Message.Message === 'xhr') {
        sendResponse({ state: 200 });
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'pinterest',
        }).then(r => {

        })
        sendResponse({ state: 200 });
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
    }
})

// pinterest采历史
async function dealHistoryData(data) {


    if (frameId === "") {
        frameId = data.frameId;
    } else {
        return
    }

    chrome.runtime.sendMessage({
        Message: 'history',
        type: 'pinterest',
        frameId: frameId,
        data: '',
        author: document.querySelector('div[data-test-id="profile-name"]').innerText,
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
