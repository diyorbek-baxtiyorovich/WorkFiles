<template>
  <div class="meetBlock">
    <div class="PrevExit">
      <v-tooltip text="Орқага қайтиш">
        <template #activator="{ props }">
          <v-btn icon color="white" v-bind="props" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <v-container class="pa-6">
      <div class="text-center mb-8">
        <h1 class="text-h4 font-weight-bold text-blue-darken-4">Мажлис маълумотлар Архиви</h1>
      </div>

      <v-row justify="center" class="equal-height-row">
        <v-col cols="12" md="4" class="mb-4 d-flex">
          <v-card class="selection-card flex-grow-1" elevation="2" @click="arxivPlan">
            <v-card-text class="pa-6 d-flex flex-column justify-center align-center text-center">
              <v-icon size="48" color="primary" class="mb-4">mdi-folder-open</v-icon>
              <h3 class="text-h6">Мажлис материалларини режа маълумотлар архивига ўтиш</h3>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="mb-4 d-flex">
          <v-card class="selection-card flex-grow-1" elevation="2" @click="arxivMaterials">
            <v-card-text class="pa-6 d-flex flex-column justify-center align-center text-center">
              <v-icon size="48" color="success" class="mb-4">mdi-file-document</v-icon>
              <h3 class="text-h6">Мажлис материаллар маълумотлар архивига ўтиш</h3>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const arxivPlan = () => {
  router.push('/planArxiv')
}
const arxivMaterials = () => {
  router.push('/meetingArxiv')
}
const goBack = () => router.go(-1)
</script>

<style scoped>
.meetBlock {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%);
}
.equal-height-row {
  align-items: stretch;
  margin-top: 100px;
}

.selection-card {
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}
.PrevExit {
  position: absolute;
  left: 15px;
  top: 15px;
  z-index: 10000;
}

.selection-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 960px) {
  .equal-height-row {
    margin-top: 0;
  }
  .selection-card {
    min-height: 160px;
  }
}

@media (max-width: 480px) {
  .PrevExit {
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 10000;
  }
}
</style>
