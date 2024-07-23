<template>
  <div
      style="height: auto;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;border-bottom: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px">
        <template #append>
          <el-button @click="getNextCollect">
            采集
          </el-button>
        </template>
      </el-input>
    </div>
    <el-form label-position="top" style="height: auto;padding: 20px;">
    </el-form>

  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref, nextTick} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";
import {DIR, getNowDate, guid} from "../utils/utils";

const data = ref({})
const author = ref("")
const lastGetAuthor = ref("");
let pageObj = {}

async function getNextCollect() {

  let timeStamp = (new Date()).getTime();
  let data = await xhrHttp('http://121.199.14.173:8080/tictok/GetMirrorTaskTest?v=' + timeStamp + '&author_id=7051853387402576902', {}, 'post');
  if (data['errorCode'] === -1) {
    ElMessage.error("获取任务失败")
  }

  author.value = data.homepage;
  lastGetAuthor.value = data.homepage;
  pageObj = data;

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
      }
  );

}

function sendTask(tab, data) {
  return new Promise((r, j) => {
    chrome.tabs.sendMessage(
        tab.id,
        {
          Message: "video_frame",
          nextHref: data.homepage
        },
        function (response) {
          console.log(response)
          if (response?.state === 200 && !response.isCollected) {
            r(1)
          } else {
            r(-1)
          }
        }
    );
  })
}

function dealYoutubeVideo(Message) {
  if (Message.Message === 'tiktokFrame') {
    data.value = Message.data;
    try {
      let callBackUrl = 'http://121.199.14.173:8080/tictok/CallBack';
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

      })
    } catch (e) {
      console.log(e)
    }
  }
}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);
})

</script>

<style scoped>

</style>
