<template>
  <div class="files-viewer-container">
    <div class="PrevExit">
      <v-tooltip text="Orqaga qaytish">
        <template #activator="{ props }">
          <v-btn icon color="white" v-bind="props" @click="exit">
            <v-icon>mdi-arrow-left</v-icon>
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

    <div v-else class="file-container">
      <div ref="pdfWrapper" class="pdf-pages" />
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/routerId.js'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const router = useRouter()
const appStore = useAppStore()
const route = useRoute()

const currentFileUrl = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTab = ref(0)
const fileSections = ref([])
const pdfWrapper = ref(null)

const renderPDF = async (url) => {
  try {
    if (!pdfWrapper.value) return
    pdfWrapper.value.innerHTML = ''

    const loadingTask = pdfjsLib.getDocument(url)
    const pdf = await loadingTask.promise

    const ratio = window.devicePixelRatio || 1
    const screenWidth = window.innerWidth

    let scale = 1.5
    if (screenWidth < 768) {
      scale = 0.5
    }

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.style.width = viewport.width + 'px'
      canvas.style.height = viewport.height + 'px'

      canvas.width = viewport.width * ratio
      canvas.height = viewport.height * ratio

      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      await page.render({ canvasContext: context, viewport }).promise
      pdfWrapper.value.appendChild(canvas)
    }
  } catch (err) {
    error.value = `PDF yuklashda xatolik: ${err.message}`
    currentFileUrl.value = null
  } finally {
    loading.value = false
  }
}

const loadFile = async (section) => {
  try {
    if (section && section.url) {
      currentFileUrl.value = section.url
      const sectionIndex = fileSections.value.findIndex((s) => s.id === section.id)

      if (sectionIndex !== -1) {
        activeTab.value = sectionIndex
      }

      await nextTick()
      await renderPDF(section.url)
    } else {
      throw new Error('PDF URL topilmadi')
    }
  } catch (err) {
    error.value = `PDF yuklashda xatolik: ${err.message}`
    currentFileUrl.value = null
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

const retryLoad = () => initializeFiles()

const getTabClass = (type) => {
  const classes = {
    reference: 'reference-tab',
    resolution: 'resolution-tab',
    presentation: 'presentation-tab',
    app_file: 'app-file-tab',
  }
  return classes[type] || 'default-tab'
}

const exit = async () => {
  const boardId = appStore.selectedId
  if (boardId) router.push({ name: 'BoardMeeting', params: { id: boardId } })
  else router.push({ name: 'BoardMeeting' })
}

onMounted(() => {
  initializeFiles()
})

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
  left: 5px;
  top: 5px;
  z-index: 10000;
}

.file-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  position: relative;
  background-color: white;
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
.pdf-pages {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  .files-viewer-container {
    height: 87vh;
  }
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
