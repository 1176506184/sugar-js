var imgData = [];

function getImage() {

    console.log(imgData)

}

window.addEventListener('message', function (res) {
    if (res.data.Message === 'ajax') {

        function swiftData(data) {

            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object') {

                    if (key === 'tweets') {
                        Object.keys(data[key]).forEach(k=>{
                            imgData.push(data[key][k]);
                        })
                    } else if(key === 'tweet_results'){
                        imgData.push(data[key]['result']['legacy']);
                    }else {

                        if(data[key] !==null && data[key] !==undefined){
                            swiftData(data[key]);
                        }

                    }

                }
            })

        }

        if (res.data.data) {
            try{
                res.data.data = JSON.parse(res.data.data);
            }catch (e) {

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
    }else if (Message.Message === 'checkType'){
        chrome.runtime.sendMessage({
            Message: 'initBtn',
            type: 'twitter',
        }).then(r => {

        })
        sendResponse({state: 200});
    }
})
