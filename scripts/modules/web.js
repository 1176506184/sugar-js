const NETWORK = 1;
const NODE = 2;
const LIST = 1;
const ITEM = 2;
const ARTICLE = 3;

let result = []
let articleJson = {}

const list = {
    "https://www.toutiao.com/": {
        type: NETWORK,
        network: "https://www.toutiao.com/api/pc/list/user/feed",
        networkJson: {
            type: LIST,
            key: "data",
            title: ["abstract"],
            href: ["article_url"],
            createTime: ["publish_time"],
            cover: ["image_list", 0, "uri"]
        },
        node: {
            item: function () {
                return document.querySelector("#article .feed-list .s-list").children
            },
            href: function (parentNode) {
                return parentNode.children[0].attributes.url.value
            },
            time: "",
        }
    },
    "https://author.baidu.com/home": {
        type: NODE,
        node: {
            item: function () {
                return document.querySelector("#article .feed-list .s-list").children
            },
            href: function (parentNode) {
                return parentNode?.children[0]?.attributes?.url?.value
            },
            time: "",
        }
    },
    "https://baijiahao.baidu.com/s?": {
        type: ARTICLE,
        node: {
            title: function () {
                return document.querySelector("#header").children[0].innerText
            },
            body: function () {
                return document.querySelector('div [data-testid="article"]').innerHTML;
            },
            href: location.href
        }
    }
}

setInterval(() => {
    Object.keys(list).forEach((key) => {
        if (location.href.indexOf(key) > -1 && list[key].type === NODE) {
            const nodeJson = list[key].node
            const nodes = nodeJson.item()
            Array.from(nodes).forEach(node => {
                if (nodeJson.href(node)) {
                    result.push({
                        href: nodeJson.href(node),
                        isCollect: false
                    })
                }
                result = repeat(result);
            })

        }

        if (location.href.indexOf(key) > -1 && list[key].type === ARTICLE) {
            const nodeJson = list[key].node

            chrome.runtime.sendMessage({
                Message: 'web',
                data: {
                    title: nodeJson.title(),
                    body: nodeJson.body(),
                    href: location.href
                },
            }).then(r => {

            })

            window.close();
        }
    })
    console.log(result)
    result.forEach((r) => {
        if (!r.isCollect) {
            r.isCollect = true
            window.open(r.href)
        }
    })

    if (result.length > 0) {
        scrollBottom()
    }

}, 10000)

window.addEventListener('message', function (res) {
    Object.keys(list).forEach((key) => {
        if (res.data.Message === 'ajax') {
            if (res.data.url && res.data.url.indexOf(list[key].network) > -1) {
                console.log(res.data);
            }
        }
    })
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

