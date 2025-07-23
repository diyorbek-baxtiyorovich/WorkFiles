<template>
  <v-card>
    <v-card-title class="text-h5 pa-6">
      <v-icon class="mr-2">mdi-file-document-edit</v-icon>
      {{ props.title }}
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="handleSubmit" ref="form">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.title"
              label="Sarlavha"
              variant="outlined"
              required
              :rules="[rules.required]"
              prepend-inner-icon="mdi-format-title"
            />
          </v-col>

          <v-col cols="12">
            <v-card variant="outlined" class="mb-4">
              <v-card-title>
                <v-icon class="mr-2">mdi-file-document</v-icon>
                Fayl yuklash
              </v-card-title>

              <v-card-text>
                <v-alert
                  v-if="!currentFileOpen"
                  type="info"
                  variant="tonal"
                  class="mb-3"
                  border="start"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <strong>Mavjud fayl:</strong>
                      <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        class="ml-2"
                        @click="openFile"
                      >
                        {{ currentFileName }}
                        <v-icon right size="16">mdi-open-in-new</v-icon>
                      </v-btn>
                    </div>
                    <v-btn
                      icon
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeCurrentFile"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-alert>

                <v-file-input
                  v-if="currentFileOpen"
                  v-model="formData.file"
                  :label="currentFileName ? 'Faylni almashtirish' : 'Fayl yuklash'"
                  :accept="props.acceptedFileTypes"
                  prepend-icon="mdi-file-upload"
                  show-size
                  :rules="[rules.requiredIfNoOldFile, rules.fileSize]"
                  variant="outlined"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6">
      <v-spacer />
      <v-btn color="grey" variant="text" @click="cansel" :disabled="props.loading"> Yopish </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        @click="handleSubmit"
        :disabled="!isSaveEnabled || props.loading"
        :loading="props.loading"
      >
        Saqlash
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Rejani tahrirlash formasi',
  },
  modelValue: {
    type: Object,
    default: () => ({
      id: null,
      title: '',
      file: null,
      fileName: '',
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
  acceptedFileTypes: {
    type: String,
    default: '.pdf,.doc,.docx,.txt',
  },
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB
  },
})
const currentFileOpen = ref(false)

const emit = defineEmits(['update:modelValue', 'submit', 'reset', 'cancel'])

const formData = ref({
  ...props.modelValue,
})

const form = ref(null)

const currentFileName = computed(() => {
  if (props.modelValue?.fileName) {
    return props.modelValue.fileName
  }
  if (props.modelValue?.file) {
    return extractFileNameFromUrl(props.modelValue.file)
  }
  return null
})

const extractFileNameFromUrl = (url) => {
  if (!url) return ''
  const parts = url.split('/')
  return parts[parts.length - 1] || 'fayl'
}

const openFile = () => {
  if (props.modelValue?.file) {
    window.open(props.modelValue.file, '_blank')
  }
}

const removeCurrentFile = () => {
  currentFileOpen.value = true
}

watch(
  () => props.modelValue,
  (newValue) => {
    formData.value = { ...newValue }
  },
  { deep: true },
)

watch(
  () => props.resetForm,
  (shouldReset) => {
    if (shouldReset) {
      resetForm()
    }
  },
)

watch(
  formData,
  (newValue) => {
    emit('update:modelValue', { ...newValue })
  },
  { deep: true },
)

const rules = {
  required: (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 || 'Bu maydon majburiy'
    }
    return !!value || 'Bu maydon majburiy'
  },

  requiredIfNoOldFile: (value) => {
    if (!currentFileName.value && (!value || value.length === 0)) {
      return 'Fayl majburiy'
    }
    return true
  },

  fileSize: (value) => {
    const file = value?.[0]
    if (!file || typeof file.size !== 'number') return true
    return (
      file.size <= props.maxFileSize ||
      `Fayl hajmi ${props.maxFileSize / 1024 / 1024}MB dan oshmasligi kerak`
    )
  },
}
const isModified = computed(() => {
  return (
    formData.value.title !== props.modelValue.title ||
    (formData.value.file && formData.value.file !== props.modelValue.file)
  )
})
const isSaveEnabled = computed(() => {
  return isFormValid.value && isModified.value
})
const isFormValid = computed(() => {
  return formData.value.title && (formData.value.file || currentFileName.value)
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    alert("Iltimos, barcha maydonlarni to'ldiring!")
    return
  }

  emit('submit', { ...formData.value })
}
const cansel = () => {
  emit('cancel')
}

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    file: null,
    fileName: '',
  }
  if (form.value) {
    form.value.reset()
  }
  emit('reset')
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
.v-file-input {
  margin-bottom: 16px;
}
</style>
