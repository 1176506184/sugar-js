import {NotifyViscus} from "./NotifyViscus";

function patchData(oldData, newData, viscusArr) {
    console.log("start：脏值变化检测", oldData, newData)
    let _this = this;
    Object.keys(newData).forEach(key => {

        if(!diff(newData[key],oldData[key])){
            console.log("检测到了脏值变化", key)
            console.log("开始查询脏值依赖")
            NotifyViscus.apply(_this, [newData[key], key, viscusArr]);
        }

    })

}

function diff(obj1, obj2) {
    var o1 = obj1 instanceof Object;
    var o2 = obj2 instanceof Object;
    // 判断是不是对象
    if (!o1 || !o2) {
        return obj1 === obj2;
    }

    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,
    //例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    for (var o in obj1) { // 遍历对象 fon in 循环 o 为 对象的属性名
        var t1 = obj1[o] instanceof Object;
        var t2 = obj2[o] instanceof Object;
        if (t1 && t2) {
            return diff(obj1[o], obj2[o]);
        } else if (obj1[o] !== obj2[o]) {
            console.log('false')
            return false;
        }
    }
    return true;
}



export default patchData