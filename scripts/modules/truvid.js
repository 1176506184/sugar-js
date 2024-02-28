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

