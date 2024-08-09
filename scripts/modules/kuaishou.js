let eid = '';
let userid = ''
let userName = '';
const url = location.href;
window.addEventListener('message', function (res) {

    if (res.data.Message === 'ajax') {
        if (res.data.url && (res.data.url.indexOf("rest/wd/feed/profile") !== -1)) {

            if (res.data.data.feeds[0].user) {
                eid = res.data.data.feeds[0].userEid;
                userid = res.data.data.feeds[0].user.user_id;
                userName = res.data.data.feeds[0].user.user_name;
            } else {
                eid = res.data.data.feeds[0].userEid;
                userid = res.data.data.feeds[0].userId;
                userName = res.data.data.feeds[0].userName;
            }
            console.log(eid, userid, userName);
        }
    }
})


function getData() {
    var script = Array.from(document.querySelectorAll('script')).filter(item => item.innerHTML.includes('window.INIT_STATE'))[0]
    if (script) {
        const value = JSON.parse(script.innerHTML.replace('window.INIT_STATE = ', ''));
        Object.values(value).forEach(item => {
            if (item.feeds) {
                eid = item.feeds[0].userEid;
                userid = item.feeds[0].userId;
                userName = item.feeds[0].userName;
            }
        })
    }

    chrome.runtime.sendMessage({
        Message: 'kuaishouData',
        type: 'kuaishou',
        data: {
            eid,
            userid,
            url,
            userName
        }
    }).then(r => {

    })
}

chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {

    if (Message.Message === 'getData') {
        sendResponse({state: 200});
        getData();
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'kuaishou',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }

});