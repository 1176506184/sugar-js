<template>
  <div v-loading="loading">
    <div class="layout_top">
      <!--        <button id="collect">一键采集</button>-->
      <!--        <button>一键发布</button>-->
      <!--        <button id="video">抓取视频</button>-->
      <!--        <div style="clear: both"></div>-->

      <span style="font-size: 18px; font-weight: bold">通用采集工具</span>


      <el-button
          id="username"
          class="linear"
          style="font-size: 14px; float:right"
          @click="logout"
      >
        {{ state.loginText }}
      </el-button>

      <el-select placeholder="是否开启" style="width: 160px;float: right;margin-right: 15px;" v-model="open"
                 @change="changeOpen">
        <el-option :value="1" label="插件状态：开启"></el-option>
        <el-option :value="0" label="插件状态：关闭"></el-option>
      </el-select>

      <el-select style="width: 110px;float: right;margin-right: 15px;display: none" placeholder="请选择系统"
                 v-model="state.system"
                 @change="tipReload">
        <el-option :value="1" label="小号系统"></el-option>
        <el-option :value="2" label="数据系统"></el-option>
      </el-select>

    </div>
    <!--    <div class="title_viewer">-->
    <!--        <div id="username"></div>-->
    <!--    </div>-->
    <div class="layout_viewer" id="layout_viewer">

      <div id="login_container" v-if="state.isLogin === false"></div>
      <div id="menu" v-if="state.isLogin">
        <el-collapse v-model="activeNames" @change="handleChange" style="border-top: 0">
          <el-collapse-item title="抖音视频" name="1">
            <div>
              <el-button
                  @click="trumpet_video"
                  type="primary"
                  :disabled="type !== 'douyin'"
              >小号素材库
              </el-button
              >
              <el-button
                  @click="trumpet_video_hx"
                  type="primary"
                  :disabled="type !== 'douyin'"
              >欢享网
              </el-button
              >

              <el-button
                  @click="Copy_douyin"
                  type="primary"
                  :disabled="type !== 'douyin'"
              >视频采集
              </el-button
              >

              <el-button @click="collectDouyinVideoCommunitySchedulingFrame" type="primary"
                         :disabled="type !== 'douyin'">批量源素材社团排程
              </el-button>

            </div>
          </el-collapse-item>

          <el-collapse-item title="推特" name="2">
            <div>
              <el-button
                  @click="twitter_trumpet"
                  type="primary"
                  :disabled="type !== 'twitter'"
              >小号素材库
              </el-button>

              <el-button @click="collectTwitterImageCommunitySchedulingFrame" type="primary">社团排程（图片）</el-button>
              <el-button @click="collectTwitterVideoCommunitySchedulingFrame" type="primary">社团排程（视频）</el-button>

              <el-button type="warning" @click="collectTTHistory">自动采集历史</el-button>
            </div>
          </el-collapse-item>

          <el-collapse-item title="头条博主" name="3">
            <div style="display: flex">
              <el-input
                  placeholder="最大采集文章数"
                  style="width: 140px; margin-right: 15px"
                  :disabled="type !== 'toutiao'"
                  v-model="toutiaoMax"
              ></el-input>
              <el-button
                  type="primary"
                  @click="collectToutiao"
                  :disabled="type !== 'toutiao'"
                  v-if="toutiaoPending !== 'start'"
              >开始采集
              </el-button
              >
              <el-button type="danger" @click="stopCollectToutiao" v-else
              >停止采集
              </el-button
              >
            </div>
          </el-collapse-item>

          <el-collapse-item title="搜狐博主" name="4">
            <div style="display: flex">
              <el-input
                  placeholder="最大采集文章数"
                  style="width: 140px; margin-right: 15px"
                  v-model="sohuMax"
              ></el-input>
              <el-button
                  type="primary"
                  @click="collectSohu"
                  :disabled="type !== 'sohu'"
                  v-if="sohuPending !== 'start'"
              >开始采集
              </el-button>
              <el-button type="danger" @click="stopCollectSohu" v-else
              >停止采集
              </el-button>
            </div>
          </el-collapse-item>

          <el-collapse-item title="Facebook博主" name="5">
            <div style="display: flex">
              <el-input
                  placeholder="最大采集文章数"
                  style="width: 140px; margin-right: 15px"
                  v-model="fbMax"
              ></el-input>
              <el-button
                  type="primary"
                  @click="collectFacebook"
                  :disabled="type !== 'facebook'"
                  v-if="fbPending !== 'start'"
              >开始采集
              </el-button>
              <el-button type="danger" @click="stopCollectFacebook" v-else>停止采集
              </el-button>

              <el-button type="primary" @click="collectFBVideo">采集博主视频</el-button>

              <el-button type="warning" @click="collectFBHistory">自动采集历史</el-button>
            </div>
          </el-collapse-item>

          <el-collapse-item title="Youtube博主" name="6">
            <div>
              <!--              <el-button @click="collectYoutube" type="primary">采集视频并自动分发</el-button>-->
              <!--              <el-button @click="collectShorts" type="primary">采集SHORTS视频并自动分发</el-button>-->
              <el-button @click="collectYoutubeNew" type="primary">采集视频 / SHORTS并自动分发</el-button>
              <el-button @click="collectYoutubeNewPW" type="primary">采集视频 / SHORTS并TOOL源视频排文</el-button>

              <el-button @click="collectYoutubeVideoCommunitySchedulingFramePW" type="primary">批量源素材社团排程</el-button>
            </div>
          </el-collapse-item>


          <el-collapse-item title="TikTok" name="7">
            <div>
              <el-button @click="collectTiktok" type="primary">采集视频</el-button>
              <el-button @click="collectTiktokVideoFrame" type="primary">采集视频并TOOL源视频排文</el-button>

              <el-button @click="collectTiktokVideoCommunitySchedulingFrame" type="primary">批量源素材社团排程</el-button>

              <el-button @click="collectTiktokFrame" type="primary" :disabled="canTiktokFrame">
                自动化更新视频（个人勿点）
              </el-button>
            </div>
          </el-collapse-item>

          <el-collapse-item title="综合采集" name="8">
            <div>
              <el-button @click="collectWeb" type="primary">网站采集</el-button>
              <el-button @click="collectWebFrame" type="primary">网站采集（新）</el-button>
              <el-button @click="collectNovel" type="primary">小说采集</el-button>
              <el-button @click="collectNovelSync" type="primary">小说采集（加延迟防检测）</el-button>
            </div>
          </el-collapse-item>

          <el-collapse-item title="Ins博主" name="9">
            <div>
              <el-button type="warning" @click="collectInsHistory">自动采集历史</el-button>
            </div>
          </el-collapse-item>


          <!--        <p>脸书社团</p>-->
          <!--        <div>-->
          <!--          <el-button @click="facebook_member" type="primary" :disabled="type!=='facebook'">手动采集</el-button>-->
          <!--          <el-button @click="facebook_member_scroll" type="primary" :disabled="type!=='facebook'">自动采集</el-button>-->
          <!--        </div>-->
          <!--        <div class="border"></div>-->
        </el-collapse>
      </div>

    </div>
    <div id="version" style="display: flex;align-items: center">
      <p id="v_p" style="cursor: pointer">{{ state.version }} （如遇视频无法播放的情况请先关闭插件并刷新页面）</p>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
import {guid, handleCopyValue} from "../utils/utils";

const dingTalkAppId = "dingoac12xjewgmuqs2sea";
import {nextTick, onActivated, onMounted, reactive, ref, watchEffect} from "vue";
import {parseDate} from "../../utils/formatDate";
import store from "../store/store.js";
import {computed} from "vue";
import {http, xhrHttp, sHttp, dHttp} from "../utils/request";
import {ElMessage, ElMessageBox} from "element-plus";

const open = ref(1)

function changeOpen() {
  chrome.storage.local.set({
    open: open.value
  }, () => {

  })

}

const activeNames = ref([])
const handleChange = (val) => {
  console.log(val)
}

let data = {
  facebook: {},
  video: "",
  name: "",
  uid: 0,
  tk: "",
  videoPushType: 1,
};

const type = computed(() => {
  return store.getters["getType"];
});

let state = reactive({
  isLogin: false,
  loginText: "钉钉未登录",
  version: "v7.3.2",
  system: 1
});

function logout() {
  if (state.isLogin) {
    ElMessageBox.confirm(
        '是否退出登录？',
        {
          confirmButtonText: '确实',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          localStorage.clear();
          location.reload();
        })
        .catch(() => {

        })
  }
}

const loading = ref(false);
const canTiktokFrame = computed(() => {
  return localStorage.getItem('name') !== '唐非凡'
})

const canUseBtn = reactive({
  trumpetVideo: true,
  twitterImage: true,
});

function tipReload() {
  localStorage.clear();
  location.reload();
}

const reUrl = ref("");

const eventBus = async function (Message, sender, sendResponse) {
  if (Message.Message === "callbackData") {
    data.facebook = Message.data;
    sendResponse("ok");
  } else if (Message.Message === "initBtn") {
    if (Message.type === "douyin") {
      activeNames.value.push('1')
      store.commit("changeType", "douyin");
    } else if (Message.type === "twitter") {
      activeNames.value.push('2')
      store.commit("changeType", "twitter");
    } else if (Message.type === "facebook") {
      activeNames.value.push('5')
      store.commit("changeType", "facebook");
    } else if (Message.type === "toutiao") {
      activeNames.value.push('3')
      store.commit("changeType", "toutiao");
    } else if (Message.type === "sohu") {
      activeNames.value.push("4");
      store.commit("changeType", "sohu");
    } else if (Message.type === "youtube") {
      activeNames.value.push("6");
      store.commit("changeType", "youtube");
    } else if (Message.type === "tiktok") {
      activeNames.value.push("7");
      store.commit("changeType", "tiktok");
    } else if (Message.type === "web") {
      activeNames.value.push("8");
      store.commit("changeType", "web");
    } else if (Message.type === "empty") {
      store.commit("changeType", "empty");
    }
  } else if (Message.Message === "video") {
    loading.value = true;
    data.video = Message.url;
    let realData = Message.data;
    let domData = Message.domData;
    let godComment = Message.godComment;
    let curl = ``;
    godComment.forEach((god, index) => {
      if (index < 3) {
        curl += `&c${index + 1}=${god.text}`;
      }
    });

    if (Object.keys(realData).length > 0) {
      checkMP4(realData.video.play_addr?.url_list[0]);
      let url = encodeURI(realData.video.play_addr?.url_list[0]);
      if (data.videoPushType === 2) {
        window.open(
            `http://twtest.anyelse.com/user/postvideo?title=${
                realData.preview_title
                    ? escape(realData.preview_title)
                    : escape(realData.desc)
            }&cover=${escape(realData.pic)}&videourl=${escape(
                realData.reUrl
            )}&decodurl==${url}&author=${escape(realData.author.nickname)}${curl}`
        );
        return;
      }
      try {
        http("Video/SaveVideo", {
          platform: 1,
          title: realData.preview_title
              ? realData.preview_title
              : realData.desc,
          resource_link: realData.reUrl,
          resource_url: (function () {
            return realData.video.play_addr?.url_list[0];
          })(),
          times: realData.video.duration / 1000,
          play_count: realData.statistics.play_count,
          like_count: realData.statistics.digg_count,
          share_count: realData.statistics.share_count,
          collect_count: realData.statistics.collect_count,
          comment_count: realData.statistics.comment_count,
          publish_time: parseDate(realData.create_time),
          author_name: realData.author.nickname,
          author_url: `https://douyin.com/user/${realData.author.sec_uid}?vid=${realData.group_id}`,
          author_id: realData.group_id,
          pic: realData.pic,
        }).then((res) => {
          router.push({
            name: "TrumpetVideo",
            query: {
              id: res.newid,
              resource_type: 1,
            },
          });
        });
      } catch (e) {
      }
    } else {
      checkMP4(domData.video);

      if (data.videoPushType === 2) {
        window.open(
            `http://twtest.anyelse.com/user/postvideo?title=${escape(
                domData.title
            )}&cover=${escape(domData.pic)}&videourl=${escape(
                domData.url
            )}&decodurl=${escape(domData.video)}&author=${escape(
                domData.author
            )}${curl}`
        );
        return;
      }

      http("Video/SaveVideo", {
        platform: 1,
        resource_url: domData.video,
        author_url: domData.author_url,
        title: domData.title,
        author_name: domData.author,
        resource_link: domData.url,
        pic: domData.pic,
      }).then((res) => {
        router.push({
          name: "TrumpetVideo",
          query: {
            id: res.newid,
            resource_type: 1,
          },
        });
      });
    }

    loading.value = false;
  } else if (Message.Message === "image") {
    loading.value = true;
    let data = Message.data;
    let group_guid = guid();
    data = data.map((d) => {
      return {
        resource_url: d.entities?.media
            ?.map((e) => {
              return e.media_url_https;
            })
            .join("|||"),
        platform: 4,
        like_count: d.favorite_count,
        share_count: d.retweet_count,
        comment_count: d.reply_count,
        publish_time: d.created_at,
        author_name: d.author_name,
        author_url: d.author_url,
        title: d.full_text,
        resource_link: `${d.resource_link}`,
        group_guid: group_guid,
        real_id: `${d.id_str}`,
      };
    });
    http("ImageCollect/SaveImageCollectList", {
      list: data,
    }).then((res) => {
      loading.value = false;
      router.push({
        name: "TwitterImage",
        query: {
          guid: group_guid,
          resource_type: 2,
        },
      });
    });
  } else if (Message.Message === "group") {
    // console.log(Message.data)
  } else if (Message.Message === "stop" && Message.type === "toutiao") {
    toutiaoPending.value = "lock";
  } else if (Message.Message === "sendData" && Message.type === "toutiao") {
    console.log(Message.data);
    dHttp("CaptureSpecial/SaveOrUpdate", JSON.stringify(Message.data)).then(() => {
      ElMessage('上传成功一条');
    })
  } else if (Message.Message === "stop" && Message.type === "sohu") {
    sohuPending.value = "lock";
  } else if (Message.Message === "sendData" && Message.type === "sohu") {
    try {
      let res = await dHttp("CaptureSpecial/SaveOrUpdate", JSON.stringify(Message.data))
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  } else if (Message.Message === "stop" && Message.type === "facebook") {
    fbPending.value = "lock";
  } else if (Message.Message === "sendData" && Message.type === "facebook") {
    console.log(JSON.stringify(Message.data))
    dHttp("CaptureSpecial/SaveOrUpdate", JSON.stringify(Message.data)).then(() => {
      ElMessage('上传成功一条');
    })
  }
};
// if (!window.eventBus) {
//   chrome.runtime.onMessage.addListener(eventBus);
// }
// window.eventBus = eventBus;

onMounted(() => {


  chrome.storage.local.get('open', (res) => {
    if (typeof res.open === "number") {
      open.value = res.open
    }
  })


  state.system = isNaN(parseInt(localStorage.getItem("system"))) ? 1 : parseInt(localStorage.getItem("system"))

  watchEffect(() => {
    console.log(state.system)
    localStorage.setItem("system", state.system);
    if (state.system === 1) {
      reUrl.value = 'http://107.150.124.12/'
    } else {
      reUrl.value = 'http://test.44finefood.com/'
    }
  })


  if (!localStorage.getItem("tk") || !localStorage.getItem('ddid')) {
    nextTick(() => {
      setTimeout(() => {
        initDingLogin();
      });
      state.loginText = "钉钉未登录";
    });
  } else {
    state.loginText = `已登录：${localStorage.getItem("name")}`;
    state.isLogin = true;
  }
  chrome.runtime.onMessage.addListener(eventBus);
  checkType();
  getVersion();
  getPending();
});

function getPending() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "getPending",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                if (response.pending) {
                  try {
                    toutiaoPending.value = response.pending;
                    toutiaoMax.value = response.toutiaoMax;
                  } catch (e) {
                  }

                  try {
                    sohuPending.value = response.pending;
                    sohuMax.value = response.sohuMax;
                  } catch (e) {
                  }

                  try {
                    fbPending.value = response.pending;
                    fbMax.value = response.fbMax;
                  } catch (e) {
                  }
                }
              }
            }
        );
      }
  );
}

onActivated(() => {
});

function checkMP4(url) {
  try {
    xhrHttp(url).then((res) => {
    });
  } catch (e) {
  }
}

function getVersion() {
  http("/home/GetVersion", {}).then((res) => {
    console.log(res.version_code);
    if (res.version_code > state.version && res.src) {
      state.version = "点击下载最新版本";
      document.querySelector("#v_p").addEventListener("click", () => {
        window.open(res.src);
      });
    } else {
      state.version = "Version：" + state.version;
    }
  });
}

function initDingLogin() {
  let origin = location.origin;
  let base = origin + "/login";
  let redirectUrl = encodeURIComponent(base + "?type=dingding");
  let goto = encodeURIComponent(
      `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${dingTalkAppId}&response_type=code&scope=snsapi_login&state=${reUrl.value}&redirect_uri=http://ddlogin.anyelse.com/logincallback.ashx`
  );
  DDLogin({
    id: "login_container", // 这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
    goto: goto, // 请参考注释里的方式
    style: "border:none;background-color:#FFFFFF;",
    width: "365",
    height: "300",
  });
  let handleMessage = function (event) {
    let origin = event.origin;
    if (origin === "https://login.dingtalk.com") {
      // 判断是否来自ddLogin扫码事件。
      let loginTmpCode = event.data; // 拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
      let redirectURL = new URL(
          "/connect/oauth2/sns_authorize",
          "https://oapi.dingtalk.com"
      );
      redirectURL.searchParams.set("appid", dingTalkAppId);
      redirectURL.searchParams.set("response_type", "code");
      redirectURL.searchParams.set("scope", "snsapi_login");
      redirectURL.searchParams.set("state", reUrl.value);
      redirectURL.searchParams.set("redirect_uri", goto);
      redirectURL.searchParams.set("loginTmpCode", loginTmpCode);
      $.ajax({
        url: redirectURL.href,
        type: "get",
        // , beforeSend: function (XMLHttpRequest) {
        //     XMLHttpRequest.setRequestHeader("token", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxOD…");
        // }
        success: function (data) {
          if (data.StatusCode === 200) {
            console.log(data);
            localStorage.setItem("name", data.Data.username);
            localStorage.setItem("uid", data.Data.id);
            localStorage.setItem("tk", data.Data.token);
            localStorage.setItem("ddid", data.Data.dduserid)
            state.isLogin = true;
            state.loginText = `已登录：${localStorage.getItem("name")}`;
          } else {
            alert(`请先询问系统管理员添加权限后刷新重试`);
          }
        },
        error: function () {
          alert("登录失败，网络无连接")
        }
      });
    }
  };
  if (typeof window.addEventListener !== "undefined") {
    window.addEventListener("message", handleMessage, false);
  }
}

function trumpet_video() {
  data.videoPushType = 1;
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "video",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

function trumpet_video_hx() {
  data.videoPushType = 2;
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "video",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

function Copy_douyin() {
  router.push({
    name: "douyinVideo",
    query: {},
  });
}


function twitter_trumpet() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "image",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

function facebook_member() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "Group",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

function facebook_member_scroll() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "GroupScroll",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

function openBtn(BtnKey) {
  console.log(BtnKey);
  Object.keys(canUseBtn).forEach((key) => {
    if (key === BtnKey) {
      canUseBtn[BtnKey] = false;
    } else {
      canUseBtn[key] = true;
    }
  });
}

function checkType() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "checkType",
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      }
  );
}

const toutiaoMax = ref("");
const toutiaoPending = ref("lock");

function collectToutiao() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "article",
              toutiaoMax: toutiaoMax.value,
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                toutiaoPending.value = "start";
              }
            }
        );
      }
  );
}

function stopCollectToutiao() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "stop",
              toutiaoMax: toutiaoMax.value,
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                toutiaoPending.value = "stop";
              }
            }
        );
      }
  );
}

const sohuMax = ref("");
const sohuPending = ref("lock");

function collectSohu() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "article",
              sohuMax: sohuMax.value,
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                sohuPending.value = "start";
              }
            }
        );
      }
  );
}

function stopCollectSohu() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "stop",
              sohuMax: sohuMax.value,
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                sohuPending.value = "stop";
              }
            }
        );
      }
  );
}

const fbMax = ref("");
const fbPending = ref("lock");

function collectFacebook() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "article",
              fbMax: fbMax.value,
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                fbPending.value = "start";
              }
            }
        );
      }
  );
}

function stopCollectFacebook() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "stop",
              fbMax: fbMax.value,
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              } else {
                fbPending.value = "stop";
              }
            }
        );
      }
  );
}

//油管采集

function collectYoutube() {
  router.push({
    name: "YoutubeVideo",
    query: {},
  });
}

function collectShorts() {
  router.push({
    name: "ShortsVideo",
    query: {},
  });
}

function collectTiktok() {
  router.push({
    name: "TiktokVideo",
    query: {},
  });
}

function collectWeb() {
  router.push({
    name: "WebCollect",
    query: {},
  });
}

async function collectFBVideo() {

  let activeId = await getActiveId();
  let pageId = await getId("FBCollect");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/FBCollect?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}


// Ins博主采集历史
async function collectInsHistory() {

  let activeId = await getActiveId();
  let pageId = await getId("InsCollectHistory");

  // console.log(activeId, pageId)

  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId);
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/InsCollectHistory?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}


async function collectTiktokFrame() {
  let pageId = await getId("TiktokFrame");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/TiktokFrame',
      active: true
    }, (tab) => {

    })
  }
}

async function collectTiktokVideoFrame() {
  let activeId = await getActiveId();
  let pageId = await getId("TiktokVideoFrame");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/TiktokVideoFrame?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}

// TiktokVideo社团批量排程
async function collectTiktokVideoCommunitySchedulingFrame() {
  let activeId = await getActiveId();
  let pageId = await getId("TiktokVideoCommunitySchedulingFrame");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId);
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/TiktokVideoCommunitySchedulingFrame?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}


// YoutubeVideo社团批量排程
async function collectYoutubeVideoCommunitySchedulingFramePW() {
  let activeId = await getActiveId();
  let pageId = await getId("YoutubeVideoCommunitySchedulingFramePW");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId);
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/YoutubeVideoCommunitySchedulingFramePW?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}


// TwitterImage社团批量排程(图片)
async function collectTwitterImageCommunitySchedulingFrame() {
  let activeId = await getActiveId();
  let pageId = await getId("TwitterImageCommunitySchedulingFram");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId);
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/TwitterImageCommunitySchedulingFram?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}// TwitterImage社团批量排程(视频)
async function collectTwitterVideoCommunitySchedulingFrame() {
  let activeId = await getActiveId();
  let pageId = await getId("TwitterVideoCommunitySchedulingFram");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId);
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/TwitterVideoCommunitySchedulingFram?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}


// DouyinVideo社团批量排程
async function collectDouyinVideoCommunitySchedulingFrame() {
  let activeId = await getActiveId();
  let pageId = await getId("DouyinVideoCommunitySchedulingFrame");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId);
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/DouyinVideoCommunitySchedulingFrame?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}


async function collectNovel() {
  let activeId = await getActiveId();
  let pageId = await getId("Novel");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/Novel?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}

async function collectNovelSync() {
  chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
              Message: "asyncWaitNum"
            },
            function (response) {
              if (response?.state !== 200) {
                alert("插件已重新加载，请刷新页面");
              }
            }
        );
      });

  let activeId = await getActiveId();
  let pageId = await getId("Novel");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/Novel?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}

async function collectYoutubeNew() {

  let activeId = await getActiveId();
  let pageId = await getId("YoutubeVideoFrame");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/YoutubeVideoFrame?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }

}

async function collectYoutubeNewPW() {
  let activeId = await getActiveId();
  let pageId = await getId("YoutubeVideoFramePW");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/YoutubeVideoFramePW?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}

async function collectWebFrame() {
  let activeId = await getActiveId();
  let pageId = await getId("WebCollectFrame");
  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/WebCollectFrame?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  }
}

async function updateActiveId(page_id, active_id) {
  chrome.tabs.sendMessage(
      page_id,
      {
        Message: "updateActiveId",
        data: active_id
      },
      function (response) {
        if (response?.state !== 200) {
          ElMessage.warning({
            message: '插件已重新加载，请刷新页面'
          })
        }
      }
  );
}

async function getActiveId() {
  return new Promise((r) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    }, (tabs) => {
      r(tabs[0].id)
    })
  })
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


// 推特博主采集历史
async function collectTTHistory() {

  let activeId = await getActiveId();
  /* let pageId = await getId("TTCollectHistory");

  // console.log(activeId, pageId)

  if (pageId !== false) {
    await chrome.tabs.update(pageId, {
      active: true
    })
    await updateActiveId(pageId, activeId)
  } else {
    chrome.tabs.create({
      url: '/html/out.html#/TTCollectHistory?activeId=' + activeId,
      active: true
    }, (tab) => {

    })
  } */
  chrome.tabs.create({
    url: '/html/out.html#/TTCollectHistory?activeId=' + activeId,
    active: true
  }, (tab) => {

  })
}

// FB博主采集历史
async function collectFBHistory() {
  let activeId = await getActiveId();
  chrome.tabs.create({
    url: '/html/out.html#/FBCollectHistory?activeId=' + activeId,
    active: true
  }, (tab) => {

  })
}

</script>

<style scoped>
</style>
