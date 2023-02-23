const videoData = [];

function getVideo() {

    let video = document.querySelector('div[data-e2e="feed-active-video"] video');

    if (!video) {
        video = document.querySelector('video')
    }

    let author = document.querySelector('div[data-e2e="feed-video-nickname"]')?.innerText;
    let url = video.childNodes[0]?.src;
    let author_url = document.querySelector('a[href*="/user/"][data-e2e="video-avatar"]')?.href;
    let title = document.querySelector('div.title')?.innerText;
    let realVideoData = {}
    let reUrl = ``;
    if (document.querySelector('div[data-e2e="detail-video-info"]')) {
        reUrl = `https://douyin.com/video/${document.querySelector('div[data-e2e="detail-video-info"]').getAttribute("data-e2e-aweme-id")}`
    } else if (document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]')) {
        reUrl = `https://douyin.com/video/${document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]').getAttribute("data-e2e-aweme-id")}`;
    } else {
        reUrl = location.href;
    }

    videoData.forEach(d => {
        let aweme_list = d.aweme_list;
        aweme_list.forEach((item) => {
            if (document.querySelector('div[data-e2e="feed-active-video"] div[data-e2e="video-info"]').getAttribute("data-e2e-aweme-id").toString() === item.aweme_id.toString()) {
                realVideoData = item;
            }
        })
    })

    try {
        chrome.runtime.sendMessage({
            Message: 'video',
            data: realVideoData,
            domData: {
                url: reUrl,
                video: url,
                author_url: author_url,
                title: title,
                author:author
            }
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
    }
})

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'video') {
        getVideo();
        sendResponse({state: 200});
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    }
})




