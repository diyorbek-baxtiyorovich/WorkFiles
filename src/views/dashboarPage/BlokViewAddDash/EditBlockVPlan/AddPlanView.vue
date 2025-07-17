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
                <v-file-input
                  v-model="formData.file"
                  label="Faylni yuklash"
                  :accept="props.acceptedFileTypes"
                  prepend-icon="mdi-file-upload"
                  show-size
                  :rules="[rules.required, rules.fileSize]"
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
      <v-btn color="grey" variant="text" @click="resetForm" :disabled="props.loading">
        yopish
      </v-btn>
      <v-btn
        color="primary"
        variant="elevated"
        @click="handleSubmit"
        :disabled="!isFormValid || props.loading"
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
    default: 'Rejani kiritish formasi',
  },
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      file: null,
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
    default: '.pdf',
  },
  maxFileSize: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'reset'])

const formData = ref({
  ...props.modelValue,
})

const form = ref(null)

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
  fileSize: (value) => {
    const file = value?.[0] || value
    if (!file || typeof file.size !== 'number') return 'Fayl tanlanmagan'

    const isPdf = file.type === 'application/pdf'
    if (!isPdf) return 'Faqat .pdf formatdagi faylga ruxsat berilgan'

    return (
      file.size <= props.maxFileSize ||
      `Fayl hajmi ${props.maxFileSize / 1024 / 1024}MB dan oshmasligi kerak`
    )
  },
}

const isFormValid = computed(() => {
  return formData.value.title && formData.value.file
})

const handleSubmit = async () => {
  emit('submit', { ...formData.value })
}

// eslint-disable-next-line vue/no-dupe-keys
const resetForm = () => {
  emit('close')
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
