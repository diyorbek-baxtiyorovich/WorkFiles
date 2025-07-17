<template>
  <v-container fluid>
    <v-card class="mb-2 px-4 pa-6">
      <v-row class="align-center justify-space-between" no-gutters>
        <!-- Chap tomon: Search + Status -->
        <v-col cols="12" md="8">
          <v-row dense>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                v-model="search"
                label="Qidirish..."
                variant="outlined"
                density="comfortable"
                clearable
                prepend-inner-icon="mdi-magnify"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-autocomplete
                v-model="selectedStatus"
                :items="statusItem"
                item-title="label"
                label="Status"
                variant="outlined"
                density="comfortable"
                item-value="value"
                clearable
                hide-details
                prepend-inner-icon="mdi-filter"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn color="success" size="large" elevation="2" class="add-btn" @click="openAddDialog">
            <v-icon start>mdi-plus</v-icon>
            Reja qo'shish
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="data-table-card" elevation="2">
      <v-table style="height: 400px; overflow-y: auto">
        <thead>
          <tr>
            <th style="width: 50px">#</th>
            <th style="width: 400px">Sarlavha</th>
            <th style="width: 70px">Status</th>
            <th style="width: 140px">Amallar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            style="cursor: pointer"
            @click.stop="openFileDirectly(item)"
          >
            <td>{{ (options.page - 1) * options.itemsPerPage + index + 1 }}</td>
            <td>{{ item.title }}</td>
            <td>
              <v-chip
                :color="item.is_archived ? 'orange' : 'green'"
                :variant="item.is_archived ? 'tonal' : 'tonal'"
                size="small"
              >
                <v-icon start size="16">
                  {{ item.is_archived ? 'mdi-archive' : 'mdi-archive-arrow-up' }}
                </v-icon>
                {{ item.is_archived ? 'Arxivda' : 'Arxivdan chiqargan' }}
              </v-chip>
            </td>
            <td>
              <!-- Tahrirlash tugmasi -->
              <v-tooltip text="Tahrirlash">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="plain"
                    v-bind="props"
                    @click.stop="editItem(item)"
                  >
                    <v-icon size="20" color="blue">mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="O'chirish">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="plain"
                    v-bind="props"
                    @click.stop="deleteItem(item)"
                  >
                    <v-icon size="20" color="error">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip :text="item.is_archived ? 'Arxivdan chiqarish' : 'Arxivlash'">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="small"
                    variant="plain"
                    v-bind="props"
                    @click.stop="toggleArchive(item)"
                    :color="item.is_archived ? 'orange' : 'green'"
                  >
                    <v-icon size="20">
                      {{ item.is_archived ? 'mdi-archive-arrow-up' : 'mdi-archive' }}
                    </v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
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

    <v-dialog v-model="dialogAdd" max-width="1200px" scrollable>
      <AddFormModal
        v-if="dialogAdd"
        :visible="dialogAdd"
        :loading="formLoading"
        @submit="handleFormSubmit"
        @cancel="closeAddDialog"
        @close="closeAddDialog"
      />
    </v-dialog>

    <v-dialog v-model="dialogEdit" max-width="1000px" scrollable>
      <EditPlanView
        v-if="dialogEdit"
        :model-value="editingItem"
        :loading="editLoading"
        @submit="handleEditSubmit"
        @cancel="closeEditDialog"
      />
    </v-dialog>

    <!-- View Dialog -->
    <!--    <ViewPlanApp v-model="dialogView" :meeting-data="viewingItem" />-->

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

    <v-dialog v-model="dialogArchive" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon :color="itemToArchive?.is_archived ? 'orange' : 'green'" class="mr-2">
            {{ itemToArchive?.is_archived ? 'mdi-archive-arrow-up' : 'mdi-archive' }}
          </v-icon>
          {{ itemToArchive?.is_archived ? 'Arxivdan chiqarishni' : 'Arxivlashni' }} tasdiqlash
        </v-card-title>
        <v-card-text>
          "<strong>{{ itemToArchive?.title }}</strong
          >" {{ itemToArchive?.is_archived ? 'arxivdan chiqarmoqchimisiz' : 'arxivlamoqchimisiz' }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogArchive = false"> Bekor qilish </v-btn>
          <v-btn
            :color="itemToArchive?.is_archived ? 'orange' : 'green'"
            variant="flat"
            @click="confirmArchive"
            :loading="archiveLoading"
          >
            {{ itemToArchive?.is_archived ? 'Arxivdan chiqarish' : 'Arxivlash' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { reactive, onMounted, ref, watch } from 'vue'
import AddFormModal from '@/views/dashboarPage/BlokViewAddDash/EditBlockVPlan/AddPlanView.vue'
import EditPlanView from '@/views/dashboarPage/BlokViewAddDash/EditBlockVPlan/EditPlanView.vue'
import PlanBoardServise from '@/servise/board.plan.servise.js'

const dialogAdd = ref(false)
const dialogEdit = ref(false)
const dialogDelete = ref(false)
const dialogArchive = ref(false)
const editLoading = ref(false)

const loading = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const archiveLoading = ref(false)

const search = ref('')
const options = reactive({
  page: 1,
  itemsPerPage: 8,
})
const totalItems = ref(0)
const showSuccessSnackbar = ref(false)
const showErrorSnackbar = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const itemToDelete = ref(null)
const itemToArchive = ref(null)
const editingItem = ref(null)
const items = ref([])
const selectedStatus = ref(null)
const statusItem = [
  { label: 'Faol (Arxivdan chiqqan)', value: false },
  { label: 'Arxivlangan', value: true },
]

const loadMeetingInfos = async () => {
  loading.value = true
  const params = {
    page: options.page,
    page_size: options.itemsPerPage,
    query: search.value,
  }
  if (selectedStatus.value !== null) {
    params.is_archive = selectedStatus.value
  }

  try {
    const response = await PlanBoardServise.getPlansAll(params)
    items.value = response.data
    totalItems.value = response.total || 0
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

const openAddDialog = () => {
  dialogAdd.value = true
}

const closeAddDialog = () => {
  dialogAdd.value = false
}

// const viewItem = async (item) => {
//   try {
//     viewingItem.value = await PlanBoardServise.getPlanDataId(item.id)
//     dialogView.value = true
//   } catch (error) {
//     console.error(error)
//     errorMessage.value = "Ma'lumotlarni yuklashda xatolik yuz berdi"
//     showErrorSnackbar.value = true
//   }
// }

const deleteItem = (item) => {
  itemToDelete.value = item
  dialogDelete.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  deleteLoading.value = true
  try {
    await PlanBoardServise.deleteEventPlan(itemToDelete.value.id)

    const index = items.value.findIndex((item) => item.id === itemToDelete.value.id)
    if (index !== -1) {
      items.value.splice(index, 1)
      totalItems.value--
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

const toggleArchive = (item) => {
  itemToArchive.value = item
  dialogArchive.value = true
}

const confirmArchive = async () => {
  if (!itemToArchive.value) return

  archiveLoading.value = true
  try {
    await PlanBoardServise.putEventPlanUpdate(
      itemToArchive.value.id,
      !itemToArchive.value.is_archived,
    )

    const index = items.value.findIndex((item) => item.id === itemToArchive.value.id)
    if (index !== -1) {
      items.value[index].is_archived = !items.value[index].is_archived
    }
    dialogArchive.value = false

    const action = itemToArchive.value.is_archived ? 'arxivlandi' : 'arxivdan chiqarildi'
    successMessage.value = `Ma'lumot muvaffaqiyatli ${action}`
    showSuccessSnackbar.value = true

    itemToArchive.value = null
    await loadMeetingInfos()
  } catch (error) {
    const action = itemToArchive.value?.is_archived ? 'arxivdan chiqarishda' : 'arxivlashda'
    errorMessage.value = `Ma'lumotni ${action} xatolik yuz berdi`
    showErrorSnackbar.value = true
  } finally {
    archiveLoading.value = false
  }
}

const handleFormSubmit = async (data) => {
  formLoading.value = true
  const params = {
    title: data.title,
    file: data.file,
  }
  try {
    await PlanBoardServise.postAddPlan(params)

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

const editItem = async (item) => {
  try {
    const response = await PlanBoardServise.getPlanDataId(item.id)

    editingItem.value = {
      id: response.id,
      title: response.title || response.titel,
      file: null,
      fileName: response.file ? extractFileNameFromUrl(response.file) : null,
    }

    dialogEdit.value = true
  } catch (error) {
    console.error('Edit item error:', error)
    errorMessage.value = "Ma'lumotlarni yuklashda xatolik yuz berdi"
    showErrorSnackbar.value = true
  }
}

const extractFileNameFromUrl = (url) => {
  if (!url) return null
  try {
    const parts = url.split('/')
    return parts[parts.length - 1] || 'fayl'
  } catch (error) {
    return 'fayl'
  }
}

const handleEditSubmit = async (data) => {
  editLoading.value = true
  try {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('title', data.title)

    if (data.file && data.file.length > 0) {
      formData.append('file', data.file[0])
    }

    await PlanBoardServise.putUpdatePlan(data.id, formData)

    await loadMeetingInfos()
    closeEditDialog()

    successMessage.value = "Ma'lumot muvaffaqiyatli yangilandi"
    showSuccessSnackbar.value = true
  } catch (error) {
    console.error('Edit submit error:', error)
    errorMessage.value = error.message || 'Yangilashda xatolik yuz berdi'
    showErrorSnackbar.value = true
  } finally {
    editLoading.value = false
  }
}

const closeEditDialog = () => {
  dialogEdit.value = false
  editingItem.value = null
}

const openFileDirectly = (url) => {
  console.log(url)
  if (url) {
    window.open(url.file, '_blank')
  }
}

onMounted(() => {
  loadMeetingInfos()
})

watch([() => options.page, () => options.itemsPerPage], () => {
  loadMeetingInfos()
})
watch(selectedStatus, () => {
  options.page = 1
  loadMeetingInfos()
})
watch(search, () => {
  options.page = 1
  loadMeetingInfos()
})
</script>

<style scoped>
.add-btn {
  text-transform: none;
}

.data-table-card {
  border-radius: 8px;
}

.clearIcons {
  min-width: 48px;
}

.search-input {
  margin-bottom: 0;
}
</style>
