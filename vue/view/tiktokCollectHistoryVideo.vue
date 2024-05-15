<template>
  <div
      style="height: auto;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;border-bottom: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author.homepage" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #append>
          <el-button
              :loading="upLoading"
              style="background:#409eff;color:#fff;border-top-left-radius: 0;border-bottom-left-radius: 0;overflow: hidden;border:0">
            {{ collectStatus === 0 ? '待获取' : collectStatus === 1 ? '采集中' : '获取成功' }}
          </el-button>
        </template>
      </el-input>
    </div>

    <el-form label-position="top" style="height: auto;padding: 20px;">

      <el-form-item label="采旧任务ID">
        <el-input v-model="uid">
          <template #append>
            <el-button  style="background:#409eff;color:#fff;border-top-left-radius: 0;border-bottom-left-radius: 0;overflow: hidden;border:0" :icon="Search" @click="getAuthor" :loading="loading"/>
          </template>
        </el-input>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup>
import {Search} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref, nextTick} from "vue";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";
import {ElMessage} from "element-plus";

const isError = ref(false);
const route = useRoute()
const data = ref({})
const AllData = ref([])
const author = ref({})
const title = ref("")
const loading = ref(false)
const upLoading = ref(false)
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
const collectStatus = ref(0);


const timeInterval = 1000 * 60 * 40;
let lastTimeStamp = 0;
const timeValue = ref(timeInterval / 1000 * 2);

function getAuthor() {
  if (!pattern.test(uid.value)) {
    ElMessage.error("请输入正确的采集任务ID");
    return
  }
  loading.value = true;
  xhrHttp("http://101.201.222.226/tictok/GetOldTaskById", {
    task_id: uid.value
  }, 'post', 'application/json').then((res) => {
    collectStatus.value = 1;
    if (res.homepage && !author.value.homepage) {
      author.value = res;
      sendTask();
    }
  })
  loading.value = false;
}

function sendTask() {
  console.log(route.query.activeId)
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "video_frame_quick",
        nextHref: author.value.homepage
      }
  );
  chrome.tabs.update(parseInt(route.query.activeId), {
    active: true
  })
}

function dealYoutubeVideo(Message) {
  console.log(Message)
  upLoading.value = true;
  if (Message.Message === 'tiktokFrame') {
    data.value = Message.data;
    try {
      let callBackUrl = 'http://101.201.222.226/tictok/CallBackForMirrorOld';
      lastTimeStamp = parseInt((new Date()).getTime() / 1000);
      loading.value = true;
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
        page_id: author.value.page_id,
        author_id: author.value.author_id,
        homepage: author.value.homepage,
        log_id: author.value.log_id,
        statusCode: 0
      }, 'post', 'application/json').then(() => {
        loading.value = false;
        collectStatus.value = 2;
      })
    } catch (e) {
      console.log(e)
    }
  }
  upLoading.value = false

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
