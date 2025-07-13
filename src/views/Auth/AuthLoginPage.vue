<template>
  <v-container class="login-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card class="pa-4 pa-sm-6" elevation="10" rounded="xl" max-width="420" width="100%">
          <div class="d-flex justify-center mb-4">
            <v-img
              :src="mkbanklogo"
              alt="MikroKreditBank logo"
              max-width="200"
              width="100%"
              max-height="80"
              contain
            />
          </div>

          <div class="text-center font-weight-bold mb-6 text-body-1 text-sm-h6">
            "Mikrokreditbank" ATB tizimiga kirish
          </div>

          <v-form @submit.prevent="handleSubmit" ref="formRef">
            <v-text-field
              v-model="authCredentials.username"
              label="Login"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              :error-messages="usernameError"
              hide-details="auto"
              class="mb-4"
              density="comfortable"
            />

            <v-text-field
              v-model="authCredentials.password"
              :type="showPassword ? 'text' : 'password'"
              label="Parol"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="togglePassword"
              :error-messages="passwordError"
              hide-details="auto"
              class="mb-4"
              density="comfortable"
            />

            <v-btn
              type="submit"
              :loading="loading"
              color="primary"
              block
              class="mt-4"
              size="large"
              min-height="48"
            >
              Kirish
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/libs/authService.js'
import mkbanklogo from '@/assets/images/logo.svg'

const router = useRouter()

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const authCredentials = ref({
  username: '',
  password: '',
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const usernameError = computed(() =>
  !authCredentials.value.username && errorMessage.value
    ? "Login maydoni bo'sh bo'lishi mumkin emas!"
    : '',
)

const passwordError = computed(() =>
  authCredentials.value.password.length < 2 && errorMessage.value
    ? "Parol kamida 2 ta belgi bo'lishi kerak!"
    : '',
)

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  const { username, password } = authCredentials.value

  if (!username) {
    errorMessage.value = "Login maydoni bo'sh bo'lishi mumkin emas!"
    loading.value = false
    return
  }

  if (password.length < 2) {
    errorMessage.value = "Parol kamida 2 ta belgi bo'lishi kerak!"
    loading.value = false
    return
  }

  try {
    const response = await AuthService.login({ username, password })

    if (response.token) {
      localStorage.setItem('access', response.token)
      localStorage.setItem('user', JSON.stringify(response.user || {}))
      localStorage.setItem('role', response.user?.role || 'user')

      const role = response.user?.role?.toLowerCase?.() || 'user'

      try {
        const { useSnackbarStore } = await import('@/stores/snackbar')
        useSnackbarStore().showSnackbar({
          color: 'success',
          text: 'Tizimga muvaffaqiyatli kirdingiz!',
          timeout: 2000,
        })
      } catch (e) {
        console.warn('Snackbar ulanmadi:', e)
      }

      if (role === 'admin') {
        await router.push({ name: 'Dashboard' })
      } else {
        console.log('here')
        await router.push({ name: 'home' })
      }
    } else {
      errorMessage.value = "Login yoki parol noto'g'ri!"
    }
  } catch (error) {
    console.error(error)
    const detail = error.response?.data?.detail || error.response?.data?.message
    errorMessage.value = detail || "Login yoki parol noto'g'ri"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 16px;
}

.fill-height {
  min-height: 100vh;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .login-container {
    padding: 12px;
  }

  .v-card {
    margin: 0 auto;
  }
}

/* Tablet optimizations */
@media (min-width: 601px) and (max-width: 960px) {
  .login-container {
    padding: 24px;
  }
}

/* Desktop optimizations */
@media (min-width: 961px) {
  .login-container {
    padding: 32px;
  }
}

/* Ensure proper spacing on very small screens */
@media (max-width: 400px) {
  .login-container {
    padding: 8px;
  }

  .v-card {
    padding: 16px !important;
  }
}
</style>
