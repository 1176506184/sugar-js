var ajax_tools_space = {
    ajaxToolsSwitchOn: true,
    ajaxToolsSwitchOnNot200: true,
    ajaxDataList: [],
    originalXHR: window.XMLHttpRequest,
    // "/^t.*$/" or "^t.*$" => new RegExp
    strToRegExp: (regStr) => {
        let regexp = '';
        const regParts = regStr.match(new RegExp('^/(.*?)/([gims]*)$'));
        if (regParts) {
            regexp = new RegExp(regParts[1], regParts[2]);
        } else {
            regexp = new RegExp(regStr);
        }
        return regexp;
    },
    getOverrideText: (responseText, args) => {
        let overrideText = responseText;
        try {
            const data = JSON.parse(responseText);
            if (typeof data === 'object') {
                overrideText = responseText;
            }
        } catch (e) {
            // const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            // const returnText = await (new AsyncFunction(responseText))();
            const returnText = (new Function(responseText))(args);
            if (returnText) {
                overrideText = typeof returnText === 'object' ? JSON.stringify(returnText) : returnText;
            }
        }
        return overrideText;
    },
    getRequestParams: (requestUrl) => {
        if (!requestUrl) {
            return null;
        }
        const paramStr = requestUrl.split('?').pop();
        const keyValueArr = paramStr.split('&');
        let keyValueObj = {};
        keyValueArr.forEach((item) => {
            // 保证中间不会把=给忽略掉
            const itemArr = item.replace('=', '〓').split('〓');
            const itemObj = {[itemArr[0]]: itemArr[1]};
            keyValueObj = Object.assign(keyValueObj, itemObj);
        });
        return keyValueObj;
    },
    myXHR: function () {
        const modifyResponse = () => {
            const interfaceList = [];
            ajax_tools_space.ajaxDataList.forEach((item) => {
                interfaceList.push(...(item.interfaceList || []));
            });
            const [method, requestUrl] = this._openArgs;
            const queryStringParameters = ajax_tools_space.getRequestParams(requestUrl);
            const [requestPayload] = this._sendArgs;
            interfaceList.forEach(({open = true, matchType = 'normal', matchMethod, request, responseText}) => {
                const matchedMethod = !matchMethod || matchMethod === method.toUpperCase();
                if (open && matchedMethod) {
                    let matched = false;
                    if (matchType === 'normal' && request && this.responseURL.includes(request)) {
                        matched = true;
                    } else if (matchType === 'regex' && request && this.responseURL.match(ajax_tools_space.strToRegExp(request))) {
                        matched = true;
                    }
                    if (matched && responseText) {
                        const funcArgs = {
                            method,
                            payload: {
                                queryStringParameters,
                                requestPayload
                            },
                            originalResponse: this.responseText
                        };
                        const overrideText = ajax_tools_space.getOverrideText(responseText, funcArgs);
                        this.responseText = overrideText;
                        this.response = overrideText;
                        if (ajax_tools_space.ajaxToolsSwitchOnNot200) { // 非200请求如404，改写status
                            this.status = 200;
                        }
                    }
                }
            });
        }

        const xhr = new ajax_tools_space.originalXHR;
        for (let attr in xhr) {
            if (attr === 'onreadystatechange') {
                xhr.onreadystatechange = (...args) => {
                    // 下载成功
                    if (this.readyState === this.DONE) {
                        // 开启拦截
                        modifyResponse();
                    }
                    this.onreadystatechange && this.onreadystatechange.apply(this, args);
                }
                this.onreadystatechange = null;
                continue;
            } else if (attr === 'onload') {
                xhr.onload = (...args) => {
                    // 开启拦截
                    let currentTarget = args[0].currentTarget;
                    window.postMessage({
                        Message: 'ajax',
                        url: currentTarget.responseURL,
                        data: currentTarget.response
                    })

                    // console.log(currentTarget.responseURL,currentTarget.response)

                    // modifyResponse();
                    this.onload && this.onload.apply(this, args);
                }
                this.onload = null;
                continue;


            } else if (attr === 'open') {
                this.open = (...args) => {
                    this._openArgs = args;
                    xhr.open && xhr.open.apply(xhr, args);
                }
                continue;
            } else if (attr === 'send') {
                this.send = (...args) => {
                    this._sendArgs = args;
                    xhr.send && xhr.send.apply(xhr, args);
                }
                continue;
            }
            if (typeof xhr[attr] === 'function') {
                this[attr] = xhr[attr].bind(xhr);
            } else {
                // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
                if (attr === 'responseText' || attr === 'response' || attr === 'status') {
                    Object.defineProperty(this, attr, {
                        get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
                        set: (val) => this[`_${attr}`] = val,
                        enumerable: true
                    });
                } else {
                    Object.defineProperty(this, attr, {
                        get: () => xhr[attr],
                        set: (val) => xhr[attr] = val,
                        enumerable: true
                    });
                }
            }

        }
    },
    originalFetch: window.fetch.bind(window),
    myFetch: async function (...args) {

        let [resource, config] = args;
        const response = await ajax_tools_space.originalFetch(resource, config);
        try {
            if (response.url.includes("www.tiktok.com")) {
                if (response.url.includes("/api/post/item_list")) {
                    try {
                        let data = await response.clone().json()
                        window.postMessage({
                            Message: 'ajax',
                            url: response.url,
                            data: data
                        })
                    } catch (e) {

                    }
                }
            } else {
                let data = await response.clone().json()
                window.postMessage({
                    Message: 'ajax',
                    url: response.url,
                    data: data
                })
            }

        } catch (e) {

        }
        // response interceptor here
        return response;

        // return ajax_tools_space.originalFetch(...args).then(async (response) => {
        //     try {
        //         if (response.url.includes("www.tiktok.com")) {
        //             if(response.url.includes("/api/post/item_list")){
        //                 let data = await response.clone().json()
        //                 window.postMessage({
        //                     Message: 'ajax',
        //                     url: response.url,
        //                     data: data
        //                 })
        //             }
        //         } else {
        //             let data = await response.clone().json()
        //             window.postMessage({
        //                 Message: 'ajax',
        //                 url: response.url,
        //                 data: data
        //             })
        //         }
        //
        //     } catch (e) {
        //
        //     }
        //     return response;
        // })
    }
}
if (location.href.indexOf('instagram') !== -1 || location.href.indexOf('douyin') !== -1 || location.href.indexOf('twitter') !== -1 || location.href.indexOf('toutiao') !== -1 || location.href.indexOf('sohu') !== -1 || location.href.indexOf('youtube') !== -1
    || location.href.indexOf('facebook') !== -1 || location.href.indexOf('youtube') !== -1 || location.href.indexOf('tiktok') !== -1 || location.href.indexOf('ce.xinli001.com') !== -1 || location.href.indexOf('pinterest') !== -1
    || location.href.indexOf('ixigua') !== -1 || location.href.indexOf('isee.weishi.qq.com') !== -1) {

    if (location.href.indexOf('twtest.anyelse.com') === -1) {
        window.fetch = ajax_tools_space.myFetch;
        if (location.href.indexOf('douyin') !== -1 || location.href.indexOf('isee.weishi.qq.com') !== -1) {
            var XHR = XMLHttpRequest.prototype
            var open = XHR.open;
            var send = XHR.send;
            XHR.send = function (postData) {
                setTimeout(() => {
                    if (this._url && (this._url.includes("aweme/v1/web/aweme/post/?device_platform=webapp") || this._url.includes("/aweme/v1/web/tab/feed/?device_platform=webapp"))) {
                        window.postMessage({
                            Message: 'ajax',
                            url: this.responseURL,
                            data: this.responseText
                        })
                    }
                }, 7000)

                this.addEventListener("load", function (e) {
                    try {
                        window.postMessage({
                            Message: 'ajax',
                            url: e.currentTarget.responseURL,
                            data: e.currentTarget.responseText
                        })
                    } catch (error) {

                    }
                })
                return send.apply(this, arguments);
            }
        } else {
            window.XMLHttpRequest = ajax_tools_space.myXHR;
        }
        console.log("注入XHR 完成")
    } else {
        console.log("不注入")
    }

}



