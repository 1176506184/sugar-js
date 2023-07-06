chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    console.log(Message)
    if (Message.Message === 'Group') {
        await getGroup();
        sendResponse({state: 200});
    }else if(Message.Message === 'GroupScroll'){
        await getGroupAndScroll();
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'facebook',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})

function getGroupAndScroll(){
    setInterval(()=>{
        let members = []
        let temp = Array.from(document.querySelectorAll('.xt0psk2 .x1s688f')).map(r => {
            let userRealId = r.href.split('user/')[1]
            return {
                name: r.innerText,
                href: r.href,
                fbid: userRealId.replace(/[^0-9]/ig, "")
            }
        })
        members.push(...temp);
        chrome.runtime.sendMessage({
            Message: 'group',
            data: members
        })
        document.querySelectorAll('.xt0psk2 .x1s688f').forEach(r=>{
            r.remove();
        })
        window.scrollTo(0, document.documentElement.scrollHeight)
    },3000);
}

function getGroup() {
    let members = []
    let temp = Array.from(document.querySelectorAll('.xt0psk2 .x1s688f')).map(r => {
        let userRealId = r.href.split('user/')[1]
        return {
            name: r.innerText,
            href: r.href,
            fbid: userRealId.replace(/[^0-9]/ig, "")
        }
    })
    members.push(...temp);
    chrome.runtime.sendMessage({
        Message: 'group',
        data: members
    })

}

window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {

    }
});