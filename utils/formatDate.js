function parseDate(times) {
    //日期
    times = new Date(times * 1000);
    let DD = String(times.getDate()).padStart(2, '0'); // 获取日
    let MM = String(times.getMonth() + 1).padStart(2, '0'); //获取月份，1 月为 0
    let yyyy = times.getFullYear(); // 获取年

    // 时间
    let hh = String(times.getHours()).padStart(2, '0');       //获取当前小时数(0-23)
    let mm = String(times.getMinutes()).padStart(2, '0');     //获取当前分钟数(0-59)
    let ss = String(times.getSeconds()).padStart(2, '0');     //获取当前秒数(0-59)
    return yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss;
}

export {
    parseDate
}