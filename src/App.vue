<template>
  <component :is="layoutComponent" />
  <!-- Global Snackbar -->
  <v-snackbar v-model="visible" :color="color" :timeout="timeout" location="top right">
    {{ text }}
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbarStore = useSnackbarStore()

import DefaultLayout from '@/Layout/DefaultLayout.vue'
import AuthLayout from '@/Layout/AuthLayout.vue'
import AdminLayout from '@/Layout/DashboardPage.vue'

const route = useRoute()

const { visible, text, color, timeout } = storeToRefs(snackbarStore)

const layoutComponent = computed(() => {
  const layout = route.meta.layout
  if (layout === 'auth') return AuthLayout
  if (layout === 'admin') return AdminLayout
  return DefaultLayout
})
</script>
