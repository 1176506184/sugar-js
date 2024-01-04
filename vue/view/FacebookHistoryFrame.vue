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
          <el-form-item label="语言">
            <el-select v-model="form.lang" placeholder="" style="width: 200px;">
              <el-option v-for="item in langList" :key="item.lang" :label="item.name" :value="item.lang" />
            </el-select>
          </el-form-item>
          <div>
            <el-button type="primary" @click="createBlogger">创建</el-button>
          </div>
        </div>
      </div>
      <div v-if="isHaveBlogger">
        <div style="margin: 30px 0;">
          <span style="color: green;">已存在该博主：ID {{ blogger_id }}，已采集素材数 {{ collect_count }} </span>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script setup>
import router from "../router";
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import store from "../store/store";
import {dHttp, hHttp, xhrHttp, xHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {handleCopyValue} from "../utils/utils";
import {useRoute} from "vue-router";

const route = useRoute()
const isHaveBlogger = ref(false)
const author = ref("")
const authorLink = ref("")
const blogger_id = ref("")
const collect_count = ref("")
const langList = ref([
  {lang: 0, name: '繁体'},
  {lang: 1, name: '英文'},
  {lang: 2, name: '葡语'},
  {lang: 3, name: '日语'}
])
const user = ref({
  userid: '',
  username: ''
})

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0
})

async function createBlogger() {
  
  // 创建博主接口
  // 0：FB专业，1：twitter博主，2：Pinterest，3：头条，4：Instragram，5：Youtube
  // 0繁体 1 英文 2葡语 3日语
  let res = await hHttp(`/BloggerNew/Add`, {
    platform: 0,
    lang: form.lang,
    name: author.value,
    blogger_url: authorLink.value,
    create_id: user.value.userid,
    create_name: user.value.username
  })
  console.log('res', res)
  if(res.state == true) {
    isHaveBlogger.value = true
    ElMessage({
      type: 'success',
      message: '创建成功'
    })
  }
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

    // 查询库里有没有该博主
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
      let resData = d.data
      console.log(resData.id);
      blogger_id.value = resData.id
      collect_count.value = resData.capture_count? resData.capture_count: '0'
    }

  }

}

onMounted(async() => {
  // 调用接口，校验ddid
  let ddid = localStorage.getItem("ddid")

  const loadingTask = ElLoading.service({
    lock: true,
    text: '正在查询用户信息',
    background: 'rgba(0, 0, 0, 0.6)',
  })

  let res = await xHttp(`/BloggerNew/getUserByDdid`, {
    ddid: ddid
  })
  
  user.value.userid = res.data.id
  user.value.username = res.data.name

  loadingTask.close();

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


</script>

<style scoped>
:deep(.el-select-v2__placeholder) {
  text-align: left !important;
  cursor: pointer;
}
</style>
