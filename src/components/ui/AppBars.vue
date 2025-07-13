<template>
  <v-app-bar
    flat
    :style="{ backgroundColor: theme.global.current.value.colors.surface }"
    class="px-4 py-2 border-b shadow-sm"
  >
    <v-btn icon @click="$emit('toggle-collapse')" class="mx-2 mt-2">
      <v-icon>{{ isCollapsed ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <v-text-field
      v-model="search"
      placeholder="Search or type command..."
      append-inner-icon="mdi-magnify"
      density="compact"
      hide-details
      single-line
      class="mx-auto"
      style="max-width: 400px; display: none"
    />
    <v-spacer />
    <v-btn icon @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
    </v-btn>

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="px-3 py-2 rounded-xl d-flex align-center gap-3 hover:bg-gray-100 transition-all"
          height="40"
          width="auto"
        >
          <v-avatar size="40" class="border-gray-300 mr-3">
            <v-img :src="userImage" alt="User avatar" />
          </v-avatar>

          <div class="text-left">
            <div class="text-base text-gray-800 leading-tight">
              {{ reductionWord(user.fullName) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ user.position || 'Admin' }}
            </div>
          </div>

          <v-icon size="20" class="text-gray-500 ml-2">mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-card class="w-64 py-2 rounded-xl">
        <div class="px-4 pb-2">
          <div class="font-semibold text-base">{{ user.fullName }}</div>
        </div>
        <v-divider class="my-2" />

        <v-list nav density="comfortable">
          <v-list-item prepend-icon="mdi-account-edit" title="Edit profile" />
          <v-list-item prepend-icon="mdi-cog-outline" title="Account settings" />
          <v-list-item prepend-icon="mdi-lifebuoy" title="Support" />
        </v-list>

        <v-divider class="my-2" />

        <v-list-item
          prepend-icon="mdi-logout"
          title="Sign out"
          @click="logout"
          class="text-red-500"
        />
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { useTheme } from 'vuetify'
import router from '@/router/index.js'

defineProps({
  isCollapsed: Boolean,
})

const search = ref('')
const userImage =
  'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/2d/db/22/2ddb228a-f5d9-5f0e-b7a1-7a3727d8230e/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png'

const theme = useTheme()
const isDark = ref(localStorage.getItem('theme') === 'dark')

theme.global.name.value = isDark.value ? 'dark' : 'light'

function toggleTheme() {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'dark' : 'light'
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
const user = {
  fullName: 'MKBank',
}

const logout = async () => {
  localStorage.removeItem('access')
  localStorage.removeItem('user')
  await router.push('/login')
  location.reload()
}

const reductionWord = (word) => {
  if (word.length > 10) {
    return word.slice(0, 10) + '...'
  }
  return word
}
</script>
<style scoped>
.v-app-bar {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--v-theme-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-right: 10px;
}
.text-gray-800 {
  color: var(--v-theme-on-surface);
}
</style>
