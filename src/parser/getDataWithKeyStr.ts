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
        return "this result is not defined"
    }


}

export function getDataWithKey(keyStr, appId: any | null = null) {

    try {
        keyStr = keyStr.split('.');
        let result = window[`sugarBulk_${appId}`][keyStr[0]];
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
        return "this result is not defined"
    }


}

export function getKey(keyStr, appId: any | null = null) {


}