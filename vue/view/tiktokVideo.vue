<template>
  <div>
    <div class="layout_top" style="height: 20px;display: flex;align-items: center;justify-content: flex-start">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主名称</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px">
        <template #append>可修改</template>
      </el-input>
    </div>
    <el-form label-position="top">
      <div style="padding: 0 10px 10px;">
        <el-form-item>
          <el-table :data="data" @selection-change="handleSelectionChange" height="480px" ref="TableRef" @select="handleSelect">
            <el-table-column type="selection" width="30"/>

            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

            <el-table-column label="视频标题" width="370">
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
            <el-table-column label="时长" prop="duration" sortable :sort-orders="['descending','ascending',null]">
            </el-table-column>
            <el-table-column label="尺寸" prop="playCount">
              <template #default="{row}">
                {{ row.width }}×{{ row.height }}
              </template>
            </el-table-column>
          </el-table>

        </el-form-item>
      </div>
      <el-form-item>
        <div class="dialog-footer"
             style="text-align: right;width: calc(100% - 20px);padding: 10px;position: fixed;bottom: 0;background-color: #fff;z-index:20;border-top: 1px solid #ececec;">
          <el-button type="primary" @click="copyEx">
            复制标题
          </el-button>
          <el-button type="primary" @click="copy">
            复制链接
          </el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup>

import router from "../router";
import {computed, onMounted, reactive, ref} from "vue";
import store from "../store/store";
import {testHttp, xhrHttp} from "../utils/request";
import {ElMessage} from "element-plus";
import {handleCopyValue} from "../utils/utils";

const data = ref([])
const AllData = ref([])
const author = ref("")
const ports = ref([])
const categorys = ref([])
const pages = ref([])
const title = ref("")


const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: ''
})


function filterList() {

  data.value = AllData.value.filter((item) => {
    return item.title.toLowerCase().indexOf(title.value.toLowerCase()) > -1
  })

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
    firstSelect.value = getArrayIndex(data.value, row);
  } else if (langHover.value && firstSelect.value!== -1) {
    for (let i = firstSelect.value; i < getArrayIndex(data.value, row); i++) {
      TableRef.value.toggleRowSelection(data.value[i], true);
    }
    firstSelect.value = -1;
  }
}

function getArrayIndex(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return i;
    }
  }
  return -1;
}



function dealYoutubeVideo(Message) {
  data.value = Message.data
  author.value = Message.author
  AllData.value = data.value
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

function copy() {
  let copyText = ``;
  upData.value.forEach((item) => {
    copyText += `${item.href}\n`;
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

</style>
