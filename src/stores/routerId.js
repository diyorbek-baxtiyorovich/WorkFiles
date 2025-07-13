import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    selectedId: null,
  }),
  actions: {
    setSelectedId(id) {
      this.selectedId = id
    },
  },
})
