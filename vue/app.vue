<template>
  <div>
    <el-config-provider :locale="locale">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive"/>
      </router-view>
    </el-config-provider>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

</script>

<style scoped>

</style>