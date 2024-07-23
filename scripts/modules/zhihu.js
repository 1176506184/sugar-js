function getQuestion() {
    const question_title = document.querySelector('.QuestionHeader-title').innerHTML;
    document.querySelector('.QuestionRichText-more')?.click()
    const question_desc = document.querySelector('.QuestionHeader .QuestionRichText').innerHTML;
}

const collectedMap = []

function getAnswer() {
    const collectList = document.querySelectorAll('.List-item');
    for (let i = 0; i < collectList.length; i++) {
        if (!collectedMap.includes(collectList[i])) {
            collectedMap.push(collectList[i]);
            const answer_html = collectList[i].querySelector('.RichText').innerHTML;
            const good_num = collectList[i].querySelector('[aria-live="polite"]').innerText.match(/\d+/g)[0];
            const comment_num = collectList[i].querySelector('.ContentItem-actions').children[1]?.innerText.match(/\d+/g)[0] || 0;
            console.log(good_num, comment_num)
        }
    }
    scrollBottom();
    setTimeout(() => {
        getAnswer();
    }, 5000)
}


function scrollBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
}