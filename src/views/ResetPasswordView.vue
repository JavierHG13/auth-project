<template>
  <div class="reset-container">
    <h2>Nueva contraseña</h2>
    <p class="instruction">Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.</p>

    <form @submit.prevent="handleResetPassword">
      <input
        v-model="newPassword"
        type="password"
        placeholder="Nueva contraseña"
        minlength="6"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirmar contraseña"
        minlength="6"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
      </button>
    </form>

    <p v-if="message" :class="messageType">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Las contraseñas no coinciden'
    messageType.value = 'error'
    return
  }

  if (newPassword.value.length < 6) {
    message.value = 'La contraseña debe tener al menos 6 caracteres'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      newPassword: newPassword.value,
    })

    message.value = response.data.message
    messageType.value = 'success'

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    message.value = error.response?.data?.message || 'Error al actualizar contraseña'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-container {
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
  margin: 15px 0;
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
</style>
