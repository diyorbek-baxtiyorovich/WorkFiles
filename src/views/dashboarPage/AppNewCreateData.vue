<template>
  <v-container fluid>
    <v-card class="mb-2 px-4">
      <v-row align="center" dense>
        <!-- Qidiruv maydoni -->
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

        <!-- Sana tanlash -->
        <v-col cols="12" md="3" class="mt-5">
          <v-menu v-model="startMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                v-model="formattedDate"
                v-bind="props"
                label="Sana bo'yicha qidiruv"
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
                  loadMeetingInfos()
                }
              "
              locale="en-US"
            />
          </v-menu>
        </v-col>

        <!-- Filtrlarni tozalash tugmasi -->
        <v-col cols="12" md="2">
          <v-btn color="blue" variant="text" class="clearIcons" @click="clearFilters">
            <v-icon start size="30">mdi-filter-remove</v-icon>
          </v-btn>
        </v-col>

        <!-- Yangi ma'lumotlar qo'shish tugmasi - o'ng tomonda -->
        <v-col cols="12" md="3" class="d-flex justify-end">
          <v-btn
            color="primary"
            size="large"
            elevation="2"
            class="add-btn"
            @click="dialogAdd = true"
          >
            <v-icon start>mdi-plus</v-icon>
            Yangi ma'lumotlar qo'shish
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="data-table-card" elevation="2">
      <v-table>
        <thead>
          <tr>
            <th>#</th>
            <th>Sarlavha</th>
            <th>Sana</th>
            <th>Yaratilgan sana</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            style="cursor: pointer"
            @click.stop="viewItem(item)"
          >
            <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>{{ formatDateType(item) }}</td>
            <td>{{ formatDate(item.recorded_date) }}</td>
            <td>
              <v-btn icon size="small" variant="plain" @click.stop="editItem(item)">
                <v-icon size="20" color="blue">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="plain" @click.stop="deleteItem(item)">
                <v-icon size="20" color="error">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-row class="mt-4" align="center" justify="end">
        <v-col cols="auto">
          <v-select
            v-model="options.itemsPerPage"
            :items="[5, 10, 25, 50]"
            label="Har sahifada nechta"
            class="ma-0"
            density="comfortable"
            hide-details
            style="width: 150px"
          />
        </v-col>

        <v-col cols="auto">
          <v-pagination
            v-model="options.page"
            :length="Math.ceil(totalItems / options.itemsPerPage)"
            :total-visible="7"
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Add Dialog -->
    <v-dialog v-model="dialogAdd" max-width="900px" persistent scrollable>
      <v-card>
        <v-card-title class="text-h5 d-flex justify-space-between align-center">
          <span>Yangi ma'lumot yaratish</span>
          <v-btn icon @click="closeAddDialog" :disabled="formLoading">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-0">
          <StepperForm
            v-model="formData"
            :loading="formLoading"
            :reset-form="shouldResetForm"
            @submit="handleFormSubmit"
            @step-change="handleStepChange"
            ref="stepperFormRef"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="dialogEdit" max-width="1200px" persistent scrollable>
      <EditInfoDialog
        v-if="editingItem"
        :data="editingItem"
        :loading="editLoading"
        :visible="dialogEdit"
        @update="handleEditSubmit"
        @cancel="closeEditDialog"
        @close="closeEditDialog"
        ref="editFormRef"
      />
    </v-dialog>

    <!--    eye component-->
    <ViewDataInfo v-model="dialogView" :meeting-data="viewingItem" />
    <!-- Delete Dialog -->
    <v-dialog v-model="dialogDelete" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon color="error" class="mr-2">mdi-delete</v-icon>
          O'chirishni tasdiqlash
        </v-card-title>
        <v-card-text>
          Haqiqatan ham "<strong>{{ itemToDelete?.title }}</strong
          >" yig'ilish ma'lumotlarini o'chirmoqchimisiz?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogDelete = false"> Bekor qilish </v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleteLoading">
            O'chirish
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success/Error Snackbars -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" top>
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn @click="showSuccessSnackbar = false" variant="text"> Yopish </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="showErrorSnackbar" color="error" :timeout="5000" top>
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn @click="showErrorSnackbar = false" variant="text"> Yopish </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, reactive, onMounted, ref, watch } from 'vue'
import StepperForm from '@/views/dashboarPage/AddInfoBoard/AddInfoDialog.vue'
import EditInfoDialog from '@/views/dashboarPage/AddInfoBoard/EditInfoDialog.vue'
import DirectorisActivity from '@/servise/board.directors.activitie.js'
import AddBoarDataEvent from '@/servise/board.add.file.js'
import ViewDataInfo from '@/views/dashboarPage/AddInfoBoard/ViewDataInfo.vue'
import { format } from 'date-fns'

const dialogAdd = ref(false)
const dialogEdit = ref(false)
const dialogDelete = ref(false)
const dialogView = ref(false)

const loading = ref(false)
const formLoading = ref(false)
const editLoading = ref(false)
const deleteLoading = ref(false)

const shouldResetForm = ref(false)
const currentStep = ref(1)
const search = ref('')
const startMenu = ref(false)
const selectedDate = ref(null)
const options = reactive({
  page: 1,
  itemsPerPage: 8,
})
const totalItems = ref(0)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const stepperFormRef = ref(null)
const editFormRef = ref(null)
const itemToDelete = ref(null)
const editingItem = ref(null)
const viewingItem = ref(null)

const headers = ref([
  { title: '#', key: 'index', sortable: true },
  { title: 'Sarlavha', key: 'title', sortable: true },
  { title: 'Sana', key: 'date', sortable: false },
  { title: 'Yaratilgan sana', key: 'recorded_date', sortable: true },
  { title: 'Amallar', key: 'actions', sortable: false, align: 'center' },
])
const items = ref([])

const rowClicked = (item) => {
  console.log('✅ Clicked item:', item)
}

const formData = ref({
  year: new Date().getFullYear(),
  month: null,
  day: null,
  agenda: null,
  participants: {
    tarkibiy: null,
    xududiy: null,
  },
  documents: {
    sarlavhasi: '',
    malumotnoma: null,
    qaror: null,
    taqdimot: null,
    ilovalar: [],
  },
})

const monthNames = [
  '',
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]
const formattedDate = computed(() =>
  selectedDate.value ? format(new Date(selectedDate.value), 'yyyy-MM-dd') : null,
)

const formatDateType = ({ day, month, year }) => {
  if (!day || !month || !year) return ''
  const monthName = isNaN(month) ? month : monthNames[+month]
  return `${day} ${monthName}, ${year}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('uz-UZ')
}

const loadMeetingInfos = async () => {
  loading.value = true

  const requestParams = {
    page: options.page,
    page_size: options.itemsPerPage,
  }

  if (selectedDate.value) {
    requestParams.date = format(new Date(selectedDate.value), 'yyyy-MM-dd')
  }

  if (search.value?.trim()) {
    requestParams.query = search.value.trim()
  }

  try {
    const response = await DirectorisActivity.getEventsAll(requestParams)

    items.value = Array.isArray(response.data?.data) ? response.data.data : []
    totalItems.value = response.data?.total || 0
  } catch (error) {
    console.error('API Error:', error)
    items.value = []
    totalItems.value = 0
    errorMessage.value = "Ma'lumotlarni yuklashda xatolik yuz berdi"
    showErrorSnackbar.value = true
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  search.value = ''
  selectedDate.value = null
  options.page = 1
  loadMeetingInfos()
}

const createMeetingInfo = async (basicData) => {
  try {
    const response = await AddBoarDataEvent.AddEvent(basicData)
    return response.id
  } catch (error) {
    throw new Error("Asosiy ma'lumotni yaratishda xatolik")
  }
}

const uploadFile = async (meetingId, fileType, file) => {
  try {
    const uploaderMap = {
      agenda: AddBoarDataEvent.AddFileAgenda,
      participants_tarkibiy: AddBoarDataEvent.AddFileLocal,
      participants_xududiy: AddBoarDataEvent.AddFileRegionals,
      malumotnoma: AddBoarDataEvent.addFileReference,
      qaror: AddBoarDataEvent.addFileResolution,
      taqdimot: AddBoarDataEvent.addFilePresentation,
    }

    if (fileType.startsWith('ilova_')) {
      return await AddBoarDataEvent.addFileAppFile(meetingId, file)
    }

    const uploaderFn = uploaderMap[fileType]
    if (!uploaderFn) {
      throw new Error(`Noto'g'ri fileType: ${fileType}`)
    }

    return await uploaderFn(meetingId, file)
  } catch (error) {
    throw new Error(`${fileType} faylini yuklashda xatolik`)
  }
}
const updateMeetingInfo = async (id, updateData) => {
  try {
    const fileUploads = []

    if (updateData.year || updateData.month || updateData.day) {
      const basicData = {
        year: updateData.year,
        month: updateData.month,
        day: updateData.day,
      }
      await DirectorisActivity.updateEvent(id, basicData)
    }

    if (updateData.agenda instanceof File) {
      fileUploads.push(AddBoarDataEvent.AddFileAgenda(id, updateData.agenda))
    }

    if (updateData.participants) {
      if (updateData.participants.tarkibiy instanceof File) {
        fileUploads.push(AddBoarDataEvent.AddFileLocal(id, updateData.participants.tarkibiy))
      }
      if (updateData.participants.xududiy instanceof File) {
        fileUploads.push(AddBoarDataEvent.AddFileRegionals(id, updateData.participants.xududiy))
      }
    }

    if (Array.isArray(updateData.documentsList)) {
      for (const doc of updateData.documentsList) {
        if (!doc.sarlavhasi) continue

        let docId = doc.id

        if (!docId) {
          docId = await AddBoarDataEvent.addDocTitle(id, doc.sarlavhasi)
        } else {
          await DirectorisActivity.updateTopic(doc.id, {
            title: doc.sarlavhasi,
            reference_id: null,
            resolution_id: null,
            presentation_id: null,
          })
        }

        if (doc.malumotnoma instanceof File) {
          fileUploads.push(AddBoarDataEvent.addFileReference(docId, doc.malumotnoma))
        }
        if (doc.qaror instanceof File) {
          fileUploads.push(AddBoarDataEvent.addFileResolution(docId, doc.qaror))
        }
        if (doc.taqdimot instanceof File) {
          fileUploads.push(AddBoarDataEvent.addFilePresentation(docId, doc.taqdimot))
        }
        if (Array.isArray(doc.ilovalar)) {
          const onlyNewFiles = doc.ilovalar.filter((f) => f instanceof File)
          if (onlyNewFiles.length > 0) {
            fileUploads.push(AddBoarDataEvent.addFileAppFile(docId, onlyNewFiles))
          }
        }
      }
    }

    if (fileUploads.length > 0) {
      await Promise.all(fileUploads)
    }

    console.log(`${fileUploads.length} ta yangi fayl yuklandi`)
  } catch (error) {
    console.error(error)
    throw new Error("Ma'lumotlarni yangilashda xatolik yuz berdi")
  }
}

const viewItem = async (item) => {
  dialogView.value = true
  try {
    viewingItem.value = await DirectorisActivity.getEventFullDate(item.id)
  } catch (error) {
    console.error(error)
  }
}

const editItem = async (item) => {
  try {
    const fullData = await DirectorisActivity.getEventFullDate(item.id)

    const documentsList = fullData.event_topics.map((topic) => ({
      id: topic.id,
      sarlavhasi: topic.title || '',
      malumotnoma: {
        file: null,
        url: topic.reference?.path || null,
      },
      qaror: {
        file: null,
        url: topic.resolution?.path || null,
      },
      taqdimot: {
        file: null,
        url: topic.presentation?.path || null,
      },
      ilovalar: Array.isArray(topic.app_files)
        ? topic.app_files.map((file) => ({
            id: file.id,
            path: file.path,
            name: file.name || 'Nomsiz fayl', // Agar fayl nomi bo'lsa
          }))
        : [],
    }))

    editingItem.value = {
      id: item.id,
      year: item.year,
      month: item.month,
      day: item.day,
      title: item.title,
      recorded_date: item.recorded_date,
      agenda: fullData.agenda || null,
      participants: {
        tarkibiy: fullData.participants_local || null,
        xududiy: fullData.participants_regional || null,
      },
      documentsList,
    }

    dialogEdit.value = true
  } catch (error) {
    errorMessage.value = "Ma'lumotlarni yuklashda xatolik yuz berdi"
    showErrorSnackbar.value = true
  }
}

const deleteItem = (item) => {
  itemToDelete.value = item
  dialogDelete.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  deleteLoading.value = true
  try {
    await AddBoarDataEvent.DeleteEvent(itemToDelete.value.id)

    const index = items.value.findIndex((item) => item.id === itemToDelete.value.id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }

    dialogDelete.value = false
    itemToDelete.value = null

    successMessage.value = "Ma'lumot muvaffaqiyatli o'chirildi"
    showSuccessSnackbar.value = true
  } catch (error) {
    errorMessage.value = "Ma'lumotni o'chirishda xatolik yuz berdi"
    showErrorSnackbar.value = true
  } finally {
    deleteLoading.value = false
  }
}

const handleFormSubmit = async (data) => {
  formLoading.value = true
  try {
    const basicData = {
      year: data.year,
      month: data.month,
      day: data.day,
    }

    const meetingId = await createMeetingInfo(basicData)
    const fileUploads = []

    if (data.agenda) fileUploads.push(uploadFile(meetingId, 'agenda', data.agenda))
    if (data.participants.tarkibiy)
      fileUploads.push(uploadFile(meetingId, 'participants_tarkibiy', data.participants.tarkibiy))
    if (data.participants.xududiy)
      fileUploads.push(uploadFile(meetingId, 'participants_xududiy', data.participants.xududiy))

    for (const doc of data.documentsList) {
      if (!doc.sarlavhasi) continue

      const docId = await AddBoarDataEvent.addDocTitle(meetingId, doc.sarlavhasi)

      if (doc.malumotnoma)
        fileUploads.push(AddBoarDataEvent.addFileReference(docId, doc.malumotnoma))
      if (doc.qaror) fileUploads.push(AddBoarDataEvent.addFileResolution(docId, doc.qaror))
      if (doc.taqdimot) fileUploads.push(AddBoarDataEvent.addFilePresentation(docId, doc.taqdimot))

      if (doc.ilovalar && doc.ilovalar.length > 0) {
        for (const ilova of doc.ilovalar) {
          fileUploads.push(AddBoarDataEvent.addFileAppFile(docId, ilova))
        }
      }
    }

    await Promise.all(fileUploads)
    await loadMeetingInfos()
    closeAddDialog()

    successMessage.value = "Ma'lumot muvaffaqiyatli qo'shildi"
    showSuccessSnackbar.value = true
  } catch (error) {
    errorMessage.value = error.message || 'Saqlashda xatolik yuz berdi'
    showErrorSnackbar.value = true
  } finally {
    formLoading.value = false
  }
}

const handleEditSubmit = async (data) => {
  editLoading.value = true
  try {
    await updateMeetingInfo(editingItem.value.id, data)
    await loadMeetingInfos()
    closeEditDialog()

    successMessage.value = "Ma'lumot muvaffaqiyatli yangilandi"
    showSuccessSnackbar.value = true
  } catch (error) {
    errorMessage.value = error.message || 'Yangilashda xatolik yuz berdi'
    showErrorSnackbar.value = true
  } finally {
    editLoading.value = false
  }
}

const handleStepChange = (step) => {
  currentStep.value = step
}

const closeAddDialog = () => {
  dialogAdd.value = false
  resetFormData()
}

const closeEditDialog = () => {
  dialogEdit.value = false
  editingItem.value = null
}

const resetFormData = () => {
  shouldResetForm.value = true
  setTimeout(() => {
    shouldResetForm.value = false
  }, 100)
}

// Lifecycle
onMounted(() => {
  loadMeetingInfos()
})
watch([() => options.page, () => options.itemsPerPage], () => {
  loadMeetingInfos()
})

watch(search, () => {
  options.page = 1
  loadMeetingInfos()
})

watch(selectedDate, () => {
  options.page = 1
  loadMeetingInfos()
})
watch(
  () => options.itemsPerPage,
  () => {
    options.page = 1
    loadMeetingInfos()
  },
)
</script>

<style scoped>
.action-bar {
  margin-bottom: 20px;
}

.modern-table {
  border-radius: 8px;
}

.add-btn {
  text-transform: none;
}

.data-table-card {
  border-radius: 8px;
}

.v-dialog > .v-card > .v-card-text {
  padding: 0 !important;
}
</style>
