
function http(url, type = 'post') {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: type
            , beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", localStorage.getItem("tk"));
            }
            , success: function (data) {
                if (data.State === 200) {
                    resolve(data.data);
                } else {

                }
            }
        })
    })
}