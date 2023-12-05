var indexReg = /PART\b|^Prologue|Chapter\s*[\-_]?\d+|分卷|^序$|^序\s*言|^序\s*章|^前\s*言|^附\s*[录錄]|^引\s*[言子]|^摘\s*要|^[楔契]\s*子|^后\s*记|^後\s*記|^附\s*言|^结\s*语|^結\s*語|^尾\s*[声聲]|^最終話|^最终话|^番\s*外|^\d+[\s\.、,，）\-_：:][^\d#\.]+$|^[第（]?\s*[\d〇零一二三四五六七八九十百千万萬-]+\s*[、）章节節回卷折篇幕集话話]/i;
var chapterList = []
var chapterMap = []
var chapterHrefMap = []
var chapterNameMap = []
var bodyReg = /<body[^>]*>([\s\S]+?)<\/body>/i;
var bookTitleReg = /《([\s\S]+?)》/i;
var innerNextPage = /^\s*(下一[页頁张張章]|next\s*page|次のページ)/i;
var finalPage = /^\s*(末[页頁张張章]|next\s*page|次のページ)/i;
var resultList = []
var delReg = /<ins[^>]*>.*<\/ins>/gi;
var taskActive = 0;
var title = ""
var cover = "";
var brief = "";
var waitNum = 0;
var getFinal = false;
var isOpen = false;

function str2Num(str) {
    str = str.replace(/^番\s*外/, "99999+").replace(/[一①Ⅰ壹]/g, "1").replace(/[二②Ⅱ贰]/g, "2").replace(/[三③Ⅲ叁]/g, "3").replace(/[四④Ⅳ肆]/g, "4").replace(/[五⑤Ⅴ伍]/g, "5").replace(/[六⑥Ⅵ陆]/g, "6").replace(/[七⑦Ⅶ柒]/g, "7").replace(/[八⑧Ⅷ捌]/g, "8").replace(/[九⑨Ⅸ玖]/g, "9").replace(/[十⑩Ⅹ拾]/g, "*10+").replace(/[百佰]/g, "*100+").replace(/[千仟]/g, "*1000+").replace(/[万萬]/g, "*10000+").replace(/\s/g, "").match(/[\d\*\+]+/);
    if (!str) return 0;
    str = str[0];
    let mul = str.match(/(\d*)\*(\d+)/);
    while (mul) {
        let result = parseInt(mul[1] || 1) * parseInt(mul[2]);
        str = str.replace(mul[0], result);
        mul = str.match(/(\d+)\*(\d+)/);
    }
    let plus = str.match(/(\d+)\+(\d+)/);
    while (plus) {
        let result = parseInt(plus[1]) + parseInt(plus[2]);
        str = str.replace(plus[0], result);
        plus = str.match(/(\d+)\+(\d+)/);
    }
    return parseInt(str);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

async function getAllChapter(aList) {

    aList.forEach((a) => {
        let result = a.innerText.match(indexReg);
        if (result && !chapterMap.includes(result[0])) {
            chapterMap.push(result[0])
            chapterList.push({
                name: result[0],
                href: a.href
            })
            chapterHrefMap.push(a.href)
            chapterNameMap.push(result[0])
        }
    })

    for (let i = 0; i < aList.length; i++) {
        if (innerNextPage.test(aList[i].innerText)) {
            let href = aList[i].href;
            if (chapterHrefMap.includes(href)) {
                return
            }
            const response1 = await fetch(href);
            const tempBlob = await response1.blob();
            const tempText = await readBlob(tempBlob);
            let body = bodyReg.exec(tempText)[1];
            body = body.replace(delReg, '');
            let tempNode = document.createElement('div');
            tempNode.innerHTML = clearScriptTag(body);
            await getAllChapter(tempNode.querySelectorAll('a'))
        } else if (finalPage.test(aList[i].innerText) && !getFinal) {
            getFinal = true;
            let href = aList[i].href;
            const response1 = await fetch(href);
            const tempBlob = await response1.blob();
            const tempText = await readBlob(tempBlob);
            let body = bodyReg.exec(tempText)[1];
            body = body.replace(delReg, '');
            let tempNode = document.createElement('div');
            tempNode.innerHTML = clearScriptTag(body);
            await getAllChapter(tempNode.querySelectorAll('a'))
        }
    }
}


function readBlob(blob) {
    return new Promise((r, j) => {
        const reader = new FileReader();
        reader.onload = function () {
            const text = reader.result;
            r(text);
        };
        reader.onerror = function () {
            j(false)
        }
        reader.readAsText(blob);
    })
}


async function getBriefAndCover() {
    title = document.querySelector('h1').innerText;
    if (bookTitleReg.test(title)) {
        title = bookTitleReg.exec(title)[1]
    }
    let href = ""
    document.querySelectorAll('a').forEach((a) => {
        if (a.innerText === title) {
            href = a.href;
        }
    })
    const response1 = await fetch(href);
    const tempBlob = await response1.blob();
    const tempText = await readBlob(tempBlob);
    let body = bodyReg.exec(tempText)[1];
    body = body.replace(delReg, '');
    let tempNode = document.createElement('div');
    tempNode.innerHTML = clearScriptTag(body);

    if (tempNode.querySelector('#bookimg')) {
        cover = tempNode.querySelector('#bookimg').querySelector('img').getAttribute('_src');
        brief = tempNode.querySelector('#bookintro').innerText;
    }

    if (tempNode.querySelector('.bookcover.hidden-xs')) {
        cover = tempNode.querySelector('.bookcover.hidden-xs').querySelector('img').src;
        brief = tempNode.querySelector('.bookinfo').innerText;
    }

    chrome.runtime.sendMessage({
        Message: 'brief',
        brief,
        cover,
        author: title
    }).then()


}

async function getContent() {
    for (let i = 0; i < chapterList.length; i++) {
        await getContentNext(chapterList[i].name, chapterList[i].href);
        // await getContentNextFrame(chapterList[i].name, chapterList[i].href)
    }
}

async function getContentNext(name, href) {

    // await queueTask();
    // taskActive++;

    try {
        const response1 = await fetch(href);
        const tempBlob = await response1.blob();
        const tempText = await readBlob(tempBlob);
        let body = bodyReg.exec(tempText)[1];
        body = body.replace(delReg, '');
        let tempNode = document.createElement('div');
        tempNode.innerHTML = clearScriptTag(body);

        //说明回到目录或者主页了
        if (tempNode.querySelectorAll('a') > 50) {
            return
        }

        let contentNodes = tempNode.querySelectorAll('span,div,article,p,td');
        for (let j = 0; j < contentNodes.length; j++) {
            if (indexReg.test(contentNodes[j].innerText)) {
                name = indexReg.exec(contentNodes[j].innerText)[0];
                break;
            }
        }

        [].forEach.call(tempNode.querySelectorAll("span,div,ul"), function (item) {
            var thisStyle = tempNode.defaultView ? tempNode.defaultView.getComputedStyle(item) : item.style;
            if (thisStyle && (thisStyle.display === "none" || (item.nodeName === "SPAN" && thisStyle.fontSize === "0px"))) {
                item.innerHTML = "";
            }
        });
        let nextPageMap = [];
        [].forEach.call(tempNode.querySelectorAll('a'), (a) => {
            let isNextPageBtn = a.innerText.match(innerNextPage);
            if (isNextPageBtn && !nextPageMap.includes(a.href) && !chapterHrefMap.includes(a.href)) {
                nextPageMap.push(a.href);
                chapterHrefMap.push(a.href);
                getContentNext(name, a.href);
            }
        })

        let content = tempNode.querySelector('#content') ? tempNode.querySelector('#content').innerHTML : tempNode.querySelector('#rtext') ? tempNode.querySelector('#rtext').innerHTML : ""

        if (!content) {
            let doms = tempNode.querySelectorAll('span,div,article,p,td');
            doms.forEach((item) => {
                if (item.querySelectorAll('p').length > 8) {
                    content = item.innerHTML
                }
            })
        }

        let pushData = {
            name: `第 ${str2Num(name)} 章`,
            href: href,
            content: content,
            guid: uuidv4()
        }

        resultList.push(pushData)

        chrome.runtime.sendMessage({
            Message: 'pushData',
            data: pushData
        }).then()


        tempNode.innerHTML = "";
        tempNode = null;
        await wait(waitNum);
    } catch (e) {
        await wait(3);
        await getContentNext(name, href)
    }

}

function wait(num) {
    return new Promise((r) => {
        setTimeout(() => {
            r(true)
        }, 1000 * num)
    })
}

function clearScriptTag(str) {
    const reg = /<script[^>]*>([\S\s]*?)<\/script>/gim;
    // 清除标签内 相关 xss 安全代码
    const reg1 = /javascript:/gim;
    const reg2 = / *.js/gim;
    if (reg.test(str)) {
        str = str.replace(reg, '');
    }
    if (reg1.test(str)) {
        str = str.replace(reg1, '');
    }
    if (reg2.test(str)) {
        str = str.replace(reg2, '');
    }
    return str;
}

async function startTask() {

    await getAllChapter(document.querySelectorAll('a'));
    chrome.runtime.sendMessage({
        Message: 'chapterLength',
        data: chapterList.length
    }).then()

    await getContent();
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'web',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'start') {
        getBriefAndCover().then();
        if (!isOpen) {
            isOpen = true
            startTask().then();
        } else {
            if (resultList.length > 0) {
                resultList.forEach((r) => {
                    chrome.runtime.sendMessage({
                        Message: 'pushData',
                        data: r
                    }).then()
                })

                chrome.runtime.sendMessage({
                    Message: 'chapterLength',
                    data: chapterList.length
                }).then()
            }
        }
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'asyncWaitNum') {
        waitNum = 2;
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})