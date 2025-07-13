<template>
  <div class="hero-section">
    <div class="logout">
      <v-tooltip text="Chiqish">
        <template #activator="{ props }">
          <v-btn icon color="red" v-bind="props" @click="logout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>
    <div class="geometric-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <v-container fluid class="fill-height">
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" class="text-center">
          <v-chip
            class="government-badge mb-4 mb-md-8"
            variant="outlined"
            color="white"
            :size="$vuetify.display.mobile ? 'default' : 'large'"
          >
            <img :src="MKBlogo" alt="Logo" style="width: auto; height: 30px" />
          </v-chip>

          <h1 class="main-title mb-2 mb-md-4">Boshqaruv Kengashi</h1>

          <p class="subtitle mb-3 mb-md-4">Mikrokreditbank Boshqaruv Kengashi</p>

          <p class="description mb-6 mb-md-8">
            Moliyaviy barqarorlik va innovatsion yechimlar orqali mamlakatimiz iqtisodiyotining
            rivojlanishiga hissa qo'shuvchi, zamonaviy bank xizmatlarini taqdim etuvchi yetakchi
            moliyaviy muassasa sifatida faoliyat yuritamiz.
          </p>

          <v-btn
            class="cta-button"
            size="default"
            prepend-icon="mdi-account-group"
            @click="goToBoardMeeting"
            :class="{ 'mobile-button': $vuetify.display.mobile }"
          >
            <span class="button-text">
              {{
                $vuetify.display.mobile
                  ? "Yig'ilishga o'tish"
                  : "Boshqaruv Kengashi yig'ilishiga o'tish"
              }}
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import MKBlogo from '@/assets/images/MKBANK.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToBoardMeeting = () => {
  router.push({ name: 'info-meeting' })
}

const logout = async () => {
  localStorage.removeItem('access')
  localStorage.removeItem('user')
  await router.push('/login')
  location.reload()
  console.log('here')
}
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
  overflow: hidden;
  padding: 0 16px;
}
.logout {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 10000;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  animation: backgroundMove 10s ease-in-out infinite;
}

@keyframes backgroundMove {
  0%,
  100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(-10px) translateY(-5px);
  }
  50% {
    transform: translateX(10px) translateY(-10px);
  }
  75% {
    transform: translateX(-5px) translateY(5px);
  }
}

.geometric-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  opacity: 0.06;
  animation: float 3s ease-in-out infinite;
}

.shape-1 {
  top: 10%;
  left: 10%;
  width: 60px;
  height: 60px;
  background: rgba(241, 206, 206, 0.1);
  transform: rotate(45deg);
  animation-delay: 0s;
}

.shape-2 {
  top: 20%;
  right: 15%;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation-delay: 2s;
}

.shape-3 {
  bottom: 20%;
  left: 20%;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.05);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation-delay: 4s;
}

.shape-4 {
  bottom: 10%;
  right: 10%;
  width: 55px;
  height: 55px;
  background: rgba(255, 255, 255, 0.07);
  transform: rotate(45deg);
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

.v-container {
  position: relative;
  z-index: 10;
}

.government-badge {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  opacity: 0;
  transform: translateY(-30px);
  animation: fadeInDown 1s ease-out 0.5s forwards;
}

.main-title {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 700;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(-50px);
  animation: fadeInDown 0.5s ease-out 1s forwards;
  line-height: 1.2;
}

.subtitle {
  font-size: clamp(1rem, 4vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  opacity: 0;
  transform: translateY(-30px);
  animation: fadeInDown 1s ease-out 1.5s forwards;
}

.description {
  width: 60%;
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 100%;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDown 1s ease-out 2s forwards;
  padding: 0 8px;
}

.cta-button {
  background: linear-gradient(135deg, #567fbd, #688aca) !important;
  color: white !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 15px rgba(44, 90, 160, 0.25) !important;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.5s ease-out 2s forwards;
  transition: all 0.3s ease;
  padding: 12px 24px !important;
  font-size: 1rem !important;
  height: auto !important;
  min-width: auto !important;
  width: auto !important;
  display: inline-flex !important;
  margin: 0 auto;
}

.cta-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(44, 90, 160, 0.35) !important;
  background: linear-gradient(135deg, #1e4080, #2c5aa0) !important;
}

.button-text {
  font-size: 1rem;
  text-align: center;
  white-space: nowrap;
  font-weight: 600;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Mobile Specific Styles */
@media (max-width: 600px) {
  .hero-section {
    padding: 0 12px;
  }

  .main-title {
    font-size: 2rem;
    line-height: 1.1;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .description {
    width: 100%;
    font-size: 0.95rem;
    padding: 0 4px;
    line-height: 1.5;
  }

  .government-badge {
    font-size: 0.85rem;
  }

  .mobile-button {
    padding: 10px 20px !important;
    font-size: 0.9rem !important;
  }

  .button-text {
    font-size: 0.9rem !important;
  }

  .shape-1,
  .shape-2,
  .shape-3,
  .shape-4 {
    opacity: 0.04;
  }

  .shape-1 {
    width: 45px;
    height: 45px;
  }

  .shape-2 {
    width: 35px;
    height: 35px;
  }

  .shape-3 {
    width: 50px;
    height: 50px;
  }

  .shape-4 {
    width: 40px;
    height: 40px;
  }
}

/* Tablet Styles */
@media (min-width: 601px) and (max-width: 960px) {
  .hero-section {
    padding: 0 24px;
  }

  .main-title {
    font-size: 2.8rem;
  }

  .subtitle {
    font-size: 1.3rem;
  }

  .description {
    font-size: 1.05rem;
    max-width: 90%;
  }

  .cta-button {
    padding: 14px 28px !important;
    font-size: 1.05rem !important;
  }
}

/* Large Mobile Landscape */
@media (max-width: 960px) and (orientation: landscape) {
  .hero-section {
    height: 100vh;
    padding: 0 20px;
  }

  .main-title {
    font-size: 2.2rem;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }

  .description {
    font-size: 0.9rem;
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .government-badge {
    margin-bottom: 16px;
  }
}

/* Extra small devices */
@media (max-width: 360px) {
  .hero-section {
    padding: 0 8px;
  }

  .main-title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .description {
    font-size: 0.9rem;
    padding: 0 2px;
  }

  .button-text {
    font-size: 0.85rem !important;
  }

  .cta-button {
    padding: 10px 18px !important;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .main-title {
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }
}
</style>
