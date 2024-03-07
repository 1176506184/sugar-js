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
        setTimeout(() => {
            document.querySelector('#login-btn').click();
        }, 10 * 1000)
        setTimeout(() => {
            document.querySelector('#login-btn').click();
        }, 30 * 1000)
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

