<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import emailjs from '@emailjs/browser'
import { vMaska } from 'maska/vue'

interface Props {
  defaultSubject?: string
  preventMultipleSubmissions?: boolean
  formId?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultSubject: '',
  preventMultipleSubmissions: false,
  formId: 'consultation-form',
})

const route = useRoute()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
})

const isSending = ref(false)
const sendError = ref<string | null>(null)
const sendSuccess = ref(false)
const formAlreadySent = ref(false)

const FORM_SENT_KEY = 'consultation_form_sent'

// проверяем при загрузке, была ли форма уже отправлена
onMounted(() => {
  if (props.preventMultipleSubmissions && typeof window !== 'undefined') {
    formAlreadySent.value = localStorage.getItem(FORM_SENT_KEY) === 'true'
  }
})

// заполнение сабджекта в форме сразу
watch(
  () => route.query.subject,
  (value) => {
    if (typeof value === 'string' && value.trim()) {
      form.subject = value
    }
  },
  { immediate: true },
)

const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault()

  if (props.preventMultipleSubmissions && formAlreadySent.value) {
    return
  }

  sendError.value = null
  sendSuccess.value = false

  // ключи от емейл js
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    sendError.value = 'Не настроена отправка: заполните VITE_EMAILJS_* в front/.env'
    return
  }

  isSending.value = true
  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || 'Заявка с сайта',
        message: form.message,
      },
      { publicKey },
    )

    sendSuccess.value = true

    if (props.preventMultipleSubmissions) {
      formAlreadySent.value = true
      if (typeof window !== 'undefined') {
        localStorage.setItem(FORM_SENT_KEY, 'true')
      }
    } else {
      form.name = ''
      form.email = ''
      form.phone = ''
      form.subject = ''
      form.message = ''
      form.consent = false
    }
  } catch (e) {
    sendError.value = 'Не удалось отправить. Попробуйте позже.'
    console.error(e)
  } finally {
    isSending.value = false
  }
}

const setSubject = (subject: string): void => {
  form.subject = subject
  const element = document.getElementById(props.formId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const phoneMask = { mask: '+7 (###) ###-##-##' }

const isPhoneValid = (): boolean => {
  return form.phone.length === 18
}

defineExpose({
  setSubject,
})
</script>

<template>
  <div :id="formId">
    <div v-if="preventMultipleSubmissions && formAlreadySent" class="consultation__success-message">
      <div class="consultation__success-icon">✓</div>
      <h3 class="consultation__success-title">Форма отправлена</h3>
      <p class="consultation__success-text">
        Спасибо! Ваше сообщение успешно отправлено. Я свяжусь с вами в ближайшее время.
      </p>
    </div>

    <form v-else class="consultation__form" @submit="handleSubmit">
      <label class="consultation__label">
        <span>Имя <span class="consultation__required">*</span></span>
        <input v-model="form.name" type="text" class="consultation__input" required />
      </label>

      <label class="consultation__label">
        <span>Email <span class="consultation__optional">(необязательно)</span></span>
        <input v-model="form.email" type="email" class="consultation__input" />
      </label>

      <label class="consultation__label">
        <span>Телефон <span class="consultation__required">*</span></span>
        <input 
          v-model="form.phone" 
          v-maska="phoneMask"
          type="tel" 
          class="consultation__input" 
          placeholder="+7 (___) ___-__-__"
          required 
        />
      </label>

      <label class="consultation__label">
        <span>Тема <span class="consultation__optional">(необязательно)</span></span>
        <input v-model="form.subject" type="text" class="consultation__input" />
      </label>

      <label class="consultation__label">
        <span>Сообщение <span class="consultation__optional">(необязательно)</span></span>
        <textarea
          v-model="form.message"
          class="consultation__textarea"
          rows="5"
        ></textarea>
      </label>

      <label class="consultation__checkbox-label">
        <input
          v-model="form.consent"
          type="checkbox"
          class="consultation__checkbox"
          required
        />
        <span class="consultation__checkbox-text">
          Я даю согласие на 
          <RouterLink to="/consent" target="_blank">обработку персональных данных</RouterLink> 
          и принимаю 
          <RouterLink to="/privacy" target="_blank">политику конфиденциальности</RouterLink>
        </span>
      </label>

      <button
        type="submit"
        class="consultation__submit"
        :disabled="isSending || (preventMultipleSubmissions && formAlreadySent) || !form.consent || !form.name || !isPhoneValid()"
      >
        {{ isSending ? 'Отправка...' : 'Отправить' }}
      </button>

      <p v-if="sendError" class="consultation__status consultation__status--error">
        {{ sendError }}
      </p>
      <p
        v-else-if="!preventMultipleSubmissions && sendSuccess"
        class="consultation__status consultation__status--success"
      >
        Спасибо! Сообщение отправлено.
      </p>
    </form>
  </div>
</template>

<style scoped>
.consultation__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
}

.consultation__label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 15px;
}

.consultation__label > span {
  font-weight: 500;
  color: #333;
}

.consultation__required {
  color: #dc2626;
  font-weight: 400;
}

.consultation__optional {
  color: #9ca3af;
  font-weight: 400;
  font-size: 13px;
}

.consultation__input,
.consultation__textarea {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.consultation__input:focus,
.consultation__textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.consultation__textarea {
  resize: vertical;
  min-height: 120px;
}

.consultation__checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.consultation__checkbox {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #2563eb;
  flex-shrink: 0;
}

.consultation__checkbox-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.consultation__checkbox-text a {
  color: #2563eb;
  text-decoration: none;
}

.consultation__checkbox-text a:hover {
  text-decoration: underline;
}

.consultation__submit {
  align-self: flex-start;
  padding: 12px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.consultation__submit:hover {
  background: #1d4ed8;
}

.consultation__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.consultation__status {
  margin: 4px 0 0;
  font-size: 14px;
}

.consultation__status--error {
  color: #c0392b;
}

.consultation__status--success {
  color: #1e7e34;
}

.consultation__success-message {
  max-width: 500px;
  margin: 24px auto 0;
  padding: 48px 32px;
  text-align: center;
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 16px;
}

.consultation__success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.consultation__success-title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 500;
  color: #0f172a;
}

.consultation__success-text {
  margin: 0;
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
}
</style>
