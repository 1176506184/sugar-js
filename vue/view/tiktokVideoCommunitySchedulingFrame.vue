<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">

    <Swiper :modules="[Controller]"
            :controller="{ control: controlledSwiper }"
            @swiper="setController" :allowTouchMove="false">

      <swiper-slide>
        <div class="layout_top"
             style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
          <span style="font-size: 15px;font-weight: bold;margin-right: 5px">博主名称</span>
          <el-input v-model="author" style="display: inline-flex;flex:1;width: 500px">
            <template #append>可修改</template>
          </el-input>
        </div>
        <el-form label-position="top" style="height: calc(100vh - 57px);">
          <div style="padding: 0 10px 10px;">
            <el-form-item style="margin-bottom: 0">
              <el-table :data="data" @selection-change="handleSelectionChange" ref="TableRef" @select="handleSelect"
                        @sort-change="handleSortChange"
                        style="flex:1;height:calc(100vh - 130px)">
                <el-table-column type="selection" width="30"/>

                <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>

                <el-table-column label="视频标题" width="570">
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
                <el-table-column label="尺寸" prop="cup" sortable :sort-orders="['descending','ascending',null]">
                  <template #default="{row}">
                    {{ row.width }}×{{ row.height }}
                  </template>
                </el-table-column>

                <el-table-column label="发布时间" prop="create_time" sortable
                                 :sort-orders="['descending','ascending',null]">
                  <template #default="{row}">
                    <div>
                      {{ moment(row.create_time * 1000).format('YYYY-MM-DD') }}
                    </div>
                    <div>
                      {{ moment(row.create_time * 1000).format('HH:mm:ss') }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>

            </el-form-item>
          </div>
          <el-form-item>
            <div class="dialog-footer"
                 style="text-align: right;width: calc(100% - 20px);padding: 10px;background-color: #fff;z-index:20;">
              <el-input style="width: 200px;margin-right: 12px;" placeholder="尺寸筛选(,分割)" v-model="size"
                        @input="filterList"></el-input>
              <el-button type="danger" @click="close">关闭</el-button>
              <el-button type="primary" style="margin-right: 10px" @click="nextStep">
                下一步
              </el-button>
            </div>
          </el-form-item>

        </el-form>

      </swiper-slide>

      <swiper-slide style="width: 100%;height: 100vh">
        <div class="layout_top"
             style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
          <span style="font-size: 15px;font-weight: bold;margin-right: 5px">批量排程</span>
        </div>
        <el-form label-position="left" style="height: calc(100vh - 57px);">
          <div style="padding: 0 10px 10px;">
            <el-form-item label="批量设置排程时间" style="margin-top: 10px">
              <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="startTime"
                  type="datetime"
                  placeholder="开始时间"
              />
              <el-select v-model="interval_type" style="width: 80px;margin-left: 5px">
                <el-option label="分" :value="0">分</el-option>
                <el-option label="时" :value="1">时</el-option>
              </el-select>
              <el-input v-model="interval_num" placeholder="间隔时间" style="width: 130px;margin-left:5px;"
                        type="number"></el-input>
              <el-button type="primary" style="margin-left:5px;" @click="create_plan">确认</el-button>
            </el-form-item>
            <el-form-item style="border-bottom: 0;margin-bottom: 0">
              <el-table :data="pwData" style="flex:1;height:calc(100vh - 190px)">

                <el-table-column width="55" label="序号" align="center">
                  <template #default="{ row, column, $index }">
                    <span :style="failList.includes($index) ? 'color:red' : ''">{{ $index + 1 }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="视频标题" width="480">
                  <template #default="{ row }">
                    <el-input autosize type="textarea" v-model="row.title"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="视频链接" width="280">
                  <template #default="{ row }">
                    <el-input v-model="row.url"></el-input>
                  </template>
                </el-table-column>

                <el-table-column label="排程时间" width="250">
                  <template #default="{ row }">
                    <el-date-picker type="datetime" v-model="row.plan_time"></el-date-picker>
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template #default="{ row, column, $index }">
                    <el-button size="small" type="danger" @click="delPlan($index)">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </el-form-item>
          </div>

          <div class="el-form-item">
            <div class="dialog-footer"
                 style="text-align: left;width: calc(100% - 20px);height: 100px;padding: 10px;background-color: #fff;z-index:20;">

              <el-row gutter="10" style="width: 880px;float: left">
                <el-col :span="12">
                  <div style="flex-v">
                    <div class="form_title">排程社团</div>
                    <div>
                      <el-select placeholder="搜索社团名称或ID" v-model="state.communityNameAndUid"
                                filterable
                                clearable
                                remote
                                reserve-keyword
                                :loading="pageLoading"
                                :remote-method="getCommuity"
                                @change="changePage"
                                value-key="CommunityCode"
                                style="width: 100%">
                        <el-option v-for="item in communitys" :label="item.Name + ' ' + item.CommunityCode" :value="item"
                                  :key="item.CommunityCode"/>
                      </el-select>
                    </div>
                  </div>
                </el-col>
                <!-- <el-col :span="4">
                  <div style="flex-v">
                    <div class="form_title">排程类型</div>
                    <div>
                      <el-select placeholder="排程类型" v-model="state.PostType">
                        <el-option label="图文" :value="2">
                          图文
                        </el-option>
                        <el-option label="视频" :value="3">
                          视频
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col> -->

                <el-col :span="3">
                  <div style="flex-v">
                    <div class="form_title">发帖身份</div>
                    <div>
                      <el-select placeholder="发帖身份" v-model="state.JoinRole">
                        <el-option label="账号" :value="0">
                          账号
                        </el-option>
                        <el-option label="粉丝页" :value="1">
                          粉丝页
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>

                <el-col :span="3">
                  <div style="flex-v">
                    <div class="form_title">社团角色</div>
                    <div>
                      <!-- 
                        <el-option label="普通成员" :value="1">
                          普通成员
                        </el-option>
                        <el-option label="社团版主" :value="2">
                          社团版主
                        </el-option>
                        -->
                      <el-select placeholder="社团角色" v-model="state.CommunityRole">
                        
                        <el-option label="管理员" :value="3">
                          管理员
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>

                <el-col :span="3">
                  <div style="flex-v">
                    <div class="form_title">是否置顶</div>
                    <div>
                      <el-select placeholder="是否置顶" v-model="state.IsTop">
                        <el-option label="否" :value="0">
                          否
                        </el-option>
                        <el-option label="是" :value="1">
                          是
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>

                <el-col :span="3">
                  <div style="flex-v">
                    <div class="form_title">是否繁简转换</div>
                    <div>
                      <el-select placeholder="是否繁简转换" v-model="state.IsTranslate">
                        <el-option label="否" :value="0">
                          否
                        </el-option>
                        <el-option label="是" :value="1">
                          是
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                </el-col>
              </el-row>

              <div class="flex-p flex-end" style="margin-top: 15px;">
                <el-button type="danger" @click="close">关闭</el-button>
                <el-button @click="prevStep">上一步</el-button>
                <el-button type="primary" style="margin-right: 10px" @click="Save">
                  创建排程
                </el-button>
              </div>
            </div>
          </div>
        </el-form>


        <el-dialog v-model="loading" width="500" :show-close="false">
          {{ loading_text }}
        </el-dialog>

      </swiper-slide>

    </Swiper>

  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, nextTick, onBeforeMount} from "vue";
import {testHttp, sHttp, cjHttp} from "../utils/request";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Controller} from 'swiper/modules';
import 'swiper/css';
import moment from "moment";

const controlledSwiper = ref(null);

function setController(swiper) {
  controlledSwiper.value = swiper
}

onBeforeMount(() => {
  document.body.style.width = "1200px"
})

const route = useRoute()
const data = ref([])
const AllData = ref([])
const author = ref("")
const communitys = ref([])
const title = ref("")
const active_id = ref("")
const loading = ref(false)
const loading_text = ref("检测封面图中");
const size = ref("")

const pattern = /^(([0-9]+\.[0-9]{1})|([0-9]+\.[0-9]{2})|([0-9]*[1-9][0-9]*))$/;
const form = reactive({
  lang: 0,
  content_type: 0,
  host: '',
  category: '',
  pageuid: '',
  needProcess: 0
})

// 排程社团
const CommunityState = reactive({
  Communityid: 0,
  Communityuserid: '',
  DishoutName: ''
})
// 排程其他变量
const state = ref({
  communityNameAndUid: '',
  PostType: 3,
  JoinRole: 0,
  CommunityRole: 3,
  IsTop: 0,
  SourceType: 2,
  IsTranslate: 0
})


function filterList() {

  data.value = AllData.value.filter((item) => {
    return item.title.toLowerCase().indexOf(title.value.toLowerCase()) > -1 && (size.value.split(',').includes(`${item.width}×${item.height}`) || !size.value)
  })

}

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
                Message: "video"
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

    return
  } else if (Message.Message === 'douyinVideo') {
    data.value = Message.data
    author.value = Message.author
    AllData.value = data.value
  }


}


const pageLoading = ref(false);
var reg = /^[1-9]\d*$|^0$/;

const failList = ref([])

function changePage(item) {
  console.log(item);
  CommunityState.Communityuserid = item.CommunityCode;
  CommunityState.Communityid = item.id;
  CommunityState.DishoutName = item.Name;

  state.value.communityNameAndUid = item.Name + ' ' + item.CommunityCode;
}

function getCommuity(query) {
  if (query) {
    pageLoading.value = true;
    sHttp(`ScheduledTask/GetList`, {
      community_str: query
    }, 'post', 'application/json').then((res) => {
      console.log(res);
      communitys.value = res;
      pageLoading.value = false;
    });
  } else {
    communitys.value = []
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
            Message: "video"
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
  chrome.runtime.onMessage.removeListener(dealYoutubeVideo)
  window.close();
}

const upData = ref([])
const tool_type = ref('')
const is_tw = ref('')

const handleSelectionChange = (val) => {
  upData.value = TableRef.value.getSelectionRows()
}

const handleSortChange = ({column, prop, order}) => {
  console.log({column, prop, order})
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
    firstSelect.value = getArrayIndex(TableRef.value.store.states.data.value, row);
  } else if (!langHover.value && firstSelect.value !== -1) {
    firstSelect.value = getArrayIndex(TableRef.value.store.states.data.value, row);
  } else if (langHover.value && firstSelect.value !== -1) {
    if (firstSelect.value > getArrayIndex(TableRef.value.store.states.data.value, row)) {
      for (let i = firstSelect.value; i > getArrayIndex(TableRef.value.store.states.data.value, row); i--) {
        TableRef.value.toggleRowSelection(TableRef.value.store.states.data.value[i], true);
      }
    } else {
      for (let i = firstSelect.value; i < getArrayIndex(TableRef.value.store.states.data.value, row); i++) {
        TableRef.value.toggleRowSelection(TableRef.value.store.states.data.value[i], true);
      }
    }
    firstSelect.value = -1;
  }
}

function getArrayIndex(arr, obj) {
  console.log(arr, obj)
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return i;
    }
  }
  return -1;
}


function delPlan(index) {
  pwData.value.splice(index, 1)
}

function create_plan() {

  if (!startTime.value) {
    ElMessage.warning("请选择开始时间");
    return;
  }

  if (!interval_num.value) {
    ElMessage.warning("请输入间隔时间");
    return;
  }

  pwData.value.forEach((r, index) => {
    r.plan_time = moment(startTime.value).add(interval_num.value * index, interval_type.value === 0 ? 'minute' : 'hour').format('YYYY-MM-DD HH:mm:ss');
    console.log(r.plan_time)
  })

}

const pwData = ref([])

function nextStep() {
  if (upData.value.length > 60) {
    ElMessage.error("最多一次排程60条");
    return
  }


  pwData.value = upData.value.map((r) => {
    return {
      title: r.title,
      url: r.href,
      author: r.author ? r.author : author.value,
      plan_time: ''
    }
  })


  if (pwData.value.length === 0) {
    ElMessage.warning("先请选择视频");
    return
  }

  controlledSwiper.value.slideTo(1);
}

function prevStep() {
  controlledSwiper.value.slideTo(0);
}

async function Save() {

  if (!CommunityState.Communityid || !CommunityState.Communityuserid) {
    ElMessage.error("请选择排程社团");
    return;
  }


  if (pwData.value.filter((item, index) => {
    return !item.url || !item.title || !item.plan_time
  }).length > 0) {
    ElMessage.error("请补全视频的标题/链接/排程时间");
    return;
  }
  

  if (state.value.JoinRole === '' || state.value.CommunityRole === '' || state.value.IsTop === '') {
    ElMessage.error("请将排程信息填写完整");
    return;
  }

  const loadingTask = ElLoading.service({
    lock: true,
    text: '数据上传中',
    background: 'rgba(0, 0, 0, 0.6)',
  })

  


  let params = pwData.value.map((item) => {
    return {
      /* Title: encodeURI(item.title),
      Url: encodeURI(item.url),
      Pagename: CommunityState.Pagename ? encodeURI(CommunityState.Pagename) : '',
      Pagefbid: CommunityState.Pagefbid,
      Pageid: CommunityState.Pageid,
      Type: tool_type.value,
      isTW: is_tw.value ? is_tw.value : 0,
      Plantime: item.plan_time,
      CreateUserId: localStorage.getItem("ddid"),
      CreateUserName: localStorage.getItem('name') */
      MaterialTitle: encodeURI(item.title) || '',
      MaterialSourceUrl: encodeURI(item.url) || '',
      PlanTime: item.plan_time || ''
    }
  })

  // 组成要发送的数据包
  let PostData = {
    SourceType: '2', //素材来源 1抖音 2tiktok 3youtube
    PostType: '3', //帖子类型 2图文 3视频
    JoinRole: state.value.JoinRole,
    CommunityRole: state.value.CommunityRole,
    IsTop: state.value.IsTop,
    // 繁简转换
    IsTranslate: state.value.IsTranslate,
    Communityid: CommunityState.Communityid,
    Communityuserid: CommunityState.Communityuserid,
    DishoutName: CommunityState.DishoutName,
    BatchParam: params,
    ddId: localStorage.getItem("ddid")
  }

  cjHttp(`ScheduledTask/BatchAdd`, PostData, 'post', 'application/json').then((res) => {
    /* res = JSON.parse(res);
    if (res.r) {
      alert(`创建成功${res.successCount.length};失败${res.failCount.length}条`);
      failList.value = res.failCount;
    } else {
      alert(res.msg)
    } */
    if(res.StatusCode === 200) {
      ElMessageBox.confirm
        (
          '排程创建成功!',
          '温馨提示',
          {
            confirmButtonText: '确认',
            showCancelButton: false
          }
        )
      .then(() => {
        prevStep();
      })
      .catch(() => {
      });
    }else {
      alert(res.Message);
    }
    loadingTask.close();
  });
  
}


const startTime = ref("")
const interval_type = ref(0)
const interval_num = ref("")

</script>

<style scoped>
/**
flex布局
*/
  /**
  主轴为水平方向
  */
  .flex-p {
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
  }

  /**
  主轴为垂直方向
  */
  .flex-v {
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
  }

  /**
  主轴水平方向，垂直方向统统居中
  */
  .flex-c {
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      align-items: center;
  }

  /**
  主轴水平方向居中
  */
  .flex-pc {
      display: flex;
      display: -webkit-flex;
      justify-content: center;
  }

  /**
  主轴垂直方向居中
  */
  .flex-vc {
      display: flex;
      display: -webkit-flex;
      align-items: center;
  }

  /**
  主轴水平方向两端分布
  */
  .flex-between {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
  }

  /**
  主轴水平方向均匀分布
  */
  .flex-around {
      display: flex;
      display: -webkit-flex;
      justify-content: space-around;
  }

  /**
  主轴水平方向顺序
  */
  .flex-start {
      display: flex;
      display: -webkit-flex;
      justify-content: flex-start;
  }

  /**
  主轴水平方向逆序
  */
  .flex-end {
      display: flex;
      display: -webkit-flex;
      justify-content: flex-end;
  }

  /**
  主轴水平方向换行
  */
  .flex-wrap {
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
  }

  /**
  主轴水平方向不换行
  */
  .flex-nowrap {
      display: flex;
      display: -webkit-flex;
      flex-wrap: nowrap;
  }

  .form_title {
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 6px;
  }
</style>
