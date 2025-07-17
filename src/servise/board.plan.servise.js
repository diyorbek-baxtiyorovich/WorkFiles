import apiService from '@/libs/axios'

const PlanBoardServise = {
  getPlansAll: async (params) => {
    const { data } = await apiService.get('/event_plans/get-all', { params })

    return data
  },

  getPlanDataId: async (id) => {
    const { data } = await apiService.get(`/event_plans/get/${id}`)

    return data
  },
  postAddPlan: async (params) => {
    const formData = new FormData()

    formData.append('title', params.title)
    formData.append('file', params.file)

    const { data } = await apiService.post(`/event_plans/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return data
  },

  putUpdatePlan: async (id, params) => {
    const { data } = await apiService.put(`/event_plans/update-plan/${id}`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
  putEventPlanUpdate: async (id, toArchive) => {
    const { data } = await apiService.put(`/event_plans/archive-plan/${id}?to_archive=${toArchive}`)
    return data
  },
  deleteEventPlan: async (id) => {
    const { data } = await apiService.delete(`/event_plans/delete-plan/${id}`)
    return data
  },
}

export default PlanBoardServise
