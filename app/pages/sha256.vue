<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sha256.title')" :description="$t('pages.sha256.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-shield-check" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              {{ $t('ui.inputText') }}
            </label>
            <div class="flex items-center gap-2">
              <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">
                {{ $t('ui.clear') }}
              </UButton>
              <UBadge color="neutral" variant="subtle" size="sm">{{ inputText.length }} {{ $t('ui.characters') }}</UBadge>
            </div>
          </div>
          <UTextarea v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" :rows="8" autoresize :maxrows="20" size="xl" class="font-mono text-base block w-full" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full' }" @input="generateHash" />
        </div>

        <div v-if="sha256Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-blue-500" />
                  {{ $t('ui.hashResult') }} (SHA256)
                </label>
                <UBadge color="primary" variant="subtle" size="md">256 {{ $t('ui.bits') }}</UBadge>
              </div>
              <div class="flex gap-2">
                <UInput v-model="sha256Hash" readonly size="lg" class="font-mono text-lg flex-1" :ui="{ base: 'bg-white dark:bg-gray-900' }" @click="() => copyToClipboard(sha256Hash, 'SHA256')" />
                <UButton color="neutral" variant="soft" size="lg" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(sha256Hash, 'SHA256')">
                  {{ $t('ui.copy') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' SHA256'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const inputText = ref('')
const sha256Hash = ref('')

async function generateHash() {
  if (!inputText.value) { sha256Hash.value = ''; return }
  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)
  const sha256Buffer = await crypto.subtle.digest('SHA-256', data)
  sha256Hash.value = Array.from(new Uint8Array(sha256Buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function clearAll() { inputText.value = ''; sha256Hash.value = '' }

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('ui.whatIs') + ' SHA-256?', icon: 'i-heroicons-question-mark-circle', content: 'SHA-256 is a cryptographic hash function from the SHA-2 family, producing a 256-bit hash value. It is one of the most widely used secure hash algorithms.' },
  { slot: 'usage', label: t('ui.mainUsage'), icon: 'i-heroicons-rocket-launch', content: 'SHA-256 is the core algorithm for Bitcoin and other cryptocurrencies, also widely used in SSL/TLS certificates, digital signatures, password storage, and file integrity verification.' },
  { slot: 'security', label: t('ui.securityNote'), icon: 'i-heroicons-shield-check', content: 'No effective attacks against SHA-256 have been found. It is considered cryptographically secure and widely recommended for new system development.' }
])

useHead({ title: t('pages.sha256.title'), meta: [{ name: 'description', content: t('pages.sha256.description') }] })
</script>
