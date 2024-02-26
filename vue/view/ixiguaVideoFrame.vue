<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">

    <Swiper :modules="[Controller]"
            :controller="{ control: controlledSwiper }"
            @swiper="setController" :allowTouchMove="false">

      <swiper-slide>
        <div class="layout_top"
             style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
          <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主名称</span>
          <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px">
            <template #append>可修改</template>
          </el-input>
        </div>
        <el-form label-position="top" style="height: calc(100vh - 57px);">
          <div style="padding: 0 10px 10px;">
            <el-form-item style="margin-bottom: 0">
              <el-table :data="data" @selection-change="handleSelectionChange" ref="TableRef" @select="handleSelect"
                        @sort-change="handleSortChange"
                        style="flex:1;height:calc(100vh - 130px)"
                        v-loading="initLoading">
                <el-table-column type="selection" width="30"/>

                <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

                <el-table-column label="视频标题" width="570">
                  <template #header>
                    <div style="display: flex;align-items: center;">
                      <label>视频标题</label>
                      <el-input style="width: 250px;margin-left:10px;" placeholder="输入后筛选" v-model="title"
                                @input="filterList"></el-input>
                    </div>

                  </template>
                  <template #default="{ row }">
                    {{ row.title }}
                  </template>
                </el-table-column>
                <el-table-column label="播放量" prop="playCount" sortable :sort-orders="['descending','ascending',null]">
                </el-table-column>
                <!-- <el-table-column label="时长" prop="duration" sortable :sort-orders="['descending','ascending',null]">
                </el-table-column>
                <el-table-column label="尺寸" prop="cup" sortable :sort-orders="['descending','ascending',null]">
                  <template #default="{row}">
                    {{ row.width }}×{{ row.height }}
                  </template>
                </el-table-column> -->

                <el-table-column label="发布时间" prop="create_time" sortable
                                 :sort-orders="['descending','ascending',null]">
                  <template #default="{row}">
                    <div>
                      {{ moment(row.create_time * 1000).format('YYYY-MM-DD') }}
                    </div>
                    <div>
                      {{ moment(row.create_time * 1000).format('HH:mm:ss') }}
                    </div>
                  </template>
                </el-table-column>

              </el-table>

            </el-form-item>
          </div>
          <el-form-item>
            <div class="dialog-footer"
                 style="text-align: right;width: calc(100% - 20px);padding: 10px;background-color: #fff;z-index:20;">
              <el-input style="width: 200px;margin-right: 12px;" placeholder="尺寸筛选(,分割)" v-model="size"
                        @input="filterList"></el-input>
              <el-button type="warning" @click="select60">勾选前60条</el-button>
              <el-button type="danger" @click="close">关闭</el-button>
              <el-button type="primary" style="margin-right: 10px" @click="nextStep">
                下一步
              </el-button>
            </div>
          </el-form-item>

        </el-form>

      </swiper-slide>
      <swiper-slide style="width: 100%;height: 100vh">
        <div class="layout_top"
             style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
          <span style="font-size: 15px;font-weight: bold;margin-right: 5px">批量排程</span>
        </div>
        <el-form label-position="left" style="height: calc(100vh - 57px);">
          <div style="padding: 0 10px 10px;">
            <el-form-item label="批量设置排程时间" style="margin-top: 10px">
              <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="startTime"
                  type="datetime"
                  placeholder="开始时间"
              />
              <el-select v-model="interval_type" style="width: 80px;margin-left: 5px">
                <el-option label="分" :value="0">分</el-option>
                <el-option label="时" :value="1">时</el-option>
              </el-select>
              <el-input v-model="interval_num" placeholder="间隔时间" style="width: 130px;margin-left:5px;"
                        type="number"></el-input>
              <el-button type="primary" style="margin-left:5px;" @click="create_plan">确认</el-button>
            </el-form-item>
            <el-form-item style="border-bottom: 0;margin-bottom: 0">
              <el-table :data="pwData" style="flex:1;height:calc(100vh - 190px)">

                <el-table-column width="55" label="序号" align="center">
                  <template #default="{ row, column, $index }">
                    <span :style="failList.includes($index) ? 'color:red' : ''">{{ $index + 1 }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="视频标题" width="480">
                  <template #default="{ row }">
                    <el-input autosize type="textarea" v-model="row.title"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="视频链接" width="280">
                  <template #default="{ row }">
                    <el-input v-model="row.url"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="排程时间" width="250">
                  <template #default="{ row }">
                    <el-date-picker type="datetime" v-model="row.plan_time"></el-date-picker>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template #default="{ row, column, $index }">
                    <el-button size="small" type="danger" @click="delPlan($index)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </el-form-item>
          </div>
          <el-form-item>
            <div class="dialog-footer"
                 style="text-align: right;width: calc(100% - 20px);padding: 10px;background-color: #fff;z-index:20;">

              <el-row gutter="10" style="width: 620px;float: left">
                <el-col :span="10">
                  <el-select placeholder="搜索专页名称或专页ID" v-model="form.pageuid"
                             filterable
                             clearable
                             remote
                             reserve-keyword
                             :loading="pageLoading"
                             :remote-method="getPage"
                             @change="changePage"
                             value-key="Pagefbid"
                             style="width: 100%">
                    <el-option v-for="item in pages" :label="item.Name + ' - ' + item.Pagefbid" :value="item"
                               :key="item.Pagefbid"/>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-select placeholder="排程类型" v-model="tool_type">
                    <el-option label="Reels" :value="4">
                      Reels
                    </el-option>
                    <el-option label="时间线" :value="0">
                      时间线
                    </el-option>
                  </el-select>
                </el-col>

                <el-col :span="7">
                  <el-select placeholder="是否简繁转换" v-model="is_tw">
                    <el-option label="否" :value="0">
                      否
                    </el-option>
                    <el-option label="是" :value="1">
                      是
                    </el-option>
                  </el-select>
                </el-col>

              </el-row>

              <el-button type="danger" @click="close">关闭</el-button>
              <el-button @click="prevStep">上一步</el-button>
              <el-button type="primary" style="margin-right: 10px" @click="Save">
                创建TOOL源视频排程
              </el-button>
            </div>
          </el-form-item>
        </el-form>


        <el-dialog v-model="loading" width="500" :show-close="false">
          {{ loading_text }}
        </el-dialog>

      </swiper-slide>

    </Swiper>


  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, nextTick, onBeforeMount} from "vue";
import {testHttp, xhrHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Controller} from 'swiper/modules';
import 'swiper/css';
import moment from "moment";

const controlledSwiper = ref(null);

function setController(swiper) {
  controlledSwiper.value = swiper
}

onBeforeMount(() => {
  document.body.style.width = "1200px"
})

const route = useRoute()
const data = ref([])
const AllData = ref([])
const author = ref("")
const pages = ref([])
const title = ref("")
const active_id = ref("")
const loading = ref(false)
const loading_text = ref("检测封面图中");
const size = ref("")
// 初始化Loading表格
const initLoading = ref(false)

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: '',
  needProcess: 0
})


function filterList() {

  data.value = AllData.value.filter((item) => {
    // return item.title.toLowerCase().indexOf(title.value.toLowerCase()) > -1 && (size.value.split(',').includes(`${item.width}×${item.height}`) || !size.value)
    return item.title.toLowerCase().indexOf(title.value.toLowerCase()) > -1
  })

}

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
  } else if (Message.Message === 'ixiguaVideo') {
    data.value = Message.data
    author.value = Message.author
    AllData.value = data.value
  }


}


const pageLoading = ref(false);
var reg = /^[1-9]\d*$|^0$/;
const pageState = reactive({
  Pagename: '',
  Pagefbid: '',
  Pageid: ''
})
const failList = ref([])

function changePage(data) {
  console.log(data)
  pageState.Pagefbid = data.Pagefbid;
  pageState.Pageid = data.id;
  pageState.Pagename = data.Name;
}

function getPage(query) {
  if (query) {
    pageLoading.value = true;
    xhrHttp(`https://tool.anyelse.com/open/getPage`, {
      pagename: reg.test(query) ? null : query,
      fbid: reg.test(query) ? query : null,
    }, 'post', 'application/json').then((res) => {
      pages.value = JSON.parse(res).data
      pageLoading.value = false;
    });
  } else {
    pages.value = []
  }

}

onMounted(() => {
  // 初始化Loading表格
  initLoading.value = true
  setTimeout(function() {
    initLoading.value = false
  }, 2000)

  chrome.runtime.onMessage.addListener(dealIxiguaVideo);
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
})


function close() {
  chrome.runtime.onMessage.removeListener(dealIxiguaVideo)
  window.close();
}

const upData = ref([])
const tool_type = ref('')
const is_tw = ref('')

const handleSelectionChange = (val) => {
  upData.value = TableRef.value.getSelectionRows()
}

const handleSortChange = ({column, prop, order}) => {
  console.log({column, prop, order})
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

function select60() {
  for (let i = 0; i < 60; i++) {
    if (TableRef.value.store.states.data.value[i]) {
      TableRef.value.toggleRowSelection(TableRef.value.store.states.data.value[i], true);
    }
  }
}

function delPlan(index) {
  pwData.value.splice(index, 1)
}

function create_plan() {

  if (!startTime.value) {
    ElMessage.warning("请选择开始时间");
    return;
  }

  if (!interval_num.value) {
    ElMessage.warning("请输入间隔时间");
    return;
  }

  pwData.value.forEach((r, index) => {
    r.plan_time = moment(startTime.value).add(interval_num.value * index, interval_type.value === 0 ? 'minute' : 'hour').format('YYYY-MM-DD HH:mm:ss');
    console.log(r.plan_time)
  })

}

const pwData = ref([])

function nextStep() {
  if (upData.value.length > 60) {
    ElMessage.error("最多一次排程60条");
    return
  }


  pwData.value = upData.value.map((r) => {
    return {
      title: r.title,
      url: r.href,
      author: r.author ? r.author : author.value,
      plan_time: ''
    }
  })


  if (pwData.value.length === 0) {
    ElMessage.warning("先请选择视频");
    return
  }

  controlledSwiper.value.slideTo(1);
}

function prevStep() {
  controlledSwiper.value.slideTo(0);
}

async function Save() {

  if (!pageState.Pageid) {
    ElMessage.warning("请选择专页");
    return;
  }

  failList.value = []


  if (pwData.value.filter((item, index) => {
    failList.value.push(index)
    return !item.url || !item.title || !item.plan_time
  }).length > 0) {
    ElMessage.warning("请补全视频的标题/链接/排程时间");
    return
  }

  if (tool_type.value === '' || tool_type.value === undefined || tool_type.value === null) {
    ElMessage.warning("请选择排程类型");
    return;
  }

  const loadingTask = ElLoading.service({
    lock: true,
    text: '数据上传中',
    background: 'rgba(0, 0, 0, 0.6)',
  })


  let param = pwData.value.map((item) => {
    return {
      Title: encodeURI(item.title),
      Url: encodeURI(item.url),
      Pagename: pageState.Pagename ? encodeURI(pageState.Pagename) : '',
      Pagefbid: pageState.Pagefbid,
      Pageid: pageState.Pageid,
      Type: tool_type.value,
      isTW: is_tw.value ? is_tw.value : 0,
      Plantime: item.plan_time,
      CreateUserId: localStorage.getItem("ddid"),
      CreateUserName: localStorage.getItem('name')
    }
  })

  xhrHttp(`https://tool.anyelse.com/open/saveVideoPlanBatch`, param, 'post', 'application/json').then((res) => {
    res = JSON.parse(res);
    if (res.r) {
      alert(`创建成功${res.successCount.length};失败${res.failCount.length}条`);
      failList.value = res.failCount;
    } else {
      alert(res.msg)
    }
    loadingTask.close();
  });
}


const startTime = ref("")
const interval_type = ref(0)
const interval_num = ref("")

</script>

<style scoped>

</style>
