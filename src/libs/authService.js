import apiService from '@/libs/axios'

const AuthService = {
  login: async (userCredentials) => {
    const { data } = await apiService.post('/auth/login', userCredentials)
    return data
  },
}

export default AuthService
