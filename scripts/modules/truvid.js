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


setTimeout(() => {
    console.log('到时间了，登录')
    if (document.querySelector('#login')) {
        localStorage.setItem('lastLogin', (new Date()).getTime())
        document.querySelector('#login-btn').click();
    } else {
        autoLoginOut();
    }
}, 60000)
