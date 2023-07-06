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
          style="font-size: 14px; margin-right: 15px"
      >
        {{ state.loginText }}
      </el-button>
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
            </div>
          </el-collapse-item>
          <el-collapse-item title="推特图片" name="2">
            <div>
              <el-button
                  @click="twitter_trumpet"
                  type="primary"
                  :disabled="type !== 'twitter'"
              >小号素材库
              </el-button
              >
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
          <el-collapse-item title="脸书博主" name="5">
            <div style="display: flex">
              <el-input
                  placeholder="最大采集文章数"
                  style="width: 140px; margin-right: 15px"
                  v-model="toutiaoMax"
              ></el-input>
              <el-button
                  type="primary"
                  @click="collectToutiao"
                  v-if="toutiaoPending !== 'start'"
              >开始采集
              </el-button>
              <el-button type="danger" @click="stopCollectToutiao" v-else>停止采集
              </el-button>
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
    <div id="version">
      <p id="v_p" style="cursor: pointer">{{ state.version }}</p>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
import {guid} from "../utils/utils";

const dingTalkAppId = "dingoac12xjewgmuqs2sea";
import {nextTick, onActivated, onMounted, reactive, ref} from "vue";
import {parseDate} from "../../utils/formatDate";
import store from "../store/store.js";
import {computed} from "vue";
import {http, xhrHttp, sHttp} from "../utils/request";

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
  version: "2.1",
});

const loading = ref(false);

const canUseBtn = reactive({
  trumpetVideo: true,
  twitterImage: true,
});

const toutiaoPending = ref("lock");
const eventBus = function (Message, sender, sendResponse) {
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
  }
  else if (Message.Message === "stop" && Message.type === "sohu") {
    sohuPending.value = "lock";
    // 调接口，传采集数据
    loading.value = true;
    let data = Message.data;
    alert(JSON.stringify(data));
    loading.value = false;
  }
};
// if (!window.eventBus) {
//   chrome.runtime.onMessage.addListener(eventBus);
// }
// window.eventBus = eventBus;

onMounted(() => {
  if (!localStorage.getItem("tk")) {
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
              } catch (e) {}

              try {
                sohuPending.value = response.pending;
                sohuMax.value = response.sohuMax;
              } catch (e) {}
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
  const reUrl = "http://107.150.124.12/";
  let goto = encodeURIComponent(
      `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${dingTalkAppId}&response_type=code&scope=snsapi_login&state=${reUrl}&redirect_uri=http://ddlogin.anyelse.com/logincallback.ashx`
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
      redirectURL.searchParams.set("state", reUrl);
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
            localStorage.setItem("name", data.Data.username);
            localStorage.setItem("uid", data.Data.id);
            localStorage.setItem("tk", data.Data.token);
            state.isLogin = true;
            state.loginText = `已登录：${localStorage.getItem("name")}`;
          }
        },
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
const sohuPending = ref("lock")

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
</script>

<style scoped>
</style>