chrome.runtime.onMessage.addListener(async function (Message) {
    console.log(Message)
    if (Message.Message === 'video') {
        getVideo();
    }
})

function getVideo() {

    let video = document.querySelector('div[data-e2e="feed-active-video"] video');
    let url = video.childNodes[0]?.src;

    chrome.runtime.sendMessage({
        Message: 'video',
        url: url
    })

}