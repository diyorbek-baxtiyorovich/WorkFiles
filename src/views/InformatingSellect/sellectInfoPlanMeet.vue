<template>
  <v-app class="government-portal">
    <v-app-bar color="blue darken-4" dark elevation="4">
      <v-app-bar-title class="titel_header">
        <v-icon left>mdi-bank</v-icon>
        Микрокредитбанк
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="modelValue = true">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="pa-6">
        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold text-blue-darken-4 mb-2">
            Бошқарув мажлиси маълумотлари
          </h1>
        </div>

        <v-row justify="center" class="equal-height-row">
          <v-col cols="12" md="4" class="mb-4 d-flex">
            <v-card
              class="selection-card flex-grow-1"
              elevation="2"
              @click="proceedToSection('plan')"
            >
              <v-card-text class="text-center pa-6 d-flex flex-column justify-center align-center">
                <v-icon size="48" color="blue darken-2" class="mb-4">mdi-calendar-clock</v-icon>
                <h3 class="text-h5 mb-3">Бошқарув иш режаси</h3>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="mb-4 d-flex">
            <v-card
              class="selection-card flex-grow-1"
              elevation="2"
              @click="proceedToSection('materials')"
            >
              <v-card-text class="text-center pa-5 d-flex flex-column justify-center align-center">
                <v-icon size="48" color="green darken-2" class="mb-4"
                  >mdi-file-document-multiple</v-icon
                >
                <h3 class="text-h5 mb-3">
                  {{ BoardItem?.title || `Бошқарувнинг навбатдаги мажлисига доир материаллар` }}
                </h3>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="mb-4 d-flex">
            <v-card class="selection-card flex-grow-1" elevation="2" @click="historyBlock">
              <v-card-text class="text-center pa-6 d-flex flex-column justify-center align-center">
                <v-icon size="48" color="orange darken-2" class="mb-4"
                  >mdi-clipboard-text-clock</v-icon
                >
                <h3 class="text-h5 mb-3">Бошқарув мажлиси материаллар архиви</h3>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

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

    <v-dialog v-model="modalInfo" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Маълумот</v-card-title>
        <v-card-text>Файл мавжуд эмас</v-card-text>
        <v-card-actions>
          <v-btn variant="text" color="grey" @click="modalInfo = false">Ёпиш</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PlanBoardServise from '@/servise/board.plan.servise.js'
import DirectorisActivity from '@/servise/board.directors.activitie.js'

const router = useRouter()
const planItem = ref(null)
const BoardItem = ref(null)
const modelValue = ref(false)
const modalInfo = ref(false)

const proceedToSection = (section) => {
  if (section === 'plan') {
    if (planItem.value && planItem.value.file) {
      router.push({
        name: 'planPdf',
        query: { pdfUrl: encodeURIComponent(planItem.value.file) },
      })
    } else {
      modalInfo.value = true
    }
  } else if (section === 'materials') {
    if (BoardItem.value && BoardItem.value.id) {
      router.push({
        name: 'BoardMeeting',
        params: { id: BoardItem.value.id },
      })
    } else {
      modalInfo.value = true
    }
  }
}

const fetchPlanData = async () => {
  const params = {
    is_archive: false,
  }
  try {
    const res = await PlanBoardServise.getPlansAll(params)
    if (res.data && res.data.length > 0) {
      planItem.value = res.data[0]
    } else {
      console.warn("Reja ma'lumotlari topilmadi.")
    }
  } catch (error) {
    console.error("Plan ma'lumotlarini olishda xatolik:", error)
  }
}

const fetchBoardData = async () => {
  const params = {
    is_archive: false,
  }
  try {
    const res = await DirectorisActivity.getEventsAll(params)
    if (res.data && res.data.length > 0) {
      BoardItem.value = res.data[0]
    } else {
      console.warn('Materiallar topilmadi.')
    }
  } catch (error) {
    console.error('Materiallarni olishda xatolik:', error)
  }
}

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

const historyBlock = () => {
  router.push({
    name: 'archive-meeting',
  })
}

onMounted(() => {
  fetchPlanData()
  fetchBoardData()
})
</script>

<style scoped>
.government-portal {
  min-height: 80vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%);
}

.equal-height-row {
  align-items: stretch;
  margin-top: 100px;
}

.selection-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.selection-card .v-card-text {
  flex-grow: 1;
  min-height: 200px;
}

.selection-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.selection-card.selected {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

@media (max-width: 960px) {
  .selection-card {
    min-height: 150px;
  }
  .equal-height-row {
    margin-top: 20px;
  }

  .selection-card .v-card-text {
    min-height: 150px;
    padding: 1.5rem !important;
  }
}

@media (max-width: 768px) {
  .titel_header {
    font-size: 14px;
  }

  .text-h3 {
    font-size: 1.8rem !important;
  }

  .selection-card {
    min-height: 120px;
  }

  .selection-card .v-card-text {
    padding: 1rem !important;
    min-height: 120px;
  }

  .text-h5 {
    font-size: 1.2rem !important;
    line-height: 1.3 !important;
  }
}
</style>
