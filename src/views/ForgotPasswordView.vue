<template>
  <div class="forgot-container">
    <h2>Recuperar contraseña</h2>
    <p class="instruction">
      Ingresa tu correo electrónico y te enviaremos un código de recuperación.
    </p>

    <form @submit.prevent="handleForgotPassword">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Enviar código' }}
      </button>
    </form>

    <p v-if="message" :class="messageType">{{ message }}</p>

    <p class="back-link">
      <router-link to="/login">Volver al inicio de sesión</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const handleForgotPassword = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await axios.post(`${API_URL}/forgot-password`, {
      email: email.value,
    })

    message.value = response.data.message
    messageType.value = 'success'

    // Redirigir a verificación después de 1.5 segundos
    setTimeout(() => {
      router.push('/verify-recovery-code')
    }, 1500)
  } catch (error) {
    message.value = error.response?.data?.message || 'Error al enviar código'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #1e1e1e;
  color: white;
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
}

.instruction {
  color: #b0b0b0;
  font-size: 14px;
  margin-bottom: 2rem;
  line-height: 1.5;
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 2px solid #333;
  border-radius: 8px;
  background: #2a2a2a;
  color: white;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #42b883;
}

button {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

button:hover:not(:disabled) {
  background: #35a372;
}

button:disabled {
  background: #666;
  cursor: not-allowed;
}

.success {
  color: #42b883;
  margin-top: 15px;
  font-weight: bold;
}

.error {
  color: #ff6b6b;
  margin-top: 15px;
  font-weight: bold;
}

.back-link {
  margin-top: 20px;
}

a {
  color: #42b883;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
