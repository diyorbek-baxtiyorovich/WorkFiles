<template>
  <div class="rounded-md">
    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.rounded-md {
  width: 100%;
  overflow: auto;
}
</style>
