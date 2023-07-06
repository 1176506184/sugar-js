var imgData = [];
var user = {};

function getImage() {

    if (location.href.indexOf("fetcherx.com") === -1) {
        imgData.forEach(r => {
            r.author_url = `https://twitter.com/${user.screen_name}`;
            r.resource_link = `https://twitter.com/${user.screen_name}/status/${r.id_str}`;
            r.author_name = user.name
            // r.author_name =
        })

    }

    chrome.runtime.sendMessage({
        Message: 'image',
        data: imgData
    })

}

window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {

        function swiftData(data) {

            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object') {

                    // if (key === 'tweets') {
                    //     Object.keys(data[key]).forEach(k=>{
                    //         if(data[key][k].entities?.media){
                    //             imgData.unshift(data[key][k]);
                    //         }
                    //     })
                    // }
                    // else

                    if (data[key]?.medias?.length && data[key]?._id && data[key]?.user) {
                        imgData.unshift({
                            resource_link: data[key].url,
                            author_url: `https://twitter.com/${data[key].user.username}`,
                            author_name: data[key].user.nickname,
                            full_text: data[key].context,
                            created_at: data[key].ts,
                            id_str: data[key]._id,
                            entities: {
                                media: data[key].medias.map(r => {
                                    return {
                                        media_url_https: r.url
                                    }
                                })
                            }
                        })
                    }

                    if (key === 'tweet_results') {
                        if (data[key]['result']['legacy'].entities?.media) {
                            imgData.unshift(data[key]['result']['legacy']);
                        }
                    } else if (key === 'legacy') {
                        if (data[key]?.name && data[key]?.friends_count) {
                            user = data[key];
                        }
                    } else {

                        if (data[key] !== null && data[key] !== undefined) {
                            swiftData(data[key]);
                        }

                    }

                }
            })

        }

        if (res.data.data) {
            try {
                res.data.data = JSON.parse(res.data.data);
            } catch (e) {

            }
        }

        if (typeof res.data.data === 'object') {
            swiftData(res.data.data);
        }

    }
})


chrome.runtime.onMessage.addListener(async function (Message, sender, sendResponse) {
    if (Message.Message === 'image') {
        getImage();
        sendResponse({state: 200});
    } else if (Message.Message === 'xhr') {
        sendResponse({state: 200});
    } else if (Message.Message === 'checkType') {
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'twitter',
        }).then(r => {

        })
        sendResponse({state: 200});
    } else if (Message.Message === 'getPending') {
        sendResponse({
            state: 200
        });
    }
})
