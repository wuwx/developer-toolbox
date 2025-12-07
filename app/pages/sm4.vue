<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sm4.title')" :description="$t('pages.sm4.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 mb-6 shadow-xl">
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
              <UIcon name="i-heroicons-key" class="w-4 h-4 text-red-500" />
              Key (Hex)
            </label>
            <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-sparkles" @click="generateKey">{{ $t('ui.generate') }} 128-bit Key</UButton>
          </div>
          <div class="relative">
            <UInput v-model="secretKey" placeholder="32 hex characters (128-bit key)" size="xl" class="font-mono w-full" :type="showKey ? 'text' : 'password'" :ui="{ base: 'pl-4 pr-12 py-3' }">
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

    <ToolInfo :title="$t('ui.about') + ' SM4'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import { sm4 } from 'sm-crypto'
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

watch(secretKey, () => {
  const hexRegex = /^[0-9a-fA-F]{32}$/
  keyError.value = secretKey.value && !hexRegex.test(secretKey.value) ? 'Key must be 32 hex characters' : ''
})

function generateKey() {
  const chars = '0123456789abcdef'
  let key = ''
  for (let i = 0; i < 32; i++) key += chars.charAt(Math.floor(Math.random() * chars.length))
  secretKey.value = key
}

function process() {
  error.value = ''
  outputText.value = ''
  if (!secretKey.value || !!keyError.value) { keyError.value = 'Please enter valid key'; return }
  if (!inputText.value) { error.value = 'Please enter content'; return }
  try {
    outputText.value = mode.value === 'encrypt' ? sm4.encrypt(inputText.value, secretKey.value) : sm4.decrypt(inputText.value, secretKey.value)
  } catch (e) { error.value = t('ui.operationFailed'); console.error(e) }
}

function clearAll() { inputText.value = ''; outputText.value = ''; error.value = '' }
watch(mode, () => clearAll())

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.sm4.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.sm4.whatContent') },
  { slot: 'security', label: t('pages.sm4.security'), icon: 'i-heroicons-shield-check', content: t('pages.sm4.securityContent') },
  { slot: 'tips', label: t('pages.sm4.tips'), icon: 'i-heroicons-light-bulb', content: t('pages.sm4.tipsContent') }
])

useHead({ title: t('pages.sm4.title'), meta: [{ name: 'description', content: t('pages.sm4.description') }] })
</script>
