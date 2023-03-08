function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function queryURLParams(url) {
    let pattern = /(\w+)=(\w+)/ig; //定义正则表达式
    let parames = {}; // 定义参数对象
    url.replace(pattern, ($, $1, $2) => {
        parames[$1] = $2;
    });
    return parames;
}



function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


function GetQueryString(name) {
    var r = location.href.split('?'); //获取url中"?"符后的字符串并正则匹配
    var rr = r[1].split('&');
    var result = "";
    for(var i in rr){
        var rrr = rr[i].split("=");
        if(rrr[0] === name){
            result =rrr[1];
        }
    }
    return result;
}

export {
    guid,
    queryURLParams,
    GetRequest,
    GetQueryString
}