let PrivateLink = {
    'trumpet': 'http://23.91.101.251/',
    // 'trumpet': 'http://192.168.205.34:57968/',
    's': 'http://107.150.124.12/'
}


function xhrHttp(url, params, type = 'get') {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            data: params,
            type: type
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
