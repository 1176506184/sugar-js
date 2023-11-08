let mountHandleList = {};
let ActiveId = '';

function onMounted (handle) {
  if (!mountHandleList[ActiveId]) {
    mountHandleList[ActiveId] = [];
  }

  mountHandleList[ActiveId].push({
    used: false,
    fun: handle
  });
}

function updateActiveId (id) {
  ActiveId = id;
}

function clearMounted () {
  mountHandleList = [];
}

export { onMounted, mountHandleList, clearMounted, updateActiveId };
