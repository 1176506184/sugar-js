import { type MountHandleList, type MountHandler } from '../types';

let mountHandleList: MountHandleList = {};
let ActiveId: string = '';

function onMounted(handle: MountHandler) {
  if (!mountHandleList[ActiveId]) {
    mountHandleList[ActiveId] = [];
  }

  mountHandleList[ActiveId].push({
    used: false,
    fun: handle,
  });
}

function updateActiveId(id: string) {
  ActiveId = id;
}

function clearMounted() {
  mountHandleList = {};
}

export { onMounted, mountHandleList, clearMounted, updateActiveId };
