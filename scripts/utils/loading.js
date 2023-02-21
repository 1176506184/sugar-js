function useLoading(option) {

    let state = false;
    let id = Date.now();
    let el = option && option.el ? (typeof option.el === 'string' ? document.querySelector(option.el) : option.el) : document.body;
    let popup = document.createElement("div");
    popup.id = `p${id}`;
    popup.className = `popup_loading_t_render`;
    popup.innerHTML = `<div class="loading_t_render">
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                                <div class="item_t_render"></div>
                            </div>`;
    el.appendChild(popup);

    function open(time) {
        document.querySelector(`#p${id}`).style.display = "flex";
        setTimeout(() => {
            document.querySelector(`#p${id}`).style.opacity = 1;
        })
        if (time) {
            setTimeout(() => {
                close()
            }, time * 1000)
        }

    }

    function close() {
        document.querySelector(`#p${id}`).style.opacity = 0;
        setTimeout(() => {
            document.querySelector(`#p${id}`).style.display = "none";
        }, 300)
    }


    function addCSS(cssText) {
        var style = document.createElement('style'), //创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        if (style.styleSheet) { //IE
            var func = function () {
                try { //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                } catch (e) {

                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if (style.styleSheet.disabled) {
                setTimeout(func, 10);
            } else {
                func();
            }
        } else { //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        head.appendChild(style); //把创建的style元素插入到head中
    }

    addCSS(`
    
    .popup_loading_t_render {
        background-color:rgba(0,0,0,0.4);align-items: center;justify-content: center;width: 100vw;z-index: 999999;height: 100%;position: fixed;top: 0;left: 0;display: none;opacity: 0;transition:all .3s;pointer-events: none;
    }
    
    .loading_t_render {
            position: absolute;
            /* 居中 */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            /* 高度 */
            height: 40px;
            /* 弹性布局 */
            display: flex;
            /* 设置子项在y轴方向居中，应该是设置起点在中间，非常有用，不然动画很怪 */
            align-items: center;
            pointer-events: none;
        }

        /* 小竖条 */
        .item_t_render {
            height: 50px;
            width: 5px;
            background: white;
            /* 加margin，使竖条之间有空隙 */
            margin: 0px 3px;
            /* 圆角 */
            border-radius: 10px;
            /* 动画：名称、时间、循环 */
            animation: loading 1s infinite;
        }

        /* 设置动画 */
        @keyframes loading {
            0% {
                height: 0px;
            }

            50% {
                height: 50px;
            }

            100% {
                height: 0px;
            }
        }

        /* 为每一个竖条设置延时 */
        .item_t_render:nth-child(2) {
            animation-delay: 0.1s;
        }

        .item_t_render:nth-child(3) {
            animation-delay: 0.2s;
        }

        .item_t_render:nth-child(4) {
            animation-delay: 0.3s;
        }

        .item_t_render:nth-child(5) {
            animation-delay: 0.4s;
        }

        .item_t_render:nth-child(6) {
            animation-delay: 0.5s;
        }

        .item_t_render:nth-child(7) {
            animation-delay: 0.6s;
        }

        .item_t_render:nth-child(8) {
            animation-delay: 0.7s;
        }
    `);

    return {
        open,
        close
    }
}