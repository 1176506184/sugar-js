<template>
  <div>
    <div class="layout_top" style="height: 20px;line-height: 20px">
      <span style="font-size: 15px;font-weight: bold">油管频道博主：{{ author }}</span>
    </div>

    <div style="padding: 0 10px 10px;">

      <el-form label-position="top">

        <el-form-item>
          <el-table :data="data" @selection-change="handleSelectionChange" height="300px">
            <el-table-column type="selection" width="55"/>

            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

            <el-table-column label="视频标题" width="500">
              <template #default="{ row }">
                {{ row.title.runs[0].text }}
              </template>
            </el-table-column>
            <el-table-column label="播放量" prop="viewCount" sortable :sort-orders="['descending','ascending',null]">
            </el-table-column>
          </el-table>

        </el-form-item>

        <el-row gutter="5">
          <el-col :span="6">
            <el-form-item label="语言">
              <el-select v-model="form.lang" class="smallWidthInput" placeholder="请选择" @change="getPortList">
                <el-option label="繁体" :value="0"/>
                <el-option label="英语" :value="1"/>
                <el-option label="葡语" :value="2"/>
                <el-option label="日语" :value="3"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="生成内容类型">
              <el-select v-model="form.content_type" placeholder="请选择" @change="getPortList">
                <el-option label="快讯" :value="0"/>
                <el-option label="文章" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="生成内容域名">
              <el-select placeholder="请选择" v-model="form.host" @change="getCateGory" filterable>
                <el-option v-for="item in ports" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="生成内容分类">
              <el-select placeholder="请选择" v-model="form.category">
                <el-option v-for="item in categorys" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item>

          <template #label>
            <label class="el-form-item__label">分发专页(<span
                style="color:orange;">请确认选择的专页发帖形式为定时发</span>)</label>
          </template>
          <el-row gutter="5" style="width: 100%">
            <el-col :span="6">
              <el-select placeholder="请选择" v-model="form.pageuid" filterable clearable>
                <el-option v-for="item in pages" :label="item.name" :value="item.uid"/>
              </el-select>
            </el-col>
            <el-col :span="18" style="color:orange;">
              {{ pageType }}
<!--              （发帖形式：图文追平贴 排期类型：定时发）-->
            </el-col>
          </el-row>
        </el-form-item>


        <el-form-item>
          <div class="dialog-footer"
               style="text-align: right;width: calc(100% - 20px);padding: 10px;position: fixed;bottom: 0;background-color: #fff;z-index:20;border-top: 1px solid #ececec;">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" style="margin-right: 10px" @click="Save">
              创建任务
            </el-button>
          </div>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script setup>

import router from "../router";
import {computed, onMounted, reactive, ref} from "vue";
import store from "../store/store";
import {xhrHttp} from "../utils/request";

const data = ref([])
const author = ref("")
const ports = ref([])
const categorys = ref([])
const pages = ref([])

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: ''
})

const pageType = computed(() => {

  for (let i = 0; i < pages.value.length; i++) {

    if (form.pageuid === pages.value[i].uid) {
      return `（ 发帖形式：${pages.value[i].post_typename} | 排期类型：${pages.value[i].plan_typename} ）`
    }

  }

  return ``

})

function dealYoutubeVideo(Message) {
  data.value = Message.data.map((d) => {
    return {
      ...d,
      viewCount: parseInt(d.viewCountText.simpleText.replace(/\D/g, ''))
    }
  })
  author.value = Message.author
  console.log(data.value)
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
    pages.value = JSON.parse(res).data
    console.log(pages.value)
  });
}

onMounted(() => {

  chrome.runtime.onMessage.addListener(dealYoutubeVideo);

  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "video"
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );

  getPortList();
  getPage();
})


function close() {
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  router.push({
    name: 'Home'
  });
}

const upData = ref([])

const handleSelectionChange = (val) => {
  upData.value = val
}

function Save() {

  let param = {
    ...form,
    videodata: upData.value.map(r => {
      return {
        url: `https://www.youtube.com/watch?v=${r.videoId}`,
        title: r.title.runs[0].text,
        cover: `https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`,
        author: author.value
      }
    })
  }


  xhrHttp(` http://gpt.anyelse.com/callback/captureyoutubetask`, param, 'post', 'application/json').then((res) => {
    res = JSON.parse(res);
    if (res.state) {
      alert(res.msg)
    } else {
      alert("创建失败")
    }
  });
}

</script>

<style scoped>

</style>