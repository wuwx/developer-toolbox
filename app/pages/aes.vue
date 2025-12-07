<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.aes.title')" :description="$t('pages.aes.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="mb-8 flex justify-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <UButton :color="mode === 'encrypt' ? 'primary' : 'neutral'" :variant="mode === 'encrypt' ? 'solid' : 'ghost'" size="md" icon="i-heroicons-lock-closed" class="px-6" @click="mode = 'encrypt'">{{ $t('ui.encrypt') }}</UButton>
          <UButton :color="mode === 'decrypt' ? 'primary' : 'neutral'" :variant="mode === 'decrypt' ? 'solid' : 'ghost'" size="md" icon="i-heroicons-lock-open" class="px-6" @click="mode = 'decrypt'">{{ $t('ui.decrypt') }}</UButton>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
          <div class="flex items-center justify-between mb-4">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-key" class="w-4 h-4 text-emerald-500" />
              Key
            </label>
            <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-sparkles" @click="generateKey">{{ $t('ui.generate') }}</UButton>
          </div>
          <div class="relative">
            <UInput v-model="secretKey" placeholder="Enter at least 16 characters" size="xl" class="font-mono w-full" :type="showKey ? 'text' : 'password'" :ui="{ base: 'pl-4 pr-12 py-3' }">
              <template #trailing>
                <UButton color="neutral" variant="link" size="sm" :icon="showKey ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" :padded="false" @click="showKey = !showKey" />
              </template>
            </UInput>
            <div v-if="keyError" class="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1">
              <UIcon name="i-heroicons-exclamation-circle" class="w-3 h-3" />{{ keyError }}</div>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                {{ $t('ui.input') }}
              </label>
              <div class="flex items-center gap-2">
                <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
                <UBadge color="neutral" variant="subtle" size="sm">{{ inputText.length }} {{ $t('ui.characters') }}</UBadge>
              </div>
            </div>
            <UTextarea v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" :rows="12" autoresize :maxrows="20" size="xl" class="font-mono text-sm block w-full" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[300px] p-4 w-full' }" />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <UIcon :name="mode === 'encrypt' ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" class="w-4 h-4 text-primary-500" />
                {{ $t('ui.output') }}
              </label>
              <UButton v-if="outputText" color="neutral" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(outputText, 'Result')">{{ $t('ui.copy') }}</UButton>
            </div>
            <UTextarea v-model="outputText" readonly :placeholder="error || 'Waiting...'" :rows="12" size="xl" autoresize :maxrows="20" class="font-mono text-sm block w-full h-full" :ui="{ base: `bg-gray-50 dark:bg-gray-800/50 min-h-[300px] p-4 w-full ${error ? 'text-red-500 dark:text-red-400' : ''}` }" @click="() => outputText && copyToClipboard(outputText, 'Result')" />
          </div>
        </div>

        <div class="flex justify-center pt-4">
          <UButton size="xl" color="primary" class="w-full sm:w-auto min-w-[200px] justify-center font-bold shadow-lg shadow-primary-500/20 transition-all hover:scale-105" :icon="mode === 'encrypt' ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" :disabled="!inputText || !secretKey || !!keyError" @click="process">{{ $t('ui.execute') }}</UButton>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' AES'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const secretKey = ref('')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const showKey = ref(false)
const keyError = ref('')

watch(secretKey, () => { keyError.value = secretKey.value.length > 0 && secretKey.value.length < 16 ? 'Key must be at least 16 characters' : '' })

function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let key = ''
  for (let i = 0; i < 32; i++) key += chars.charAt(Math.floor(Math.random() * chars.length))
  secretKey.value = key
}

async function process() {
  error.value = ''; outputText.value = ''
  if (!secretKey.value || secretKey.value.length < 16) { keyError.value = 'Key must be at least 16 characters'; return }
  if (!inputText.value) { error.value = 'Please enter content'; return }
  try { outputText.value = mode.value === 'encrypt' ? await encrypt(inputText.value, secretKey.value) : await decrypt(inputText.value, secretKey.value) }
  catch (e) { error.value = e instanceof Error ? e.message : t('ui.operationFailed') }
}

async function getKeyMaterial(password: string) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey'])
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array) {
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

async function encrypt(text: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(await getKeyMaterial(password), salt)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  result.set(salt, 0); result.set(iv, salt.length); result.set(new Uint8Array(encrypted), salt.length + iv.length)
  return btoa(String.fromCharCode(...result))
}

async function decrypt(ciphertext: string, password: string): Promise<string> {
  try {
    const data = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)))
    const salt = data.slice(0, 16), iv = data.slice(16, 28), encrypted = data.slice(28)
    const key = await deriveKey(await getKeyMaterial(password), salt)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)
    return new TextDecoder().decode(decrypted)
  } catch (e) { throw new Error('Decryption failed, check key') }
}

function clearAll() { inputText.value = ''; outputText.value = ''; error.value = '' }
watch(mode, () => clearAll())

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.aes.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.aes.whatContent') },
  { slot: 'security', label: t('pages.aes.security'), icon: 'i-heroicons-shield-check', content: t('pages.aes.securityContent') },
  { slot: 'tips', label: t('pages.aes.tips'), icon: 'i-heroicons-light-bulb', content: t('pages.aes.tipsContent') }
])

useHead({ title: t('pages.aes.title'), meta: [{ name: 'description', content: t('pages.aes.description') }] })
</script>
