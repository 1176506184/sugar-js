const videoData = [];
const godComment = [];

function getVideo() {

    console.log(godComment);

    let video = document.querySelector('div[data-e2e="feed-active-video"] video');

    if (!video) {
        video = document.querySelector('video')
    }

    let url = video.childNodes[0]?.src;

    let pic = document.querySelector('div[data-e2e="feed-active-video"] .background img')

    if (!pic) {
        pic = document.querySelector('.background')
    }

    let author = document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="feed-video-nickname"]')?.innerText;

    if (!author) {
        author = document.querySelector('div[data-e2e="feed-video-nickname"]')?.innerText;
    }

    if (!author) {
        document.querySelectorAll('div[data-e2e="user-info"] a[href*="/user/"]').forEach(d => {
            if (d.innerText) {
                author = d.innerText
            }
        })
    }

    let author_url = document.querySelector('div[data-e2e="feed-active-video"] a[href*="/user/"][data-e2e="video-avatar"]')?.href;

    if (!author_url) {
        author_url = document.querySelector('a[href*="/user/"][data-e2e="video-avatar"]')?.href;
    }

    let title = document.querySelector('div[data-e2e="feed-active-video"] div.title')?.innerText;

    if (!title) {
        title = document.querySelector('div.title')?.innerText;
    }

    if (!title) {
        title = document.querySelector(`div[data-e2e="detail-video-info"] h2`)?.innerText;
    }

    if (!title) {
        title = document.querySelector(`div[data-e2e="detail-video-info"] h1`)?.innerText;
    }

    let realVideoData = {}
    let reUrl = ``;
    if (document.querySelector('div[data-e2e="detail-video-info"]')) {
        reUrl = `https://douyin.com/video/${document.querySelector('div[data-e2e="detail-video-info"]').getAttribute("data-e2e-aweme-id")}`
    } else if (document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]')) {
        reUrl = `https://douyin.com/video/${document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]').getAttribute("data-e2e-aweme-id")}`;
    } else {
        reUrl = location.href;
    }

    let aweme_id = document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]')?.getAttribute("data-e2e-aweme-id");
    if (!aweme_id) {
        document.querySelector('div[data-e2e="detail-video-info"]')?.getAttribute("data-e2e-aweme-id")
    }

    videoData.forEach(d => {
        let aweme_list = d.aweme_list;
        aweme_list.forEach((item) => {
            if (aweme_id.toString() === item.aweme_id.toString()) {
                realVideoData = item;
                realVideoData.reUrl = reUrl;
                realVideoData.pic = pic?.src;
            }
        })
    })

    try {


        if (Object.keys(realVideoData).length === 0 && !url) {
            alert("未检测到video标签下的素材院地址，请刷新当前页面");
            return;
        }

        if (!aweme_id && document.body.innerText.indexOf("直播中") !== -1) {
            alert("未检测到当前为直播");
            return;
        }

        chrome.runtime.sendMessage({
            Message: 'video',
            data: realVideoData,
            domData: {
                url: reUrl,
                video: url,
                author_url: author_url,
                title: title,
                author: author,
                pic: pic?.src,
            },
            godComment: godComment
        })
    } catch (e) {
        console.log(e);
    }

}


window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("aweme/v1/web/aweme/post/?device_platform=webapp") !== -1 || res.data.url.indexOf("/aweme/v1/web/tab/feed/?device_platform=webapp") !== -1)) {
            videoData.push(JSON.parse(res.data.data))
        }
        try {
            getComment(JSON.parse(res.data.data))
        } catch (e) {
            // console.log(e);
        }
    }
})


function getComment(data) {
    if (typeof data === 'object' && data !== null && data !== undefined) {
        Object.keys(data).forEach(key => {
            if (key === "comments") {
                console.log(data[key])
                godComment.push(...data[key]);
            } else if (typeof data[key] === 'object') {
                getComment(data[key]);
            }
        })
    }
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'video') {
        console.log("获取任务");
        getVideo();
        sendResponse({state: 200});
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'douyin',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})







