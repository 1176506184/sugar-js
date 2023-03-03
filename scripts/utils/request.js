let PrivateLink = {
    'trumpet': 'http://23.91.101.251/',
    's':'http://107.150.124.12/'
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
