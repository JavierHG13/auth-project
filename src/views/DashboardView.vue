<template>
  <Navbar />
  <div class="dashboard">
    <h1>Bienvenido, {{ auth.user?.name }}</h1>
    <p>Has iniciado sesión correctamente</p>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 2rem;
}
</style>
