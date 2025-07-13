import apiService from '@/libs/axios'

const AddBoarDataEvent = {
  AddEvent: async (basicData) => {
    const { data } = await apiService.post('/events/add-event', basicData)
    return data
  },
  DeleteEvent: async (eventId) => {
    const { data } = await apiService.delete(`/events/delete/${eventId}`)
    return data
  },

  addDocTitle: async (eventId, title) => {
    const { data } = await apiService.post(`/event-topics/add-topic/${eventId}`, {
      title,
    })

    return data.topic_id
  },

  AddFileAgenda: async (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post(
      `/event-docs/add-event-file?event_id=${id}&type_=agenda`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  AddFileLocal: async (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post(
      `/event-docs/add-event-file?event_id=${id}&type_=participants_local`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  AddFileRegionals: async (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post(
      `/event-docs/add-event-file?event_id=${id}&type_=participants_regional`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  addFileReference: async (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post(
      `/event-docs/add-topic-file?topic_id=${id}&type_=reference`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  addFileResolution: async (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post(
      `/event-docs/add-topic-file?topic_id=${id}&type_=resolution`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  addFilePresentation: async (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post(
      `/event-docs/add-topic-file?topic_id=${id}&type_=presentation`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return data
  },
  addFileAppFile: async (id, files) => {
    const formData = new FormData()
    const filesArray = Array.isArray(files) ? files : [files]

    filesArray.forEach((file) => {
      formData.append('files', file)
    })

    const { data } = await apiService.post(
      `/event-docs/bulk-add-app-file?topic_id=${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return data
  },
}

export default AddBoarDataEvent
