<template>
  <v-card class="edit-form-container">
    <v-card-title class="pa-6 header-section">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon class="mr-3" size="28" color="primary">mdi-file-document-edit</v-icon>
          <div>
            <h2 class="text-h5 mb-1">Ma'lumotlarni tahrirlash</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Mavjud ma'lumotlarni o'zgartiring va saqlang
            </p>
          </div>
        </div>
        <v-btn icon variant="text" size="large" @click="handleClose" :disabled="loading">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <v-card variant="outlined" class="mb-6 edit-section-card">
          <v-card-title class="edit-section-title">
            <v-icon class="mr-2 text-primary">mdi-calendar-edit</v-icon>
            Asosiy ma'lumotlar
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="editData.year"
                  label="Yil"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.year]"
                  :readonly="loading"
                  @input="markAsModified"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="editData.month"
                  label="Oy"
                  :items="months"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  :readonly="loading"
                  @update:model-value="markAsModified"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="editData.day"
                  label="Kun"
                  :items="days"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  :readonly="loading"
                  @update:model-value="markAsModified"
                />
              </v-col>
            </v-row>

            <v-alert
              v-if="editData.year && editData.month && editData.day"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              <template #title>
                <strong>Yangi sarlavha:</strong>
              </template>
              <div class="mt-2">
                "Mikrokreditbank" ATB Boshqaruvining
                <span class="text-primary font-weight-bold"> {{ editData.year }}</span> yil
                <span class="text-primary font-weight-bold">{{ editData.day }}</span>
                -{{ getMonthName(editData.month) }}dagi navbatdagi majlisiga doir materiallar
                to'plami
              </div>
            </v-alert>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-6 edit-section-card">
          <v-card-title class="edit-section-title">
            <v-icon class="mr-2 text-primary">mdi-account-group</v-icon>
            Kun tartibi va ishtirokchilar
          </v-card-title>
          <v-card-text class="pt-4">
            <v-card class="mb-4 edit-subsection-card">
              <v-card-title class="edit-subsection-title">
                <v-icon class="mr-2">mdi-file-document</v-icon>
                Kun tartibi
                <v-chip v-if="editData.agenda?.file" class="ml-2" size="small" color="success">
                  Fayl mavjud
                </v-chip>
              </v-card-title>

              <v-card-text class="mt-4">
                <div v-if="!hesDeleteInfo" class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <span class="mr-4 text-truncate" style="max-width: 300px">
                      {{ getFileName(editData.agenda.url) }}
                    </span>
                  </div>
                  <v-btn variant="text" @click="confirmRemoveFile('agenda')" :disabled="loading">
                    <v-icon color="error">mdi-delete</v-icon>
                  </v-btn>
                </div>
                <v-file-input
                  v-else
                  v-model="editData.agenda.file"
                  label="Kun tartibi faylini almashtirish"
                  accept=".pdf"
                  prepend-icon="mdi-file-pdf-box"
                  show-size
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.pdfFile]"
                  :readonly="loading"
                  @update:model-value="markAsModified"
                />
              </v-card-text>
            </v-card>

            <v-card class="edit-subsection-card">
              <v-card-title class="edit-subsection-title">
                <v-icon class="mr-2">mdi-account-multiple</v-icon>
                Ishtirokchilar ro'yxati
              </v-card-title>
              <v-card-text class="mt-4">
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="d-flex align-center mb-2">
                      <span class="text-subtitle-2">Tarkibiy bo'linmalar</span>
                      <v-chip
                        v-if="editData.participants.tarkibiy"
                        class="ml-2"
                        size="small"
                        color="success"
                      >
                        Fayl mavjud
                      </v-chip>
                    </div>
                    <div v-if="!hesDeleteInfoTar" class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <span class="mr-4 text-truncate" style="max-width: 300px">
                          {{ getFileName(editData.participants.tarkibiy.url) }}
                        </span>
                      </div>
                      <v-btn
                        variant="text"
                        @click="confirmRemoveFile('tarkibiy')"
                        :disabled="loading"
                      >
                        <v-icon color="error">mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      v-else
                      v-model="editData.participants.tarkibiy.file"
                      label="Tarkibiy bo'linmalar rahbarlar"
                      accept=".pdf"
                      prepend-icon="mdi-file-pdf-box"
                      show-size
                      variant="outlined"
                      density="comfortable"
                      :rules="[rules.required, rules.pdfFile]"
                      :readonly="loading"
                      @update:model-value="markAsModified"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="d-flex align-center mb-2">
                      <span class="text-subtitle-2">Xududiy bo'linmalar</span>
                      <v-chip
                        v-if="editData.participants.xududiy"
                        class="ml-2"
                        size="small"
                        color="success"
                      >
                        Fayl mavjud
                      </v-chip>
                    </div>
                    <div v-if="!hesDeleteInfoXud" class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <span class="mr-4 text-truncate" style="max-width: 300px">
                          {{ getFileName(editData.participants.xududiy.url) }}
                        </span>
                      </div>
                      <v-btn
                        variant="text"
                        @click="confirmRemoveFile('xududiy')"
                        :disabled="loading"
                      >
                        <v-icon color="error">mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <v-file-input
                      v-else
                      v-model="editData.participants.xududiy.file"
                      label="Xududiy bo'linmalar rahbarlar"
                      accept=".pdf"
                      prepend-icon="mdi-file-pdf-box"
                      show-size
                      variant="outlined"
                      density="comfortable"
                      :rules="[rules.required, rules.pdfFile]"
                      :readonly="loading"
                      @update:model-value="markAsModified"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-6 edit-section-card">
          <v-card-title class="edit-section-title">
            <v-icon class="mr-2 text-primary">mdi-attachment</v-icon>
            Qo'shimcha hujjatlar
            <v-chip class="ml-2" size="small" color="info"> {{ documentsCount }} ta blok </v-chip>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-alert v-if="!isDocumentsValid" type="warning" variant="tonal" class="mb-4">
              <template #title>
                <strong>Ma'lumot yuklash xatoligi!</strong>
              </template>
              <p class="mb-0">
                Hujjatlar ma'lumotlarini yuklashda xatolik yuz berdi. Sahifani yangilang yoki qayta
                urinib ko'ring.
              </p>
            </v-alert>

            <template v-if="isDocumentsValid">
              <v-row>
                <v-col
                  cols="12"
                  v-for="(doc, index) in editData.documentsList"
                  :key="`doc-${index}`"
                >
                  <v-card class="mb-4 edit-document-card">
                    <v-card-title class="edit-document-header">
                      <div class="d-flex justify-space-between align-center w-100">
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" color="primary">mdi-file-document-multiple</v-icon>
                          <span class="edit-document-title">{{
                            getDocumentTitle(doc, index)
                          }}</span>
                          <v-chip
                            v-if="isDocumentComplete(doc)"
                            class="ml-2"
                            size="small"
                            color="success"
                          >
                            To'liq
                          </v-chip>
                        </div>
                        <div class="d-flex align-center gap-2">
                          <v-btn
                            v-if="editData.documentsList.length > 1"
                            icon
                            color="error"
                            size="small"
                            variant="text"
                            @click="removeDocumentBlock(index)"
                            :disabled="loading"
                          >
                            <v-icon size="18">mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-card-title>

                    <v-card-text class="mt-3">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="doc.sarlavhasi"
                            label="Sarlavha"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.required]"
                            :readonly="loading"
                            @input="markAsModified"
                          />
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2">Ma'lumotnoma</span>
                            <v-chip
                              v-if="doc.malumotnoma?.url?.url"
                              class="ml-2"
                              size="small"
                              color="success"
                            >
                              Mavjud
                            </v-chip>
                          </div>
                          <div
                            v-if="doc.malumotnoma?.url?.url"
                            class="d-flex align-center justify-space-between pa-2 rounded mb-2"
                            style="border: 1px solid #ccc"
                          >
                            <div class="text-truncate" style="max-width: 300px">
                              <v-icon small class="mr-2" color="primary">mdi-file-pdf-box</v-icon>
                              <a
                                :href="doc.malumotnoma?.url?.url"
                                target="_blank"
                                class="text-decoration-none"
                                style="color: inherit"
                              >
                                {{ getShortFileName(doc.malumotnoma?.url?.url) }}
                              </a>
                            </div>

                            <v-btn
                              icon
                              size="small"
                              variant="text"
                              color="error"
                              @click="
                                confirmRemoveFile('reference', index, doc.malumotnoma?.url?.url)
                              "
                              :disabled="loading"
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-file-input
                            v-else
                            v-model="doc.malumotnoma.file"
                            label="Ma'lumotnoma faylini almashtirish"
                            accept=".pdf"
                            prepend-icon="mdi-file-pdf-box"
                            show-size
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.pdfFile]"
                            :readonly="loading"
                            @update:model-value="markAsModified"
                          />
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2">Qaror loyihasi</span>
                            <v-chip
                              v-if="doc.qaror?.url?.url"
                              class="ml-2"
                              size="small"
                              color="success"
                            >
                              Mavjud
                            </v-chip>
                          </div>
                          <div
                            v-if="doc.qaror?.url?.url"
                            class="d-flex align-center justify-space-between pa-2 rounded mb-2"
                            style="border: 1px solid #ccc"
                          >
                            <div class="text-truncate" style="max-width: 300px">
                              <v-icon small class="mr-2" color="primary">mdi-file-pdf-box</v-icon>
                              <a
                                :href="doc.qaror?.url?.url"
                                target="_blank"
                                class="text-decoration-none"
                                style="color: inherit"
                              >
                                {{ getShortFileName(doc.qaror?.url?.url) }}
                              </a>
                            </div>

                            <v-btn
                              icon
                              size="small"
                              variant="text"
                              color="error"
                              @click="confirmRemoveFile('resolution', index, doc.qaror?.url?.url)"
                              :disabled="loading"
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-file-input
                            v-else
                            v-model="doc.qaror.file"
                            label="Qaror loyihasi faylini almashtirish"
                            accept=".pdf"
                            prepend-icon="mdi-file-pdf-box"
                            show-size
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.pdfFile]"
                            :readonly="loading"
                            @update:model-value="markAsModified"
                          />
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2">Taqdimot</span>
                            <v-chip
                              v-if="doc.taqdimot?.url?.url"
                              class="ml-2"
                              size="small"
                              color="success"
                            >
                              Mavjud
                            </v-chip>
                          </div>

                          <div
                            v-if="doc.taqdimot?.url?.url"
                            class="d-flex align-center justify-space-between pa-2 rounded mb-2"
                            style="border: 1px solid #ccc"
                          >
                            <div class="text-truncate" style="max-width: 300px">
                              <v-icon small class="mr-2" color="primary">mdi-file-pdf-box</v-icon>
                              <a
                                :href="doc.taqdimot?.url?.url"
                                target="_blank"
                                class="text-decoration-none"
                                style="color: inherit"
                              >
                                {{ getShortFileName(doc.taqdimot?.url?.url) }}
                              </a>
                            </div>

                            <v-btn
                              icon
                              size="small"
                              variant="text"
                              color="error"
                              @click="
                                confirmRemoveFile('presentation', index, doc.taqdimot?.url?.url)
                              "
                              :disabled="loading"
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                          <v-file-input
                            v-else
                            v-model="doc.taqdimot.file"
                            label="Taqdimot faylini almashtirish"
                            accept=".pdf"
                            prepend-icon="mdi-file-pdf-box"
                            show-size
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.pdfFile]"
                            :readonly="loading"
                            @update:model-value="markAsModified"
                          />
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2">Ilovalar</span>
                            <v-chip
                              v-if="doc.ilovalar && doc.ilovalar.length > 0"
                              class="ml-2"
                              size="small"
                              color="success"
                            >
                              {{ doc.ilovalar.length }} ta fayl
                            </v-chip>
                          </div>

                          <v-file-input
                            v-model="doc.newIlovalar"
                            label="Ilovalar fayllarini almashtirish"
                            accept=".pdf"
                            prepend-icon="mdi-file-pdf-box"
                            show-size
                            multiple
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.pdfFileMultiple]"
                            :readonly="loading"
                            @update:model-value="markAsModified"
                          />

                          <div v-if="doc.ilovalar.length">
                            <div
                              v-for="(file, ilovaIndex) in doc.ilovalar"
                              :key="`ilova-${ilovaIndex}`"
                              class="d-flex align-center justify-space-between pa-2 rounded mb-2"
                              style="border: 1px solid #ccc"
                            >
                              <div class="text-truncate" style="max-width: 300px">
                                <v-icon small class="mr-2" color="primary">mdi-file-pdf-box</v-icon>
                                <a
                                  :href="file.path"
                                  target="_blank"
                                  class="text-decoration-none"
                                  style="color: inherit"
                                >
                                  {{ getShortFileName(file.path) }}
                                </a>
                              </div>

                              <v-btn
                                icon
                                size="small"
                                variant="text"
                                color="error"
                                @click="confirmRemoveFile('app_file', index, file.path, ilovaIndex)"
                                :disabled="loading"
                              >
                                <v-icon small>mdi-delete</v-icon>
                              </v-btn>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-btn
                color="primary"
                class="mt-2"
                @click="addDocumentBlock"
                prepend-icon="mdi-plus"
                variant="outlined"
                size="large"
                :disabled="loading"
              >
                Yangi hujjat bloki qo'shish
              </v-btn>
            </template>

            <template v-else>
              <v-empty-state
                icon="mdi-file-document-alert"
                title="Hujjatlar yuklashda xatolik"
                text="Hujjatlar ma'lumotlarini yuklashda xatolik yuz berdi. Sahifani yangilang."
              >
                <template #actions>
                  <v-btn
                    color="primary"
                    @click="initializeDocuments"
                    prepend-icon="mdi-plus"
                    variant="outlined"
                  >
                    Yangi hujjat qo'shish
                  </v-btn>
                </template>
              </v-empty-state>
            </template>
          </v-card-text>
        </v-card>

        <v-alert v-if="hasModifications" type="warning" variant="tonal" class="mb-4">
          <template #title>
            <strong>Saqlanmagan o'zgarishlar!</strong>
          </template>
          <p class="mb-0">
            Formada o'zgarishlar mavjud. Ularni saqlash uchun "Yangilash" tugmasini bosing.
          </p>
        </v-alert>
      </v-form>
    </v-card-text>

    <v-divider></v-divider>
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000" top>
      {{ successMessage }}
      <template v-slot:actions>
        <v-btn @click="showSuccessSnackbar = false" variant="text"> Yopish </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="modelInfo" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
          E'tibor bering!
        </v-card-title>

        <v-card-text> O'zgartirilgan o'zgarishlar yo'qoladi. Davom etasizmi? </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="text" @click="handleModalCancel"> Bekor qilish </v-btn>
          <v-btn color="red" variant="flat" @click="handleModalConfirm"> Davom etish </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modelDeleteItemInfo" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
          E'tibor bering!
        </v-card-title>

        <v-card-text> Bu faylni o'chirishni hohlaysizmi ? </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="grey" variant="text" @click="deleteItemCancel"> Bekor qilish </v-btn>
          <v-btn color="red" variant="flat" @click="deleteItemConfirm"> O'chirish </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-actions class="pa-6">
      <v-spacer></v-spacer>
      <v-btn
        @click="handleCancel"
        variant="outlined"
        color="error"
        size="large"
        prepend-icon="mdi-cancel"
        :disabled="loading"
      >
        Bekor qilish
      </v-btn>
      <v-btn
        @click="handleSubmit"
        color="success"
        size="large"
        prepend-icon="mdi-content-save"
        :disabled="!isFormValid || loading || !hasModifications"
        :loading="loading"
        class="ml-4"
      >
        Yangilash
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DirectorisActivity from '@/servise/board.directors.activitie.js'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value === 'object' && value.year && value.month && value.day
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update', 'cancel', 'close'])

const formRef = ref(null)
const isFormValid = ref(false)
const hasModifications = ref(false)
const hesDeleteInfo = ref(false)
const hesDeleteInfoTar = ref(false)
const successMessage = ref('')
const hesDeleteInfoXud = ref(false)
const showSuccessSnackbar = ref(false)
const modelInfo = ref(false)
const pendingAction = ref(null)
const modelDeleteItemInfo = ref(false)
const deleteTarget = ref({
  type: null,
  docIndex: null,
  ilovaIndex: null,
  url: null,
})
const pendingDeletions = ref([])

const editData = ref({
  year: null,
  month: null,
  day: null,
  agenda: {
    file: null,
    url: null,
  },
  participants: {
    tarkibiy: { file: null, url: null },
    xududiy: { file: null, url: null },
  },
  documentsList: [],
})

const months = [
  { title: 'Yanvar', value: 1 },
  { title: 'Fevral', value: 2 },
  { title: 'Mart', value: 3 },
  { title: 'Aprel', value: 4 },
  { title: 'May', value: 5 },
  { title: 'Iyun', value: 6 },
  { title: 'Iyul', value: 7 },
  { title: 'Avgust', value: 8 },
  { title: 'Sentabr', value: 9 },
  { title: 'Oktabr', value: 10 },
  { title: 'Noyabr', value: 11 },
  { title: 'Dekabr', value: 12 },
]

const days = computed(() => {
  if (!editData.value.month || !editData.value.year) return []

  const daysInMonth = new Date(editData.value.year, editData.value.month, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => ({
    title: i + 1,
    value: i + 1,
  }))
})

const getFileName = (url) => {
  if (!url) return ''
  return decodeURIComponent(url.split('/').pop())
}
const getShortFileName = (path) => {
  if (!path) return 'Nomaʼlum fayl'
  return decodeURIComponent(path.split('/').pop())
}
const markFileForDeletion = (type, docIndex = null, url = null, ilovaIndex = null) => {
  pendingDeletions.value.push({
    type,
    docIndex,
    url,
    ilovaIndex,
    timestamp: Date.now(),
  })

  switch (type) {
    case 'agenda':
      hesDeleteInfo.value = true
      editData.value.agenda = { file: null, url: null }
      break
    case 'xududiy':
      hesDeleteInfoXud.value = true
      editData.value.participants.xududiy = { file: null, url: null }
      break
    case 'tarkibiy':
      hesDeleteInfoTar.value = true
      editData.value.participants.tarkibiy = { file: null, url: null }
      break
    case 'reference':
      const refDoc = editData.value.documentsList[docIndex]
      if (refDoc && refDoc.malumotnoma) {
        refDoc.malumotnoma = { file: null, url: null }
      }
      break
    case 'presentation':
      const presDoc = editData.value.documentsList[docIndex]
      if (presDoc && presDoc.taqdimot) {
        presDoc.taqdimot = { file: null, url: null }
      }
      break
    case 'resolution':
      const resDoc = editData.value.documentsList[docIndex]
      if (resDoc && resDoc.qaror) {
        resDoc.qaror = { file: null, url: null }
      }
      break
    case 'app_file':
      const appDoc = editData.value.documentsList[docIndex]
      if (appDoc && Array.isArray(appDoc.ilovalar)) {
        appDoc.ilovalar.splice(ilovaIndex, 1)
      }
      break
  }

  markAsModified()
}

const cancelPendingDeletions = () => {
  pendingDeletions.value.forEach((deletion) => {
    switch (deletion.type) {
      case 'agenda':
        hesDeleteInfo.value = false
        editData.value.agenda = {
          file: null,
          url: props.data.agenda || null,
        }
        break
      case 'xududiy':
        hesDeleteInfoXud.value = false
        editData.value.participants.xududiy = {
          file: null,
          url: props.data.participants?.xududiy || null,
        }
        break
      case 'tarkibiy':
        hesDeleteInfoTar.value = false
        editData.value.participants.tarkibiy = {
          file: null,
          url: props.data.participants?.tarkibiy || null,
        }
        break
      case 'reference':
        const originalRefDoc = props.data.documentsList?.[deletion.docIndex]
        if (originalRefDoc && editData.value.documentsList[deletion.docIndex]) {
          editData.value.documentsList[deletion.docIndex].malumotnoma = {
            file: null,
            url: originalRefDoc.malumotnoma || null,
          }
        }
        break
      case 'presentation':
        const originalPresDoc = props.data.documentsList?.[deletion.docIndex]
        if (originalPresDoc && editData.value.documentsList[deletion.docIndex]) {
          editData.value.documentsList[deletion.docIndex].taqdimot = {
            file: null,
            url: originalPresDoc.taqdimot || null,
          }
        }
        break
      case 'resolution':
        const originalResDoc = props.data.documentsList?.[deletion.docIndex]
        if (originalResDoc && editData.value.documentsList[deletion.docIndex]) {
          editData.value.documentsList[deletion.docIndex].qaror = {
            file: null,
            url: originalResDoc.qaror || null,
          }
        }
        break
      case 'app_file':
        const originalAppDoc = props.data.documentsList?.[deletion.docIndex]
        if (
          originalAppDoc &&
          originalAppDoc.ilovalar &&
          editData.value.documentsList[deletion.docIndex]
        ) {
          editData.value.documentsList[deletion.docIndex].ilovalar = [
            ...(originalAppDoc.ilovalar || []),
          ]
        }
        break
    }
  })

  pendingDeletions.value = []
}
const processPendingDeletions = async () => {
  const deletionPromises = pendingDeletions.value.map(async (deletion) => {
    const param = {
      path: deletion.url,
      type_:
        deletion.type === 'app_file'
          ? 'app_file'
          : deletion.type === 'presentation'
            ? 'presentation'
            : deletion.type === 'resolution'
              ? 'resolution'
              : deletion.type === 'reference'
                ? 'reference'
                : deletion.type,
    }

    try {
      await DirectorisActivity.deleteEventDocsById(param)
      console.log(`Successfully deleted ${deletion.type} file:`, deletion.url)
    } catch (error) {
      console.error(`Failed to delete ${deletion.type} file:`, error)
      throw error
    }
  })

  try {
    await Promise.all(deletionPromises)
    pendingDeletions.value = []

    successMessage.value = "O'chirilgan fayllar muvaffaqiyatli saqlandi"
    showSuccessSnackbar.value = true
  } catch (error) {
    console.error('Some deletions failed:', error)
  }
}

const confirmRemoveFile = (type, docIndex = null, url = null, ilovaIndex = null) => {
  deleteTarget.value = { type, docIndex, url, ilovaIndex }
  modelDeleteItemInfo.value = true
}
const deleteItemConfirm = async () => {
  const { type, docIndex, url, ilovaIndex } = deleteTarget.value

  // Faylni o'chirish uchun belgilash (haqiqiy o'chirish emas)
  markFileForDeletion(type, docIndex, url, ilovaIndex)

  modelDeleteItemInfo.value = false
  deleteTarget.value = { type: null, docIndex: null, ilovaIndex: null, url: null }
}

const deleteItemCancel = () => {
  modelDeleteItemInfo.value = false
  deleteTarget.value = { type: null, docIndex: null, ilovaIndex: null, url: null }
}

const documentsCount = computed(() => {
  return Array.isArray(editData.value.documentsList) ? editData.value.documentsList.length : 0
})

const isDocumentsValid = computed(() => {
  return Array.isArray(editData.value.documentsList)
})

const rules = {
  required: (value) => !!value || 'Yangi faylni yuklash majburiy!\n' + '\n',
  year: (value) => {
    const year = parseInt(value)
    return (year >= 2000 && year <= 2100) || "Yil 2000-2100 oralig'ida bo'lishi kerak"
  },
  pdfFile: (value) => {
    if (!value) return true
    const file = Array.isArray(value) ? value[0] : value
    return file.type === 'application/pdf' || 'Faqat PDF fayllar ruxsat etilgan'
  },
  pdfFileMultiple: (value) => {
    if (!value || value.length === 0) return true
    return (
      value.every((file) => file.type === 'application/pdf') || 'Faqat PDF fayllar ruxsat etilgan'
    )
  },
}

const getMonthName = (monthNumber) => {
  const month = months.find((m) => m.value === monthNumber)
  return month ? month.title : ''
}

const getDocumentTitle = (doc, index) => {
  if (!doc) return `Hujjat ${index + 1}`
  return doc.sarlavhasi || `Hujjat ${index + 1}`
}

const isDocumentComplete = (doc) => {
  if (!doc) return false
  return !!(doc.sarlavhasi && doc.malumotnoma && doc.qaror && doc.taqdimot)
}

const markAsModified = () => {
  hasModifications.value = true
}

const addDocumentBlock = () => {
  editData.value.documentsList.push({
    id: null,
    sarlavhasi: '',
    malumotnoma: { file: null, url: null },
    qaror: { file: null, url: null },
    taqdimot: { file: null, url: null },
    ilovalar: [],
    newIlovalar: [],
  })
  markAsModified()
}

const removeDocumentBlock = (index) => {
  if (editData.value.documentsList.length > 1) {
    editData.value.documentsList.splice(index, 1)
    markAsModified()
  }
}

const initializeDocuments = () => {
  editData.value.documentsList = [
    {
      sarlavhasi: '',
      malumotnoma: null,
      qaror: null,
      taqdimot: null,
      ilovalar: [],
    },
  ]
  markAsModified()
}
const handleSubmit = async () => {
  hesDeleteInfo.value = false
  hesDeleteInfoXud.value = false
  hesDeleteInfoTar.value = false

  if (!isFormValid.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  const updatedData = {}

  if (editData.value.year !== props.data.year) updatedData.year = editData.value.year
  if (editData.value.month !== props.data.month) updatedData.month = editData.value.month
  if (editData.value.day !== props.data.day) updatedData.day = editData.value.day

  if (editData.value.agenda?.file instanceof File) {
    updatedData.agenda = editData.value.agenda.file
  }

  const participantUpdates = {}
  if (editData.value.participants.tarkibiy?.file instanceof File) {
    participantUpdates.tarkibiy = editData.value.participants.tarkibiy.file
  }
  if (editData.value.participants.xududiy?.file instanceof File) {
    participantUpdates.xududiy = editData.value.participants.xududiy.file
  }
  if (Object.keys(participantUpdates).length > 0) {
    updatedData.participants = participantUpdates
  }

  const hasFileChanged = (orig, current) => {
    return (
      current?.file instanceof File ||
      (orig?.url?.url && !current?.url?.url) ||
      (!orig?.url?.url && current?.url?.url)
    )
  }

  const documentsChanged = editData.value.documentsList.some((doc, i) => {
    const originalDoc = props.data.documentsList?.[i] || {}

    const ilovaCountChanged = (originalDoc.ilovalar?.length || 0) !== (doc.ilovalar?.length || 0)
    const ilovaFileAdded =
      Array.isArray(doc.newIlovalar) && doc.newIlovalar.some((f) => f instanceof File)

    return (
      doc.sarlavhasi !== originalDoc.sarlavhasi ||
      hasFileChanged(originalDoc.malumotnoma, doc.malumotnoma) ||
      hasFileChanged(originalDoc.qaror, doc.qaror) ||
      hasFileChanged(originalDoc.taqdimot, doc.taqdimot) ||
      ilovaCountChanged ||
      ilovaFileAdded
    )
  })

  if (documentsChanged) {
    updatedData.documentsList = editData.value.documentsList.map((doc) => {
      const ilovalarFiles = Array.isArray(doc.newIlovalar)
        ? doc.newIlovalar.filter((f) => f instanceof File)
        : []

      return {
        id: doc.id || null,
        sarlavhasi: doc.sarlavhasi || '',
        malumotnoma:
          doc.malumotnoma?.file instanceof File
            ? doc.malumotnoma.file
            : doc.malumotnoma?.url?.url === null
              ? null
              : undefined,
        qaror:
          doc.qaror?.file instanceof File
            ? doc.qaror.file
            : doc.qaror?.url?.url === null
              ? null
              : undefined,
        taqdimot:
          doc.taqdimot?.file instanceof File
            ? doc.taqdimot.file
            : doc.taqdimot?.url?.url === null
              ? null
              : undefined,
        ilovalar: ilovalarFiles.length > 0 ? ilovalarFiles : undefined,
      }
    })
  }

  if (Object.keys(updatedData).length === 0 && pendingDeletions.value.length === 0) {
    console.log("Hech qanday o'zgarish yo'q.")
    return
  }

  try {
    if (pendingDeletions.value.length > 0) {
      await processPendingDeletions()
    }

    if (Object.keys(updatedData).length > 0) {
      console.log("Yuborilayotgan yangilangan ma'lumot:", updatedData)
      emit('update', updatedData)
    }

    hasModifications.value = false
  } catch (error) {
    console.error('Yangilashda xatolik:', error)
  }
}

const handleCancel = () => {
  hesDeleteInfo.value = false
  hesDeleteInfoXud.value = false
  hesDeleteInfoTar.value = false

  if (hasModifications.value || pendingDeletions.value.length > 0) {
    pendingAction.value = 'cancel'
    modelInfo.value = true
  } else {
    emit('cancel')
  }
}

const handleClose = () => {
  hesDeleteInfo.value = false
  hesDeleteInfoXud.value = false
  hesDeleteInfoTar.value = false

  if (hasModifications.value || pendingDeletions.value.length > 0) {
    pendingAction.value = 'close'
    modelInfo.value = true
  } else {
    emit('close')
  }
}
const handleModalCancel = () => {
  modelInfo.value = false
  pendingAction.value = null
}

const handleModalConfirm = () => {
  modelInfo.value = false

  cancelPendingDeletions()

  if (pendingAction.value === 'cancel') {
    emit('cancel')
  } else if (pendingAction.value === 'close') {
    emit('close')
  }

  pendingAction.value = null
}
const loadData = () => {
  try {
    if (!props.data) return

    const { year, month, day, agenda, participants, documentsList, documents } = props.data

    editData.value.year = year || null
    editData.value.month = month || null
    editData.value.day = day || null

    editData.value.agenda = {
      file: null,
      url: agenda || null,
    }

    editData.value.participants = {
      tarkibiy: {
        file: null,
        url: participants?.tarkibiy || null,
      },
      xududiy: {
        file: null,
        url: participants?.xududiy || null,
      },
    }

    const sourceDocs =
      Array.isArray(documentsList) && documentsList.length ? documentsList : documents || []

    editData.value.documentsList = sourceDocs.map((doc) => ({
      id: doc.id || null,
      sarlavhasi: doc.sarlavhasi || '',
      malumotnoma: {
        file: null,
        url: doc.malumotnoma || null,
      },
      qaror: {
        file: null,
        url: doc.qaror || null,
      },
      taqdimot: {
        file: null,
        url: doc.taqdimot || null,
      },
      ilovalar: Array.isArray(doc.ilovalar)
        ? doc.ilovalar.map((ilova) => ({
            id: ilova.id || null,
            path: ilova.path || ilova.url || null,
          }))
        : [],
    }))

    hasModifications.value = false
  } catch (error) {
    console.error("Ma'lumotlarni yuklashda xatolik:", error)
  }
}

watch(() => props.data, loadData, { immediate: true })

onMounted(() => {
  loadData()
})

defineExpose({
  resetModifications: () => {
    hasModifications.value = false
  },
  hasUnsavedChanges: () => hasModifications.value,
  validateForm: () => formRef.value?.validate(),
})
</script>
<style scoped>
.edit-form-container {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.header-section {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.1) 0%,
    rgba(var(--v-theme-primary), 0.05) 100%
  );
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.edit-section-card {
  border-radius: 12px;
  border: 2px solid rgba(var(--v-theme-primary), 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.edit-section-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.1);
}

.edit-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  padding: 16px 20px;
  background: rgba(var(--v-theme-primary), 0.08);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.edit-subsection-title {
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 16px;
  background: rgba(var(--v-theme-surface), 0.8);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.edit-document-card {
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.3s ease;
}

.edit-document-card:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  box-shadow: 0 2px 12px rgba(var(--v-theme-primary), 0.1);
}

.edit-document-header {
  font-size: 1rem;
  font-weight: 500;
  padding: 12px 16px;
  background: rgba(var(--v-theme-primary), 0.06);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.edit-document-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.gap-2 {
  gap: 8px;
}

.v-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

.v-text-field,
.v-select,
.v-file-input {
  border-radius: 8px;
}

.v-card-actions {
  background: rgba(var(--v-theme-surface), 0.95);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
