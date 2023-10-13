<template>
  <div>

    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <el-input v-model="origin" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #prepend>当前域名</template>
      </el-input>
    </div>

    <el-form label-position="top">
      <div style="padding: 0 10px 10px;">
        <el-form-item>
          <el-table :data="data" height="480px">

            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

            <el-table-column label="文章标题" width="500">
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
            <el-table-column label="点阅量" prop="play" sortable :sort-orders="['descending','ascending',null]">
            </el-table-column>
          </el-table>
        </el-form-item>

      </div>
      <el-form-item>
        <div class="dialog-footer"
             style="text-align: right;width: calc(100% - 20px);padding: 10px;position: fixed;bottom: 0;background-color: #fff;z-index:20;border-top: 1px solid #ececec;">

          <el-row :gutter="5" style="width: 380px;float: left">
            <el-col :span="15">
              <el-select placeholder="请选择采集域名" v-model="urlId" filterable clearable style="width: 100%">
                <el-option v-for="item in urls" :label="item.postDomain" :value="item.id"/>
              </el-select>
            </el-col>
          </el-row>

          <el-button @click="close">取消</el-button>
          <el-button type="primary" style="margin-right: 10px" :disabled="collectStatus === 0" @click="finishTask">
            {{ nextStepBtn }}
          </el-button>
        </div>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup>

import router from "../router";
import {computed, onMounted, reactive, ref} from "vue";
import {xhrHttp} from "../utils/request";

const data = ref([])
const AllData = ref([])
const author = ref("")
const title = ref("")
const nextStepBtn = ref("获取域名规则中")
const collectStatus = ref(0);
const urls = ref([])
const origin = ref("获取当前网站域名中...")
const urlId = ref("");
const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const rules = ref({})


function filterList() {

  data.value = AllData.value.filter((item) => {
    return item.title.indexOf(title.value) > -1
  })

}

function uploadData() {

  for (let i = 0; i < data.value.length; i += 50) {

    xhrHttp(`http://captureapi.anyelse.com/CaptureArticleHistory/Save`, {
      models: data.value.filter((d, index) => {
        return index >= i && index < i + 50
      }).map(d => {
        return {
          SourceDomainId: urlId.value,
          ArticleUrl: d.href,
          ArticleItemTitle: d.title,
          PublishedTime: d.time,
          ViewCount: d.play

        }
      })
    }, 'post', 'application/json').then((res) => {
      res = JSON.parse(res)
    });

  }


}

function dealData(Message) {

  if (Message.Message === 'Origin') {
    origin.value = Message.data;
    getRule();
  } else if (Message.Message === 'web') {
    data.value = Message.data;
  } else if (Message.Message === 'finish') {
    finishTask();
  }

}

function finishTask() {
  nextStepBtn.value = "上传数据"
  if (collectStatus.value === 1) {
    uploadData();
    return
  }
  collectStatus.value = 1;
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "finishTask"
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

function getRule() {

  xhrHttp(`http://captureapi.anyelse.com/SourceDomain/List`, {
    postDomain: origin.value,
    pi: 1,
    ps: 200,
    is_rule: -1,
    id: null,
    addusername: "",
    rule_datetime: "",
    LinkType: -1,
    ruleType: -1,
    lang: -1
  }, 'post', 'application/json').then((res) => {
    res = JSON.parse(res)
    urls.value = res.data.data;
    if (urls.value.length >= 1) {
      urlId.value = urls.value[0].id;
      nextStepBtn.value = "点击停止采集"
      startTask();
    } else {
      nextStepBtn.value = "未获取到匹配的域名规则,点击停止采集"
      startTask();
    }
  });


}


onMounted(() => {
  chrome.runtime.onMessage.addListener(dealData);
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "getOrigin"
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
})


function close() {
  chrome.runtime.onMessage.removeListener(dealData)
  router.push({
    name: 'Home'
  });
}

function startTask() {
  collectStatus.value = 1;
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "startTask"
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

const upData = ref([])

const handleSelectionChange = (val) => {
  upData.value = val
}


</script>

<style scoped>

</style>
