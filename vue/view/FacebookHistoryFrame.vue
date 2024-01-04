<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <div>
        <span style="font-size: 15px;font-weight: bold;margin-right: 5px">FB专页-历史自动采集</span>
      </div>
    </div>

    <el-form label-position="top" style="height: auto;padding: 20px;">

      <el-form-item label="博主名称">
        <el-input v-model="author" readonly></el-input>
      </el-form-item>

      <el-form-item label="博主链接">
        <el-input v-model="authorLink" readonly></el-input>
      </el-form-item>


      <div v-if="!isHaveBlogger">
        <div style="margin: 30px 0;">
          <span style="color:blue;">库里没有该博主，请点击创建</span>
        </div>
        <div>
          <el-button type="primary" @click="createBlogger">创建</el-button>
        </div>
      </div>
      <div v-if="isHaveBlogger">
        <div style="margin: 30px 0;">
          <span style="color:#00ff04;">已存在该博主：ID:{{blogger_id.value}}</span>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script setup>
import router from "../router";
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import store from "../store/store";
import {dHttp, testHttp, xhrHttp, xHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {handleCopyValue} from "../utils/utils";
import {useRoute} from "vue-router";

const route = useRoute()
const isHaveBlogger = ref(false)
const author = ref("")
const authorLink = ref("")
const blogger_id = ref("")
const collect_count = ref("")
const data = ref([])
const pages = ref([])

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0
})

function createBlogger() {
  isHaveBlogger.value = !isHaveBlogger.value
  // 创建博主接口
}

async function dealYoutubeVideo(Message) {
  if (Message.Message === 'updateActiveId') {
    active_id.value = Message.data;
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
                Message: "history"
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
  } else {
    console.log(Message)
    author.value = Message.author.replace(/\s/g, '');
    authorLink.value = Message.authorLink.replace(/\s/g, '');

    const loadingTask = ElLoading.service({
      lock: true,
      text: '正在查询该博主信息',
      background: 'rgba(0, 0, 0, 0.6)',
    })

    let d = await xHttp(`/BloggerNew/getBloggerNewByNameUrl`, {
      url: authorLink.value,
      name: author.value
    })

    loadingTask.close();

    if (d.state) {
      isHaveBlogger.value = true
    }

  }

}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);

  if (!!route.query.activeId) {
    nextTick(() => {
      console.log(route.query.activeId)
      chrome.tabs.sendMessage(
          parseInt(route.query.activeId),
          {
            Message: "history"
          },
          function (response) {
            if (response?.state !== 200) {
              ElMessage.warning({
                message: '未获取到内容，请重试'
              })
            }
          }
      );
      // 查询库里有没有该博主
    })
  }

})


function close() {
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  window.close();
}


</script>

<style scoped>
:deep(.el-select-v2__placeholder) {
  text-align: left !important;
  cursor: pointer;
}
</style>
