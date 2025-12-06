<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sha1.title')" :description="$t('pages.sha1.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              {{ $t('ui.inputText') }}
            </label>
            <div class="flex items-center gap-2">
              <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
              <UBadge color="neutral" variant="subtle" size="sm">{{ inputText.length }} {{ $t('ui.characters') }}</UBadge>
            </div>
          </div>
          <UTextarea v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" :rows="8" size="xl" autoresize :maxrows="20" @input="handleInput" class="font-mono text-base block w-full" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full' }" />
          <div class="mt-4 flex justify-end">
            <UButton color="primary" size="md" icon="i-heroicons-sparkles" :disabled="!inputText" @click="generateSHA1" class="px-6">{{ $t('ui.generate') }} SHA1</UButton>
          </div>
        </div>

        <div v-if="sha1Hash" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-key" class="w-4 h-4 text-green-500" />
                  {{ $t('ui.hashResult') }} (SHA1)
                </label>
                <UBadge color="success" variant="subtle" size="md">160 {{ $t('ui.bits') }}</UBadge>
              </div>
              <div class="flex gap-2">
                <UInput v-model="sha1Hash" readonly size="lg" class="font-mono text-lg flex-1" :ui="{ base: 'bg-white dark:bg-gray-900' }" @click="() => copyToClipboard(sha1Hash, 'SHA1')" />
                <UButton color="primary" variant="soft" size="lg" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(sha1Hash, 'SHA1')">{{ $t('ui.copy') }}</UButton>
              </div>
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.originalLength') }}</div>
                  <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.hashLength') }}</div>
                  <div class="font-mono font-bold text-purple-600 dark:text-purple-400">40</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.algorithmBits') }}</div>
                  <div class="font-mono font-bold text-green-600 dark:text-green-400">160</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolExamples :examples="examples" @select="useExample" />
    <ToolInfo :title="$t('ui.about') + ' SHA1'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { Example, AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const inputText = ref('')
const sha1Hash = ref('')
const { copyToClipboard } = useToolClipboard()

const examples: Example[] = [
  { label: 'Hello World', text: 'Hello World' },
  { label: '中文', text: '你好世界' },
  { label: '123456', text: '123456' },
  { label: 'Email', text: 'admin@example.com' },
  { label: 'JSON', text: '{"name":"John","age":30}' }
]

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('ui.whatIs') + ' SHA1?', icon: 'i-heroicons-question-mark-circle', content: 'SHA1 (Secure Hash Algorithm 1) is a cryptographic hash function designed by the NSA. It produces a 160-bit (20-byte) hash value, typically rendered as a 40-digit hexadecimal number.' },
  { slot: 'usage', label: t('ui.mainUsage'), icon: 'i-heroicons-rocket-launch', content: 'SHA1 is widely used in Git version control, digital signatures, SSL certificates, and file integrity verification.' },
  { slot: 'security', label: t('ui.securityNote'), icon: 'i-heroicons-shield-exclamation', content: 'SHA1 has been proven vulnerable to collision attacks. Google demonstrated a practical collision attack in 2017. For security-sensitive applications, use SHA-256 or stronger algorithms.' }
])

const generateSHA1 = () => { if (inputText.value) sha1Hash.value = CryptoJS.SHA1(inputText.value).toString() }
const handleInput = () => { if (inputText.value) generateSHA1(); else sha1Hash.value = '' }
const clearAll = () => { inputText.value = ''; sha1Hash.value = '' }
const useExample = (text: string) => { inputText.value = text; generateSHA1() }

useHead({ title: t('pages.sha1.title'), meta: [{ name: 'description', content: t('pages.sha1.description') }] })
</script>
