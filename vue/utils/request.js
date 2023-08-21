const NODE_ENV = process.env.NODE_ENV;
let PrivateLink = {
    'trumpet': 'http://152.32.188.85',
    's': 'http://107.150.124.12/',
    'dataCollect': 'http://test.44finefood.com/'
}

console.log(NODE_ENV)

if (NODE_ENV === 'development') {
    PrivateLink = {
        'trumpet': 'http://192.168.205.34:57968/',
        's': 'http://192.168.205.34:44346',
        'dataCollect': 'http://test.44finefood.com/'
    }
}


function xhrHttp(url, params, type = 'get', content_type = 'application/x-www-form-urlencoded; charset=UTF-8') {
    return new Promise((resolve, reject) => {

        if (content_type === 'application/json') {
            params = JSON.stringify(params)
        }

        $.ajax({
            url: url,
            data: params,
            type: type,
            contentType: content_type
            , success: function (data) {
                resolve(data);
            },
            fail: function (error) {
                reject(error);
            },
            statusCode: {
                403: function () {
                    alert("视频地址已失效,请刷新主页面")
                }
            }
        })
    })
}

function http(url, params, type = 'post') {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: PrivateLink['trumpet'] + url,
            data: params,
            type: type
            , beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", localStorage.getItem("tk"));
            }
            , success: function (data) {
                if (data.StatusCode === 200) {
                    if (data.Message) {
                        if (!data.Data) {
                            data.Data = {};
                        }
                        data.Data.Message = data.Message
                    }
                    resolve(data.Data);
                } else {
                    alert(data.Message);
                    reject(data);
                }
            },
            error: function (res) {
                reject(res);
            }
        })
    })
}


function sHttp(url, params, type = 'post') {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: PrivateLink['s'] + url,
            data: params,
            type: type
            , beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", localStorage.getItem("tk"));
            }
            , success: function (data) {
                if (data.StatusCode === 200) {
                    resolve(data.Data);
                } else {
                    reject(data);
                }
            },
            error: function (res) {
                reject(res);
            }
        })
    })
}

function dHttp(url, params, type = 'post') {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: PrivateLink['dataCollect'] + url,
            data: params,
            type: type,
            headers: {
                "content-type": 'application/json'
            }
            , beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", localStorage.getItem("tk"));
            }
            , success: function (data) {
                if (data.StatusCode === 200) {
                    resolve(data.Data);
                } else {
                    reject(data);
                }
            },
            error: function (res) {
                reject(res);
            }
        })
    })
}


export {
    http,
    xhrHttp,
    sHttp,
    dHttp
}