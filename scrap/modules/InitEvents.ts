import eventCenter from "./eventCenter";

function InitEvents(eventArr: any) {

    let _this = this;
    Object.keys(_this.eventArr).forEach(key => {

        Object.keys(_this.eventArr[key]).forEach(keyE => {

            if (eventCenter.getEvent(key, keyE)) {
                return;
            } else if (keyE === 's-click') {
                // console.log("是否绑定事件",directive)
                let handle = _this.methods[_this.eventArr[key][keyE]];
                eventCenter.pushEvent(key, key, handle);
                document.querySelector(`[s-guid="${key}"]`).addEventListener('click', (...args) => {
                    handle.apply(_this, args);
                });
            } else if (keyE === 's-change') {
                let handle = _this.methods[_this.eventArr[key][keyE]];
                eventCenter.pushEvent(key, key, handle);
                document.querySelector(`[s-guid="${key}"]`).addEventListener('input', (...args) => {
                    handle.apply(_this, args);
                });
            }
        })

    })

}


export default InitEvents