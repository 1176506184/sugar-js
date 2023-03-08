<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive"/>
    </router-view>
  </div>
</template>

<script setup>
import router from "./router";
const route = router.getRoutes();


</script>

<style scoped>

</style>