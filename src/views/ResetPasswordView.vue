<template>
  <div class="reset-container">
    <div class="header">
      <Shield :size="48" class="header-icon" />
      <h2>Nueva contraseña</h2>
      <p class="instruction">
        Tu nueva contraseña debe tener al menos 6 caracteres, una mayúscula y un carácter especial.
      </p>
    </div>

    <form @submit.prevent="handleResetPassword">
      <!-- Nueva contraseña -->
      <div class="input-group">
        <div class="password-wrapper">
          <Lock :size="20" class="input-icon" />
          <input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Nueva contraseña"
            @input="validatePassword"
            required
            :class="{ 'input-error': passwordError, 'input-success': isPasswordValid }"
          />
          <button
            type="button"
            class="toggle-btn"
            @click="showNewPassword = !showNewPassword"
            tabindex="-1"
          >
            <Eye v-if="showNewPassword" :size="20" />
            <EyeOff v-else :size="20" />
          </button>
        </div>

        <!-- Requisitos de contraseña -->
        <div v-if="newPassword.length > 0" class="requirements">
          <div class="requirement" :class="{ valid: checks.length }">
            <span class="check-icon">{{ checks.length ? '✓' : '○' }}</span>
            Al menos 6 caracteres
          </div>
          <div class="requirement" :class="{ valid: checks.uppercase }">
            <span class="check-icon">{{ checks.uppercase ? '✓' : '○' }}</span>
            Una letra mayúscula
          </div>
          <div class="requirement" :class="{ valid: checks.special }">
            <span class="check-icon">{{ checks.special ? '✓' : '○' }}</span>
            Un carácter especial (!@#$%^&*)
          </div>
        </div>

        <span v-if="passwordError" class="error-text">
          <AlertCircle :size="14" />
          {{ passwordError }}
        </span>
      </div>

      <!-- Confirmar contraseña -->
      <div class="input-group">
        <div class="password-wrapper">
          <Lock :size="20" class="input-icon" />
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirmar contraseña"
            @blur="validateConfirm"
            required
            :class="{ 'input-error': confirmError, 'input-success': confirmSuccess }"
          />
          <button
            type="button"
            class="toggle-btn"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
          >
            <Eye v-if="showConfirmPassword" :size="20" />
            <EyeOff v-else :size="20" />
          </button>
        </div>

        <span v-if="confirmError" class="error-text">
          <AlertCircle :size="14" />
          {{ confirmError }}
        </span>
        <span v-if="confirmSuccess && !confirmError" class="success-text">
          <CheckCircle2 :size="14" />
          Las contraseñas coinciden
        </span>
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        <Loader2 v-if="loading" :size="20" class="spinner" />
        <Key v-else :size="20" />
        {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
      </button>
    </form>

    <!-- Mensaje de respuesta -->
    <div v-if="message" :class="['alert', messageType]">
      <CheckCircle2 v-if="messageType === 'success'" :size="20" />
      <AlertCircle v-else :size="20" />
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield, Loader2, Key } from 'lucide-vue-next'

const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const confirmError = ref('')
const confirmSuccess = ref(false)
const passwordError = ref('')
const router = useRouter()
const auth = useAuthStore()

const API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

// Validaciones de contraseña
const checks = reactive({
  length: false,
  uppercase: false,
  special: false,
})

const validatePassword = () => {
  const pass = newPassword.value

  checks.length = pass.length >= 6
  checks.uppercase = /[A-Z]/.test(pass)
  checks.special = /[!@#$%^&*(),.?":{}|<>]/.test(pass)

  // Actualizar error
  if (pass.length > 0 && (!checks.length || !checks.uppercase || !checks.special)) {
    passwordError.value = 'La contraseña no cumple con los requisitos'
  } else {
    passwordError.value = ''
  }

  // Revalidar confirmación si ya se ingresó
  if (confirmPassword.value.length > 0) {
    validateConfirm()
  }
}

const validateConfirm = () => {
  if (confirmPassword.value.length === 0) {
    confirmError.value = ''
    confirmSuccess.value = false
    return
  }

  if (confirmPassword.value !== newPassword.value) {
    confirmError.value = 'Las contraseñas no coinciden'
    confirmSuccess.value = false
  } else {
    confirmError.value = ''
    confirmSuccess.value = true
  }
}

const isPasswordValid = computed(() => {
  return checks.length && checks.uppercase && checks.special
})

// Validar si el formulario es válido
const isFormValid = computed(() => {
  return (
    checks.length &&
    checks.uppercase &&
    checks.special &&
    newPassword.value === confirmPassword.value &&
    confirmPassword.value.length > 0
  )
})

const handleResetPassword = async () => {
  // Validaciones finales
  if (!checks.length || !checks.uppercase || !checks.special) {
    message.value = 'La contraseña no cumple con los requisitos'
    messageType.value = 'error'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Las contraseñas no coinciden'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      newPassword: newPassword.value,
      email: auth.user?.email,
    })

    message.value = response.data.message
    messageType.value = 'success'

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
  max-width: 450px;
  margin: 3rem auto;
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

.header-icon {
  color: #42b883;
  margin-bottom: 1rem;
}

h2 {
  margin: 0 0 0.5rem 0;
  font-size: 28px;
  font-weight: 700;
}

.instruction {
  color: #b0b0b0;
  font-size: 14px;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.input-group {
  margin-bottom: 20px;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
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
  border: 2px solid #333;
  border-radius: 10px;
  background: #2a2a2a;
  color: white;
  font-size: 15px;
  box-sizing: border-box;
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

input.input-error {
  border-color: #ff6b6b;
}

input.input-success {
  border-color: #42b883;
}

.toggle-btn {
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

.toggle-btn:hover {
  color: #42b883;
}

/* Requisitos de contraseña */
.requirements {
  margin-top: 12px;
  padding: 12px;
  background: #2a2a2a;
  border-radius: 8px;
  border: 1px solid #333;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  color: #888;
  font-size: 13px;
  transition: color 0.3s;
}

.requirement.valid {
  color: #42b883;
}

.check-icon {
  font-weight: bold;
  font-size: 16px;
}

.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff6b6b;
  font-size: 13px;
  margin-top: 8px;
}

.success-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #42b883;
  font-size: 13px;
  margin-top: 8px;
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
</style>
