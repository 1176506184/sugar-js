let mountHandleList = {}
let ActiveId = '';

export default function (handle) {

    if (!mountHandleList[ActiveId]) {
        mountHandleList[ActiveId] = []
    }

    mountHandleList[ActiveId].push({
        used: false,
        fun: handle
    })
}

function updateActiveId(id){
    ActiveId = id;
}

function clearMounted() {
    mountHandleList = [];
}

export {mountHandleList, clearMounted, updateActiveId}