<template>
  <v-layout class="rounded-md">
    <v-navigation-drawer :permanent="true" class="navigetDrav" :width="isCollapsed ? 65 : 280">
      <v-list class="dark:border-gray-700 py-4">
        <v-img
          :src="isCollapsed ? mkbankIcon : mkbanklogo"
          alt="Logo"
          contain
          max-height="40"
          class="mx-auto"
        />
      </v-list>

      <AppSideBar :is-collapsed="isCollapsed" />
    </v-navigation-drawer>

    <AppBars :is-collapsed="isCollapsed" @toggle-collapse="isCollapsed = !isCollapsed" />

    <v-main class="d-flex align-center justify-center" style="overflow: hidden">
      <div class="routerSize">
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppSideBar from '@/components/ui/AppSideBar.vue'
import AppBars from '@/components/ui/AppBars.vue'
import mkbanklogo from '@/assets/images/MKBANK.png'
import mkbankIcon from '@/assets/images/logoMini.png'

const isCollapsed = ref(false)
</script>

<style scoped>
.navigetDrav {
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  transition: width 0.3s ease;
}

.v-layout {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.routerSize {
  width: 100%;
  height: 90vh;
  overflow: auto;
}
</style>
