<template>
  <div class="features-section">
    <div class="logout">
      <v-tooltip text="Чиқиш">
        <template #activator="{ props }">
          <v-btn icon color="red" v-bind="props" @click="modelValue = true">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <div class="PrevExit">
      <v-tooltip text="Орқага қайтиш">
        <template #activator="{ props }">
          <v-btn icon color="white" v-bind="props" @click="exit">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <v-container>
      <v-row justify="center" class="mb-5">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="section-title mb-4">Бошқарув мажлиси материаллари тўплами</h2>
          <p class="section-subtitle">
            Замонавий корпоратив бошқарув тамойиллари асосида самарали ва шаффоф фаолият
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card
            class="feature-card"
            elevation="0"
            @click="navigateToAgenda"
            @mouseenter="playHoverAnimation('kun-tartibi')"
            @mouseleave="resetHoverAnimation('kun-tartibi')"
          >
            <v-card-text class="pa-4">
              <div class="feature-content">
                <div class="feature-icon-wrapper kun-tartibi-icon">
                  <v-icon
                    :class="['feature-icon', { 'icon-animate': animatingIcons['kun-tartibi'] }]"
                    size="36"
                    color="primary"
                  >
                    mdi-calendar-text-outline
                  </v-icon>
                </div>
                <h3 class="feature-title">Кун тартиби</h3>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-expansion-panels
            v-model="expandedPanels"
            multiple
            class="expansion-panels"
            variant="accordion"
          >
            <v-expansion-panel class="expansion-panel" elevation="0">
              <v-expansion-panel-title class="panel-title">
                <div class="panel-header">
                  <div class="panel-icon-wrapper participants-icon">
                    <v-icon color="success" size="40"> mdi-account-multiple </v-icon>
                  </div>
                  <div class="panel-info">
                    <h3 class="panel-title-text">Иштирокчилар рўйхати</h3>
                    <p class="panel-subtitle">Йиғилиш иштирокчилари</p>
                  </div>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-row class="panel-content">
                  <v-col cols="12" md="6">
                    <v-card
                      class="participant-card"
                      elevation="2"
                      @click="navigateToParticipants('local')"
                    >
                      <v-card-text class="pa-4">
                        <div class="participant-item">
                          <v-icon color="primary" size="32" class="mb-2">
                            mdi-account-group
                          </v-icon>
                          <h4 class="participant-title">Таркибий</h4>
                          <p class="participant-desc">Асосий иштирокчилар</p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card
                      class="participant-card"
                      elevation="2"
                      @click="navigateToParticipants('regional')"
                    >
                      <v-card-text class="pa-4">
                        <div class="participant-item">
                          <v-icon color="secondary" size="32" class="mb-2">
                            mdi-account-tie
                          </v-icon>
                          <h4 class="participant-title">Худудий бўлимлар раҳбарлари</h4>
                          <p class="participant-desc">Вилоят раҳбарлари</p>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <div class="mt-7">
              <v-expansion-panel
                v-for="(topic, index) in eventTopics"
                :key="topic.id"
                class="expansion-panel"
                elevation="0"
              >
                <v-expansion-panel-title class="panel-title">
                  <div class="panel-header">
                    <div class="panel-icon-wrapper agenda-files-icon">
                      <v-icon color="info" size="40"> mdi-folder-multiple-outline </v-icon>
                    </div>
                    <div class="panel-info">
                      <h3 class="panel-title-text">
                        {{ topic.agenda_files?.title || topic.title }}
                      </h3>
                    </div>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <v-row class="panel-content">
                    <v-col v-if="topic.agenda_files?.reference" cols="12" sm="6" md="4">
                      <v-card
                        class="file-card reference-card"
                        elevation="2"
                        @click="navigateToReference(topic.agenda_files)"
                      >
                        <v-card-text class="pa-4">
                          <div class="file-item">
                            <v-icon color="orange" size="32" class="mb-2">
                              mdi-file-document-outline
                            </v-icon>
                            <h4 class="file-title">Маълумотнома</h4>
                            <p class="file-desc">Асосий маълумотлар</p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col v-if="topic.agenda_files?.resolution" cols="12" sm="6" md="4">
                      <v-card
                        class="file-card resolution-card"
                        elevation="2"
                        @click="navigateToResolution(topic.agenda_files)"
                      >
                        <v-card-text class="pa-4">
                          <div class="file-item">
                            <v-icon color="purple" size="32" class="mb-2"> mdi-gavel </v-icon>
                            <h4 class="file-title">Қарор лойиҳаси</h4>
                            <p class="file-desc">Қарор xужжати</p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col v-if="topic.agenda_files?.presentation" cols="12" sm="6" md="4">
                      <v-card
                        class="file-card presentation-card"
                        elevation="2"
                        @click="navigateToPresentation(topic.agenda_files)"
                      >
                        <v-card-text class="pa-4">
                          <div class="file-item">
                            <v-icon color="teal" size="32" class="mb-2"> mdi-presentation </v-icon>
                            <h4 class="file-title">Тақдимот</h4>
                            <p class="file-desc">Презентация</p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Ilovalar -->
                    <v-col
                      v-for="(appFileUrl, appIndex) in topic.agenda_files?.app_files || []"
                      :key="`app-file-${topic.id}-${appIndex}`"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card
                        class="file-card app-file-card"
                        elevation="2"
                        @click="navigateToAppFile(topic.agenda_files, appFileUrl)"
                      >
                        <v-card-text class="pa-4">
                          <div class="file-item">
                            <v-icon color="indigo" size="32" class="mb-2">
                              mdi-file-plus-outline
                            </v-icon>
                            <h4 class="file-title">Илова {{ appIndex + 1 }}</h4>
                            <p class="file-desc">Қўшимча файл</p>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </div>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row v-if="loading" justify="center" class="mt-8">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4 text-h6">Маълумотлар юкланмоқда...</p>
        </v-col>
      </v-row>

      <v-row v-if="error" justify="center" class="mt-8">
        <v-col cols="12" md="6" class="text-center">
          <v-alert type="error" variant="tonal" class="mb-4">
            {{ error }}
          </v-alert>
          <v-btn color="primary" @click="fetchBoardData" :loading="loading"> Қайта уриниш </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="modelValue" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Chiqish</v-card-title>
        <v-card-text>Ростдан ҳам ҳисобдан чиқмоқчимисиз?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="grey" @click="cancel">Бекор қилиш</v-btn>
          <v-btn variant="tonal" color="red" @click="confirm">Чиқиш</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/routerId.js'
import DirectorisActivity from '@/servise/board.directors.activitie.js'

const router = useRouter()
const route = useRoute()

const animatingIcons = ref({})
const expandedPanels = ref([])
const loading = ref(false)
const error = ref('')
const appStore = useAppStore()
const modelValue = ref(false)

const boardData = ref({
  id: null,
  agenda: null,
  participants_local: null,
  participants_regional: null,
  event_topics: [],
})

const eventTopics = ref([])

const playHoverAnimation = (key) => {
  animatingIcons.value[key] = true
}

const resetHoverAnimation = (key) => {
  animatingIcons.value[key] = false
}

const navigateToAgenda = () => {
  if (boardData.value.agenda) {
    router.push({
      name: 'agenda',
      query: { pdfUrl: encodeURIComponent(boardData.value.agenda) },
    })
  }
}

const navigateToParticipants = (type) => {
  const localUrl = boardData.value.participants_local
  const regionalUrl = boardData.value.participants_regional

  if (!localUrl && !regionalUrl) return

  if (type === 'local') {
    router.push({
      name: 'participants',
      query: {
        firstPdfUrl: encodeURIComponent(localUrl),
        secondPdfUrl: encodeURIComponent(regionalUrl),
        activeType: 'local',
        firstType: 'local',
        secondType: 'regional',
      },
    })
  } else {
    router.push({
      name: 'participants',
      query: {
        firstPdfUrl: encodeURIComponent(regionalUrl),
        secondPdfUrl: encodeURIComponent(localUrl),
        activeType: 'regional',
        firstType: 'regional',
        secondType: 'local',
      },
    })
  }
}

const navigateToFile = (activeType, agendaFiles) => {
  const files = []

  if (agendaFiles?.reference) {
    files.push({
      type: 'reference',
      name: "Ma'lumotnoma",
      url: agendaFiles.reference,
      icon: 'mdi-file-document-outline',
      color: 'orange',
    })
  }

  if (agendaFiles?.resolution) {
    files.push({
      type: 'resolution',
      name: 'Qaror loyihasi',
      url: agendaFiles.resolution,
      icon: 'mdi-gavel',
      color: 'purple',
    })
  }

  if (agendaFiles?.presentation) {
    files.push({
      type: 'presentation',
      name: 'Taqdimot',
      url: agendaFiles.presentation,
      icon: 'mdi-presentation',
      color: 'teal',
    })
  }

  const appFiles = agendaFiles?.app_files || []
  appFiles.forEach((appFileUrl, index) => {
    files.push({
      type: 'app_file',
      name: `Ilova ${index + 1}`,
      url: appFileUrl,
      icon: 'mdi-file-plus-outline',
      color: 'indigo',
      index: index,
    })
  })

  if (files.length > 0) {
    const queryParams = {
      activeType: activeType,
      totalFiles: files.length,
    }

    files.forEach((file, index) => {
      queryParams[`file${index}_type`] = file.type
      queryParams[`file${index}_name`] = file.name
      queryParams[`file${index}_url`] = encodeURIComponent(file.url)
      queryParams[`file${index}_icon`] = file.icon
      queryParams[`file${index}_color`] = file.color

      if (file.index !== undefined) {
        queryParams[`file${index}_index`] = file.index
      }
    })

    router.push({
      name: 'meetBoard',
      query: queryParams,
    })
  }
}

const navigateToReference = (agendaFiles) => {
  navigateToFile('reference', agendaFiles)
}

const navigateToResolution = (agendaFiles) => {
  navigateToFile('resolution', agendaFiles)
}

const navigateToPresentation = (agendaFiles) => {
  navigateToFile('presentation', agendaFiles)
}

const navigateToAppFile = (agendaFiles, appFileUrl) => {
  const appFiles = agendaFiles?.app_files || []
  const index = appFiles.findIndex((url) => url === appFileUrl)
  navigateToFile(`app_file_${index}`, agendaFiles)
}

const fetchBoardData = async () => {
  try {
    loading.value = true
    error.value = ''

    const boardId = route.params.id

    if (!boardId) {
      throw new Error('Board ID topilmadi')
    }

    const res = await DirectorisActivity.getEventDataId(boardId)
    boardData.value = res
  } catch (err) {
    console.error('Error fetching board data:', err)
    error.value = "Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
  } finally {
    loading.value = false
  }
}

const FetchEventData = async () => {
  try {
    loading.value = true
    error.value = ''

    const boardId = route.params.id

    if (!boardId) {
      throw new Error('Board ID topilmadi')
    }

    const res = await DirectorisActivity.getEventById(boardId)
    eventTopics.value = res
  } catch (err) {
    console.error('Error fetching event data:', err)
    error.value = "Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const routerId = route.params.id
  if (routerId) {
    appStore.setSelectedId(routerId)
  }
  await fetchBoardData()
  await FetchEventData()
})
const cancel = () => {
  modelValue.value = false
}
const confirm = async () => {
  modelValue.value = false
  localStorage.removeItem('access')
  localStorage.removeItem('user')
  await router.push('/login')
  location.reload()
}

const exit = async () => {
  router.push('/meeting-Plan')
}
</script>

<style scoped>
.features-section {
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 40px 0;
}
.logout {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 10000;
}
.PrevExit {
  position: absolute;
  left: 15px;
  top: 15px;
  z-index: 10000;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out forwards;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #718096;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s ease-out 0.2s forwards;
}

.feature-card {
  margin-bottom: 0px !important;
  background: white !important;
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.3s forwards;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

.feature-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.kun-tartibi-icon {
  background: rgba(103, 126, 234, 0.1);
}

.feature-icon {
  transition: all 0.3s ease;
}

.icon-animate {
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.feature-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

/* Expansion panels */
.expansion-panels {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out 0.4s forwards;
}

.expansion-panel {
  background: white !important;
  border-radius: 16px !important;
  margin-bottom: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.expansion-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
}

.panel-title {
  padding: 20px 24px !important;
  background: white;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.panel-icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.participants-icon {
  background: rgba(76, 175, 80, 0.1);
}

.agenda-files-icon {
  background: rgba(33, 150, 243, 0.1);
}

.panel-info {
  flex: 1;
}

.panel-title-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.panel-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}

.panel-content {
  padding: 0 24px 24px 24px;
}

.participant-card,
.file-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px !important;
  height: 100%;
}

.participant-card:hover,
.file-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.participant-item,
.file-item {
  text-align: center;
  padding: 8px;
}

.participant-title,
.file-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 8px 0 4px 0;
}

.participant-desc,
.file-desc {
  font-size: 0.9rem;
  color: #718096;
  margin: 0;
}

.reference-card {
  border-left: 4px solid #ff9800;
}

.resolution-card {
  border-left: 4px solid #9c27b0;
}

.presentation-card {
  border-left: 4px solid #009688;
}

.app-file-card {
  border-left: 4px solid #3f51b5;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .features-section {
    padding: 50px 0;
  }

  .feature-content {
    gap: 16px;
  }

  .feature-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .feature-icon {
    font-size: 32px !important;
  }

  .feature-title {
    font-size: 1.4rem;
  }

  .panel-header {
    gap: 16px;
  }

  .panel-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .panel-icon-wrapper .v-icon {
    font-size: 32px !important;
  }

  .panel-title-text {
    font-size: 1.3rem;
  }

  .panel-content {
    padding: 0 16px 16px 16px;
  }
}

@media (max-width: 480px) {
  .feature-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  .logout {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 10000;
  }
  .PrevExit {
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 10000;
  }

  .panel-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .panel-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .panel-icon-wrapper .v-icon {
    font-size: 28px !important;
  }

  .panel-title-text {
    font-size: 1.2rem;
  }
}
</style>
