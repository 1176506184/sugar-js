<template>
  <div
      style="height: auto;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;border-bottom: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #append>
          <el-button
              type="primary"
              size="mini"
              @click="sendTask"
              :loading="loading"
          >
            {{ collectStatus === 0 ? '开始采集' : collectStatus === 1 ? '采集中' : '采集成功' }}
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, nextTick} from "vue";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";
import {ElMessage} from "element-plus";

const isError = ref(false);
const route = useRoute()
const data = ref({})
const AllData = ref([])
const author = ref('')
const title = ref("")
const loading = ref(false)
const uid = ref('');
const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: '',
  needProcess: 0
})
const collectStatus = ref(0)

function sendTask() {
  if (collectStatus.value === 0) {
    collectStatus.value = 1
    chrome.tabs.sendMessage(
        parseInt(route.query.activeId),
        {
          Message: "getHistory"
        }
    );
    chrome.tabs.update(parseInt(route.query.activeId), {
      active: true
    })
  }
}

function dealYoutubeVideo(Message) {
  if (Message.Message === 'authorInfo') {
    author.value = Message.author
  } else if (Message.Message === 'result') {
    xhrHttp("http://101.201.222.226/WeiShi/CallBack", Message.result
        , 'post', 'application/json').then((res) => {
      console.log(res)
      collectStatus.value = 2;
    })
  }
}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);
})

function close() {
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  window.close();
}


</script>

<style scoped>

</style>
