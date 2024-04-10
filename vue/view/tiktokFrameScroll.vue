<template>
  <div
      style="height: auto;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;border-bottom: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #append>采集中</template>
      </el-input>
    </div>

    <el-form label-position="top" style="height: auto;padding: 20px;">

      <el-form-item label="进程唯一ID">
        <el-input v-model="tiktokGuid" readonly></el-input>
      </el-form-item>

      <el-form-item label="上次采集时间">
        <el-input v-model="lastGetTime" readonly></el-input>
      </el-form-item>

      <el-form-item label="上次采集博主">
        <el-input v-model="lastGetAuthor" readonly></el-input>
      </el-form-item>

      <el-form-item label="获取新任务倒计时">
        <el-input v-model="timeValue" readonly></el-input>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref, nextTick} from "vue";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";
import {getNowDate, guid} from "../utils/utils";

const isError = ref(false);
const tiktokGuid = guid();
const route = useRoute()
const data = ref({})
const AllData = ref([])
const author = ref("")
const title = ref("")
const active_id = ref("")
let active_page = null;
const loading = ref(false)
const textData = computed(() => {
  return JSON.stringify(active_page);
})
const lastGetTime = ref("");
const lastGetAuthor = ref("");
const pageMap = new Map();
let restartArr = [];
const uid = ref(0);


const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: '',
  needProcess: 0
})

const timeInterval = 1000 * 60 * 40;
let lastTimeStamp = 0;
let lastUpDataTimeStamp = 0;
const timeValue = ref(timeInterval / 1000 * 2);

setInterval(() => {
  timeValue.value -= 1;
}, 1000)

setInterval(() => {
  timeValue.value = timeInterval / 1000 * 2;
  chrome.tabs.query(
      {},
      function (tabs) {
        tabs.map((tab) => {
          if (!tab.url.includes('out.html#/TiktokFrame') && tab.url.includes('tiktok.com')) {
            uid.value += 1;
            getNextCollect(uid.value)
          }
        })
      });
}, timeInterval * 2)

async function getNextCollect(u) {

  if (u !== uid.value) {
    return
  }

  let data = {}
  try {
    if (active_page) {
      data = active_page;
    } else {
      lastGetTime.value = getNowDate();
      timeValue.value = timeInterval / 1000 * 2;
      data = await xhrHttp('http://101.201.222.226/tictok/GetMirrorOldTask', {}, 'post');
    }
  } catch (e) {
    setTimeout(() => {
      getNextCollect(u);
    }, timeInterval)
    return
  }

  if (data['errorCode'] === -1) {
    setTimeout(() => {
      getNextCollect(u);
    }, timeInterval)
    return;
  }

  if (restartArr.length === 0 || restartArr[0] === data.homepage) {
    restartArr.push(data.homepage);
  }

  if (restartArr.length >= 3) {
    restartArr = [];
    active_page = null;
    await nextUrl(data.homepage);
    await getNextCollect(u);
    return
  }

  author.value = data.homepage;
  active_page = data;
  lastGetAuthor.value = data.homepage;

  if (pageMap.get(data.homepage)) {
    setTimeout(() => {
      active_page = null;
      getNextCollect(u);
    }, timeInterval)
    return
  }

  pageMap.set(data.homepage, {
    page_id: data.page_id,
    homepage: data.homepage,
    author_id: data.author_id,
    log_id: data.log_id
  })

  chrome.tabs.query(
      {},
      async function (tabs) {
        for (let i = tabs.length - 1; i >= 0; i--) {
          let tab = tabs[i];
          if (!tab.url.includes('out.html#/TiktokFrame') && tab.url.includes('tiktok')) {
            let result = await sendTask(tab, data);
            if (result === 1) break;
          }
        }

        setTimeout(() => {
          getNextCollect(u);
        }, timeInterval)

      }
  );

}

function sendTask(tab, data) {
  return new Promise((r, j) => {
    chrome.tabs.sendMessage(
        tab.id,
        {
          Message: "video_frame",
          Scroll: true,
          nextHref: data.homepage
        },
        function (response) {
          console.log(response)
          if (response?.state === 200 && !response.isCollected) {
            active_page = null
            restartArr = [];
            r(1)
          } else {
            r(-1)
          }
        }
    );
  })
}

function dealYoutubeVideo(Message) {
  console.log(Message)
  if (Message.Message === 'tiktokFrame') {
    data.value = Message.data;
    try {
      var pageObj = pageMap.get(Message.homepage);
      if (!pageObj) {
        getNextCollect(uid.value);
        return;
      }

      let callBackUrl = 'http://101.201.222.226/tictok/CallBackForMirrorOld';
      lastTimeStamp = parseInt((new Date()).getTime() / 1000);

      xhrHttp(callBackUrl, {
        ...data.value,
        itemList: data.value.itemList?.map((item) => {
          let authorId = item.authorId;
          if (!authorId && item.author) {
            authorId = item.author.id
          }
          return {
            ...item,
            authorId
          }
        }),
        page_id: pageObj.page_id,
        author_id: pageObj.author_id,
        homepage: pageObj.homepage,
        log_id: pageObj.log_id,
        statusCode: 0
      }, 'post', 'application/json').then(() => {
        pageMap.delete(Message.homepage);
      })
    } catch (e) {
      console.log(e)
    }
  }
}

async function nextUrl(homepage) {
  lastUpDataTimeStamp = (new Date()).getTime();
  let callBackUrl = 'http://101.201.222.226/tictok/CallBackForMirrorOld';
  var pageObj = pageMap.get(homepage);
  xhrHttp(callBackUrl, {
    ...data.value,
    itemList: [],
    page_id: pageObj.page_id,
    author_id: pageObj.author_id,
    homepage: pageObj.homepage,
    log_id: pageObj.log_id,
    statusCode: 0
  }, 'post', 'application/json').then(() => {
    pageMap.delete(Message.homepage);
  })

}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);
  nextTick(() => {
    getNextCollect(uid.value)
  })
})

function close() {
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  window.close();
}


</script>

<style scoped>

</style>
