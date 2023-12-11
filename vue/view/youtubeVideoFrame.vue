<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主名称</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px">
        <template #append>可修改</template>
      </el-input>
    </div>
    <el-form label-position="top" style="height: calc(100vh - 57px);">
      <div style="padding: 0 10px 10px;">
        <el-form-item>
          <el-table :data="data" @selection-change="handleSelectionChange" style="flex:1;height:calc(100vh - 230px)"
                    @sort-change="tabelSort">
            <el-table-column type="selection" width="55"/>

            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

            <el-table-column label="视频标题" width="900">
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
            <el-table-column label="播放量" prop="viewCount" sortable :sort-orders="['descending','ascending',null]">
            </el-table-column>

            <el-table-column label="播放时长" prop="lengthText" sortable :sort-orders="['descending','ascending',null]">
              <template #default="{ row }">
                {{ row?.lengthText?.simpleText }}
              </template>
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

          <el-col :span="4">
            <el-form-item label="生成内容类型">
              <el-select v-model="form.content_type" placeholder="请选择" @change="getPortList">
                <el-option label="快讯" :value="0"/>
                <el-option label="文章" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="是否需要审核">
              <el-select v-model="form.needProcess" class="smallWidthInput" placeholder="请选择">
                <el-option label="否" :value="0"/>
                <el-option label="是" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="生成内容域名">
              <el-select placeholder="请选择" v-model="form.host" @change="getCateGory" filterable>
                <el-option v-for="item in ports" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="生成内容分类">
              <el-select placeholder="请选择" v-model="form.category" filterable>
                <el-option v-for="item in categorys" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="标题是否chatgpt处理">
              <el-select v-model="form.needChapgpt" class="smallWidthInput" placeholder="请选择">
                <el-option label="否" :value="0"/>
                <el-option label="是" :value="1"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

      </div>
      <el-form-item>
        <div class="dialog-footer"
             style="text-align: right;width: calc(100% - 20px);padding: 10px;background-color: #fff;z-index:20;border-top: 1px solid #ececec;">

          <el-row gutter="10" style="width: 420px;float: left">
            <el-col :span="12">
              <el-select-v2 placeholder="请选择分发专页" v-model="form.pageuid" filterable clearable style="width: 100%"
                            :options="pages">
                <!--                <el-option v-for="item in pages" :label="item.name + ' - ' +item.uid" :value="item.uid"-->
                <!--                           :key="item.uid"/>-->
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

    <el-dialog v-model="loading" width="500" :show-close="false">
      {{ loading_text }}
    </el-dialog>

  </div>
</template>

<script setup>

import router from "../router";
import {computed, onMounted, reactive, ref, nextTick} from "vue";
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
const loading = ref(false)
const loading_text = ref("检测封面图中");

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: null,
  needProcess: 1,
  needChapgpt: 1
})

const pageType = computed(() => {

  for (let i = 0; i < pages.value.length; i++) {

    if (form.pageuid === pages.value[i].uid) {
      return `发帖形式：${pages.value[i].post_typename}\n排期类型：${pages.value[i].plan_typename} `
    }

  }

  return ``

})


function tabelSort({column, prop, order}) {
  // console.log(column, prop, order)

  if (prop === 'lengthText') {
    data.value = AllData.value.sort((a, b) => {

      let t1 = a.lengthText?.simpleText?.split(':');
      let t2 = b.lengthText?.simpleText?.split(':');

      if (!t1 || !t2) {
        return 1
      }

      t1[0] = parseInt(t1[0])
      t2[0] = parseInt(t2[0])

      if (t1[0] > t2[0]) {
        return 1
      } else if (t1[0] === t2[0]) {
        if (t1[1] > t2[1]) {
          return 1
        } else {
          return -1
        }
      } else {
        return -1
      }

    })
  }


}

function filterList() {

  data.value = AllData.value.filter((item) => {
    return item.title.toLowerCase().indexOf(title.value.toLowerCase()) > -1
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
  } else if (Message.Message === 'youtubeVideo') {
    data.value = Message.data.map((d) => {
      let titleTemp = "";
      try {
        if (d.headline?.simpleText) {
          titleTemp = d.headline?.simpleText
        } else {
          titleTemp = d.title?.runs[0].text
        }
      } catch (e) {
        console.log('未知字符串');
      }
      return {
        ...d,
        title: titleTemp,
        viewCount: dealNum(d.viewCountText?.simpleText)
      }
    })
    author.value = Message.author
    AllData.value = data.value
    console.log(data.value)
  }


}

function dealNum(num) {

  let result = num

  if (num === "" || num == null) {
    return 0;
  } else {

    result = num.replace(/[^\d.]/ig, "");

    if (num.toString().includes('万')) {
      result = result * 10000;
    }

    if (num.toString().includes('K')) {
      result = result * 1000;
    }

    return Number(result);
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

  let videoData = []
  loading_text.value = `封面图检测中（0/${upData.value.length}）`;
  loading.value = true;
  let successNum = 0;
  const limit = 8;

  async function checkImage(r) {
    let cover = `https://i.ytimg.com/vi/${r.videoId}/maxresdefault.jpg`;
    let result = await testHttp(cover);
    if (!result) {
      cover = `https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`;
    }
    videoData.push({
      url: `https://www.youtube.com/watch?v=${r.videoId}`,
      title: r.title,
      cover: cover,
      author: r.author ? r.author : author.value
    })
    successNum += 1;
    loading_text.value = `封面图检测中（${successNum}/${upData.value.length}）`;
  }

  await promiseAll(upData.value, checkImage, limit)

  // proFn返回一个封装了异步任务的promise
  async function promiseAll(arr = [], proFn, limit) {
    // 当前正在遍历的坐标
    let index = 0;
    // 存放结果的数组
    let res = [];
    // 正在执行的数组
    let excuting = [];

    // 执行函数
    function enqueue() {
      // 当执行完毕之后返回resolve状态的promise
      if (index === arr.length) {
        return Promise.resolve();
      }

      // 依次取出一个元素
      const item = arr[index++];

      /* 此处then方法会立即返回一个promise,在then回调运行结束
      （promise生成完毕）之后才会变成resolved状态，且当时的promise与
      proFn生成的promise保持一致(1、状态一致；2、resolve或者reject的值一致)*/
      const p = Promise.resolve().then(() => proFn(item, arr));
      // 将其放到promise数组
      res.push(p);

      // 将e放入正在执行的数组，并且在p执行完成之后将当前执行的e删除掉
      const e = p.then(() => {
        excuting.splice(excuting.indexOf(e), 1);
      });
      excuting.push(e);

      // 让r为一个默认resolved状态的promise
      let r = Promise.resolve();
      // 如果执行数组满了的话，那就让r通过race等待改变状态
      if (excuting.length >= limit) {
        r = Promise.race(excuting);
      }
      // 等到r变为resolved状态（执行数组没满或者有一个已经执行完被删除了）再来递归调用enqueue
      return r.then(() => enqueue());
    }

    // 执行完成后，通过promise.all返回所有的结果
    return enqueue().then(() => Promise.all(res));
  }

  // let promise = upData.value.map(async r => {
  //   let cover = `https://i.ytimg.com/vi/${r.videoId}/maxresdefault.jpg`;
  //   let result = await testHttp(cover);
  //   if (!result) {
  //     cover = `https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`;
  //   }
  //   videoData.push({
  //     url: `https://www.youtube.com/watch?v=${r.videoId}`,
  //     title: r.title,
  //     cover: cover,
  //     author: r.author ? r.author : author.value
  //   })
  //
  //   successNum += 1;
  //   loading_text.value = `封面图检测中（${successNum}/${upData.value.length}）`;
  // })
  //
  // await Promise.all(promise);
  loading.value = false;

  const loadingTask = ElLoading.service({
    lock: true,
    text: '数据上传中',
    background: 'rgba(0, 0, 0, 0.6)',
  })


  let param = {
    ...form,
    dduserid: localStorage.getItem("ddid"),
    videodata: JSON.stringify(videoData)
  }

  xhrHttp(`http://gpt.anyelse.com/callback/captureyoutubetask`, param, 'post', 'application/json').then((res) => {
    res = JSON.parse(res);
    if (res.state) {
      alert(res.msg)
    } else {
      alert("创建失败")
    }
    loadingTask.close();
  });
}

function copy() {
  let copyText = ``;
  upData.value.forEach((item) => {
    copyText += `https://www.youtube.com/watch?v=${item.videoId}\n`;
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
