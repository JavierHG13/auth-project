<template>
  <div class="verify-container">
    <h2>Verifica tu correo</h2>
    <p class="instruction">
      Hemos enviado un código de verificación a tu correo electrónico.
      <br />Ingresa el código de 6 dígitos para activar tu cuenta.
    </p>

    <form @submit.prevent="verifyCode">
      <input
        v-model="code"
        type="text"
        placeholder="Código de 6 dígitos"
        maxlength="6"
        pattern="\d{6}"
        required
        autofocus
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Verificando...' : 'Verificar' }}
      </button>
    </form>

    <p v-if="message" :class="messageType">{{ message }}</p>

    <div class="resend-section">
      <p>¿No recibiste el código?</p>
      <button @click="resendCode" :disabled="cooldown > 0 || loading" class="resend-btn">
        {{ cooldown > 0 ? `Espera ${cooldown}s` : 'Reenviar código' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const code = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const cooldown = ref(0)
const router = useRouter()
const pendingEmail = ref('')
const API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

onMounted(() => {
  // Obtener el correo guardado al registrarse
  pendingEmail.value = localStorage.getItem('pendingEmail') || ''
})

const verifyCode = async () => {
  if (code.value.length !== 6) {
    message.value = 'El código debe tener 6 dígitos'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await axios.post(`${API_URL}/verify-email`, {
      email: pendingEmail.value,
      code: verificationCode.value,
    })
    message.value = response.data.message
    messageType.value = 'success'

    localStorage.removeItem('pendingEmail')

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    message.value = error.response?.data?.message || 'Error al verificar el código'
    messageType.value = 'error'
    code.value = '' // Limpiar el código incorrecto
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await axios.post(`${API_URL}/resend-code`, { email: pendingEmail.value, })

    message.value = response.data.message
    messageType.value = 'success'

    // Iniciar cooldown de 60 segundos
    cooldown.value = 60
    const interval = setInterval(() => {
      cooldown.value--
      if (cooldown.value === 0) clearInterval(interval)
    }, 1000)
  } catch (error) {
    message.value = error.response?.data?.message || 'Error al reenviar código'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Verificar si hay sesión activa al cargar el componente
onMounted(async () => {
  try {
    // Puedes hacer una petición para verificar si hay una sesión activa
    // Si no hay sesión, redirigir al registro
  } catch (error) {
    console.error('No hay sesión activa')
  }
})
</script>

<style scoped>
.verify-container {
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
  padding: 15px;
  margin: 15px 0;
  border: 2px solid #333;
  border-radius: 8px;
  font-size: 24px;
  text-align: center;
  letter-spacing: 8px;
  background: #2a2a2a;
  color: white;
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
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #35a372;
}

button:disabled {
  background: #666;
  cursor: not-allowed;
}

.resend-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.resend-section p {
  color: #b0b0b0;
  font-size: 14px;
  margin-bottom: 10px;
}

.resend-btn {
  background: #333;
  font-size: 14px;
}

.resend-btn:hover:not(:disabled) {
  background: #444;
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
