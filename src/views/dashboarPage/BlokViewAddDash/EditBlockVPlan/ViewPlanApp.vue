<template>
  <!-- Modal Dialog -->
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    width="1000px"
    scrollable
    persistent
  >
    <v-card>
      <v-card-title class="bg-primary text-white pa-4">
        <div class="d-flex align-center justify-space-between w-100">
          <span class="text-h6">Reja Ma'lumotlari</span>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeModal" />
        </div>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-list>
          <v-list-subheader class="text-primary font-weight-bold">
            ASOSIY MA'LUMOTLAR
          </v-list-subheader>

          <v-list-item>
            <v-list-item-title>ID</v-list-item-title>
            <v-list-item-subtitle>{{
              meetingData?.id || "Ma'lumot mavjud emas"
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Sarlavha</v-list-item-title>
            <v-list-item-subtitle>{{
              meetingData?.title || "Ma'lumot mavjud emas"
            }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-3"></v-divider>

          <v-list-subheader class="text-primary font-weight-bold">
            FAYL MA'LUMOTLARI
          </v-list-subheader>

          <v-list-item v-if="meetingData?.file">
            <v-list-item-title>Asosiy fayl</v-list-item-title>
            <v-list-item-subtitle>{{ getFileName(meetingData.file) }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn
                color="blue"
                variant="outlined"
                size="small"
                @click="openFileDirectly(meetingData.file)"
              >
                Ko'rish
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="!meetingData?.file">
            <v-list-item-title>Fayl holati</v-list-item-title>
            <v-list-item-subtitle>Fayl mavjud emas</v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-3"></v-divider>
        </v-list>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="closeModal"> Yopish </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SimpleMeetingDataModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    meetingData: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  methods: {
    updateModelValue(value) {
      this.$emit('update:modelValue', value)
    },
    closeModal() {
      this.updateModelValue(false)
    },
    openFileDirectly(url) {
      if (url) {
        window.open(url, '_blank')
      }
    },
    getFileName(path) {
      if (!path) return "Noma'lum fayl"
      const parts = path.split('/')
      const filename = parts[parts.length - 1]
      const cleanName = filename.replace(
        /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}-/,
        '',
      )

      return cleanName.length > 30 ? cleanName.substring(0, 30) + '...' : cleanName
    },
  },
}
</script>

<style scoped>
.v-list-subheader {
  height: auto;
  padding: 16px 16px 8px 16px;
}

.v-list-item-title {
  font-size: 14px;
}

.v-list-item-subtitle {
  font-size: 13px;
}
</style>
