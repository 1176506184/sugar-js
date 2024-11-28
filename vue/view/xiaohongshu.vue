<template>
  <div
      style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;position:relative;">
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <div>
        <span style="font-size: 15px;font-weight: bold;margin-right: 5px">FB专页-历史自动采集</span>
      </div>
    </div>

    <el-form label-position="top" style="height: auto;padding: 20px;">

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="博主名称">
            <el-input v-model="state.author" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="博主链接">
            <el-input v-model="state.authorLink" readonly></el-input>
          </el-form-item>
        </el-col>

      </el-row>


      <div v-if="!state.isHaveBlogger">
        <div>
          <span style="color:blue;">库里没有该博主，请点击创建</span>
        </div>
        <div>
          <el-form-item label="语言">
            <el-select v-model="form.lang" placeholder="" style="width: 200px;">
              <el-option v-for="item in langList" :key="item.lang" :label="item.name" :value="item.lang"/>
            </el-select>
          </el-form-item>
          <div>
            <el-button type="primary" @click="createBlogger">创建</el-button>
          </div>
        </div>
      </div>

      <div v-else>
        <div style="margin-bottom: 10px">
          <span style="color: red;font-size:16px;font-weight: bold">已存在该博主：ID {{
              state.blogger_id
            }}(创建人：{{ state.createUserName }},已采集素材数 {{
              state.collect_count
            }},创建时间{{ state.createTime }})</span>
        </div>

        <el-form-item label="采集数量上限">
          <el-input v-model="state.max_collect"></el-input>
        </el-form-item>

        <div>
          <div style="font-size: 16px">
            <span>当前采集状态</span>：<span>{{ state.status === 0 ? '停止采集' : '采集中' }}</span>

            <span
                style="margin-left: 20px">已采集帖子：{{ data.length }}</span>
            <span
                style="margin-left: 20px">已上传帖子：{{ state.collectNum }}</span>
            <span
                style="margin-left: 20px">重复帖子数：{{ state.failNum }}</span>
            <!--            <span style="margin-left: 20px">距离上次获取贴文已经过：{{ waitNextTimeNum }}秒</span>-->
          </div>
          <div style="font-size: 12px;color:orangered;margin-top: 3px">
            点击开启后，请切换到对应采集页面，开始自动向下滚动，页面请不要最小化，如需使用浏览器，请单独拖拽出一个新的浏览器窗口进行操作，采集成功后如需重新采集，请刷新博主页面
          </div>
        </div>

        <div style="display: flex;margin-top: 10px;">
          <el-button :type="state.status === 0 ? 'primary':'info'" :disabled="state.status !== 0 && state.isLogin"
                     @click="startCollect">
            继续自动采集
          </el-button>
          <el-button :type="state.status === 0? 'info':'danger'" :disabled="state.status === 0" @click="pauseCollect">
            关闭自动采集
          </el-button>
        </div>

      </div>


    </el-form>

    <el-table stripe style="height:calc(100vh - 314px - 41px - 50px)" :data="data" @selection-change="selectChange"
              @sort-change="handleSortChange"
              ref="tableRef">
      <el-table-column type="selection" width="55">

      </el-table-column>

      <el-table-column type="index" width="80">

      </el-table-column>

      <el-table-column label="类型" width="80">
        <template #default="{row}">
          <el-tag>
            {{ row.article_type === 2 ? '图文' : '视频' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="标题" width="550" prop="title">

      </el-table-column>

      <el-table-column label="点赞量" width="100" prop="likes" sortable="custom">

      </el-table-column>

      <el-table-column label="操作">
        <template #default="{row,$index}">
          <el-button size="small" type="primary" @click="openUrl(row.article_url)">查看</el-button>
          <el-button size="small" type="danger" @click="delData($index)">移除</el-button>
        </template>
      </el-table-column>

    </el-table>


    <div
        style="position: absolute;bottom: 0;width: 100%;height: 50px;border-top: 1px solid #ddd;">
      <div style="position:relative;width: 100%;display: flex;align-items: center;height: 100%">
        <div style="margin-left: 10px">
          已选择贴文：{{ selectNum }}
        </div>

        <div style="position: absolute;right: 0;display: flex">

          <el-input style="width: 180px;margin-right: 10px;" v-model="state.preSelect">
            <template #append>
              <div @click="selectAllTop60">
                勾选前{{ state.preSelect }}
              </div>
            </template>
          </el-input>

          <el-button type="primary" @click="copy">
            批量复制帖子链接
          </el-button>

          <el-button type="primary" style="margin-right: 10px" @click="save" :loading="state.loading">
            保存到历史采集素材库
          </el-button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import {hHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {handleCopyValue} from "../utils/utils";


let toolId = ''
const route = useRoute()
const collect_count = ref(0)
const data = ref([])
const selectData = ref([])
const selectNum = computed(() => {
  return selectData.value.length
})
const tableRef = ref(null)

const state = reactive({
  author: '',
  authorLink: '',
  isHaveBlogger: false,
  blogger_id: '',
  createUserName: '',
  createTime: '',
  max_collect: 1000,
  finishTime: 10,
  status: 0,
  collectNum: 0,
  failNum: 0,
  isLogin: true,
  preSelect: 60,
  collect_count: 0,
  loading: false
})


const langList = ref([
  {lang: 0, name: '繁体'},
  {lang: 1, name: '英文'},
  {lang: 2, name: '葡语'},
  {lang: 3, name: '日语'}
])

const form = reactive({
  lang: 0
})
const user = ref({
  userid: '',
  username: ''
})

async function createBlogger() {
  // 创建博主接口
  // 0：FB专业，1：twitter博主，2：Pinterest，3：头条，4：Instragram，5：Youtube
  // 0繁体 1 英文 2葡语 3日语
  let res = await hHttp(`/BloggerNew/Add`, {
    platform: 100,
    lang: form.lang,
    name: state.author,
    blogger_url: state.authorLink,
    create_id: user.value.userid,
    create_name: user.value.username
  })
  // console.log('res', res)
  if (res.state === true) {
    if (res.data) {
      state.blogger_id = res.data
      state.collect_count = 0
      state.createUserName = user.value.username
      state.createTime = '刚刚创建'
    }
    state.isHaveBlogger = true
    ElMessage({
      type: 'success',
      message: '创建成功'
    })
  }
}


async function getUserInfoWithRedBook(Message) {
  console.log(Message)
  state.author = Message.author.replace(/\s/g, '');
  state.authorLink = Message.authorLink.replace(/\s/g, '');
  // 查询库里有没有该博主
  const loadingTask = ElLoading.service({
    lock: true,
    text: '正在查询该博主信息',
    background: 'rgba(0, 0, 0, 0.6)',
  })

  let d = await hHttp(`/BloggerNew/getBloggerNewByNameUrl`, {
    url: state.authorLink,
    name: state.author
  })

  loadingTask.close();

  if (d.state) {
    state.isHaveBlogger = true;
    let resData = d.data;
    state.blogger_id = resData.id;
    state.createUserName = resData.create_name;
    state.createTime = resData.create_time.split('T')[0];
    state.collect_count = resData.capture_count ? resData.capture_count : 0
  }
}


onMounted(async () => {
  toolId = await getActiveId();
  // 调用接口，校验ddid
  let ddid = localStorage.getItem("ddid")

  const loadingTask = ElLoading.service({
    lock: true,
    text: '正在查询用户信息',
    background: 'rgba(0, 0, 0, 0.6)',
  })

  let res = await hHttp(`/BloggerNew/getUserByDdid`, {
    ddid: ddid
  })
  if (res.data && res.data.id) {
    user.value.userid = res.data.id
    user.value.username = res.data.name
  } else {
    ElMessage.warning({
      message: '请到数据采集平台进行登录授权'
    })
    return;
  }

  loadingTask.close();

  chrome.runtime.onMessage.addListener(eventBus);

  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "getBlogger"
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

async function eventBus(Message) {
  if (Message.Message === 'redBookBlogger') {
    await getUserInfoWithRedBook(Message)
  } else if (Message.Message === 'CantRedBook') {

    state.isLogin = false
    ElMessage.error('未登录小红书/未在博主页面')

  } else if (Message.Message === 'redBookData') {

    let resData = Message.data;
    let uniqueData = new Set();

// 将数据转换为字符串并存储在 Set 中去重
    JSON.parse(resData).forEach(r => {
      const key = JSON.stringify(r);
      uniqueData.add(key);
    });


    data.value.push(...Array.from(uniqueData).map(item => {
      const parsedItem = JSON.parse(item);
      return {
        ...parsedItem,
        likes: parseInt(parsedItem.likes)
      }
    }));

  } else if (Message.Message === 'StopRedBook') {

    state.status = 0;
    await chrome.tabs.update(parseInt(toolId), {
      active: true
    })

  }
}

async function startCollect() {
  state.status = 1;
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "startCollectHistory",
        max_collect: state.max_collect,
        frameId: route.query.activeId,
        toolId: toolId
      },
      function (response) {
        if (response?.state !== 200) {
          ElMessage.warning({
            message: '未获取到内容，请重试'
          })
        } else {
          chrome.tabs.update(parseInt(route.query.activeId), {
            active: true
          })
        }
      }
  );
}

async function pauseCollect() {
  state.status = 0;
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "pauseCollectHistory",
        frameId: route.query.activeId
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

async function getActiveId() {
  return new Promise((r) => {
    chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          r(tabs[0].id);
        }
    );
  });
}

function delData(index) {
  data.value.splice(index, 1)
}

function openUrl(href) {
  window.open(href)
}


function selectChange(res) {
  selectData.value = res
}

function selectAllTop60() {
  // 获取当前表格显示的数据
  console.log(tableRef.value)
  const top60Data = data.value.slice(0, state.preSelect);
  selectData.value = top60Data;
  tableRef.value.clearSelection();
  top60Data.forEach(row => {
    tableRef.value.toggleRowSelection(row, true);
  });
}

function copy() {

  if (selectData.value.length === 0) {
    ElMessage.warning('请先选择素材')
    return
  }

  let copyText = ``;
  selectData.value.forEach((item) => {
    copyText += `${item.article_url}\n`;
  })
  handleCopyValue(copyText).then(() => {
    ElMessage({
      message: '复制成功.',
      type: 'success',

    })
  });
}

function handleSortChange({column, prop, order}) {
  data.value.sort((a, b) => {
    if (order === 'ascending') {
      return a[prop] > b[prop] ? 1 : -1;
    } else if (order === 'descending') {
      return a[prop] < b[prop] ? 1 : -1;
    } else {
      return 0;
    }
  });
}

async function save() {

  if (selectData.value.length === 0) {
    ElMessage.warning('请先选择素材')
    return
  }

  state.loading = true;
  let data = selectData.value.map(r => {
    return {
      ...r,
      blogger_id: state.blogger_id
    }
  })
  let res = await hHttp("/BloggerCaptureHistoryNew/AddArticle", data);
  state.collectNum = res.count
  state.failNum = res.recount
  state.loading = false
  ElMessage.success('上传成功')
}

</script>


<style scoped>
:deep(.el-input-group__append) {
  background: #409eff;
  color: #fff;
  cursor: pointer;
}
</style>