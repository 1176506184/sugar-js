<template>
  <div
      style="height: auto;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;border-bottom: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #append>
          <el-button @click="getNextCollect" :loading="loading">
            采集
          </el-button>
        </template>
      </el-input>
    </div>
    <el-form label-position="top" style="height: auto;padding: 20px;">
      <el-form-item>
        <el-cascader
            filterable
            placeholder="请选择分类"
            style="width: 100%"
            v-model="type"
            :options="category"
            :props="props"
        />
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref, nextTick} from "vue";
import {ElLoading, ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {xhrHttp} from "../utils/request";
import {DIR, getNowDate, guid} from "../utils/utils";

const route = useRoute()
const data = ref({})
let pageObj = {}
const active_id = ref("")
const loading = ref(false)

const type = ref(null)
const author = ref('')
const category = ref([])
const props = {
  expandTrigger: 'hover',
  value: 'tag_id',
  label: 'tag_name'
}


async function getNextCollect() {

  if ((type.value?.length === 0 || !type.value)) {
    ElMessage.error("请选择分类")
    return
  }
  loading.value = true;
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "video_init"
      },
      function (response) {
        if (response?.state !== 200) {
          ElMessage.warning({
            message: '未获取到内容，请重试'
          })
        }

        chrome.tabs.update(parseInt(active_id.value), {
          active: true
        })

      }
  );

}

async function getId(hash) {
  return new Promise((r) => {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab['url']?.includes(`chrome-extension://jkobepngkjafdjkkdkebjohjclihidnj/html/out.html#/${hash}`)) {
          r(tab.id)
        }
      })
      r(false)
    })
  })
}


async function dealYoutubeVideo(Message) {
  if (Message.Message === 'tiktokFrame') {
    let pageId = await getId("TiktokFrameSingle");
    await chrome.tabs.update(parseInt(pageId), {
      active: true
    })
    data.value = Message.data;
    try {
      let callBackUrl = 'http://101.201.222.226/tictok/addtictok';
      let authorId = '';
      const dataUp = data.value.itemList?.map((item) => {
        authorId = item.authorId;
        if (!authorId && item.author) {
          authorId = item.author.id
        }
        return {
          ...item,
          authorId
        }
      });

      author.value = authorId

      xhrHttp(callBackUrl, {
        itemList: dataUp,
        author_id: authorId,
        homepage: Message.homepage,
        tag_id: type.value?.slice(-1)[0],
        operator_id: localStorage.getItem('ddid'),
        statusCode: 0
      }, 'post', 'application/json').then((res) => {
        loading.value = false;
        ElMessage.info({
          message: res.msg
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
}

onMounted(async () => {
  chrome.runtime.onMessage.addListener(dealYoutubeVideo);
  const {data} = await xhrHttp('http://101.201.222.226/author/authortaglist', {}, 'post');
  category.value = buildTree(data, 0);
  active_id.value = route.query.activeId
})

function buildTree(FlatData, ParentId = null) {
  return FlatData
      .filter(item => item.parent_id === ParentId)
      .map(item => ({
        ...item,
        children: buildTree(FlatData, item.tag_id)
      }));
}

</script>

<style scoped>

</style>
