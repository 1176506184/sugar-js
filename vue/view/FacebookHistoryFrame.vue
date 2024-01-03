<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <div>
        <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主名称</span>
        <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px" :disabled="false">
          <template #append>可修改</template>
        </el-input>
      </div>
    </div>
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <div>
        <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主链接</span>
        <el-input v-model="authorLink" style="display: inline-flex;flex:1;width: 500px" :disabled="false">
          <template #append>可修改</template>
        </el-input>
      </div>
    </div>

    <el-form label-position="top">
      <div v-if="!isHaveBlogger">
        <span>库里没有该博主，请点击创建</span>
        <div>
          <el-button type="primary" @click="createBlogger">创建</el-button>
        </div>
      </div>
      <div v-if="isHaveBlogger">
        
      </div>
    </el-form>

  </div>
</template>

<script setup>
import router from "../router";
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import store from "../store/store";
import {dHttp, xhrHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {handleCopyValue} from "../utils/utils";
import {useRoute} from "vue-router";

const route = useRoute()
const isHaveBlogger = ref(false)
const author = ref("")
const authorLink = ref("")
const data = ref([])
const ports = ref([])
const categorys = ref([])
const pages = ref([])

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0
})

function createBlogger() {
  isHaveBlogger.value = !isHaveBlogger.value
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
    data.value = Message.data.map((item) => {
      return {
        ...item,
        play: Number(item.play)
      }
    })
    console.log(Message)
    author.value = Message.author
    authorLink.value = Message.authorLink
    console.log(data.value)
  }

}


function getPage() {
  dHttp(`http://gpt.anyelse.com/callback/capturefacebooklist`, {}, 'post', 'application/json').then((res) => {
    pages.value = JSON.parse(res).data.map((item) => {
      return {
        ...item,
        value: item.uid,
        label: item.name + ' - ' + item.uid
      }
    })
  });
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
    })
  }

})


function close() {
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  window.close();
}

const upData = ref([])

const handleSelectionChange = (val) => {
  upData.value = val
}


async function Save() {

  const loadingTask = ElLoading.service({
    lock: true,
    text: '数据上传中',
    background: 'rgba(0, 0, 0, 0.6)',
  })

  let param = {
    ...form,
    dduserid: localStorage.getItem("ddid"),
    videodata: JSON.stringify(upData.value)
  }

  xhrHttp(`http://gpt.anyelse.com/callback/capturefacebooktask`, param, 'post', 'application/json').then((res) => {
    res = JSON.parse(res);
    loadingTask.close();
    if (res.state) {
      alert(res.msg)
    } else {
      alert("创建失败")
    }
  });
}

function copy() {
  let copyText = ``;
  upData.value.forEach((item) => {
    copyText += `${item.url}\n`;
  })
  handleCopyValue(copyText).then(() => {
    ElMessage({
      message: '复制成功.',
      type: 'success',

    })
  });
}

function copyEx() {
  let copyText = ``;
  upData.value.forEach((item) => {
    copyText += `${item.title}\n`;
  })
  handleCopyValue(copyText).then(() => {
    ElMessage({
      message: '复制成功.',
      type: 'success',

    })
  });
}

</script>

<style scoped>
:deep(.el-select-v2__placeholder) {
  text-align: left !important;
  cursor: pointer;
}
</style>
