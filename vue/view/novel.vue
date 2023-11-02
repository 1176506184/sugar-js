<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top" style="height: auto">
      <div class="book pt10">
        <div class="bookcover hidden-xs">
          <img class="thumbnail" alt="異能：一不小心覺醒成了世界之主" :src="cover" width="140" height="180">
        </div>
        <div class="bookinfo">
          <h1 class="booktitle">{{ author }}</h1>
          <p class="bookintro">
            {{ brief }}
          </p>
        </div>
        <div class="clear"></div>
      </div>
    </div>

    <el-form label-position="top">
      <div style="padding: 0 10px 10px;">
        <el-form-item>

          <el-table-v2
              :columns="TableColumns"
              :data="data"
              width="978"
              :height="height"
              fixed
          />

          <!--          <el-table :data="data" @selection-change="handleSelectionChange" style="flex:1;height:calc(100vh - 275px)"-->
          <!--                    row-key="guid">-->
          <!--            <el-table-column type="selection" width="55"/>-->

          <!--            <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>-->

          <!--            <el-table-column label="章节标题" width="300" prop="name">-->
          <!--            </el-table-column>-->

          <!--            <el-table-column label="原链接" width="500">-->
          <!--              <template #default="{row}">-->
          <!--                <el-link type="primary">{{ row.href }}</el-link>-->
          <!--              </template>-->
          <!--            </el-table-column>-->

          <!--          </el-table>-->


        </el-form-item>

        <el-form-item>
          <div class="dialog-footer"
               style="text-align: right;width: calc(100% - 20px);padding:0 10px;background-color: #fff;z-index:20;border-top:1px solid #f0f0f0">

            <el-button @click="close">取消</el-button>
            <el-button @click="download" type="primary">打包下载</el-button>
          </div>
        </el-form-item>


      </div>

    </el-form>


  </div>
</template>

<script lang="jsx" setup>

import router from "../router";
import {computed, onMounted, reactive, ref, nextTick, unref} from "vue";
import store from "../store/store";
import {testHttp, xhrHttp} from "../utils/request";
import {ElLoading, ElMessage} from "element-plus";
import {useRoute} from "vue-router";

const route = useRoute()
const data = ref([])
const AllData = ref([])
const author = ref("")
const title = ref("")
const active_id = ref("")
const loading = ref(false)
const cover = ref("")
const brief = ref("")
const height = ref(window.innerHeight - 275);
const width = ref(0);

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: ''
})


const TableColumns = ref([{
  key: 'index',
  dataKey: 'index',
  title: '序号',
  width: 100
}, {
  key: 'name',
  dataKey: 'name',
  title: '章节标题',
  width: 300
}, {
  key: 'href',
  dataKey: 'href',
  title: '原链接',
  width: 500,
  cellRenderer: ({rowData}) => (
      <>
        <el-link type="primary">{rowData.href}</el-link>
      </>
  )
}])


const SelectionCell = ({
                         value,
                         intermediate = false,
                         onChange,
                       }) => {
  return (
      <ElCheckbox
          onChange={onChange}
          modelValue={value}
          indeterminate={intermediate}
      />
  )
}

TableColumns.value.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({rowData}) => {
    const onChange = (value) => (rowData.checked = value)
    return <SelectionCell value={rowData.checked} onChange={onChange}/>
  },
  headerCellRenderer: () => {
    const _data = unref(data.value)
    const onChange = (value) =>
        (data.value = _data.map((row) => {
          row.checked = value
          return row
        }))
    const allSelected = _data.every((row) => row.checked)
    const containsChecked = _data.some((row) => row.checked)
    return (
        <SelectionCell
            value={allSelected}
            intermediate={containsChecked && !allSelected}
            onChange={onChange}
        />
    )
  }
})

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
                Message: "start"
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
  } else if (Message.Message === 'pushData') {
    let tempData = Message.data;
    let cache = data.value.filter((item) => {
      return item.name === tempData.name;
    })

    if (cache.length > 0) {
      cache[0].content += `\n${tempData.content}`;
    } else {
      tempData['index'] = data.value.length
      data.value.push(tempData)
    }
  } else if (Message.Message === 'brief') {

    author.value = Message.author
    cover.value = Message.cover
    brief.value = Message.brief


  }


}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);

  if (!!route.query.activeId) {
    nextTick(() => {
      console.log(route.query.activeId)
      chrome.tabs.sendMessage(
          parseInt(route.query.activeId),
          {
            Message: "start"
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
  window.close();
}

const upData = ref([])

const handleSelectionChange = (val) => {
  upData.value = val
}

function download() {
  upData.value = data.value.filter((item) => {
    return item.checked
  })
  let text = "";
  upData.value.forEach((d) => {
    text += `${d.name}\n`;
    text += `${delHtmlTag(d.content)}\n\n\n`
  })
  saveTextAsFile(text, `${author.value}.txt`);
}

function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g, "\n").replaceAll('&nbsp;', '');//去掉所有的html标记
}

function saveTextAsFile(text, filename) {
  const blob = new Blob([text], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


</script>

<style scoped>


</style>
