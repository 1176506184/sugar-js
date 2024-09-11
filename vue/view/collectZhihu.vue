<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top"
         style="min-height:35px;position: relative;border-radius: 0;border-left: 0;border-right: 0;height: auto">
      <div style="font-size: 15px;font-weight: bold;">问题：</div>
      <div v-html="question?.title">

      </div>

    </div>
    <el-form label-position="top" style="height: auto;">

      <el-form-item>

        <el-table ref="multipleTableRef" :data="answerList" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection">

          </el-table-column>
          <el-table-column type="index" label="序号" width="55">

          </el-table-column>
          <el-table-column label="回答">
            <template #default="{row}">
              <div v-html="keepOnlyPTags(row.content)"
                   style="max-height: 100px;overflow-x:hidden;overflow-y: auto"></div>
            </template>
          </el-table-column>
          <el-table-column label="点赞数" width="80" sortable prop="voteupCount">
            <template #default="{row}">
              {{ row.voteupCount }}
            </template>
          </el-table-column>
          <el-table-column width="150">
            <template #default="{row}">
              <el-button type="primary" @click="openDetail(row.content)" size="small">
                预览（带图）
              </el-button>
            </template>
          </el-table-column>

        </el-table>

      </el-form-item>

      <el-form-item>
        <div class="dialog-footer"
             style="position: fixed;bottom: 0;text-align: right;background: #fff;width: 1198px;box-sizing: border-box;padding: 10px;z-index:20;border-top: 1px solid #ececec;">
          <el-select v-if="state === 0" placeholder="域名" v-model="site"
                     style="display: inline-block;width: 200px;margin-right: 12px;">
            <el-option v-for="item in siteList" :value="item" :label="item">{{ item }}</el-option>
          </el-select>
          <el-select v-if="state === 0" placeholder="分类" v-model="cate"
                     style="display: inline-block;width: 150px;margin-right: 12px;">
            <el-option v-for="item in cateList" :value="item" :label="item">{{ item }}</el-option>
          </el-select>
          <el-button type="primary" @click="getQuestion" v-if="state === 0">
            上传问题
          </el-button>
          <el-input v-if="state === 1" v-model="collectNum" style="width: 100px;margin-right: 12px;"
                    placeholder="采集数量"></el-input>
          <el-button type="primary" @click="getAnswer" v-if="state === 1">
            采集回答
          </el-button>
          <el-button type="primary" @click="submitAnswer" v-if="state === 2" :loading="loading">
            {{ text }}
          </el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>

  <el-dialog v-model="open" width="1000">
    <div v-html="detail" style="max-height: 60vh;overflow-y: auto">

    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="open = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import {onMounted, ref, watchEffect} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";

const route = useRoute();
const question = ref("待采集")
const answerList = ref([])
const state = ref(0)
const site = ref("");
const siteList = ref([])
const cate = ref("")
const cateList = ref([])
const qid = ref(0)
const open = ref(false);
const detail = ref("")
const loading = ref(false);
const text = ref("提交回答");
const successNum = ref(0)
const collectNum = ref(100)

function keepOnlyPTags(html) {
  // 正则表达式匹配除了<p>标签外的所有HTML标签
  const regex = /<(?!p\b)[^>]*>|<\/[^>]*>/gi;
  // 使用replace方法替换所有匹配项为空字符串
  return html.replace(regex, '');
}

const multipleTableRef = ref()
const multipleSelection = ref([])

function handleSelectionChange(val) {
  multipleSelection.value = val
}

function openDetail(v) {
  open.value = true;
  detail.value = moveWatermarkSrcToSrc(v);
}

function moveWatermarkSrcToSrc(html) {
  // 正则表达式匹配<img>标签，并捕获data-default-watermark-src属性的值
  const imgRegex = /<img[^>]*\sdata-default-watermark-src\s*=\s*['"]([^'"]*)['"][^>]*>/g;

  // 使用replace方法替换匹配到的<img>标签
  return html.replace(imgRegex, function (match, watermarkSrc) {
    // 构建新的<img>标签，将watermarkSrc值放到src属性
    return `<img src="${watermarkSrc}">`;
  });
}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealZhihu)
  xhrHttp("https://twwebapi.anyelse.com/qa/HostList").then((res) => {
    res = JSON.parse(res)
    siteList.value = res.data;
  })
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "GetQuestion"
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

watchEffect(() => {
  xhrHttp("https://twwebapi.anyelse.com/qa/CategoryList", {
    host: site.value
  }).then((res) => {
    res = JSON.parse(res)
    cateList.value = res.data;
  })
})

async function dealZhihu(Message) {
  if (Message.Message === 'question') {
    console.log(Message.data)
    question.value = Message.data;
  } else if (Message.Message === 'finish') {
    console.log(Message.data)
    answerList.value = Message.data.map((r) => {
      if (r.voteup_count) {
        r.voteupCount = r.voteup_count;
      }

      if(!r.voteupCount && !r.voteup_count){
        r.voteupCount = 0;
      }

      return r;
    });
    finish();
  }
}

function finish() {
  chrome.tabs.query(
      {},
      async function (tabs) {
        for (let i = tabs.length - 1; i >= 0; i--) {
          let tab = tabs[i];
          if (tab.url.includes('out.html#/collectZhihu')) {
            await chrome.tabs.update(tab.id, {
              active: true
            })
            break;
          }
        }

      }
  );
}

async function getQuestion() {
  if (!site.value || !cate.value) {
    ElMessage.warning("请选择分类和域名")
    return
  }
  xhrHttp("https://twwebapi.anyelse.com/qa/QuestionSave", {
    title: question.value.title,
    intro: question.value.editableDetail,
    cover: question.value.thumbnailInfo?.thumbnails[0]?.url,
    refurl: "https://www.zhihu.com/question/" + question.value.id,
    host: site.value,
    categoryname: cate.value,
    dduserid: localStorage.getItem("ddid")
  }).then((res) => {
    res = JSON.parse(res)
    ElMessage.info(res.msg);
    state.value = 1;
    qid.value = res.artid;
  })
}

function getAnswer() {
  state.value = 2;

  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "GetAnswer",
        num: collectNum.value
      },
      function (response) {
        if (response?.state !== 200) {
          ElMessage.warning({
            message: '未获取到内容，请重试'
          })
        }
      }
  );

  chrome.tabs.update(parseInt(route.query.activeId), {
    active: true
  })


}

function splitIntoGroups(array, groupSize) {
  let result = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
}

async function uploadItem(item) {
  return xhrHttp("https://twwebapi.anyelse.com/qa/AnswerSave", {
    qid: qid.value,
    content: moveWatermarkSrcToSrc(item.content),
    refurl: "https://www.zhihu.com/question/" + question.value.id + "/" + item.id,
    dduserid: localStorage.getItem("ddid"),
    like: item.voteupCount
  }, 'POST');
}

async function submitAnswer() {
  console.log(multipleSelection.value);
  text.value = "提交中 " + successNum.value + "/" + multipleSelection.value.length;
  loading.value = true;
  const groups = splitIntoGroups(multipleSelection.value, 5);
  for (const group of groups) {
    let res = await Promise.all(group.map(item => uploadItem(item)));
    res = res.map(item => JSON.parse(item)).filter(item => item.state === true);
    successNum.value += res.length;
    loading.value = false;
    text.value = "提交中 " + successNum.value + "/" + multipleSelection.value.length;
  }
  text.value = "提交完成 " + successNum.value + "/" + multipleSelection.value.length;
}

function close() {
  chrome.runtime.onMessage.removeListener(dealZhihu)
  window.close();
}

</script>

<style scoped>

:deep(.el-select-v2__placeholder) {
  text-align: left !important;
  cursor: pointer;
}


</style>
