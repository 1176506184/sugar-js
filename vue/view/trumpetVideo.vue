<template>
  <div>
    <div class="layout_top">
      <!--        <button id="collect">一键采集</button>-->
      <!--        <button>一键发布</button>-->
      <!--        <button id="video">抓取视频</button>-->
      <!--        <div style="clear: both"></div>-->
      <span style="font-size: 18px;font-weight: bold">小号视频素材</span>

    </div>

    <div style="padding: 10px;">
      <el-form ref="editFormRef" label-position="top" :model="form" v-loading="loading" :rules="rules"
               label-width="140px">

        <el-form-item label="素材标题" prop="resource_title">
          <el-input v-model="form.resource_title" placeholder="请输入"></el-input>
        </el-form-item>

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

        <el-form-item label="素材文件地址" prop="resource_url" v-if="false">
          <el-input v-model="form.resource_url" placeholder="请输入" disabled></el-input>
        </el-form-item>

        <el-form-item label="素材博主" prop="resource_author">
          <el-input v-model="form.resource_author" placeholder="请输入" disabled></el-input>
        </el-form-item>
        <el-form-item label="采集源地址" prop="resource_link" v-if="false">
          <el-input v-model="form.resource_link" placeholder="请输入" disabled></el-input>
        </el-form-item>
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
import router from "../router";
import {ElMessage} from "element-plus";


const form = reactive({
  resource_url: '',
  resource_type: 0,
  resource_author: '',
  resource_link: '',
  fb_person_id: '',
  page_person_id: '',
  twitter_person_id: '',
  lang: 1
})

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
  newid: 0
})

const props = defineProps(["id"]);
const optionsFB = ref([])
const optionsTW = ref([])
const optionsClub = ref([])
const loading = ref(false);
const rules = reactive({
  resource_title: [{
    required: true,
    message: '请输入素材标题'
  }],
})

onMounted(() => {
  getLangList()
  const url = location.href;
  const params = queryURLParams(url);
  state.newid = params['id'];
  form.resource_type = parseInt(params['resource_type']);
  http("Resource/GetCollectCatch", params).then(res => {

    form.resource_link = res.resource_link
    form.resource_url = res.resource_url
    form.resource_author = res.author_name
    form.resource_title = res.title
    form.resource_img = res.pic
    const pre_accounts = localStorage.getItem('pre_accounts')
    if (pre_accounts) {
      const pre_accounts_obj = JSON.parse(pre_accounts)
      if (pre_accounts_obj.fb_person_id) {
        form.fb_person_id = pre_accounts_obj.fb_person_id
        optionsFB.value.push({
          value: pre_accounts_obj.fb_person_id,
          label: pre_accounts_obj.fb_person_name
        })
      }
      if (pre_accounts_obj.page_person_id) {
        form.page_person_id = pre_accounts_obj.page_person_id
        optionsClub.value.push({
          value: pre_accounts_obj.page_person_id,
          label: pre_accounts_obj.page_person_name
        })
      }
      if (pre_accounts_obj.twitter_person_id) {
        form.twitter_person_id = pre_accounts_obj.twitter_person_id
        optionsTW.value.push({
          value: pre_accounts_obj.twitter_person_id,
          label: pre_accounts_obj.twitter_person_name
        })
      }
    }
  })
})


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

function queryURLParams(url) {
  let pattern = /(\w+)=(\w+)/ig; //定义正则表达式
  let parames = {}; // 定义参数对象
  url.replace(pattern, ($, $1, $2) => {
    parames[$1] = $2;
  });
  return parames;
}

function close() {
  router.push({
    name:'Home'
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
    http('Resource/Save', form).then(res => {
      loading.value = false;
      ElMessage({
        message: "提交成功",
        duration: 1000,
        type: "success"
      })
      router.push({
        name:'Home'
      });
    });
  } catch (e) {
    loading.value = false;
    alert(e);
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