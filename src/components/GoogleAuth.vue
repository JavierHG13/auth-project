<template>
  <div class="google-login">
    <GoogleLogin :callback="handleGoogleLogin" />
  </div>
</template>

<script setup>
import { GoogleLogin } from 'vue3-google-login'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
//const API_URL = 'http://localhost:3000/api/auth/google-auth'
const API_URL = 'https://practica-de-auteticacion.vercel.app/api/auth/google-auth'

//Manejar respuesta de Google
const handleGoogleLogin = async (response) => {
  try {
    const googleToken = response.credential

    if (!googleToken) {
      console.error('No se recibió token de Google')
      return
    }

    const res = await axios.post(API_URL, { googleToken }, { withCredentials: true })

    const { user, token } = res.data

    auth.login(user, token)

    router.push('/dashboard')
  } catch (error) {
    console.error('Error en autenticación con Google:', error)
    alert(error.response?.data?.message || 'Error al iniciar sesión con Google')
  }
}
</script>

<style scoped>
.google-login {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>
