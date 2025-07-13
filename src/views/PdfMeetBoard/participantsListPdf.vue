<template>
  <div class="pdf-viewer-container">
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
      <p class="mt-4">PDF yuklanmoqda...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <v-icon color="error" size="48">mdi-alert-circle</v-icon>
      <p class="mt-4 text-error">{{ error }}</p>
      <v-btn @click="retryLoad" color="primary" class="mt-4">Qayta urinish</v-btn>
    </div>

    <div v-else-if="currentPdfUrl" class="pdf-container">
      <iframe
        :src="currentPdfUrl"
        class="pdf-iframe"
        width="100%"
        height="800px"
        frameborder="0"
      ></iframe>
    </div>

    <div v-else class="no-pdf-container">
      <v-icon color="grey" size="64">mdi-file-pdf-box</v-icon>
      <p class="mt-4">PDF topilmadi</p>
    </div>

    <!-- PDF tugmalari -->
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/routerId.js'

const router = useRouter()
const appStore = useAppStore()

const route = useRoute()
const currentPdfUrl = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTab = ref(0)

const pdfSections = ref([])

const loadPdf = (section) => {
  loading.value = true
  error.value = null

  try {
    if (section && section.url) {
      currentPdfUrl.value = section.url
      const sectionIndex = pdfSections.value.findIndex((s) => s.id === section.id)
      if (sectionIndex !== -1) {
        activeTab.value = sectionIndex
      }
    } else {
      throw new Error('PDF URL topilmadi')
    }
  } catch (err) {
    error.value = `PDF yuklashda xatolik: ${err.message}`
    currentPdfUrl.value = null
  } finally {
    loading.value = false
  }
}

const initializePdfs = () => {
  loading.value = true
  error.value = null

  try {
    const firstPdfUrl = route.query.firstPdfUrl || route.params.firstPdfUrl
    const secondPdfUrl = route.query.secondPdfUrl || route.params.secondPdfUrl
    const activeType = route.query.activeType || 'local'

    if (firstPdfUrl || secondPdfUrl) {
      pdfSections.value = []

      const decodedFirstUrl = decodeURIComponent(firstPdfUrl || '')
      const decodedSecondUrl = decodeURIComponent(secondPdfUrl || '')

      if (decodedFirstUrl) {
        pdfSections.value.push({
          id: 'first',
          name: getPdfLabelFromUrl(decodedFirstUrl),
          type: 'first',
          url: decodedFirstUrl,
        })
      }

      if (decodedSecondUrl) {
        pdfSections.value.push({
          id: 'second',
          name: getPdfLabelFromUrl(decodedSecondUrl),
          type: 'second',
          url: decodedSecondUrl,
        })
      }

      if (pdfSections.value.length > 0) {
        let targetSection = pdfSections.value[0]

        if (activeType === 'regional' && pdfSections.value.length > 1) {
          targetSection = pdfSections.value[1]
        }

        loadPdf(targetSection)
      }
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

const getPdfLabelFromUrl = (url) => {
  if (!url) return 'PDF'

  if (url.includes('locals')) return "Tarkibiy bo'limlar"
  if (url.includes('regionals')) return "Xududiy bo'limlar"

  return 'PDF'
}
const retryLoad = () => {
  initializePdfs()
}

const getTabClass = (type) => {
  const classes = {
    first: 'first-tab',
    second: 'second-tab',
  }
  return classes[type] || ''
}

const getTabIcon = (type) => {
  const icons = {
    first: 'mdi-file-document-outline',
    second: 'mdi-file-document',
  }
  return icons[type] || 'mdi-file-document'
}

const getTabIconColor = (type) => {
  const colors = {
    first: 'primary',
    second: 'success',
  }
  return colors[type] || 'primary'
}

const exit = async () => {
  const id = appStore.selectedId
  console.log(id)
  if (id) {
    router.push({ name: 'BoardMeeting', params: { id: id } })
  } else {
    router.push({ name: '/info-meeting' })
  }
}

// Lifecycle
onMounted(() => {
  initializePdfs()
})

watch(
  () => [route.params.firstPdfUrl, route.params.secondPdfUrl],
  () => {
    initializePdfs()
  },
  { deep: true },
)

watch(
  () => [route.query.firstPdfUrl, route.query.secondPdfUrl],
  () => {
    initializePdfs()
  },
  { deep: true },
)
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
  left: 0;
  top: 60px;
  z-index: 10000;
}

.pdf-container {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
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
}

.loading-container {
  background: white;
}

.error-container {
  background: #fafafa;
}

.no-pdf-container {
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

.first-tab.v-tab--selected {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1976d2;
}

.second-tab.v-tab--selected {
  background-color: rgba(76, 175, 80, 0.08);
  color: #4caf50;
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
