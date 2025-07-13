<template>
  <div class="files-viewer-container">
    <div class="PrevExit">
      <v-tooltip text="Orqaga qaytish">
        <template #activator="{ props }">
          <v-btn icon color="blue" v-bind="props" @click="exit">
            <v-icon>mdi-arrow-left-bold</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4">Fayl yuklanmoqda...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <v-icon color="error" size="48">mdi-alert-circle</v-icon>
      <p class="mt-4 text-error">{{ error }}</p>
      <v-btn @click="retryLoad" color="primary" class="mt-4">Qayta urinish</v-btn>
    </div>

    <div v-else-if="currentFileUrl" class="file-container">
      <iframe
        :src="currentFileUrl"
        class="file-iframe"
        width="100%"
        height="800px"
        frameborder="0"
      ></iframe>
    </div>

    <div v-else class="no-file-container">
      <v-icon color="grey" size="64">mdi-file-outline</v-icon>
      <p class="mt-4">Fayl topilmadi</p>
    </div>

    <div class="tabs-container" v-if="fileSections.length > 1">
      <v-tabs
        v-model="activeTab"
        class="modern-tabs"
        bg-color="white"
        slider-color="primary"
        slider-size="3"
        grow
        show-arrows
        elevation="2"
      >
        <v-tab
          v-for="(section, index) in fileSections"
          :key="index"
          class="modern-tab"
          :class="getTabClass(section.type)"
          @click="loadFile(section)"
        >
          <div class="tab-content">
            <v-icon :color="section.color" class="mr-2">
              {{ section.icon }}
            </v-icon>
            <span class="tab-text">{{ section.name }}</span>
          </div>
        </v-tab>
      </v-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/routerId.js'

const router = useRouter()
const appStore = useAppStore()

const route = useRoute()
const currentFileUrl = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTab = ref(0)
const fileSections = ref([])

const loadFile = (section) => {
  loading.value = true
  error.value = null

  try {
    if (section && section.url) {
      currentFileUrl.value = section.url
      const sectionIndex = fileSections.value.findIndex((s) => s.id === section.id)
      if (sectionIndex !== -1) {
        activeTab.value = sectionIndex
      }
    } else {
      throw new Error('Fayl URL topilmadi')
    }
  } catch (err) {
    error.value = `Fayl yuklashda xatolik: ${err.message}`
    currentFileUrl.value = null
  } finally {
    loading.value = false
  }
}
const initializeFiles = () => {
  loading.value = true
  error.value = null

  try {
    const totalFiles = parseInt(route.query.totalFiles) || 0
    const activeType = route.query.activeType

    if (totalFiles > 0) {
      fileSections.value = []

      for (let i = 0; i < totalFiles; i++) {
        const fileType = route.query[`file${i}_type`]
        const fileName = route.query[`file${i}_name`]
        const fileUrl = decodeURIComponent(route.query[`file${i}_url`] || '')
        const fileIcon = route.query[`file${i}_icon`]
        const fileColor = route.query[`file${i}_color`]
        const fileIndex =
          route.query[`file${i}_index`] !== undefined ? parseInt(route.query[`file${i}_index`]) : i

        if (fileType && fileName && fileUrl) {
          fileSections.value.push({
            id: `file_${i}`,
            name: fileName,
            type: fileType,
            url: fileUrl,
            icon: fileIcon,
            color: fileColor,
            index: fileIndex,
          })
        }
      }

      if (fileSections.value.length > 0) {
        let targetSection = fileSections.value[0]

        if (activeType) {
          if (activeType.startsWith('app_file_')) {
            const appIndex = parseInt(activeType.split('_')[2])
            const match = fileSections.value.find(
              (f) => f.type === 'app_file' && f.index === appIndex,
            )
            if (match) targetSection = match
          } else {
            // Boshqa turlarda aniqlash
            const match = fileSections.value.find((f) => f.type === activeType)
            if (match) targetSection = match
          }
        }

        loadFile(targetSection)
      }
    } else {
      throw new Error('Fayllar topilmadi')
    }
  } catch (err) {
    error.value = `Fayllar yuklashda xatolik: ${err.message}`
    currentFileUrl.value = null
  } finally {
    loading.value = false
  }
}

const retryLoad = () => {
  initializeFiles()
}

const getTabClass = (type) => {
  const classes = {
    reference: 'reference-tab',
    resolution: 'resolution-tab',
    presentation: 'presentation-tab',
    app_file: 'app-file-tab',
  }
  return classes[type] || 'default-tab'
}

onMounted(() => {
  initializeFiles()
})
const exit = async () => {
  const boardId = appStore.selectedId
  if (boardId) {
    router.push({ name: 'BoardMeeting', params: { id: boardId } })
  } else {
    router.push({ name: 'BoardMeeting' })
  }
}

watch(
  () => route.query,
  () => {
    initializeFiles()
  },
  { deep: true },
)
</script>

<style scoped>
.files-viewer-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
.PrevExit {
  position: absolute;
  left: 0;
  top: 60px;
  z-index: 10000;
}

.file-container {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.file-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.loading-container,
.error-container,
.no-file-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.loading-container {
  background: white;
}

.error-container {
  background: #fafafa;
}

.no-file-container {
  background: #f5f5f5;
}

.tabs-container {
  background: white;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.modern-tabs {
  border-radius: 0;
}

.modern-tab {
  min-height: 64px;
  font-weight: 500;
  text-transform: none;
  transition: all 0.3s ease;
}

.modern-tab:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.modern-tab.v-tab--selected {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1976d2;
}

.tab-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
}

.tab-text {
  font-size: 14px;
  font-weight: 500;
}

.reference-tab.v-tab--selected {
  background-color: rgba(255, 152, 0, 0.08);
  color: #ff9800;
}

.resolution-tab.v-tab--selected {
  background-color: rgba(156, 39, 176, 0.08);
  color: #9c27b0;
}

.presentation-tab.v-tab--selected {
  background-color: rgba(0, 150, 136, 0.08);
  color: #009688;
}

.app-file-tab.v-tab--selected {
  background-color: rgba(63, 81, 181, 0.08);
  color: #3f51b5;
}

@media (max-width: 768px) {
  .tab-content {
    padding: 4px 8px;
  }

  .tab-text {
    font-size: 12px;
  }

  .modern-tab {
    min-height: 56px;
  }
}

@media (max-width: 420px) {
  .PrevExit {
    position: absolute;
    left: 2px;
    top: 2px;
    z-index: 10000;
  }
}
</style>
