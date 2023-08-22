export function makeMap(
    str: string,
    expectsLowerCase?: boolean
): (key: string) => true | undefined {
    const map = Object.create(null)
    const list: Array<string> = str.split(',')
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
    }
    return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val]
}


export function escape2Html(str) {

    var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};

    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {

        return arrEntities[t];

    });

}


//生成不重复11位序列号
export function serial_num_11() {
    let d = new Date();
    let year: any = d.getFullYear();
    let month: any = d.getMonth() + 1;
    let date: any = d.getDate();
    let day = d.getDay();
    year = (year + "").substring(2);
    if (month <= 9) {
        month = "0" + month;
    } else if (date <= 9) {
        date = "0" + date;
    }
    //获取当日凌晨0:00:00（零时整）
    let startTime: any = parseInt(String(new Date(new Date().toLocaleDateString()).getTime()));
    //获取当日23:59:59
    let endTime = startTime + (24 * 60 * 60 * 1000 - 1);
    //获取当前时间戳
    let currentTime = parseInt(String(new Date().getTime()));
    let remainTime = parseInt(String((parseInt(endTime) - parseInt(String(currentTime))) / 1000));
    let time;
    if (parseInt(String(currentTime)) > parseInt(startTime)) {
        if (remainTime < 10) {
            time = "0000" + remainTime.toString();
        }
        if (remainTime < 100 && remainTime >= 10) {
            time = "000" + remainTime.toString();
        }
        if (remainTime < 1000 && remainTime >= 100) {
            time = "00" + remainTime.toString();
        }
        if (remainTime < 10000 && remainTime >= 1000) {
            time = "0" + remainTime.toString();
        }
        if (remainTime >= 10000) {
            time = remainTime.toString();
        }
        var id = year + month + date + time;
        return id;
    }

}

export function StartsWith(name: any, key) {
    return name.startsWith(key);
}