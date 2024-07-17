<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <div>
        <span style="font-size: 15px;font-weight: bold;margin-right: 5px">FB专页-自动采集图文帖至Tool脚本素材库</span>
      </div>
    </div>

    <el-form label-position="top" style="height: auto;padding: 20px;">

      <el-form-item label="博主名称">
        <el-input v-model="author" readonly></el-input>
      </el-form-item>

      <el-form-item label="博主链接">
        <el-input v-model="authorLink" readonly></el-input>
      </el-form-item>


      <div v-if="isHaveBlogger || 1">
        <el-row gutter="10">
          <el-col :span="10">
            <el-form-item label="采集数量上限（默认30）">
              <el-input v-model="max_collect"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="10">
            <el-form-item label="下拉无数据后多少时间自动结束（单位：分钟）">
              <el-input v-model="finishTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="10">
            <el-form-item label="帖子文案是否转繁体">
              <el-select v-model="isToFanti">
                <el-option :value="true" label="是">是</el-option>
                <el-option :value="false" label="否">否</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="10">
          <el-col :span="24">
            <el-form-item label="脚本素材库追评内容">
              <el-input v-model="valComment" type="textarea" :rows="5" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <div style="margin: 30px 0;">
          <div style="font-size: 16px" :class="status === 0 ? 'redText' : 'greenText'">
            <span>当前采集状态</span>：<span>{{ status === 0 ? '停止采集' : '采集中' }}</span>
            <span style="margin-left: 25px;margin-right: 5px;">{{ "|" }}</span>
            <span
              style="margin-left: 20px">已采集：{{ collectNum }}</span>
            <!-- <span
                style="margin-left: 20px">重复帖子：{{ failNum }}</span> -->
          </div>
          <div style="font-size: 12px;color: orange;margin-top: 3px;">
            点击开启后，请切换到对应采集页面，开始自动向下滚动，页面请不要最小化，如需使用浏览器，请单独拖拽出一个新的浏览器窗口进行操作
          </div>
        </div>
        <div style="display: flex">
          <el-button :type="status === 0 ? 'primary':'info'" :disabled="status !== 0" @click="startCollect">继续自动采集
          </el-button>
          <el-button :type="status === 0? 'info':'danger'" :disabled="status === 0" @click="pauseCollect">关闭自动采集
          </el-button>
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
const isHaveBlogger = ref(true)
const author = ref("")
const authorLink = ref("")
const blogger_id = ref("")
const collect_count = ref("")
const max_collect = ref(30)
const finishTime = ref(10)
const status = ref(0)
const collectNum = ref(0)
const createUserName = ref("");
const createTime = ref("")
const successPostNum = ref(0)
const waitNextTimeNum = ref(0)
const failNum = ref(0);
// 转繁体
const isToFanti = ref(true);
// 评论追评内容
const valComment = ref("");

const user = ref({
  userid: '',
  username: ''
})


async function startCollect() {
  status.value = 1;
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "startCollectImageToTool",
        max_collect: max_collect.value,
        finishTime: finishTime.value,
        frameId: route.query.activeId,
        isToFanti: isToFanti.value
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
  status.value = 0;
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "pauseCollectImageToTool",
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

let cacheList = [];

async function dealFbHistory(Message) {
  if (Message.Message === 'imageToTool' && Message.frameId.toString() === route.query.activeId.toString()) {
    // 反显博主名称、博主链接
    author.value = Message.author.replace(/\s/g, '');
    authorLink.value = Message.authorLink.replace(/\s/g, '');

  } else if (Message.Message === 'imageToTool_data' && Message.frameId.toString() === route.query.activeId.toString()) {
    console.log(Message.data)
    if (collectNum.value < max_collect.value) {
      var commentObj = [{
        "comment": encodeURIComponent(valComment.value),
      }]
      var kongArr = []
      var tempObject = {
        Title: Message.data?.Title,
        ContentPath: JSON.stringify(Message.data?.ContentPath),
        Comment: valComment.value? JSON.stringify(commentObj): JSON.stringify(kongArr),
        Type: 1, // 固定1，图文追评
        CreateUserId: localStorage.getItem("ddid"),
        IsTw: isToFanti.value? 1 : 0,
      }
      cacheList.push(tempObject);

      console.log(cacheList);

      if (cacheList.length >= 3) {
        try {
          let copyList = JSON.parse(JSON.stringify(cacheList));
          // 先计数，后清空
          cacheList = [];
          // 发送至Tool平台
          xhrHttp('http://tool.anyelse.com/open/saveXhFeedBatch', copyList, 'post', 'application/json').then((res) => {
            let rData = JSON.parse(res);
            if (rData.r) {
              // successPostNum.value += count;
              collectNum.value += copyList.length;
            } else {
              // failNum.value += recount;
            }
          });
        } catch (e) {
          console.log(e.msg);
        }
      }

      if (collectNum.value >= max_collect.value) {
        // UpdatedBlogger(Message.data.publish_time).then();
        console.log("最大采集数-", max_collect.value)
        console.log("现已采集数-", collectNum.value)
        pauseCollect().then();
      }
    } else {
      if (collectNum.value = max_collect.value) {
        // UpdatedBlogger(Message.data.publish_time).then();
        pauseCollect().then();
      }
      try {
        let copyList = JSON.parse(JSON.stringify(cacheList));
        // 先计数，后清空
        cacheList = [];
        console.log('找最后一个', collectNum.value, max_collect.value);
        if(copyList && copyList.length > 0 && status.value === 1 && (collectNum.value < max_collect.value)) {
          // 发送至Tool平台
          xhrHttp('http://tool.anyelse.com/open/saveXhFeedBatch', copyList, 'post', 'application/json').then((res) => {
            let rData = JSON.parse(res);
            if (rData.r) {
              // successPostNum.value += count;
              collectNum.value += copyList.length;
            } else {
              // failNum.value += recount;
            }
          });
        }
      } catch (e) {
        console.log(e.msg);
      }
      if (collectNum.value >= max_collect.value) {
        // UpdatedBlogger(Message.data.publish_time).then();
        console.log("最大采集数-", max_collect.value)
        console.log("现已采集数-", collectNum.value)
        pauseCollect().then();
      }
    }
  } else if (Message.Message === 'error') {
    // UpdatedBloggerError().then();
    console.log("已到最大等待时间-", finishTime.value*60)
    
    // 没了，且不够3个
    await theLastPortSend(cacheList);
    // 暂停采集
    pauseCollect().then();
  }
}

// 最后一批数据，不足3个发送
async function theLastPortSend(cacheList) {
  try {
    let copyList = JSON.parse(JSON.stringify(cacheList));
    // 先计数，后清空
    cacheList = [];
    console.log('找最后一个', collectNum.value, max_collect.value);
    if(copyList && copyList.length > 0 && status.value === 1 && (collectNum.value < max_collect.value)) {
      // 发送至Tool平台
      xhrHttp('http://tool.anyelse.com/open/saveXhFeedBatch', copyList, 'post', 'application/json').then((res) => {
        let rData = JSON.parse(res);
        if (rData.r) {
          // successPostNum.value += count;
          collectNum.value += copyList.length;
        } else {
          // failNum.value += recount;
        }
      });
    }
  } catch (e) {
    console.log(e.msg);
  }  
}

onMounted(async () => {
  // 调用接口，校验ddid
  let ddid = localStorage.getItem("ddid");
  /* const loadingTask = ElLoading.service({
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
  loadingTask.close(); */

  chrome.runtime.onMessage.addListener(dealFbHistory);

  if (!!route.query.activeId) {
    await nextTick(() => {
      chrome.tabs.sendMessage(
          parseInt(route.query.activeId),
          {
            Message: "imageToTool",
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
    })
  }

})


function close() {
  chrome.runtime.onMessage.removeListener(dealFbHistory);
  window.close();
}


// 调发通知接口
async function UpdatedBlogger(time) {
  let ddid = localStorage.getItem("ddid");
  let post_time_last = time ? time.split('T')[0] : time
  console.log('完成了，发通知-', ddid);
  let postString = '博主已采集完毕，已采集到最后贴文发布时间' + post_time_last + '，请及时进入后台查看' + '\n' +
      '博主名称：' + author.value + '\n' +
      '博主平台：Facebook' + '\n' +
      '博主采集数量：' + collectNum.value + '\n' +
      '入库成功数量：' + successPostNum.value
  let hres = await hHttp(`/BloggerCaptureHistoryNew/SendDDInfo`, {
    id: ddid,
    content: postString
  })
  if (hres.state === true) {
    ElMessage.success({
      message: '采集异常中止，已发送钉钉通知'
    })
  }
}

// 调发通知接口
async function UpdatedBloggerError() {
  let ddid = localStorage.getItem("ddid");
  console.log('完成了，发通知-', ddid);
  let postString = '博主历史采集超过' + finishTime.value + '分钟未获取到新贴文，请查看' + '\n' +
      '博主名称：' + author.value + '\n' +
      '博主平台：Facebook' + '\n' +
      '博主采集数量：' + collectNum.value + '\n' +
      '入库成功数量：' + successPostNum.value
  let hres = await hHttp(`/BloggerCaptureHistoryNew/SendDDInfo`, {
    id: ddid,
    content: postString
  })
  if (hres.state === true) {
    ElMessage.success({
      message: '采集完成，已发送钉钉通知'
    })
  }
}

</script>

<style scoped>
:deep(.el-select-v2__placeholder) {
  text-align: left !important;
  cursor: pointer;
}
:deep(.redText) {
  color: red;
}
:deep(.greenText) {
  color: green;
}
</style>
