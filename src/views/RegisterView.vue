<template>
  <div class="register-container">
    <h2>Registro</h2>
    <form @submit.prevent="handleRegister">
      <input 
        v-model="name" 
        type="text" 
        placeholder="Nombre completo" 
        required 
      />
      <input 
        v-model="email" 
        type="email" 
        placeholder="Correo" 
        required 
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Contraseña" 
        minlength="6"
        required 
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Crear cuenta' }}
      </button>
    </form>
    
    <p v-if="message" :class="messageType">{{ message }}</p>
    
    <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const name = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const router = useRouter()

const API_URL = 'http://localhost:3000/api/auth'

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true

const handleRegister = async () => {
  loading.value = true
  message.value = ''
  messageType.value = ''
  
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    message.value = response.data.message
    messageType.value = 'success'
    
    // Redirigir a la vista de verificación después de 1.5 segundos
    setTimeout(() => {
      router.push('/verify-email')
    }, 1500)
    
  } catch (error) {
    message.value = error.response?.data?.message || 'Error al registrar usuario'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
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