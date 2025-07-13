import axios from 'axios'

export const imageApiService = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_IMAGES,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: false,
})

imageApiService.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access')
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
