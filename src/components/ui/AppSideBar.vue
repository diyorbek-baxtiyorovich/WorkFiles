<template>
  <div>
    <v-list nav dense class="modern-sidebar" :class="{ collapsed: isCollapsed }">
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="!isCollapsed ? item.title : ''"
        :to="item.to"
        router
        class="modern-item"
        :class="{ 'active-item': $route.path === item.to }"
      />
    </v-list>
  </div>
</template>

<script setup>
const props = defineProps({
  isCollapsed: Boolean,
})

const menuItems = [
  { icon: 'mdi-home-group-plus', title: "Ma'lumotlar qo'shish", value: 'Home', to: '/create' },
]
</script>

<style scoped>
.modern-sidebar {
  transition: width 0.3s ease;
}

/* Hiding item content when collapsed */
.collapsed .v-list-item__content {
  display: none;
}

.modern-item {
  border-radius: 8px;
  margin-bottom: 6px;
  transition:
    background-color 0.3s,
    color 0.3s;
  font-size: 16px;
  font-weight: 500;
}

/* Highlight current route */
.active-item {
  background-color: #1976d2;
  color: white;
}

.active-item .v-icon {
  color: white !important;
}
</style>
