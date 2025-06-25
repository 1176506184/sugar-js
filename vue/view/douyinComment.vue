<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">字体采集 <el-button size="small" type="primary"
                                                                                            >批量下载</el-button></span>
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
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";

const route = useRoute();
const data = ref([]);

function dealYoutubeVideo(Message) {
  console.log(Message)
}

onMounted(() => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "getComment"
      },
      function (response) {
        if (response?.state !== 200) {
          ElMessage.warning({
            message: '未获取到内容，请重试'
          })
        }
      }
  );
});
</script>

<style scoped>

</style>