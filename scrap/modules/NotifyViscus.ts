import updateDom from "./updateDom"

function NotifyViscus(data, parentKey, viscus, parentKeyStr = "") {

    let _this = this;

    if (parentKeyStr === "" && viscus[parentKey]) {
        console.log("检测到脏值依赖", viscus[parentKey]);
        updateDom.apply(_this, [viscus[(parentKey)], _this.data]);
        return
    }

    console.log("递归数据", (parentKeyStr + parentKey))

    if (viscus[(parentKeyStr + parentKey)]) {
        console.log("检测到脏值依赖", viscus[(parentKeyStr + parentKey)]);
        updateDom.apply(_this, [viscus[(parentKeyStr + parentKey)], _this.data]);
        return
    } else if (typeof data === 'object') {
        parentKeyStr += `${parentKey}.`
        Object.keys(data).forEach(key => {
            NotifyViscus.apply(_this, [data[key], key, viscus, parentKeyStr]);
        })
    }

}

export {NotifyViscus}