<template>
  <div class="pdf-viewer">
    <v-btn icon class="back-btn" @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
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

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const pdfWrapper = ref(null)

const goBack = () => router.go(-1)

const renderPDF = async (url) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url)
    const pdf = await loadingTask.promise

    const ratio = window.devicePixelRatio || 1
    const screenWidth = window.innerWidth
    let scale = screenWidth < 768 ? 0.7 : 1.2

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = viewport.width * ratio
      canvas.height = viewport.height * ratio

      canvas.style.width = viewport.width + 'px'
      canvas.style.height = viewport.height + 'px'

      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      await page.render({ canvasContext: context, viewport }).promise
      pdfWrapper.value.appendChild(canvas)
    }
  } catch (err) {
    console.error(err)
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
  renderPDF(decodedUrl)
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
  top: 16px;
  left: 16px;
  z-index: 10;
}

.pdf-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
  touch-action: manipulation;
  padding-top: 70px;
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
</style>
