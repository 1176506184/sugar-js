<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">字体采集 <el-button size="small" type="primary"
                                                                                            @click="download">批量下载</el-button></span>
    </div>
    <div>
      <el-divider content-position="left"></el-divider>
      <div style="width: 95%;margin-left: 2.5%">
        <el-table :data="data">
          <el-table-column label="字体名" prop="name" width="150"></el-table-column>
          <el-table-column label="字体来源" prop="src"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{row}">
              <el-button size="small" type="primary">直接下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute();
const data = ref([])
chrome.runtime.onMessage.addListener(async (Message) => {
  if (Message.Message === 'font') {
    data.value.push(Message.data);
  }
});

onMounted(() => {
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

function download() {
  data.value.forEach((item, index) => {
    chrome.downloads.download({
      url: item.src,
      filename: item.name + '.woff',
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error(`下载失败: ${item.src}`, chrome.runtime.lastError.message);
      } else {
        console.log(`开始下载: ${item.src}（ID: ${downloadId}）`);
      }
    });
  });
}

</script>


<style scoped>

</style>