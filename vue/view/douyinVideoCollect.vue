<template>
  <div
      style="height: auto;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;border-bottom: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">当前博主</span>
      <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px" readonly>
        <template #append>采集中</template>
      </el-input>
    </div>
    <el-form label-position="top" style="height: auto;padding: 20px;">
      <el-form-item>
        <el-cascader
            placeholder="请选择分类"
            style="width: 100%"
            v-model="type"
            :options="category"
            :props="props"
        />
      </el-form-item>
      <el-form-item style="margin-bottom: 0;">
        <div style="width: 100%;display: flex;justify-content: flex-end">
          <el-button type="primary" @click="sendTask('all')" :loading="loading">
            采集所有数据
          </el-button>
          <el-button type="warning" @click="sendTask('first')" :loading="loading">
            采集首页数据
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {apiFetch, xhrHttp} from "../utils/request";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const active_id = ref("")
const route = useRoute()
const loading = ref(false)
const collectType = ref('first')
const callBackUrl = computed(() => {
  return collectType.value === 'first' ? 'http://101.201.222.226/Author/AddDy' : 'http://101.201.222.226/Resource/RefreshDy'
})

const type = ref(null)
const author = ref('')
const category = ref([])
const props = {
  expandTrigger: 'hover',
  value: 'tag_id',
  label: 'tag_name'
}


onMounted(async () => {
  chrome.runtime.onMessage.addListener(EventListener);
  const {data} = await xhrHttp('http://101.201.222.226/author/authortaglist', {}, 'post');
  category.value = buildTree(data, 0)
  active_id.value = route.query.activeId
})

async function EventListener(Message) {
  if (Message.Message === 'finish') {
    author.value = Message.author;
    await chrome.tabs.query(
        {},
        async function (tabs) {
          for (let i = tabs.length - 1; i >= 0; i--) {
            let tab = tabs[i];
            if (tab.url.includes('out.html#/DouyinVideoCollect')) {
              await chrome.tabs.update(tab.id, {
                active: true
              })
              break;
            }
          }

        }
    );

    const {data, msg} = await apiFetch(callBackUrl.value, {
      aweme_list: Message.data.map(r => {
        return {
          author: {
            sec_uid: r.author.sec_uid,
            uid: r.author.uid,
            nickname: r.author.nickname,
            avatar_thumb: r.author.avatar_thumb
          },
          aweme_type: r.aweme_type,
          aweme_id: r.aweme_id,
          desc: r.desc,
          video: r.video,
          statistics: r.statistics
        }
      }),
      tag_id: type.value?.slice(-1)[0],
      operator_id: localStorage.getItem('ddid'),
      status_code: 0
    });
    ElMessage.info(msg)
    loading.value = false;
  }
}

function buildTree(FlatData, ParentId = null) {
  return FlatData
      .filter(item => item.parent_id === ParentId)
      .map(item => ({
        ...item,
        children: buildTree(FlatData, item.tag_id)
      }));
}

function sendTask(t) {
  collectType.value = t;
  if (collectType.value === 'first' && (type.value?.length === 0 || !type.value)) {
    ElMessage.error("请选择分类")
    return
  }
  loading.value = true;
  chrome.tabs.sendMessage(
      parseInt(route.query.activeId),
      {
        Message: "startVideoCollectTask",
        type: t
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


</script>

<style scoped>

</style>