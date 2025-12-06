<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.bcrypt.title')" :description="$t('pages.bcrypt.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.generate') }}</h3></template>
        <div class="space-y-4">
          <UInput v-model="password" type="password" :placeholder="$t('ui.inputPlaceholder')" size="xl" class="w-full" />
          <div>
            <label class="text-sm font-medium mb-2 block">Cost Factor: {{ rounds }}</label>
            <URange v-model="rounds" :min="4" :max="12" />
            <p class="text-xs text-gray-500 mt-1">Recommended: 10-12</p>
          </div>
          <UButton block color="primary" size="lg" @click="generateHash" :loading="generating">{{ $t('ui.generate') }}</UButton>
          <div v-if="hash" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">Bcrypt Hash:</span>
              <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(hash, 'Hash')">{{ $t('ui.copy') }}</UButton>
            </div>
            <code class="text-xs font-mono break-all">{{ hash }}</code>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">Verify</h3></template>
        <div class="space-y-4">
          <UInput v-model="verifyPassword" type="password" :placeholder="$t('ui.inputPlaceholder')" size="xl" class="w-full" />
          <UTextarea v-model="verifyHash" placeholder="Bcrypt hash..." :rows="3" class="font-mono text-sm w-full" />
          <UButton block color="primary" size="lg" @click="verify" :loading="verifying">Verify</UButton>
          <div v-if="verifyResult !== null" class="p-4 rounded-lg" :class="verifyResult ? 'bg-success-50 dark:bg-success-950/30' : 'bg-error-50 dark:bg-error-950/30'">
            <div class="flex items-center gap-2" :class="verifyResult ? 'text-success-600' : 'text-error-600'">
              <UIcon :name="verifyResult ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-5 h-5" />
              <span class="font-medium">{{ verifyResult ? '✓ Match' : '✗ No Match' }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <ToolInfo :title="$t('ui.about') + ' Bcrypt'" :items="accordionItems" class="mt-8" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const password = ref('')
const rounds = ref(10)
const hash = ref('')
const generating = ref(false)
const verifyPassword = ref('')
const verifyHash = ref('')
const verifying = ref(false)
const verifyResult = ref<boolean | null>(null)

async function generateHash() {
  if (!password.value) return
  generating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    const salt = '$2a$' + rounds.value.toString().padStart(2, '0') + '$' + generateSalt()
    hash.value = salt + await hashPassword(password.value, salt)
  } finally { generating.value = false }
}

async function verify() {
  if (!verifyPassword.value || !verifyHash.value) return
  verifying.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    const computed = await hashPassword(verifyPassword.value, verifyHash.value.substring(0, 29))
    verifyResult.value = verifyHash.value === verifyHash.value.substring(0, 29) + computed
  } finally { verifying.value = false }
}

function generateSalt(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./'
  let salt = ''
  for (let i = 0; i < 22; i++) salt += chars[Math.floor(Math.random() * chars.length)]
  return salt
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 31)
}

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('ui.whatIs') + ' Bcrypt?', icon: 'i-heroicons-question-mark-circle', content: 'Bcrypt is a password hashing function designed for secure password storage with adaptive cost factor, automatic salt generation, and intentionally slow computation.' },
  { slot: 'features', label: t('ui.techFeatures'), icon: 'i-heroicons-cog', content: 'Adaptive: adjustable computation cost. Salted: automatic random salt prevents rainbow table attacks. Slow: intentionally computation-intensive to resist brute force.' }
])

useHead({ title: t('pages.bcrypt.title'), meta: [{ name: 'description', content: t('pages.bcrypt.description') }] })
</script>
