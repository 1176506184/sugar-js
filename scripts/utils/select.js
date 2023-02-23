function useSelect(data) {
    let state = false;
    let dataState = {
        _xy: [0, 0]
    }
    let options = data.options;
    let el = typeof data.el === "string" ? document.querySelector(data.el) : data.el;
    let jel = $(el);
    dataState['xy'] = [(el.offsetTop + el.clientHeight), el.offsetLeft];
    let select = document.createElement("div");
    select.id = Date.now().toString();
    select.style.cssText = `display: none;top:${dataState['xy'][0] + 10}px;left: ${dataState['xy'][1]}px;position: fixed;z-index: 9;width: 120px;min-height: 50px;background-color: #fff;box-shadow: 3px 3px 6px #cdcdcd`

    options.forEach(o => {
        let div = document.createElement("div");
        div.style.cssText = `width:100%;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#333`
        div.innerText = o.label;
        div.addEventListener('click', o.handle);
        select.appendChild(div);
    })

    Object.defineProperty(dataState, 'xy', {
        get() {
            return this._xy
        },
        set(newVal) {
            this._xy = newVal;
            select.style.cssText = `display: none;top:${dataState['xy'][0] + 10}px;left: ${dataState['xy'][1]}px;position: fixed;z-index: 9;width: 130px;min-height: 30px;background-color: #fff;box-shadow: 3px 3px 6px #cdcdcd`
        }
    })

    function open() {
        dataState['xy'] = [(el.offsetTop + el.clientHeight), el.offsetLeft];
        select.style.display = "block"
    }

    function close() {
        select.style.display = "none"
    }

    document.body.appendChild(select);

    el.addEventListener('click', function (e) {
        state = !state;
        if (state) {
            open()
        } else {
            close()
        }

        e.stopPropagation();

    })

    document.body.addEventListener('click', function () {
        if (state) {
            state = !state;
            close()
        }
    })

    return {
        open,
        close
    }

}