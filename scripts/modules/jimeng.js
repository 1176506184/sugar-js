chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'jimeng',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'start') {
        start()
    } else if (Message.Message === 'success') {
        showToast('添加成功');
    } else if (Message.Message === 'pushed') {
        showToast('图片已存在');
    }
    sendResponse({state: 200});
})

function start() {
    console.log('--开始采集--');
    setInterval(() => {
        const images = Array.from(document.querySelectorAll('[class*="imageContainer"]')).filter(r => r.getAttribute('sugar-finish') !== 'true');
        images.forEach(r => {
            r.setAttribute('sugar-finish', 'true');
            const download = document.createElement('div');
            download.innerHTML = '添加'
            download.style = 'cursor:pointer;font-size:16px;color:#fff;font-weight:bold;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;display:flex;justify-content:center;align-items:center;;background:#35ccff;border-radius:10px;'
            r.appendChild(download)
            download.addEventListener('click', (e) => {
                r.click();
                findImage().then(src => {
                    console.log(src);
                    chrome.runtime.sendMessage({
                        Message: 'image',
                        data: src
                    }).then()
                    document.querySelector('.lv-modal-wrapper [class*="back-"] svg').parentNode.click();
                })
                e.stopPropagation();
            })
        })
        console.log(images);
    }, 500)

}

async function findImage() {
    return new Promise((r) => {
        let timer = setInterval(() => {
            const src = document.querySelector('[data-apm-action="record-detail-image-detail-image-container"]')?.src;
            if (src) {
                clearInterval(timer);
                r(src);
            }
        }, 50)
    })
}

function showToast(e) {
    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 1e3
        , n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : document.body
        , o = document.createElement("div");
    o.style.cssText = "z-index:999999999999;position: fixed;width: auto;height: auto;max-width: 250px;background:#35ccff;border-radius:5px;color:#fff;line-height:25px;padding:10px 20px;font-size:25px;transition: 0.3s;"
    o.innerText = e
    n.appendChild(o)
    o.style.top = window.innerHeight / 2 - o.clientHeight / 2 + "px"
    o.style.left = window.innerWidth / 2 - o.clientWidth / 2 + "px"
    setTimeout((function () {
            o.style.opacity = "0"
            setTimeout((function () {
                    o.remove()
                }
            ), 300)
        }
    ), t)
}