<template>
  <div class="login-container">
    <div class="header">
      <h2>Iniciar sesión</h2>
    </div>

    <form @submit.prevent="handleLogin">
      <!-- Email -->
      <div class="input-wrapper">
        <Mail :size="20" class="input-icon" />
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
      </div>

      <!-- Password -->
      <div class="input-wrapper">
        <Lock :size="20" class="input-icon" />
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Contraseña"
          required
        />
        <button
          type="button"
          class="toggle-password"
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <Eye v-if="showPassword" :size="20" />
          <EyeOff v-else :size="20" />
        </button>
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        <Loader2 v-if="loading" :size="20" class="spinner" />
        <LogIn v-else :size="20" />
        {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
      </button>
    </form>

    <!-- Mensaje de respuesta -->
    <div v-if="message" :class="['alert', messageType]">
      <CheckCircle2 v-if="messageType === 'success'" :size="20" />
      <AlertCircle v-else :size="20" />
      {{ message }}
    </div>

    <GoogleAuth />

    <p class="forgot-link">
      <router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
    </p>

    <p class="register-link">
      ¿No tienes cuenta? <router-link to="/register">Crea una aquí</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import GoogleAuth from '../components/GoogleAuth.vue'
import axios from 'axios'
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckCircle2, AlertCircle } from 'lucide-vue-next'

// Referencias reactivas
const email = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const handleLogin = async () => {
  loading.value = true
  message.value = ''
  messageType.value = ''

  // Crear una instancia del store
  const auth = useAuthStore()

  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email.value,
      password: password.value,
    })

    const { user, token, message: msg } = response.data

    auth.login(user, token)

    message.value = msg
    messageType.value = 'success'

    console.log(response)

    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    message.value = error.response?.data?.message || 'Error al iniciar sesión'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 450px;
  margin: 4rem auto;
  padding: 2.5rem;
  border-radius: 16px;
  background: #1e1e1e;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

form {
  margin-bottom: 1.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #888;
  pointer-events: none;
  z-index: 1;
}

input {
  width: 100%;
  padding: 14px 45px 14px 45px;
  border-radius: 10px;
  border: 2px solid #333;
  font-size: 15px;
  box-sizing: border-box;
  background: #2a2a2a;
  color: white;
  transition: all 0.3s ease;
}

input::placeholder {
  color: #888;
}

input:focus {
  outline: none;
  border-color: #42b883;
  background: #333;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  color: #888;
  transition: color 0.3s;
  z-index: 2;
}

.toggle-password:hover {
  color: #42b883;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  margin-top: 10px;
  background: linear-gradient(135deg, #42b883 0%, #35a372 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 184, 131, 0.4);
}

.submit-btn:disabled {
  background: #666;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.alert {
  margin-top: 20px;
  padding: 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert.success {
  background: rgba(66, 184, 131, 0.15);
  color: #42b883;
  border: 1px solid #42b883;
}

.alert.error {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

.forgot-link {
  margin-top: 15px;
  text-align: center;
}

.forgot-link a {
  color: #42b883;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-link a:hover {
  color: #35a372;
  text-decoration: underline;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #aaa;
  font-size: 14px;
}

.register-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
  margin-left: 4px;
}

.register-link a:hover {
  color: #35a372;
  text-decoration: underline;
}
</style>
