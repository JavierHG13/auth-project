import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import VerifyEmailView from '../views/VerifyEmailView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'           
import VerifyRecoveryCodeView from '../views/VerifyRecoveryCodeView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'  
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/verify-email',
      name: 'VerifyEmail',
      component: VerifyEmailView
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPasswordView
    },
    {
      path: '/verify-recovery-code',
      name: 'VerifyRecoveryCode',
      component: VerifyRecoveryCodeView
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: ResetPasswordView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
  ]
})

// Middleware para rutas protegidas
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router
