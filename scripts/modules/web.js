const NETWORK = 1;
const NODE = 2;
const LIST = 1;
const ITEM = 2;
const ARTICLE = 3;
let result = []
let timer = null;
const ajaxData = []

const list = {
    "https://dogblog.com/?s=dog": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll("article")
            },
            href: function (parentNode) {
                return parentNode.querySelector('.entry-title').children[0].href
            },
            title: function (parentNode) {
                return parentNode.querySelector('.entry-title').children[0].innerText
            },
            time: null,
            play: null,
            nextPage: function () {
                return document.querySelector('.masonry-load-more.load-more.has-svg-icon').children[0]
            }
        }
    },
    "https://etcanada.com/?s=Mariska+Hargitay&video-search=0": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('.is-active .media-object');
            },
            href: function (parentNode) {
                return parentNode.querySelector('.media-object-link').href
            },
            title: function (parentNode) {
                return parentNode.querySelector('.headline').innerText
            },
            time: null,
            play: null,
            nextPage: function () {
                return document.querySelector('button.load-more')
            }
        }
    },
    "https://ew.com/search/?q=grey+anatomy": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('div[data-tracking-zone="search-results"] div[role="listitem"]')
            },
            href: function (parentNode) {
                return parentNode.querySelector('a.searchResult__titleLink').href;
            },
            title: function (parentNode) {
                return parentNode.querySelector('span.searchResult__titleLinkText').innerText;
            },
            time: null,
            play: null,
            nextPage: null
        }
    },
    "https://fandomwire.com/?s=scarlett+johnson": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('div.g1-row-inner div[id="primary"] .g1-collection-item article');
            },
            href: function (parentNode) {
                return parentNode.querySelector('a[rel="bookmark"]').href;
            },
            title: function (parentNode) {

                let title = parentNode.querySelector('h3.entry-title')?.innerText;
                if (!title) {
                    title = parentNode.querySelector('h2.entry-title').innerText;
                }
                return title
            },
            time: function (parentNode) {
                return parentNode.querySelector('time').getAttribute('datetime')
            },
            play: null,
            nextPage: function () {
                return document.querySelector('div.g1-collection-more a')
            }
        }
    },
    "https://madlyodd.com/category/feed-pets/": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('ul.g1-collection-items li.g1-collection-item article')
            },
            href: function (parentNode) {
                return parentNode.querySelector('h3.entry-title a').href
            },
            title: function (parentNode) {
                return parentNode.querySelector('h3.entry-title').innerText;
            },
            time: null,
            play: function (parentNode) {

                let play = parentNode.querySelector('.entry-views strong').innerText;
                if (play.indexOf('k')) {
                    play = play.replace(/[^\d.]/ig, "");
                    play = play * 1000;
                }
                return play
            },
            nextPage: null
        }
    },
    "https://www.faithpot.com/category/news": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('main article');
            },
            href: function (parentNode) {
                return parentNode.querySelector('a').href;
            },
            title: function (parentNode) {
                return parentNode.querySelector('h2.entry-title').innerText;
            },
            time: null,
            play: null,
            nextPage: function () {
                return document.querySelector('div.masonry-load-more.load-more.has-svg-icon a')
            }
        }
    },
    "https://www.tvinsider.com/show/blue-bloods/": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('div.records a.records-item');
            },
            href: function (parentNode) {
                return parentNode.href;
            },
            title: function (parentNode) {
                return parentNode.querySelector('h3').innerText;
            },
            time: null,
            play: null,
            nextPage: function () {
                return document.querySelector('button.alm-load-more-btn.more')
            }
        }
    },
    "https://www.onemillionarticle.com": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelectorAll('article.post-amp.post.hentry.h-entry')
            },
            href: function (parentNode) {
                return parentNode.querySelector('a').href
            },
            title: function (parentNode) {
                return parentNode.querySelector('h2').innerText
            },
            time: null,
            play: null,
            nextPage: function () {
                return document.querySelector('#loadMorePosts')
            }
        }
    }
}

function startTask() {
    console.log("开始采集")
    timer = setInterval(() => {
        Object.keys(list).forEach((key) => {

            if (location.href.indexOf(key) > -1 && list[key].type === NODE) {
                const nodeJson = list[key].node
                const nodes = nodeJson.item()
                Array.from(nodes).forEach(node => {
                    if (nodeJson.href(node)) {
                        result.push({
                            href: nodeJson.href(node),
                            title: nodeJson.title(node),
                            isCollect: false,
                            play: nodeJson.play ? nodeJson.play(node) : 0,
                            time: nodeJson.time ? nodeJson.time(node) : ''
                        })
                    }
                    // if(list[key].node.nextPage !== null){
                    //     node.remove();
                    // }
                    result = repeat(result);
                })


                if (list[key].node.nextPage !== null) {
                    scrollBottom();
                    list[key].node.nextPage()?.click();
                    if (!list[key].node.nextPage()) {
                        chrome.runtime.sendMessage({
                            Message: 'finish',
                            type: 'web'
                        }).then(r => {

                        })
                    }


                } else {
                    scrollBottom();
                }

            }

        })
        console.log(result);
        chrome.runtime.sendMessage({
            Message: 'web',
            data: result,
        }).then(r => {

        })

    }, 5000)
}

window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {
        // if (res.data.url && res.data.url.indexOf(list[key].network) > -1) {
        //     console.log(res.data);
        // }
        ajaxData.push(res.data);
    }
})

function repeat(array) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i].href === array[j].href) {
                array.splice(j, 1);
                j--;
            }
        }
    }
    return array
}

function scrollBottom() {
    window.scrollTo(0, document.documentElement.scrollHeight)
}

function finishTask() {
    clearInterval(timer);
    timer = null
}


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'web',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'getOrigin') {

        chrome.runtime.sendMessage({
            Message: 'Origin',
            type: 'web',
            data: location.origin
        }).then(r => {

        })

        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'startTask') {
        startTask();
        sendResponse({
            state: 200
        });
    } else if (Message.Message === 'finishTask') {
        finishTask();
        sendResponse({
            state: 200
        });
    }
})

function createFunction(code, params) {
    return new Function(...params, code)
}



