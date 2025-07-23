<template>
  <div class="pdf-viewer-container">
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
      <p class="mt-4">PDF yuklanmoqda...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <v-icon color="error" size="48">mdi-alert-circle</v-icon>
      <p class="mt-4 text-error">{{ error }}</p>
      <v-btn @click="retryLoad" color="primary" class="mt-4">Qayta urinish</v-btn>
    </div>

    <div class="pdf-pages" ref="pdfWrapper"></div>

    <div class="tabs-container">
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
          v-for="(section, index) in pdfSections"
          :key="index"
          class="modern-tab"
          :class="getTabClass(section.type)"
          @click="loadPdf(section)"
        >
          <div class="tab-content">
            <v-icon :color="getTabIconColor(section.type)" class="mr-2">
              {{ getTabIcon(section.type) }}
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
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url'
import { useAppStore } from '@/stores/routerId.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const currentPdfUrl = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTab = ref(0)
const pdfSections = ref([])
const pdfWrapper = ref(null)

const renderPDF = async (url) => {
  loading.value = true
  error.value = null

  try {
    const loadingTask = pdfjsLib.getDocument(url)
    const pdf = await loadingTask.promise
    pdfWrapper.value.innerHTML = ''

    const ratio = window.devicePixelRatio || 1

    let scale = 1.25
    const screenWidth = window.innerWidth

    if (screenWidth < 768) {
      scale = 0.5
    } else if (screenWidth < 1024) {
      scale = 0.9
    } else {
      scale = 1.6
    }

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.className = 'pdf-canvas'
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
    console.error(err)
    error.value = `PDF yuklashda xatolik: ${err.message}`
    currentPdfUrl.value = null
  } finally {
    loading.value = false
  }
}

const loadPdf = async (section) => {
  try {
    if (section && section.url) {
      currentPdfUrl.value = section.url
      const sectionIndex = pdfSections.value.findIndex((s) => s.id === section.id)
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
    currentPdfUrl.value = null
  }
}

const initializePdfs = () => {
  loading.value = true
  error.value = null

  try {
    const firstPdfUrl = route.query.firstPdfUrl || route.params.firstPdfUrl
    const secondPdfUrl = route.query.secondPdfUrl || <route class="params secondPdfUrl"></route>
    const activeType = route.query.activeType || 'local'
    const firstType = route.query.firstType || 'local'
    const secondType = route.query.secondType || 'regional'

    if (firstPdfUrl || secondPdfUrl) {
      pdfSections.value = []

      const decodedFirstUrl = decodeURIComponent(firstPdfUrl || '')
      const decodedSecondUrl = decodeURIComponent(secondPdfUrl || '')

      const getTabName = (type) => {
        switch (type) {
          case 'local':
            return "Tarkibiy bo'linmalar"
          case 'regional':
            return "Xududiy bo'linmalar rahbarlari"
          default:
            return "Ma'lumot"
        }
      }

      if (decodedFirstUrl) {
        pdfSections.value.push({
          id: 'first',
          name: getTabName(firstType),
          type: firstType,
          url: decodedFirstUrl,
        })
      }
      if (decodedSecondUrl) {
        pdfSections.value.push({
          id: 'second',
          name: getTabName(secondType),
          type: secondType,
          url: decodedSecondUrl,
        })
      }

      const targetSection =
        pdfSections.value.find((section) => section.type === activeType) || pdfSections.value[0]

      loadPdf(targetSection)
    } else {
      throw new Error('PDF URL lari topilmadi')
    }
  } catch (err) {
    error.value = `PDF yuklashda xatolik: ${err.message}`
    currentPdfUrl.value = null
  } finally {
    loading.value = false
  }
}

const retryLoad = () => initializePdfs()

const getTabClass = (type) => {
  const classes = {
    local: 'local-tab',
    regional: 'regional-tab',
  }
  return classes[type] || 'default-tab'
}

const getTabIcon = (type) => {
  const icons = {
    local: 'mdi-account-group',
    regional: 'mdi-account-tie',
  }
  return icons[type] || 'mdi-file-document'
}

const getTabIconColor = (type) => {
  const colors = {
    local: 'primary',
    regional: 'success',
  }
  return colors[type] || 'primary'
}
const exit = () => {
  const id = appStore.selectedId
  if (id) router.push({ name: 'BoardMeeting', params: { id } })
  else router.push({ name: '/info-meeting' })
}

onMounted(() => initializePdfs())
watch(() => [route.params.firstPdfUrl, route.params.secondPdfUrl], initializePdfs, { deep: true })
watch(() => [route.query.firstPdfUrl, route.query.secondPdfUrl], initializePdfs, { deep: true })
</script>

<style scoped>
.pdf-viewer-container {
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

.pdf-pages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
}

.pdf-canvas {
  margin-bottom: 16px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  max-width: 100%;
}

.loading-container,
.error-container,
.no-pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  background: white;
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

.first-tab.v-tab--selected {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1976d2;
}

.second-tab.v-tab--selected {
  background-color: rgba(76, 175, 80, 0.08);
  color: #4caf50;
}
.local-tab.v-tab--selected {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1976d2;
}

.regional-tab.v-tab--selected {
  background-color: rgba(76, 175, 80, 0.08);
  color: #4caf50;
}

.default-tab.v-tab--selected {
  background-color: rgba(158, 158, 158, 0.08);
  color: #9e9e9e;
}

@media (max-width: 768px) {
  .pdf-viewer-container {
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
