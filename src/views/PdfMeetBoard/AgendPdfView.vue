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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentPdfUrl = ref(null)
const loading = ref(false)
const error = ref(null)

const loadPdf = async () => {
  loading.value = true
  error.value = null

  try {
    const pdfUrl = route.query.pdfUrl || route.params.pdfUrl

    if (pdfUrl) {
      currentPdfUrl.value = decodeURIComponent(pdfUrl)
    } else {
      throw new Error('PDF manzili yo‘q')
    }
  } catch (err) {
    error.value = `PDF yuklashda xatolik: ${err.message}`
    currentPdfUrl.value = null
  } finally {
    loading.value = false
  }
}

const retryLoad = () => {
  loadPdf()
}
const exit = async () => {
  router.go(-1)
}

onMounted(loadPdf)

watch(() => route.query.pdfUrl, loadPdf)
watch(() => route.params.pdfUrl, loadPdf)
</script>

<style scoped>
.pdf-viewer-container {
  position: relative;
  height: auto;
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

.pdf-display-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.pdf-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.pdf-object {
  width: 100%;
  height: 100%;
  border: none;
}

.pdf-embed {
  width: 100%;
  height: 100%;
  border: none;
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

@media (max-width: 768px) {
  .pdf-viewer-container {
    height: 100vh;
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
