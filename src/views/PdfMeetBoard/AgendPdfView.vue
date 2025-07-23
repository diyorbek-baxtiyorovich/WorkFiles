<template>
  <div class="pdf-viewer">
    <v-btn icon class="back-btn" @click="goBack" @touchstart="goBack" size="large">
      <v-icon size="large">mdi-arrow-left</v-icon>
    </v-btn>

    <div v-if="loading" class="loading">
      <v-progress-circular indeterminate color="primary" />
      <p>Yuklanmoqda...</p>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-show="!loading && !error" ref="pdfWrapper" class="pdf-wrapper" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url'
import panzoom from 'panzoom'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const pdfWrapper = ref(null)

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const renderPDF = async (url) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url)
    const pdf = await loadingTask.promise

    const ratio = window.devicePixelRatio || 1
    const screenWidth = window.innerWidth

    let scale = screenWidth < 768 ? 0.5 : 1.2

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = viewport.width * ratio
      canvas.height = viewport.height * ratio

      canvas.style.width = viewport.width + 'px'
      canvas.style.height = viewport.height + 'px'
      canvas.style.marginBottom = '20px'
      canvas.style.borderRadius = '8px'
      canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'

      const context = canvas.getContext('2d')
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      await page.render({ canvasContext: context, viewport }).promise

      pdfWrapper.value.appendChild(canvas)
    }
  } catch (err) {
    error.value = `Xatolik: ${err.message}`
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const rawUrl = route.query.pdfUrl || route.params.pdfUrl
  if (!rawUrl) {
    error.value = 'PDF URL topilmadi'
    loading.value = false
    return
  }

  const decodedUrl = decodeURIComponent(rawUrl)
  await nextTick()
  await renderPDF(decodedUrl)
  await nextTick()

  if (pdfWrapper.value) {
    panzoom(pdfWrapper.value, {
      maxZoom: 4,
      minZoom: 0.6,
      zoomDoubleClickSpeed: 1,
      bounds: true,
      boundsPadding: 0.1,
      contain: 'inside',
      beforeTransform: (e) => {
        e.x = 0
        return true
      },
    })
  }
})
</script>

<style scoped>
.pdf-viewer {
  position: relative;
  padding: 20px;
  min-height: 100vh;
  background: #f8f8f8;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10000;
  pointer-events: auto !important;
  background: white !important;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 56px !important;
  height: 56px !important;
  min-width: 56px !important;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:hover {
  background: #f5f5f5 !important;
}

.back-btn:active {
  transform: scale(0.95);
  background: #e0e0e0 !important;
}

.pdf-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 80px 0 20px;
  touch-action: pan-y;
  position: relative;
  z-index: 1;
}

.pdf-canvas {
  background: white;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 100%;
  height: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  color: #666;
}

.error {
  color: red;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .back-btn {
    top: 10px;
    left: 10px;
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
  }

  .pdf-wrapper {
    padding: 70px 10px 20px;
  }
}
</style>
