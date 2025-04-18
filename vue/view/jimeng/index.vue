<template>
  <div
      style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc;position: relative">
    <div class="layout_top" style="height: auto;border-radius: 0">
      <div>
        <span style="font-size: 15px;font-weight: bold;margin-right: 5px">即梦-创建FB专页排期</span>
      </div>
    </div>
    <el-form label-position="top" style="padding:10px 10px">
      <el-form-item label="图片列表（拖拽排序,点击放大）">
        <div
            style="border-bottom: 1px solid #ccc;margin-top: 10px;width: calc(100% - 20px);height: 200px;white-space: nowrap;overflow-x: auto;overflow-y: hidden;padding-bottom: 10px;">
          <draggable :list="imageList">
            <template #item="{ element,index }">
              <div style="position: relative;display: inline-block;margin-right: 10px;">
                <el-image :preview-src-list="imageList" :initial-index="index" :src="element"
                          style="width: 200px;height: 200px;">
                </el-image>
                <div>
                  <div style="position: absolute;top: 0;right: 0;">
                    <el-button type="danger" size="small" @click="imageList.splice(index,1)">
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </template>

          </draggable>
        </div>
      </el-form-item>
    </el-form>

    <el-form label-position="top" style="padding:10px;width: 800px">
      <el-form-item label="导语">
        <el-input type="textarea" rows="7" v-model="form.title"></el-input>
      </el-form-item>
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="语言">
            <el-select v-model="form.lang" placeholder="" style="width: 100%;" @change="getPage">
              <el-option v-for="item in langList" :key="item.lang" :label="item.name" :value="item.lang"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="FB专页">
            <el-select-v2 placeholder="FB专页" v-model="form.page_id" filterable clearable style="width: 100%"
                          :options="pages">
            </el-select-v2>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row gutter="10">
        <el-col :span="12">
          <el-form-item label="排期方式">
            <el-select v-model="form.type" placeholder="" style="width: 100%;">
              <el-option :value="1" label="手动排期"/>
              <el-option :value="0" label="自动排期"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排期时间(手动排期必填)">
            <el-date-picker
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:00"
                type="datetime"
                style="width: 100%"
                v-model="form.time"
                :disabled="form.type === 0">

            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>


    <div style="position: absolute;bottom: 0;width: 100%;height: 50px;border-top: 1px solid #ddd;">
      <div style="position:relative;width: 100%;display: flex;align-items: center;height: 100%">
        <div style="position: absolute;right: 0;display: flex">


          <el-button type="info" style="" @click="close">
            关闭
          </el-button>

          <el-button type="primary" @click="goActive">
            前往采集页
          </el-button>

          <el-button type="primary" style="margin-right: 10px" @click="submit" :loading="loading">
            提交
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {hHttp, xhrHttp} from "../../utils/request";
import {onMounted, ref, watch} from "vue";
import {ElMessage} from 'element-plus';
import draggable from "vuedraggable";

const imageList = ref([])
import {useRoute} from "vue-router";

const pages = ref([])
const route = useRoute();
const loading = ref(false)
const form = ref({
  lang: 0,
  type: 1,
  time: '',
  title: '',
  page_id: ''
})

onMounted(() => {
  chrome.runtime.onMessage.addListener(eventBus);
  getPage();
})

function goActive() {
  chrome.tabs.update(parseInt(route.query.activeId), {
    active: true
  })
}

async function eventBus(Message) {

  console.log(Message)
  if (Message.Message === 'image') {
    if (imageList.value.indexOf(Message.data) === -1) {
      imageList.value.push(Message.data)
      chrome.tabs.sendMessage(
          parseInt(route.query.activeId), {
            Message: 'success'
          }).then()
    } else {
      chrome.tabs.sendMessage(
          parseInt(route.query.activeId), {
            Message: 'pushed'
          }).then()
    }
  }
}

const langList = ref([
  {lang: 0, name: '繁体'},
  {lang: 1, name: '英文'},
  {lang: 2, name: '葡语'},
  {lang: 3, name: '日语'}
])

function close() {
  window.close();
}

async function submit() {

  if (imageList.value.length === 0) {
    ElMessage.warning({
      message: '请获取图片'
    })
    return;
  }

  if (!form.value.page_id) {
    ElMessage.warning({
      message: '请选择FB专页'
    })
    return;
  }

  if (form.value.type === 1 && !form.value.time) {
    ElMessage.warning({
      message: '请选择排期时间'
    })
    return;
  }

  if (!form.value.title) {
    ElMessage.warning({
      message: '请填写导语'
    })
    return;
  }

  loading.value = true;
  const {msg, state} = await hHttp("/MaterialReview/SaveToMaterialCJ", {
    title: form.value.title,
    source_url: imageList.value.join(','),
    page_id: form.value.page_id,
    ddid: localStorage.getItem('ddid'),
    publish_type: form.value.type,
    plan_time: form.value.time,
    lang: form.value.lang
  });
  if (state) {
    form.value.title = '';
    imageList.value = [];
    ElMessage.success({
      message: '提交成功'
    })
  } else {
    ElMessage.error({
      message: msg
    })
  }
  loading.value = false;
}

function getPage() {
  xhrHttp(`http://gpt.anyelse.com/callback/capturefacebooklist`, {
    lang:form.value.lang
  }, 'post', 'application/json').then((res) => {
    pages.value = JSON.parse(res).data.map((item) => {
      return {
        ...item,
        value: item.uid,
        label: item.name + ' - ' + item.uid
      }
    })
  });
}

</script>

<style scoped>
:deep(.el-date-editor .el-input__wrapper) {
  width: 100%;
  box-sizing: border-box;
}
</style>