const eval2 = eval;
export default function getDataWithKeyStr(keyStr,
                                          data: any | null = null,
                                          dataKey: any | null = null,
                                          indexStr: any | null = null,
                                          indexVal: any | null = null, appId: any | null = null) {

    if (!!indexStr && keyStr === indexStr) {
        return indexVal
    }

    keyStr = keyStr.split('.');
    if (dataKey && keyStr[0] !== dataKey) {
        data = null
    }

    try {
        let result = data ? data : window[`sugarBulk_${appId}`][keyStr[0]];
        if (keyStr[0] === 'prop') {
            result = eval2(window[`sugarBulkProp_${appId}`]);
        }
        for (let i = 1; i < keyStr.length; i++) {
            result = result[keyStr[i]];
            if (!result) {
                break;
            }
        }

        if (keyStr[0] === 'prop') {
            return eval2(result)
        }

        return result;
    } catch (e) {
        return ""
    }


}

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
            // console.log(result)
            // console.log(eval2(result))
            return result
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
        keyStr = keyArr.splice(0, 1).join(',');
        let result = eval2(window[`sugarBulkProp_${appId}`]);
        let keys = Object.keys(result).toString()
        window[`sugarValues_${appId}`] = result
        return eval2(`(function(${keys}){return ${keyStr}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`)
    }
    let keys = Object.keys(window[`sugarBulk_${appId}`]).toString()
    window[`sugarValues_${appId}`] = Object.values(window[`sugarBulk_${appId}`])
    return eval2(`(function(${keys}){return ${keyStr}}).call(window['sugarBulk_${appId}'],...window['sugarValues_${appId}'])`)
}

export function getKey(keyStr, appId: any | null = null) {


}