<template>
  <div style="height: 100vh;margin: 0;padding: 0;border-right: 1px solid #ccc;border-left: 1px solid #ccc">
    <div class="layout_top"
         style="height: 35px;display: flex;align-items: center;justify-content: flex-start;position: relative">
      <span style="font-size: 15px;font-weight: bold;margin-right: 5px">插件中控</span>
    </div>
    <div>
      <el-divider content-position="left">truvid监控</el-divider>
      <div style="width: 95%;margin-left: 2.5%">
        <el-input readonly v-model="ci_session">
          <template #prepend>ci_session</template>
          <template #append>{{ ci_session_status === 1 ? '有效' : '已过期' }}</template>
        </el-input>
      </div>

    </div>
  </div>

</template>

<script setup>

import {onMounted, reactive, ref} from "vue";

const ci_session = ref("")
const ci_session_status = ref(1)

onMounted(async () => {
  ci_session.value = await getCiSession()
})

function getCiSessionStatus() {
  chrome.tabs.create({
    url: '/html/out.html#/CenterControl',
    active: true
  }, () => {

  })
}

const cookieUrl = "https://beta.console.truvid.com"

async function refresh() {
  chrome.tabs.query({}, (tabs) => {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].url.includes('truvid.com')) {
        chrome.tabs.remove(tabs[i].id);
      }
    }
  })

  chrome.cookies.getAll({url: cookieUrl}, function (cookies) {
    for (var i = 0; i < cookies.length; ++i) {
      chrome.cookies.remove({url: cookieUrl, name: cookies[i].name});
    }
  });

  setTimeout(() => {
    chrome.tabs.create({
      url: 'https://beta.console.truvid.com/login',
      active: true
    }, () => {

    })
  }, 500)
}

chrome.runtime.onMessage.addListener(async (Message) => {
  if (Message.Message === 'updateCiSession') {
    console.log('更新cookies');
    ci_session.value = await getCiSession();
    fetch("http://captureapi.anyelse.com/SysConfig/update?key=truvid_cookie_from_plug&value=" + ci_session.value + "&remarks=插件自动获取", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {

    })

    chrome.tabs.query({}, (tabs) => {
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url.includes('truvid.com')) {
          chrome.tabs.remove(tabs[i].id);
        }
      }
    })
  }
});

async function getCiSession() {
  return new Promise((r) => {
    chrome.cookies.getAll({
      domain: 'truvid.com'
    }, (cookies) => {
      cookies.map((c) => {
        if (c.name === 'ci_session') {
          r(c.value);
        }
      })
      r("")
    })
  })
}

function activeRefresh() {
  refresh();
}

window.refresh = activeRefresh;

setInterval(() => {
  refresh();
}, 1000 * 60 * 10)

</script>

<style scoped>

</style>