<template>
  <div class="info-section" :class="informatingSellect.length > 4 ? 'auto-height' : 'full-height'">
    <div class="logout">
      <v-tooltip text="Chiqish">
        <template #activator="{ props }">
          <v-btn icon color="red" v-bind="props" @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <v-btn icon class="back-btn" @click="goBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="section-title mb-4">Boshqaruv Kengashi Uchrashuv Arxivi</h2>
        </v-col>
      </v-row>
      <v-row justify="center" class="mb-2" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Qidirish..."
            variant="outlined"
            density="comfortable"
            clearable
            prepend-inner-icon="mdi-magnify"
            class="search-input"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-menu v-model="startMenu" :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                v-model="formattedDate"
                v-bind="props"
                label="Sana"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                density="comfortable"
                readonly
              />
            </template>

            <v-date-picker
              v-model="selectedDate"
              @update:model-value="
                () => {
                  startMenu = false
                  getEventData()
                }
              "
              locale="en-US"
            />
          </v-menu>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn color="blue" variant="text" class="ml-auto clearIcons" @click="clearFilters">
            <v-icon start size="30">mdi-filter-remove</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-6">
        <v-col
          v-for="(item, index) in informatingSellect"
          :key="index"
          cols="12"
          md="6"
          lg="4"
          class="mb-4"
          v-if="informatingSellect"
        >
          <v-card class="meeting-card" @click="handleCardClick(item)" elevation="3">
            <v-card-text class="text-center pa-2">
              <div class="feature-content">
                <h3 class="feature-title">
                  "Mikrokreditbank" ATB Boshqaruvining
                  <span class="highlight">{{ item.year }}</span> yil
                  <span class="highlight">{{ item.day }}</span> -
                  <span class="highlight">{{ item.month }}</span
                  >dagi navbatdagi majlisiga doir materiallar to'plami
                </h3>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-if="!informatingSellect && !loading" cols="12" md="6">
          <v-card class="pa-8 text-center" variant="outlined" elevation="1">
            <v-icon size="48" color="grey">mdi-database-remove</v-icon>
            <h2 class="mt-4 mb-2">Ma'lumot mavjud emas</h2>
          </v-card>
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-8" v-if="totalPages > 1">
        <v-col cols="auto">
          <v-pagination v-model="currentPage" :length="totalPages" rounded color="primary" />
        </v-col>
      </v-row>

      <v-row justify="center" v-if="loading">
        <v-col cols="auto">
          <v-progress-circular indeterminate color="primary" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import DirectorisActivity from '@/servise/board.directors.activitie.js'

const search = ref('')
const currentPage = ref(1)
const itemsPerPage = 20
const totalPages = ref(0)
const informatingSellect = ref([])
const loading = ref(false)
const router = useRouter()
const startMenu = ref(false)
const selectedDate = ref(null)

import { format } from 'date-fns'

const formattedDate = computed(() =>
  selectedDate.value ? format(new Date(selectedDate.value), 'yyyy-MM-dd') : null,
)

const getEventData = async () => {
  loading.value = true
  try {
    const params = {
      query: search.value,
      page: currentPage.value,
      page_size: itemsPerPage,
      is_archive: false,
    }

    if (selectedDate.value) {
      const formattedDate = format(new Date(selectedDate.value), 'yyyy-MM-dd')
      params.date = formattedDate
    }

    const res = await DirectorisActivity.getEventsAll(params)

    if (res && res.data) {
      informatingSellect.value = res.data || []
      totalPages.value = res.data.total_pages || 0

      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = 1
        return
      }
    } else {
      informatingSellect.value = []
      totalPages.value = 0
    }
  } catch (e) {
    console.error('Xatolik:', e)
    informatingSellect.value = []
    totalPages.value = 0
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  search.value = ''
  selectedDate.value = null
  getEventData()
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  getEventData()
}, 400)

onMounted(() => {
  getEventData()
})

watch(search, debouncedSearch)
watch(currentPage, () => {
  getEventData()
})

const handleCardClick = (item) => {
  router.push({
    name: 'BoardMeeting',
    params: { id: item.id },
  })
}
const logout = async () => {
  localStorage.removeItem('access')
  localStorage.removeItem('user')
  await router.push('/login')
  location.reload()
}
const goBack = () => router.go(-1)
</script>

<style scoped>
.info-section {
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px 0;
  height: 100vh;
}
.logout {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 10000;
}
.back-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 10;
}

.clearIcons {
  margin-top: 5px;
  margin-left: 15px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s ease-out forwards;
}

.meeting-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  height: 100%;
  background: white;
}

.meeting-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.feature-content {
  padding: 20px 0;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.6;
}

.highlight {
  color: #1976d2;
  font-weight: 700;
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

@media (max-width: 960px) {
  .info-section {
    position: relative;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px 0;
    transition: height 0.3s ease;
  }

  .full-height {
    height: 100vh;
  }

  .auto-height {
    height: auto;
  }
  .section-title {
    font-size: 2rem;
  }

  .feature-title {
    font-size: 1.1rem;
  }
  .clearIcons {
    display: flex;
    justify-content: end;
    margin: 0;
  }
}

@media (max-width: 600px) {
  .info-section {
    padding: 50px 0;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .feature-title {
    font-size: 1rem;
  }

  .pa-8 {
    padding: 24px !important;
  }
}
</style>
