let BaseUrl = 'http://192.168.205.34:57968/';

function http(url, params, type = 'post') {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: BaseUrl + url,
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
