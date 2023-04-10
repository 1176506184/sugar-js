<template>
  <div>
    <div class="layout_top">
      <!--        <button id="collect">一键采集</button>-->
      <!--        <button>一键发布</button>-->
      <!--        <button id="video">抓取视频</button>-->
      <!--        <div style="clear: both"></div>-->
      <span style="font-size: 18px;font-weight: bold">推特图片素材</span>

    </div>

    <div style="padding: 10px;">

      <el-form ref="editFormRef" label-position="top" :model="form" v-loading="loading"
               label-width="140px">

        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="贴文数量">
              <el-input v-model="form.pageNum" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="图片数量">
              <el-input v-model="form.imageNum" disabled></el-input>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="语言" prop="lang">
              <el-select v-model="form.lang" placeholder="请选择">
                <el-option :value="item.b" :label="item.a" v-for="item in state.langList"
                           :key="`lang${item.b}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="素材类型" prop="resource_type">
              <el-select placeholder="素材类型" v-model="form.resource_type" disabled>
                <el-option :value="item.value" :label="item.label" v-for="item in state.materialList"
                           :key="`type${item.value}`"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="关联人设FB账号名" prop="fb_person_id">
              <el-select
                  v-model="form.fb_person_id"
                  filterable
                  clearable
                  remote
                  placeholder="人设名称"
                  :remote-method="getFBeMail"
              >
                <el-option
                    v-for="item in optionsFB"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联人设FB专页名" prop="page_person_id">
              <el-select
                  v-model="form.page_person_id"
                  filterable
                  clearable
                  remote
                  placeholder="人设名称"
                  :remote-method="getFBClub"
              >
                <el-option
                    v-for="item in optionsClub"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联人设Twitter账号名" prop="twitter_person_id">
              <el-select
                  v-model="form.twitter_person_id"
                  filterable
                  clearable
                  remote
                  placeholder="人设名称"
                  :remote-method="getTW"
              >
                <el-option
                    v-for="item in optionsTW"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item>
          <div class="dialog-footer" style="text-align: right">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">
              确认
            </el-button>
          </div>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import {GetQueryString} from "../utils/utils.js";
import router from "../router";
import {ElMessage} from "element-plus";
import {http,xhrHttp,sHttp} from "../utils/request";


const form = reactive({
  group_guid: '',
  fb_person_id: '',
  page_person_id: '',
  twitter_person_id: '',
  lang: 1,
  resource_type: 2,
  pageNum: 0,
  imageNum: 0
})

const loading = ref(false);
const optionsFB = ref([])
const optionsTW = ref([])
const optionsClub = ref([])

const state = reactive({
  langList: [],
  materialList: [{
    value: 1,
    label: '视频'
  },
    {
      value: 2,
      label: '图片'
    }],
  newid: 0,
  imageData: []
})


onMounted(() => {
  getLangList()
  state.group_guid = GetQueryString("guid");
  console.log(state.group_guid)
  getData();

})


function getData() {
  loading.value = true;
  http(`ImageCollect/GetImageCollectListByGroupGuid?group_guid=${state.group_guid}`).then(res => {
    loading.value = false;
    console.log(res);
    state.imageData = res.result;
    form.pageNum = state.imageData.length;
    state.imageData.forEach(r => {
      form.imageNum += r.resource_url.split('|||').length;
    })
  })
}

function close() {
  router.push({
    name: 'Home'
  });
}

async function confirm() {
  loading.value = true;
  // console.log('form:', form)
  try {
    updateLocaleStorage(form);
    if (!form.fb_person_id) {
      form.fb_person_id = 0
    }
    if (!form.page_person_id) {
      form.page_person_id = 0
    }
    if (!form.twitter_person_id) {
      form.twitter_person_id = 0
    }

    let formData = state.imageData.map(d => {

      d.title = d.title.split('http')[0];

      return {
        resource_link: d.resource_link,
        resource_url: d.resource_url,
        screen_shot_list: d.resource_url.split('|||').map(r => {
          return {
            img_url: r
          }
        }),
        resource_author: d.author_name,
        resource_title: d.title,
        resource_type: 2,
        lang: form.lang,
        fb_person_id: form.fb_person_id,
        page_person_id: form.page_person_id,
        twitter_person_id: form.twitter_person_id
      }
    })

    http('Resource/AddList', {
      list: formData
    }).then(res => {
      loading.value = false;
      ElMessage({
        message: res.Message,
        duration: 2000,
        type: "success"
      })
      router.push({
        name: 'Home'
      });
    });
  } catch (e) {
    loading.value = false;
    alert(e);
  }

}


// 获取语言列表
function getLangList() {

  sHttp("/SysConfig/Lang", {}).then(res => {
    state.langList = res;
  })

}


const paramFB = ref({
  pi: 1,
  ps: 9999,
  person_type: '',
  person_name: '',
})
const paramTW = ref({
  pi: 1,
  ps: 9999,
  person_type: '',
  person_name: '',
})
const paramClub = ref({
  pi: 1,
  ps: 9999,
  person_type: '',
  person_name: '',
})

//  FB账号模糊搜索
function getFBeMail(query) {
  if (query) {
    paramFB.value.person_type = '1'
    paramFB.value.person_name = query
    apiGetCharacterList(paramFB.value, optionsFB)
  }
}

async function apiGetCharacterList(form, options) {
  try {
    const Data = await http('Person/List', form);
    options.value = Data.map((item) => {
      return {
        value: item.id,
        label: item.person_name
      }
    })
  } catch (e) {
    alert(e);
  }
}

//  FB专页模糊搜索
function getFBClub(query) {
  if (query) {
    paramClub.value.person_type = '2'
    paramClub.value.person_name = query
    apiGetCharacterList(paramClub.value, optionsClub)
  }
}

//  Twitter账号模糊搜索
function getTW(query) {
  if (query) {
    paramTW.value.person_type = '3'
    paramTW.value.person_name = query
    apiGetCharacterList(paramTW.value, optionsTW)
  }
}


function updateLocaleStorage(obj) {
  const {fb_person_id, page_person_id, twitter_person_id} = obj
  const accounts = {
    fb_person_id,
    page_person_id,
    twitter_person_id,
    fb_person_name: getLabelByid(optionsFB.value, 'label', 'value', fb_person_id),
    page_person_name: getLabelByid(optionsClub.value, 'label', 'value', page_person_id),
    twitter_person_name: getLabelByid(optionsTW.value, 'label', 'value', twitter_person_id),
  }
  localStorage.setItem('pre_accounts', JSON.stringify(accounts))
}

function getLabelByid(arr, labelName, idName, id) {
  let label = ''
  if (arr.value) {
    arr.value.forEach((item) => {
      if (item[idName] === id) {
        label = item[labelName]
      }
    })
  } else {
    arr.forEach((item) => {
      if (item[idName] === id) {
        label = item[labelName]
      }
    })
  }
  return label
}

</script>

<style scoped>

</style>