const eval2 = eval;

export function getDataWithKey(keyStr, appId: any | null = null) {

    try {
        let keyArr = keyStr.split('.');
        if (keyArr[0] === 'prop') {
            keyArr.splice(0, 1)
            keyStr = keyArr.join(',');
            let result = window[`sugarBulkProp_${appId}`];
            let keys = Object.keys(result).toString()
            window[`sugarValues_${appId}`] = Object.values(result)
            result = eval2(`(function(${keys}){return ${keyStr}}).call(window['sugarBulkProp_${appId}'],...window['sugarValues_${appId}'])`);
            return eval2(result)
        }
        let keys = Object.keys(window[`sugarBulk_${appId}`]).toString()
        window[`sugarValues_${appId}`] = Object.values(window[`sugarBulk_${appId}`])
        return eval2(`(function(${keys}){return ${keyStr}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`)
    } catch (e) {
        return ""
    }

}


export function getDataWithKeyExtra(keyStr, appId: any) {


    let keyArr = keyStr.split('.');
    if (keyArr[0] === 'prop') {
        keyStr = keyStr.replace('prop.', '');
        let result = window[`sugarBulkProp_${appId}`];
        let keys = Object.keys(result).toString()
        window[`sugarValues_${appId}`] = Object.values(result);
        return eval2(eval2(`(function(${keys}){return ${keyStr}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`))
    }
    let keys = Object.keys(window[`sugarBulk_${appId}`]).toString()
    window[`sugarValues_${appId}`] = Object.values(window[`sugarBulk_${appId}`])
    return eval2(`(function(${keys}){return ${keyStr}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`)
}
