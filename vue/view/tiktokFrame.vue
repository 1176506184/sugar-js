<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #append>采集中</template>
      </el-input>
    </div>

    <el-form label-position="top" style="height: calc(100vh - 57px);">
      <div style="padding: 0 10px 10px;">
        <el-table :data="data" style="flex:1;height:calc(100vh - 80px)">
          <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

          <el-table-column label="视频标题" width="500">
            <template #default="{ row }">
              {{ row.title }}
            </template>
          </el-table-column>

          <el-table-column label="播放量" prop="playCount" sortable :sort-orders="['descending','ascending',null]">
          </el-table-column>

        </el-table>
      </div>
    </el-form>

  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref, nextTick} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";

const route = useRoute()
const data = ref([])
const AllData = ref([])
const author = ref("")
const title = ref("")
const active_id = ref("")
const loading = ref(false)

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: '',
  needProcess: 0
})

async function getNextCollect() {
  console.log(active_id.value)
  let data = await xhrHttp('http://121.199.14.173:8080/tictok/GetMirrorTask', {}, 'post');
  author.value = data.homepage;
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        console.log(active_id.value)
        chrome.tabs.sendMessage(
            parseInt(active_id.value),
            {
              Message: "video_frame",
              nextHref: data.homepage
            },
            function (response) {
              if (response?.state !== 200) {

              }
            }
        );
      }
  );

}


function dealYoutubeVideo(Message) {

  if (Message.Message === 'updateActiveId') {
    active_id.value = Message.data;
    console.log(active_id.value)
    chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          console.log(active_id.value)
          chrome.tabs.sendMessage(
              active_id.value,
              {
                Message: "video_frame"
              },
              function (response) {
                if (response?.state !== 200) {
                  ElMessage.warning({
                    message: '未获取到内容，请重试'
                  })
                }
              }
          );
        }
    );

    return
  } else if (Message.Message === 'tiktokFrame') {
    data.value = Message.data;
    setTimeout(() => {
      getNextCollect()
    }, 3000)
  }


}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);

  if (!!route.query.activeId) {
    active_id.value = route.query.activeId;
    nextTick(() => {
      getNextCollect()
    })
  }
})

function close() {
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  window.close();
}

async function Save() {

}

</script>

<style scoped>

</style>
