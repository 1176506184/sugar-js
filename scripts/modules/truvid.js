function autoLoginOut() {
    if (!localStorage.getItem('lastLogin')) {
        localStorage.setItem('lastLogin', (new Date()).getTime())
    } else {
        if ((new Date()).getTime() - localStorage.getItem('lastLogin') > 1000 * 60 * 10) {
            localStorage.removeItem('lastLogin')

            document.querySelector('#logoutButton').click();
        }
    }
}

function autoLoginIn() {
    if (document.querySelector('#login')) {
        localStorage.setItem('lastLogin', (new Date()).getTime())
        document.querySelector('#login-btn').click();
        keyup(document.querySelector('#login-btn'))
        setTimeout(() => {
            console.log("登录超时，多点登录");
            chrome.runtime.sendMessage({
                Message: 'closeCiSession',
                type: 'truvid',
            }).then(r => {

            })
        }, 60 * 1000)
    }
}

function keyup(targetElement) {
    // 创建一个新的键盘事件对象
    var event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: 13, // 回车键的keyCode（通常为13）
        key: 'Enter' // 根据规范也可以设置key属性
    });
    targetElement.dispatchEvent(event);
}

console.log("等待20s后检测")
setTimeout(() => {
    if (location.href.includes('login')) {
        autoLoginIn()
    } else {
        chrome.runtime.sendMessage({
            Message: 'updateCiSession',
            type: 'truvid',
        }).then(r => {

        })
    }
}, 20000)

