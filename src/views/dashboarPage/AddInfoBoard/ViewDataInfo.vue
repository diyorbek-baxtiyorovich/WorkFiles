<template>
  <!-- Modal Dialog -->
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    max-width="1200px"
    scrollable
    persistent
  >
    <v-card class="meeting-modal">
      <!-- Header -->
      <v-card-title class="bg-primary text-white pa-4">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-file-document-multiple-outline</v-icon>
            <span class="text-h6">Majlis Ma'lumotlari</span>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeModal" />
        </div>
      </v-card-title>

      <!-- Tabs -->
      <v-tabs v-model="activeTab" bg-color="grey-lighten-4">
        <v-tab value="overview">
          <v-icon class="mr-2">mdi-information-outline</v-icon>
          Umumiy Ma'lumot
        </v-tab>
        <v-tab value="files">
          <v-icon class="mr-2">mdi-file-multiple-outline</v-icon>
          Fayllar ({{ getTotalFilesCount() }})
        </v-tab>
        <v-tab value="participants">
          <v-icon class="mr-2">mdi-account-group-outline</v-icon>
          Ishtirokchilar
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-0">
        <v-tabs-window v-model="activeTab">
          <!-- Overview Tab -->
          <v-tabs-window-item value="overview">
            <v-container class="py-6">
              <v-row>
                <v-col cols="12">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="bg-blue-lighten-5">
                      <v-icon class="mr-2">mdi-calendar</v-icon>
                      Majlis Ma'lumotlari
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">ID:</v-list-item-title>
                            <v-list-item-subtitle>{{ meetingData?.id }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Sana:</v-list-item-title>
                            <v-list-item-subtitle>{{ formatDate() }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-col>
                        <v-col cols="12">
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold"
                              >Sarlavha:</v-list-item-title
                            >
                            <v-list-item-subtitle class="text-wrap">{{
                              meetingData?.title
                            }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-col>
                        <v-col cols="12">
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold"
                              >Yozilgan sana:</v-list-item-title
                            >
                            <v-list-item-subtitle>{{ formatRecordedDate() }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <!-- Event Topics -->
                  <v-card variant="outlined" v-if="meetingData?.event_topics?.length">
                    <v-card-title class="bg-green-lighten-5">
                      <v-icon class="mr-2">mdi-format-list-bulleted-outline</v-icon>
                      Tadbirlar Mavzulari
                    </v-card-title>
                    <v-card-text class="mt-4">
                      <v-expansion-panels v-model="expandedTopic">
                        <v-expansion-panel
                          v-for="(topic, index) in meetingData.event_topics"
                          :key="topic.id"
                        >
                          <v-expansion-panel-title>
                            <div class="d-flex align-center">
                              <v-icon class="mr-2">mdi-topic-outline</v-icon>
                              <span class="font-weight-medium">{{ topic.title }}</span>
                              <v-spacer></v-spacer>
                              <v-chip size="small" color="primary" class="ml-3">
                                {{ topic.app_files?.length || 0 }} fayl
                              </v-chip>
                            </div>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-row>
                              <v-col cols="12" md="4" v-if="topic.reference">
                                <v-card variant="outlined" class="h-100">
                                  <v-card-title class="text-subtitle-1">Ma'lumotnoma</v-card-title>
                                  <v-card-text>
                                    <v-btn
                                      color="blue"
                                      variant="outlined"
                                      size="small"
                                      @click="openFile(topic.reference.path, 'Ma\'lumotnoma')"
                                    >
                                      <v-icon class="mr-1">mdi-eye</v-icon>
                                      Ko'rish
                                    </v-btn>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="4" v-if="topic.resolution">
                                <v-card variant="outlined" class="h-100">
                                  <v-card-title class="text-subtitle-1">Qaror</v-card-title>
                                  <v-card-text>
                                    <v-btn
                                      color="green"
                                      variant="outlined"
                                      size="small"
                                      @click="openFile(topic.resolution.path, 'Qaror')"
                                    >
                                      <v-icon class="mr-1">mdi-eye</v-icon>
                                      Ko'rish
                                    </v-btn>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="12" md="4" v-if="topic.presentation">
                                <v-card variant="outlined" class="h-100">
                                  <v-card-title class="text-subtitle-1">Taqdimot</v-card-title>
                                  <v-card-text>
                                    <v-btn
                                      color="orange"
                                      variant="outlined"
                                      size="small"
                                      @click="openFile(topic.presentation.path, 'Taqdimot')"
                                    >
                                      <v-icon class="mr-1">mdi-eye</v-icon>
                                      Ko'rish
                                    </v-btn>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>

          <!-- Files Tab -->
          <v-tabs-window-item value="files">
            <v-container class="py-6">
              <v-row>
                <!-- Main Files -->
                <v-col cols="12">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="bg-purple-lighten-5">
                      <v-icon class="mr-2">mdi-file-document</v-icon>
                      Asosiy Fayllar
                    </v-card-title>
                    <v-card-text class="mt-3">
                      <v-row>
                        <v-col cols="12" md="4" v-if="meetingData?.agenda">
                          <v-card variant="outlined" class="text-center pa-4">
                            <v-icon size="48" color="blue">mdi-calendar-text</v-icon>
                            <v-card-title class="text-subtitle-1">Kun tartibi</v-card-title>
                            <v-card-actions class="justify-center">
                              <v-btn
                                color="blue"
                                variant="outlined"
                                @click="openFile(meetingData.agenda, 'Kun tartibi')"
                              >
                                <v-icon class="mr-1">mdi-eye</v-icon>
                                Ko'rish
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="4" v-if="meetingData?.participants_local">
                          <v-card variant="outlined" class="text-center pa-4">
                            <v-icon size="48" color="green">mdi-account-multiple</v-icon>
                            <v-card-title class="text-subtitle-1"
                              >Mahalliy ishtirokchilar</v-card-title
                            >
                            <v-card-actions class="justify-center">
                              <v-btn
                                color="green"
                                variant="outlined"
                                @click="
                                  openFile(
                                    meetingData.participants_local,
                                    'Mahalliy ishtirokchilar',
                                  )
                                "
                              >
                                <v-icon class="mr-1">mdi-eye</v-icon>
                                Ko'rish
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="4" v-if="meetingData?.participants_regional">
                          <v-card variant="outlined" class="text-center pa-4">
                            <v-icon size="48" color="orange">mdi-account-group</v-icon>
                            <v-card-title class="text-subtitle-1"
                              >Mintaqaviy ishtirokchilar</v-card-title
                            >
                            <v-card-actions class="justify-center">
                              <v-btn
                                color="orange"
                                variant="outlined"
                                @click="
                                  openFile(
                                    meetingData.participants_regional,
                                    'Mintaqaviy ishtirokchilar',
                                  )
                                "
                              >
                                <v-icon class="mr-1">mdi-eye</v-icon>
                                Ko'rish
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Topic Files -->
                <v-col cols="12" v-if="meetingData?.event_topics?.length">
                  <v-card variant="outlined">
                    <v-card-title class="bg-indigo-lighten-5">
                      <v-icon class="mr-2">mdi-folder-multiple-outline</v-icon>
                      Mavzu Fayllar
                    </v-card-title>
                    <v-card-text class="mt-3">
                      <v-expansion-panels v-model="expandedFiles">
                        <v-expansion-panel
                          v-for="(topic, index) in meetingData.event_topics"
                          :key="`files-${topic.id}`"
                        >
                          <v-expansion-panel-title>
                            <div class="d-flex align-center">
                              <v-icon class="mr-2">mdi-folder</v-icon>
                              <span class="font-weight-medium">{{ topic.title }}</span>
                              <v-spacer></v-spacer>
                              <v-chip size="small" color="indigo">
                                {{ topic.app_files?.length || 0 }} fayl
                              </v-chip>
                            </div>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-row v-if="topic.app_files?.length">
                              <v-col
                                cols="12"
                                md="6"
                                lg="4"
                                v-for="(file, fileIndex) in topic.app_files"
                                :key="file.id"
                              >
                                <v-card variant="outlined" class="h-100">
                                  <v-card-text class="text-center pa-4">
                                    <v-icon size="48" color="red">mdi-file-pdf-box</v-icon>
                                    <div class="text-subtitle-2 mt-2">Fayl #{{ file.id }}</div>
                                    <div class="text-caption text-grey">
                                      {{ getFileName(file.path) }}
                                    </div>
                                  </v-card-text>
                                  <v-card-actions class="justify-center">
                                    <v-btn
                                      color="red"
                                      variant="outlined"
                                      size="small"
                                      @click="openFile(file.path, `Fayl #${file.id}`)"
                                    >
                                      <v-icon class="mr-1">mdi-eye</v-icon>
                                      Ko'rish
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-col>
                            </v-row>
                            <v-alert v-else type="info" variant="outlined">
                              Ushbu mavzu uchun qo'shimcha fayllar mavjud emas.
                            </v-alert>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>

          <!-- Participants Tab -->
          <v-tabs-window-item value="participants">
            <v-container class="py-6">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="h-100">
                    <v-card-title class="bg-green-lighten-5">
                      <v-icon class="mr-2">mdi-account-multiple-outline</v-icon>
                      Mahalliy Ishtirokchilar
                    </v-card-title>
                    <v-card-text class="text-center pa-6">
                      <v-icon size="72" color="green">mdi-account-group</v-icon>
                      <div class="mt-4">
                        <v-btn
                          color="green"
                          variant="elevated"
                          size="large"
                          @click="
                            openFile(meetingData?.participants_local, 'Mahalliy ishtirokchilar')
                          "
                          v-if="meetingData?.participants_local"
                        >
                          <v-icon class="mr-2">mdi-eye</v-icon>
                          Ro'yxatni Ko'rish
                        </v-btn>
                        <v-alert v-else type="info" variant="outlined">
                          Mahalliy ishtirokchilar ro'yxati mavjud emas
                        </v-alert>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="h-100">
                    <v-card-title class="bg-orange-lighten-5">
                      <v-icon class="mr-2">mdi-account-multiple-outline</v-icon>
                      Mintaqaviy Ishtirokchilar
                    </v-card-title>
                    <v-card-text class="text-center pa-6">
                      <v-icon size="72" color="orange">mdi-account-group</v-icon>
                      <div class="mt-4">
                        <v-btn
                          color="orange"
                          variant="elevated"
                          size="large"
                          @click="
                            openFile(
                              meetingData?.participants_regional,
                              'Mintaqaviy ishtirokchilar',
                            )
                          "
                          v-if="meetingData?.participants_regional"
                        >
                          <v-icon class="mr-2">mdi-eye</v-icon>
                          Ro'yxatni Ko'rish
                        </v-btn>
                        <v-alert v-else type="info" variant="outlined">
                          Mintaqaviy ishtirokchilar ro'yxati mavjud emas
                        </v-alert>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- File Preview Dialog -->
  <v-dialog v-model="filePreviewDialog" max-width="900px">
    <v-card>
      <v-card-title class="bg-grey-lighten-2">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-file-eye</v-icon>
            <span>{{ selectedFileTitle }}</span>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="filePreviewDialog = false" />
        </div>
      </v-card-title>
      <v-card-text class="pa-0">
        <div class="text-center pa-8">
          <v-icon size="72" color="grey">mdi-file-pdf-box</v-icon>
          <div class="mt-4">
            <v-btn color="primary" variant="elevated" :href="selectedFileUrl" target="_blank">
              <v-icon class="mr-2">mdi-open-in-new</v-icon>
              Yangi oynada ochish
            </v-btn>
          </div>
          <div class="mt-2 text-caption text-grey">Fayl URL: {{ selectedFileUrl }}</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MeetingDataModal',
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
  data() {
    return {
      activeTab: 'overview',
      expandedTopic: null,
      expandedFiles: null,
      filePreviewDialog: false,
      selectedFileUrl: '',
      selectedFileTitle: '',
    }
  },
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
      const months = {
        january: 'Yanvar',
        february: 'Fevral',
        march: 'Mart',
        april: 'Aprel',
        may: 'May',
        june: 'Iyun',
        july: 'Iyul',
        august: 'Avgust',
        september: 'Sentabr',
        october: 'Oktabr',
        november: 'Noyabr',
        december: 'Dekabr',
      }
      return `${this.meetingData.day} ${months[this.meetingData.month.toLowerCase()]} ${this.meetingData.year}`
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
    openFile(url, title) {
      this.selectedFileUrl = url
      this.selectedFileTitle = title
      this.filePreviewDialog = true
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
.meeting-modal {
  height: 80vh;
}

.text-wrap {
  white-space: normal !important;
  word-wrap: break-word;
}

.v-expansion-panel-title {
  padding: 16px !important;
}

.v-card-title {
  word-break: break-word;
}
</style>
