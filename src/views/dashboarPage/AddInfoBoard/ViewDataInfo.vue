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
      <!-- Header -->
      <v-card-title class="bg-primary text-white pa-4">
        <div class="d-flex align-center justify-space-between w-100">
          <span class="text-h6">Majlis Ma'lumotlari</span>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeModal" />
        </div>
      </v-card-title>

      <!-- Content -->
      <v-card-text class="pa-4">
        <v-list>
          <!-- Asosiy ma'lumotlar -->
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

          <v-list-item>
            <v-list-item-title>Sana</v-list-item-title>
            <v-list-item-subtitle>{{ formatDate() }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Yozilgan sana</v-list-item-title>
            <v-list-item-subtitle>{{ formatRecordedDate() }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-3"></v-divider>

          <!-- Asosiy fayllar -->
          <v-list-subheader class="text-primary font-weight-bold">
            ASOSIY FAYLLAR
          </v-list-subheader>

          <v-list-item v-if="meetingData?.agenda">
            <v-list-item-title>Kun tartibi</v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="blue"
                variant="outlined"
                size="small"
                @click="openFileDirectly(meetingData.agenda)"
              >
                Ko'rish
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="meetingData?.participants_local">
            <v-list-item-title>Mahalliy ishtirokchilar</v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="green"
                variant="outlined"
                size="small"
                @click="openFileDirectly(meetingData.participants_local)"
              >
                Ko'rish
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="meetingData?.participants_regional">
            <v-list-item-title>Mintaqaviy ishtirokchilar</v-list-item-title>
            <template v-slot:append>
              <v-btn
                color="orange"
                variant="outlined"
                size="small"
                @click="openFileDirectly(meetingData.participants_regional)"
              >
                Ko'rish
              </v-btn>
            </template>
          </v-list-item>

          <!-- Mavzular va ularning fayllar -->
          <template v-if="meetingData?.event_topics?.length">
            <v-divider class="my-3"></v-divider>
            <v-list-subheader class="text-primary font-weight-bold">
              MAVZULAR VA FAYLLAR
            </v-list-subheader>

            <template v-for="(topic, index) in meetingData.event_topics" :key="topic.id">
              <v-list-item class="bg-grey-lighten-4 mt-2">
                <v-list-item-title class="font-weight-bold">
                  {{ index + 1 }}. {{ topic.title }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item v-if="topic.reference" class="pl-8">
                <v-list-item-title>Ma'lumotnoma</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    color="blue"
                    variant="outlined"
                    size="small"
                    @click="openFileDirectly(topic.reference.path)"
                  >
                    Ko'rish
                  </v-btn>
                </template>
              </v-list-item>

              <v-list-item v-if="topic.resolution" class="pl-8">
                <v-list-item-title>Qaror</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    color="green"
                    variant="outlined"
                    size="small"
                    @click="openFileDirectly(topic.resolution.path)"
                  >
                    Ko'rish
                  </v-btn>
                </template>
              </v-list-item>

              <v-list-item v-if="topic.presentation" class="pl-8">
                <v-list-item-title>Taqdimot</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    color="orange"
                    variant="outlined"
                    size="small"
                    @click="openFileDirectly(topic.presentation.path)"
                  >
                    Ko'rish
                  </v-btn>
                </template>
              </v-list-item>

              <template v-if="topic.app_files?.length">
                <v-list-item
                  v-for="(file, fileIndex) in topic.app_files"
                  :key="file.id"
                  class="pl-8"
                >
                  <v-list-item-title>
                    Qo'shimcha fayl #{{ file.id }} - {{ getFileName(file.path) }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-btn
                      color="red"
                      variant="outlined"
                      size="small"
                      @click="openFileDirectly(file.path)"
                    >
                      Ko'rish
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </template>
          </template>

          <!-- Statistika -->
          <v-divider class="my-3"></v-divider>
          <v-list-subheader class="text-primary font-weight-bold"> STATISTIKA </v-list-subheader>

          <v-list-item>
            <v-list-item-title>Jami fayllar soni</v-list-item-title>
            <v-list-item-subtitle>{{ getTotalFilesCount() }} ta fayl</v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Mavzular soni</v-list-item-title>
            <v-list-item-subtitle
              >{{ meetingData?.event_topics?.length || 0 }} ta mavzu</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </v-card-text>

      <!-- Footer -->
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
    formatDate() {
      if (!this.meetingData?.day || !this.meetingData?.month || !this.meetingData?.year) {
        return "Ma'lumot mavjud emas"
      }
      return `${this.meetingData.day} ${this.meetingData.month.toLowerCase()} ${this.meetingData.year}`
    },
    formatRecordedDate() {
      if (!this.meetingData?.recorded_date) return "Ma'lumot mavjud emas"
      const date = new Date(this.meetingData.recorded_date)
      return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    getTotalFilesCount() {
      let count = 0
      if (this.meetingData?.agenda) count++
      if (this.meetingData?.participants_local) count++
      if (this.meetingData?.participants_regional) count++

      if (this.meetingData?.event_topics) {
        this.meetingData.event_topics.forEach((topic) => {
          if (topic.reference) count++
          if (topic.resolution) count++
          if (topic.presentation) count++
          if (topic.app_files) count += topic.app_files.length
        })
      }
      return count
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
      return filename.length > 30 ? filename.substring(0, 30) + '...' : filename
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
