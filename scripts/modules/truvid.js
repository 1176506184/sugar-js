function autoLoginOut() {
    if (!localStorage.getItem('lastLogin')) {
        localStorage.setItem('lastLogin', (new Date()).getTime())
    } else {
        if ((new Date()).getTime() - localStorage.getItem('lastLogin') > 1000 * 60 * 60 * 5) {
            localStorage.removeItem('lastLogin')

            document.querySelector('#logoutButton').click();
        }
    }
}


setTimeout(() => {
    if (document.querySelector('#login')) {
        document.querySelector('#login-btn').click();
    } else {
        autoLoginOut();
    }
}, 60)
