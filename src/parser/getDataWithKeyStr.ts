const eval2 = eval;
export default function getDataWithKeyStr(keyStr,
                                          data: any | null = null,
                                          dataKey: any | null = null,
                                          indexStr: any | null = null,
                                          indexVal: any | null = null) {

    if (!!indexStr && keyStr === indexStr) {
        return indexVal
    }

    keyStr = keyStr.split('.');
    if (dataKey && keyStr[0] !== dataKey) {
        data = null
    }

    try {
        let result = data ? data : window['sugarBulk'][keyStr[0]];
        for (let i = 1; i < keyStr.length; i++) {
            result = result[keyStr[i]];
            if (!result) {
                break;
            }
        }

        return result;
    } catch (e) {
        return "this result is not defined"
    }


}