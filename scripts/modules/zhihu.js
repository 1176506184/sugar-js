chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    console.log(Message)
    if (Message.Message === 'GetQuestion') {
        await getQuestion();
        sendResponse({state: 200});
    } else if (Message.Message === 'GetAnswer') {
        collectNum = Message.num;
        await getAnswer();
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'zhihu',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})

let is_end = false;
var collectNum = 50;

window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {
        if (res.data && res.data.url && (res.data.url.indexOf("/feeds") !== -1)) {
            try {
                console.log('xhr', res.data.data)
                is_end = res.data.data.paging.is_end;
                collectedMap.push(...(res.data.data.data.map((item) => {
                    return item.target
                })))
            } catch (e) {
                console.log(e);
            }
        }
    }
});

function getQuestion() {
    var initQuestion = JSON.parse(document.querySelector('#js-initialData').innerHTML).initialState.entities.questions
    Object.values(initQuestion).forEach((item) => {
        chrome.runtime.sendMessage({
            Message: 'question',
            data: item
        }).then()
    })

}

const collectedMap = []

window.addEventListener('load', () => {
    var initAnswer = JSON.parse(document.querySelector('#js-initialData').innerHTML).initialState.entities.answers
    collectedMap.push(...Object.values(initAnswer))
})


function getAnswer() {
    scrollBottom();
    if (!is_end && collectedMap.length < collectNum) {
        setTimeout(() => {
            getAnswer();
        }, 3000)
    } else {
        chrome.runtime.sendMessage({
            Message: 'finish',
            data: collectedMap
        }).then()
    }

}


function scrollBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
}