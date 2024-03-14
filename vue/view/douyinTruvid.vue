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

          <el-table :data="data" @selection-change="handleSelectionChange" ref="TableRef" @select="handleSelect"
                    @sort-change="handleSortChange" style="flex:1;height:calc(100vh - 230px)"
                    :default-sort="{ prop: 'create_time', order: 'descending' }" v-loading="initLoading">
            <el-table-column type="selection" width="30" />

            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

            <el-table-column label="视频标题">
              <template #header>
                <div style="display: flex;align-items: center;">
                  <label>视频标题</label>
                  <el-input style="width: 250px;margin-left:10px;" placeholder="输入后筛选" v-model="title"
                            @input="filterList"></el-input>
                  <el-input style="width: 250px;margin-left:10px;" placeholder="时长筛选(,分割单位分钟)" v-model="section"
                            @input="filterTimeList"></el-input>
                </div>

              </template>
              <template #default="{ row }">
                {{ row.title }}
              </template>
            </el-table-column>
            <el-table-column label="播放量" prop="playCount" sortable width="150"
                             :sort-orders="['descending', 'ascending', null]">
            </el-table-column>
            <el-table-column label="播放时长" prop="duration" :formatter="formatTime" sortable width="150"
                             :sort-orders="['descending', 'ascending', null]">

            </el-table-column>

          </el-table>

        </el-form-item>

        <el-row gutter="5">
          <el-col :span="4">
            <el-form-item label="语言">
              <el-select v-model="form.lang" class="smallWidthInput" placeholder="请选择" @change="getPortList">
                <el-option label="繁体" :value="0" />
                <el-option label="英语" :value="1" />
                <el-option label="葡语" :value="2" />
                <el-option label="日语" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="生成内容类型">
              <el-select v-model="form.content_type" placeholder="请选择" @change="getPortList">
                <el-option label="快讯" :value="0" />
                <!-- <el-option label="文章" :value="1" /> -->
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="是否需要审核">
              <el-select v-model="form.needProcess" class="smallWidthInput" placeholder="请选择">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="生成内容域名">
              <el-select placeholder="请选择" v-model="form.host" @change="getCateGory" filterable>
                <el-option v-for="item in ports" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="生成内容分类">
              <el-select placeholder="请选择" v-model="form.category" filterable>
                <el-option v-for="item in categorys" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item label="标题是否chatgpt处理">
              <el-select v-model="form.needChapgpt" class="smallWidthInput" placeholder="请选择">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
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
              </el-select-v2>
            </el-col>
            <el-col :span="12"
                    style="color:orange;font-size: 12px;line-height: 17px;white-space: pre-wrap; text-align: left;">
              {{ pageType }}
            </el-col>
          </el-row>

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
import { computed, onMounted, reactive, ref, nextTick, onBeforeMount } from "vue";
import { testHttp, xhrHttp } from "../utils/request";
import { ElLoading, ElMessage } from "element-plus";
import { useRoute } from "vue-router";

onBeforeMount(() => {
  document.body.style.width = "1200px"
})

const route = useRoute()
const data = ref([])
const AllData = ref([])
const author = ref("")

const pages = ref([])
const categorys = ref([])
const ports = ref([])

const title = ref("")
const active_id = ref("")

const section = ref("")

const initLoading = ref(false)

const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: '',
  needProcess: 0,
  needChapgpt: 1
})

function formatTime(row) {
  let h = Math.floor(row.duration / 3600);
  let m = Math.floor((row.duration / 60 % 60));
  let s = Math.floor((row.duration % 60));
  if (s < 10) {
    s = `0${s}`
  }
  if (h) {
    return `${h}:${m}:${s}`;
  } else if (m) {
    return `${m}:${s}`;
  } else {
    return `${s}`;
  }
}

function filterList() {

  data.value = AllData.value.filter((item) => {
    return item.title.toLowerCase().indexOf(title.value.toLowerCase()) > -1
  })

}

function filterTimeList() {
  if (section.value.includes(',')) {
    let time = section.value.split(',')
    data.value = AllData.value.filter((item) => {
      return (item.duration > (+time[0] * 60) && item.duration < (+time[1] * 60)) ||
          (item.duration < (+time[0] * 60) && item.duration > (+time[1] * 60))
    })
  } else {
    data.value = AllData.value
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

const pageType = computed(() => {

  for (let i = 0; i < pages.value.length; i++) {

    if (form.pageuid === pages.value[i].uid) {
      return `发帖形式：${pages.value[i].post_typename}\n排期类型：${pages.value[i].plan_typename} `
    }

  }

  return ``

})

function dealIxiguaVideo(Message) {

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

    return
  } else if (Message.Message === 'douyinVideo') {
    data.value = Message.data
    author.value = Message.author
    AllData.value = data.value
  }


}


onMounted(() => {
  initLoading.value = true

  setTimeout(function () {
    initLoading.value = false
  }, 2000)

  chrome.runtime.onMessage.addListener(dealIxiguaVideo);
  if (!!route.query.activeId) {
    nextTick(() => {
      console.log(route.query.activeId)
      chrome.tabs.sendMessage(
          parseInt(route.query.activeId),
          {
            Message: "videoTruvid"
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
  chrome.runtime.onMessage.removeListener(dealIxiguaVideo)
  window.close();
}

const upData = ref([])

const handleSelectionChange = (val) => {
  upData.value = TableRef.value.getSelectionRows()
}

const handleSortChange = ({ column, prop, order }) => {
  console.log({ column, prop, order })
}

const langHover = ref(false)
const firstSelect = ref(-1)
const TableRef = ref(null)

document.onkeydown = function (e) {
  if (e.keyCode === 18) {
    if (!langHover.value) {
      langHover.value = true
    }
    e.preventDefault();
  }
};

document.onkeyup = function (e) {
  if (e.keyCode === 18) {
    if (langHover.value) {
      langHover.value = false
    }
    e.preventDefault();
  }
};

function handleSelect(selection, row) {
  if (firstSelect.value === -1) {
    firstSelect.value = getArrayIndex(TableRef.value.store.states.data.value, row);
  } else if (!langHover.value && firstSelect.value !== -1) {
    firstSelect.value = getArrayIndex(TableRef.value.store.states.data.value, row);
  } else if (langHover.value && firstSelect.value !== -1) {
    if (firstSelect.value > getArrayIndex(TableRef.value.store.states.data.value, row)) {
      for (let i = firstSelect.value; i > getArrayIndex(TableRef.value.store.states.data.value, row); i--) {
        TableRef.value.toggleRowSelection(TableRef.value.store.states.data.value[i], true);
      }
    } else {
      for (let i = firstSelect.value; i < getArrayIndex(TableRef.value.store.states.data.value, row); i++) {
        TableRef.value.toggleRowSelection(TableRef.value.store.states.data.value[i], true);
      }
    }
    firstSelect.value = -1;
  }
}

function getArrayIndex(arr, obj) {
  console.log(arr, obj)
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return i;
    }
  }
  return -1;
}

async function Save() {
  if (!form.pageuid) {
    ElMessage.warning("请选择专页");
    return;
  }
  if (!form.host) {
    ElMessage.warning("请选择域名");
    return;
  }
  if (!form.category) {
    ElMessage.warning("请选择分类");
    return;
  }
  if (upData.value.length == 0) {
    ElMessage.warning("请选择视频");
    return;
  }

  const loadingTask = ElLoading.service({
    lock: true,
    text: '数据上传中',
    background: 'rgba(0, 0, 0, 0.6)',
  })

  let params = {
    ...form,
    videoData: JSON.stringify(upData.value),
    dduserid: localStorage.getItem("ddid")
  }

  xhrHttp(`http://captureapi.anyelse.com/Callback/CaptureDouYinTask`, params, 'post', 'application/json').then((res) => {
    res = JSON.parse(res);
    if (res.state) {
      alert(`${res.msg}`);
    } else {
      alert(res.msg)
    }
    loadingTask.close();
  });


}


</script>

<style scoped></style>