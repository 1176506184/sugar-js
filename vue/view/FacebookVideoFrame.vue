<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主名称</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px">
        <template #append>可修改</template>
      </el-input>
    </div>


    <el-form label-position="top">
      <div style="padding: 0 10px 10px;">
        <el-form-item>
          <el-table :data="data" @selection-change="handleSelectionChange" style="height:calc(100vh - 230px)">
            <el-table-column type="selection" width="55"/>

            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

            <el-table-column label="视频标题" width="500">
              <template #header>
                <div style="display: flex;align-items: center;">
                  <label>视频标题</label>
                  <el-input style="width: 250px;margin-left:10px;" placeholder="输入后筛选" v-model="title"
                            @input="filterList"></el-input>
                </div>

              </template>
              <template #default="{ row }">
                <el-input v-model="row.title"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="播放量" prop="play" sortable :sort-orders="['descending','ascending',null]">
            </el-table-column>
          </el-table>

        </el-form-item>

        <el-row gutter="5">
          <el-col :span="4">
            <el-form-item label="语言">
              <el-select v-model="form.lang" class="smallWidthInput" placeholder="请选择" @change="getPortList">
                <el-option label="繁体" :value="0"/>
                <el-option label="英语" :value="1"/>
                <el-option label="葡语" :value="2"/>
                <el-option label="日语" :value="3"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="是否需要审核">
              <el-select v-model="form.needProcess" class="smallWidthInput" placeholder="请选择">
                <el-option label="否" :value="0"/>
                <el-option label="是" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="生成内容类型">
              <el-select v-model="form.content_type" placeholder="请选择" @change="getPortList">
                <el-option label="快讯" :value="0"/>
                <el-option label="文章" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="生成内容域名">
              <el-select placeholder="请选择" v-model="form.host" @change="getCateGory" filterable>
                <el-option v-for="item in ports" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="生成内容分类">
              <el-select placeholder="请选择" v-model="form.category" filterable>
                <el-option v-for="item in categorys" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

      </div>
      <el-form-item>
        <div class="dialog-footer"
             style="text-align: right;width: calc(100% - 20px);padding: 10px;background-color: #fff;z-index:20;border-top: 1px solid #ececec;">

          <el-row gutter="10" style="width: 350px;float: left">
            <el-col :span="12">
              <el-select-v2 placeholder="请选择分发专页" v-model="form.pageuid" filterable clearable style="width: 100%">
              </el-select-v2>
            </el-col>
            <el-col :span="12" style="color:orange;font-size: 12px;line-height: 17px;white-space: pre-wrap;
    text-align: left;">
              {{ pageType }}
              <!--              （发帖形式：图文追平贴 排期类型：定时发）-->
            </el-col>
          </el-row>

          <el-button type="primary" @click="copyEx">
            复制标题
          </el-button>

          <el-button type="primary" @click="copy">
            复制链接
          </el-button>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" style="margin-right: 10px" @click="Save">
            创建任务
          </el-button>
        </div>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup>

import router from "../router";
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import store from "../store/store";
import {testHttp, xhrHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {handleCopyValue} from "../utils/utils";
import {useRoute} from "vue-router";

const route = useRoute()
const data = ref([])
const AllData = ref([])
const author = ref("")
const ports = ref([])
const categorys = ref([])
const pages = ref([])
const title = ref("")
const active_id = ref("")


const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: null,
  needProcess: 0
})

const pageType = computed(() => {

  for (let i = 0; i < pages.value.length; i++) {

    if (form.pageuid === pages.value[i].uid) {
      return `发帖形式：${pages.value[i].post_typename}\n排期类型：${pages.value[i].plan_typename} `
    }

  }

  return ``

})

function filterList() {

  data.value = AllData.value.filter((item) => {
    return item.title?.runs[0]?.text.toLowerCase().indexOf(title.value.toLowerCase()) > -1
  })

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
                Message: "video"
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
    data.value = Message.data
    author.value = Message.author
    AllData.value = data.value
    console.log(data.value)
  }

}

function getPortList() {
  xhrHttp(`http://gpt.anyelse.com/callback/capturehostlist`, {
    content_type: form.content_type,
    lang: form.lang
  }, 'post', 'application/json').then((res) => {
    ports.value = JSON.parse(res).data
  });
}

function getCateGory() {
  xhrHttp(`http://gpt.anyelse.com/callback/capturecategorylist`, {
    content_type: form.content_type,
    lang: form.lang,
    host: form.host
  }, 'post', 'application/json').then((res) => {
    categorys.value = JSON.parse(res).data
  });
}

function getPage() {
  xhrHttp(`http://gpt.anyelse.com/callback/capturefacebooklist`, {}, 'post', 'application/json').then((res) => {
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
            Message: "video"
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

  getPortList();
  getPage();
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
