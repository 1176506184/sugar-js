window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {
        if (res.data.url.includes("_ajax/fonts/find")) {
            let fontOrigin = JSON.parse(res.data.data.replace(`'"])}while(1);</x>//`, ''))['fontFamilies'][0];
            const font = {
                name: fontOrigin.name,
                src: fontOrigin.fonts[0].files.filter(r => r.format === 'WOFF')[0].url
            }
            chrome.runtime.sendMessage({
                Message: 'font',
                type: 'Canva',
                data: font
            }).then(r => {

            })
        }
    }
})
const index = 0;

async function wait(time) {
    return new Promise(r => {
        setTimeout(() => {
            r(true)
        }, 1000 * time)
    })
}

async function getFontAll() {
    const arr = document.querySelectorAll('[role="treeitem"]');
    for (let i = index; i < arr.length; i++) {
        arr[i].click();
        await wait(1);
    }
    scroll2bottom();
}

function scroll2bottom() {
    document.querySelector('[role="tree"]').scrollTop = document.querySelector('[role="tree"]').scrollHeight;
    setTimeout(() => {
        getFontAll();
    }, 5000)
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'web',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'start') {
        sendResponse({
            state: 200
        });
        getFontAll();
    }
})
