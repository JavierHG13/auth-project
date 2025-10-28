<template>
  <div class="login-container">
    <h2>Recuperar contraseña</h2>

    <form @submit.prevent="handleLogin">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Correo electrónico" 
        required 
      />
    
      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando verificación...' : 'Enviar' }}
      </button>
    </form>

    <p v-if="message" :class="messageType">{{ message }}</p>

     <GoogleAuth />

    <p><router-link to="/login">Regresar</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import GoogleAuth from '../components/GoogleAuth.vue'
import axios from 'axios'


// Referencias reactivas
const email = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const router = useRouter()

const API_URL = 'http://localhost:3000/api/auth'
axios.defaults.withCredentials = true

const handleLogin = async () => {
  loading.value = true
  message.value = ''
  messageType.value = ''

  // Crear una instancia del store
  const auth = useAuthStore()

  
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: email.value
    })

    const { message: msg } = response.data

    //message.value = msg
    //messageType.value = 'success'

    
    setTimeout(() => {  router.push('/restablecer-password') }, 1500)

  } catch (error) {
    message.value = error.response?.data?.message || 'Error al enviar el codigo de verificación'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #1e1e1e;
  color: white;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: 2px solid #42b883;
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
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

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  color: #333;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  margin-top: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.google-btn img {
  width: 20px;
  height: 20px;
}

.google-btn:hover {
  background: #eaeaea;
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

p {
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
