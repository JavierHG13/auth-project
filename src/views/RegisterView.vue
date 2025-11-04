<template>
  <div class="register-container">
    <div class="header">
      <h2>Crear cuenta</h2>
    </div>

    <form @submit.prevent="handleRegister">
      <!-- Nombre completo -->
      <div class="form-group">
        <div class="input-wrapper">
          <User :size="20" class="input-icon" />
          <input
            v-model="name"
            type="text"
            placeholder="Nombre completo"
            required
            @blur="validateName"
            :class="{ 'input-error': errors.name, 'input-success': validations.name }"
          />
          <CheckCircle2 v-if="validations.name && !errors.name" :size="20" class="check-icon" />
        </div>
        <span v-if="errors.name" class="error-text">
          <AlertCircle :size="14" />
          {{ errors.name }}
        </span>
      </div>

      <!-- Correo electrónico -->
      <div class="form-group">
        <div class="input-wrapper">
          <Mail :size="20" class="input-icon" />
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            required
            @blur="validateEmail"
            :class="{ 'input-error': errors.email, 'input-success': validations.email }"
          />
          <CheckCircle2 v-if="validations.email && !errors.email" :size="20" class="check-icon" />
        </div>
        <span v-if="errors.email" class="error-text">
          <AlertCircle :size="14" />
          {{ errors.email }}
        </span>
      </div>

      <!-- Contraseña -->
      <div class="form-group">
        <div class="input-wrapper">
          <Lock :size="20" class="input-icon" />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            required
            @input="validatePassword"
            :class="{ 'input-error': errors.password, 'input-success': validations.password }"
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
        <span v-if="errors.password" class="error-text">
          <AlertCircle :size="14" />
          {{ errors.password }}
        </span>

        <!-- Requisitos de contraseña -->
        <div v-if="password.length > 0" class="requirements">
          <div class="requirement" :class="{ valid: passwordChecks.length }">
            <span class="check-icon">{{ passwordChecks.length ? '✓' : '○' }}</span>
            Al menos 6 caracteres
          </div>
          <div class="requirement" :class="{ valid: passwordChecks.uppercase }">
            <span class="check-icon">{{ passwordChecks.uppercase ? '✓' : '○' }}</span>
            Una letra mayúscula
          </div>
          <div class="requirement" :class="{ valid: passwordChecks.special }">
            <span class="check-icon">{{ passwordChecks.special ? '✓' : '○' }}</span>
            Un carácter especial (!@#$%^&*)
          </div>
        </div>
      </div>

      <!-- Confirmar contraseña -->
      <div class="form-group">
        <div class="input-wrapper">
          <Lock :size="20" class="input-icon" />
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirmar contraseña"
            required
            @blur="validateConfirmPassword"
            :class="{
              'input-error': errors.confirmPassword,
              'input-success': validations.confirmPassword,
            }"
          />
          <button
            type="button"
            class="toggle-password"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
          >
            <Eye v-if="showConfirmPassword" :size="20" />
            <EyeOff v-else :size="20" />
          </button>
        </div>
        <span v-if="errors.confirmPassword" class="error-text">
          <AlertCircle :size="14" />
          {{ errors.confirmPassword }}
        </span>
        <span v-if="validations.confirmPassword && !errors.confirmPassword" class="success-text">
          <CheckCircle2 :size="14" />
          Las contraseñas coinciden
        </span>
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        <Loader2 v-if="loading" :size="20" class="spinner" />
        <UserCheck v-else :size="20" />
        {{ loading ? 'Registrando...' : 'Crear cuenta' }}
      </button>
    </form>

    <!-- Mensaje de respuesta -->
    <div v-if="message" :class="['alert', messageType]">
      <CheckCircle2 v-if="messageType === 'success'" :size="20" />
      <AlertCircle v-else :size="20" />
      {{ message }}
    </div>

    <div class="login-link">
      <p>
        ¿Ya tienes cuenta?
        <router-link to="/login"> Inicia sesión </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-vue-next'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL

axios.defaults.withCredentials = true

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validations = ref({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})

// Checks de contraseña al estilo reset-password
const passwordChecks = reactive({
  length: false,
  uppercase: false,
  special: false,
})

const validateName = () => {
  if (name.value.trim().length < 3) {
    errors.value.name = 'El nombre debe tener al menos 3 caracteres'
    validations.value.name = false
    return false
  }
  errors.value.name = ''
  validations.value.name = true
  return true
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Por favor ingresa un correo válido'
    validations.value.email = false
    return false
  }
  errors.value.email = ''
  validations.value.email = true
  return true
}

const validatePassword = () => {
  const pass = password.value

  // Actualizar checks
  passwordChecks.length = pass.length >= 6
  passwordChecks.uppercase = /[A-Z]/.test(pass)
  passwordChecks.special = /[!@#$%^&*(),.?":{}|<>]/.test(pass)

  // Validar errores
  if (!passwordChecks.length) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    validations.value.password = false
  } else if (!passwordChecks.uppercase) {
    errors.value.password = 'Debe incluir al menos una letra mayúscula'
    validations.value.password = false
  } else if (!passwordChecks.special) {
    errors.value.password = 'Debe incluir al menos un carácter especial'
    validations.value.password = false
  } else {
    errors.value.password = ''
    validations.value.password = true
  }

  if (confirmPassword.value.length > 0) {
    validateConfirmPassword()
  }

  return validations.value.password
}

const validateConfirmPassword = () => {
  if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Las contraseñas no coinciden'
    validations.value.confirmPassword = false
    return false
  }
  if (confirmPassword.value.length < 6) {
    errors.value.confirmPassword = 'Debe tener al menos 6 caracteres'
    validations.value.confirmPassword = false
    return false
  }
  errors.value.confirmPassword = ''
  validations.value.confirmPassword = true
  return true
}

const isFormValid = computed(() => {
  return (
    name.value.trim().length >= 3 &&
    validations.value.email &&
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.special &&
    confirmPassword.value === password.value &&
    confirmPassword.value.length > 0
  )
})

const handleRegister = async () => {
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isConfirmValid = validateConfirmPassword()

  if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
    message.value = 'Por favor corrige los errores en el formulario'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''
  messageType.value = ''

  try {
    const response = await axios.post(`${API_URL}/register`, {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    message.value = response.data.message
    messageType.value = 'success'

    localStorage.setItem('pendingEmail', email.value)

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
  max-width: 480px;
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

h2 {
  margin: 0 0 0.5rem 0;
  font-size: 28px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 20px;
}

.input-wrapper {
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

.check-icon {
  position: absolute;
  right: 14px;
  color: #42b883;
  pointer-events: none;
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

input.input-error {
  border-color: #ff6b6b;
}

input.input-success {
  border-color: #42b883;
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

.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff6b6b;
  font-size: 13px;
  margin-top: 6px;
}

.success-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #42b883;
  font-size: 13px;
  margin-top: 6px;
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

.requirement .check-icon {
  position: static;
  font-weight: bold;
  font-size: 16px;
  color: inherit;
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

.login-link {
  margin-top: 25px;
  text-align: center;
}

.login-link p {
  margin: 0;
  color: #aaa;
  font-size: 14px;
}

.login-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
}

.login-link a:hover {
  color: #35a372;
  text-decoration: underline;
}
</style>
