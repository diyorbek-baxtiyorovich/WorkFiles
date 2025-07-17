import apiService from '@/libs/axios'

const DirectorisActivity = {
  getEventsAll: async (params) => {
    const { data } = await apiService.get('/events/get/all', { params })
    return data
  },

  getEventDataId: async (id) => {
    const response = await apiService.get(`/events/get-event/${id}`)
    return response.data
  },

  getEventById: async (id) => {
    const response = await apiService.get(`/event-topics/get-by-event/${id}`)
    return response.data
  },

  getEventTopics: async (id) => {
    const response = await apiService.get(`/event-topics/get-topic/${id}`)
    return response.data
  },

  getEventFullDate: async (id) => {
    const response = await apiService.get(`/events/get-event-full/${id}`)
    return response.data
  },

  updateEvent: async (id, param) => {
    const response = await apiService.put(`/events/update-event/${id}`, param)
    return response.data
  },

  updateTopic: async (id, param) => {
    const response = await apiService.put(`/event-topics/update-topic/${id}`, param)

    return response
  },
  deleteEventTopic: async (id) => {
    const response = await apiService.delete(`/event-topics/delete/${id}`)
    return response.data
  },
  deleteEventDocsById: async (param) => {
    const response = await apiService.delete('/event-docs/delete-file', {
      data: param,
    })
    return response.data
  },
  putAchiveEvent: async (id, toArchive) => {
    const { data } = await apiService.put(`/events/archive-event/${id}?to_archive=${toArchive}`)
    return data
  },
}

export default DirectorisActivity
