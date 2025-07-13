<template>
  <v-card>
    <v-stepper v-model="currentStep" :items="stepItems" class="elevation-0">
      <template #item.1>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="localFormData.year"
                label="Yil"
                type="number"
                required
                :rules="[rules.required, rules.year]"
                @input="updateFormData"
              />
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="localFormData.month"
                label="Oy"
                :items="months"
                required
                :rules="[rules.required]"
                @update:model-value="updateFormData"
              />
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="localFormData.day"
                label="Kun"
                :items="days"
                required
                :rules="[rules.required]"
                @update:model-value="updateFormData"
              />
            </v-col>
            <v-col cols="12">
              <v-card
                v-if="localFormData.year && localFormData.month && localFormData.day"
                variant="outlined"
                class="mt-4 preview-card"
                color="primary"
              >
                <v-card-text>
                  <div class="preview-content">
                    <h3 class="preview-title">
                      "Mikrokreditbank" ATB Boshqaruvining {{ localFormData.year }} yil
                      <span class="text-primary font-weight-bold">{{ localFormData.day }}</span
                      >-{{ getMonthName(localFormData.month) }}dagi navbatdagi majlisiga doir
                      materiallar to'plami
                    </h3>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </template>

      <template #item.2>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card variant="outlined" class="mb-4">
                <v-card-title>
                  <v-icon class="mr-2">mdi-file-document</v-icon>
                  Kun tartibi
                </v-card-title>
                <v-card-text>
                  <v-file-input
                    v-model="localFormData.agenda"
                    label="Kun tartibi faylini yuklash"
                    accept=".pdf"
                    prepend-icon="mdi-file-pdf-box"
                    show-size
                    :rules="[rules.pdfFile]"
                    @update:model-value="updateFormData"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card variant="outlined" class="mb-4">
                <v-card-title>
                  <v-icon class="mr-2">mdi-account-group</v-icon>
                  Ishtirokchilar ro'yxati
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-file-input
                        v-model="localFormData.participants.tarkibiy"
                        label="Tarkibiy bo'linmalar rahbarlar"
                        accept=".pdf"
                        prepend-icon="mdi-file-pdf-box"
                        show-size
                        :rules="[rules.pdfFile]"
                        @update:model-value="updateFormData"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-file-input
                        v-model="localFormData.participants.xududiy"
                        label="Xududiy bo'linmalar rahbarlar"
                        accept=".pdf"
                        prepend-icon="mdi-file-pdf-box"
                        show-size
                        :rules="[rules.pdfFile]"
                        @update:model-value="updateFormData"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </template>
      <template #item.3>
        <v-card-text>
          <v-row>
            <v-col cols="12" v-for="(doc, index) in localFormData.documentsList" :key="index">
              <v-card variant="outlined" class="mb-6 pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                  <div class="text-h6">Kun tartibiga doir ma'lumotlar {{ index + 1 }}</div>
                  <v-btn
                    icon
                    color="red"
                    size="30"
                    v-if="localFormData.documentsList.length > 1"
                    @click="removeDocumentBlock(index)"
                  >
                    <v-icon size="16">mdi-delete</v-icon>
                  </v-btn>
                </div>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="doc.sarlavhasi"
                      label="Sarlavha"
                      required
                      :rules="[rules.required]"
                      @input="updateFormData"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="doc.malumotnoma"
                      label="Ma'lumotnoma faylini yuklash"
                      accept=".pdf"
                      prepend-icon="mdi-file-pdf-box"
                      show-size
                      :rules="[rules.pdfFile]"
                      @update:model-value="updateFormData"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="doc.qaror"
                      label="Qaror loyihasi faylini yuklash"
                      accept=".pdf"
                      prepend-icon="mdi-file-pdf-box"
                      show-size
                      :rules="[rules.pdfFile]"
                      @update:model-value="updateFormData"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="doc.taqdimot"
                      label="Taqdimot faylini yuklash"
                      accept=".pdf"
                      prepend-icon="mdi-file-pdf-box"
                      show-size
                      :rules="[rules.pdfFile]"
                      @update:model-value="updateFormData"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="doc.ilovalar"
                      label="Ilovalar fayllarini yuklash"
                      accept=".pdf"
                      prepend-icon="mdi-file-pdf-box"
                      show-size
                      multiple
                      :rules="[rules.pdfFileMultiple]"
                      @update:model-value="updateFormData"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <v-btn color="primary" class="mt-2" @click="addDocumentBlock" prepend-icon="mdi-plus">
            Yangi blok qo‘shish
          </v-btn>
        </v-card-text>
      </template>

      <template #actions="{ next, prev }">
        <v-card-actions>
          <v-spacer />
          <v-btn v-if="currentStep > 1" @click="prev" variant="text" :disabled="loading">
            Orqaga
          </v-btn>
          <v-btn
            v-if="currentStep < 3"
            @click="next"
            color="primary"
            :disabled="!isCurrentStepValid || loading"
            append-icon="mdi-chevron-right"
          >
            Keyingisi
          </v-btn>
          <v-btn
            v-if="currentStep === 3"
            @click="handleSubmit"
            color="success"
            :disabled="!isFormValid || loading"
            :loading="loading"
          >
            Saqlash
          </v-btn>
        </v-card-actions>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: "Ma'lumot kiritish formasi",
  },
  modelValue: {
    type: Object,
    default: () => ({
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
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  resetForm: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'stepChange'])
const getMonthName = (monthNumber) => {
  const month = months.find((m) => m.value === monthNumber)
  return month ? month.title : ''
}

const currentStep = ref(1)
const localFormData = ref({
  ...props.modelValue,
  documentsList: [
    {
      sarlavhasi: '',
      malumotnoma: null,
      qaror: null,
      taqdimot: null,
      ilovalar: [],
    },
  ],
})

watch(
  () => props.modelValue,
  (newValue) => {
    localFormData.value = { ...newValue }
  },
  { deep: true },
)

watch(
  () => props.resetForm,
  (shouldReset) => {
    if (shouldReset) {
      resetFormData()
    }
  },
)

watch(currentStep, (newStep) => {
  emit('stepChange', newStep)
})

const stepItems = [
  {
    title: "Asosiy ma'lumotlar",
    value: 1,
    icon: 'mdi-file-document-edit',
  },
  {
    title: 'Kun tartibi va ishtirokchilar',
    value: 2,
    icon: 'mdi-account-group',
  },
  {
    title: "Qo'shimcha hujjatlar",
    value: 3,
    icon: 'mdi-attachment',
  },
]

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
  if (!localFormData.value.month || !localFormData.value.year) return []

  const daysInMonth = new Date(localFormData.value.year, localFormData.value.month, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => ({
    title: i + 1,
    value: i + 1,
  }))
})

const rules = {
  required: (value) => !!value || 'Bu maydon majburiy',
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
const addDocumentBlock = () => {
  localFormData.value.documentsList.push({
    sarlavhasi: '',
    malumotnoma: null,
    qaror: null,
    taqdimot: null,
    ilovalar: [],
  })
  updateFormData()
}
const removeDocumentBlock = (index) => {
  localFormData.value.documentsList.splice(index, 1)
  updateFormData()
}
const isStep1Valid = computed(() => {
  return localFormData.value.year && localFormData.value.month && localFormData.value.day
})

const isStep2Valid = computed(() => {
  return (
    localFormData.value.agenda &&
    localFormData.value.participants.tarkibiy &&
    localFormData.value.participants.xududiy
  )
})

const isStep3Valid = computed(() => {
  return localFormData.value.documentsList.every((doc) => doc.sarlavhasi)
})

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return isStep1Valid.value
    case 2:
      return isStep2Valid.value
    case 3:
      return isStep3Valid.value
    default:
      return false
  }
})

const isFormValid = computed(() => {
  return isStep1Valid.value && isStep2Valid.value && isStep3Valid.value
})

const updateFormData = () => {
  emit('update:modelValue', { ...localFormData.value })
}

const handleSubmit = () => {
  if (!isFormValid.value) return
  emit('submit', { ...localFormData.value })
}

const resetFormData = () => {
  localFormData.value = {
    year: new Date().getFullYear(),
    month: null,
    day: null,
    agenda: null,
    participants: {
      tarkibiy: null,
      xududiy: null,
    },
    documents: {
      malumotnoma: null,
      qaror: null,
      taqdimot: null,
      ilovalar: [],
    },
  }
  currentStep.value = 1
  updateFormData()
}

defineExpose({
  resetForm: resetFormData,
  goToStep: (step) => {
    currentStep.value = step
  },
  getCurrentStep: () => currentStep.value,
  isValid: isFormValid,
})

onMounted(() => {
  updateFormData()
})
</script>

<style scoped>
.v-stepper {
  box-shadow: none !important;
}

.v-card {
  border-radius: 8px;
}

.v-file-input {
  margin-bottom: 16px;
}
</style>
