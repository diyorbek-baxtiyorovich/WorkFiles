import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/AuthLoginPage.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HeadBoardMeeting/BoarMeetingApp.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/meeting-Plan',
    name: 'meeting-Plan',
    component: () => import('@/views/InformatingSellect/sellectInfoPlanMeet.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/meetingArxiv',
    name: 'meeting-arxiv',
    component: () => import('@/views/arxivDataPlanMeet/arxivMeetData.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/planArxiv',
    name: 'plan-arxiv',
    component: () => import('@/views/arxivDataPlanMeet/arxivPlanData.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/board-meeting/:id',
    name: 'BoardMeeting',
    component: () => import('@/views/BoardSellectItem/ItemBoardMeetingSellect.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/agenda',
    name: 'agenda',
    component: () => import('@/views/PdfMeetBoard/AgendPdfView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/planPdf',
    name: 'planPdf',
    component: () => import('@/views/PdfMeetBoard/PlanPdfView.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/participants',
    name: 'participants',
    component: () => import('@/views/PdfMeetBoard/participantsListPdf.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/meetBoard',
    name: 'meetBoard',
    component: () => import('@/views/PdfMeetBoard/MeetPdfBoarApp.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/create',
    component: () => import('@/Layout/DashboardPage.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/create',
    name: 'create',
    component: () => import('@/views/dashboarPage/AppNewCreateData.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/Table',
    name: 'Table',
    component: () => import('@/views/dashboarPage/BlokViewAddDash/AddNewBroad.vue'),
    meta: { requiresAuth: true, layout: 'admin' },
  },
  {
    path: '/pdfcontent',
    name: 'pdfcontent',
    component: () => import('@/views/PdfMeetBoard/MeetPdfBoarApp.vue'),
    meta: { requiresAuth: true, layout: 'default' },
  },
  {
    path: '/',
    redirect: '/home',
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFound.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access')
  const role = localStorage.getItem('role')

  if (to.meta.layout === 'auth' && token) {
    if (role === 'admin') {
      return next({ name: 'Dashboard' })
    } else {
      return next({ name: 'home' })
    }
  }

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  if (to.meta.layout === 'admin' && role !== 'admin') {
    return next({ name: 'home' })
  }

  next()
})

export default router
