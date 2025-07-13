import axios from 'axios'

const apiService = axios.create({
  // baseURL: 'http://172.29.64.76:8000',
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

apiService.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access')
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { useSnackbarStore } = await import('@/stores/snackbar')
    const snackbar = useSnackbarStore()

    if (error.response?.status === 403) {
      localStorage.removeItem('access')
      localStorage.removeItem('user')
      location.reload()
    }

    if (error.code === 'ERR_NETWORK') {
      snackbar.showSnackbar({
        color: 'error',
        text: '🌐 Server bilan aloqa mavjud emas. Iltimos, biroz kuting.',
        timeout: 2000,
      })
    }

    if (error.response && error.response.status !== 401) {
      const { data } = error.response
      let text = '❌ Server xatoligi'

      if (typeof data.detail === 'string') {
        text = data.detail
      } else if (typeof data.message === 'string') {
        text = data.message
      }

      snackbar.showSnackbar({
        color: 'error',
        text,
        timeout: 3000,
      })
    }

    return Promise.reject(error)
  },
)

export default apiService
