<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/"></router-link>
    </div>

    <div class="nav-actions">
      <!-- Mostrar iniciar sesión si NO está autenticado -->
      <router-link v-if="!isAuthenticated" to="/login" class="btn-login">
        Iniciar sesión
      </router-link>

      <!-- Mostrar cerrar sesión si SÍ está autenticado -->
      <button v-if="isAuthenticated" @click="logout">Cerrar sesión</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const auth = useAuthStore()
const router = useRouter()

// Computed para verificar si el usuario está autenticado
const isAuthenticated = computed(() => !!auth.user)

// Función para cerrar sesión
const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1e1e1e;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

button,
.btn-login {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
}

button:hover,
.btn-login:hover {
  background: #c0392b;
}
</style>
