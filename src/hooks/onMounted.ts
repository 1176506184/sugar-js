let mountHandleList = []
export default function (handle) {
    mountHandleList.push({
        used: false,
        fun: handle
    })
}

function clearMounted() {
    mountHandleList = [];
}

export {mountHandleList, clearMounted}