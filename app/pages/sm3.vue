<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sm3.title')" :description="$t('pages.sm3.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 mb-6 shadow-xl">
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
              <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
              <UBadge color="neutral" variant="subtle" size="sm">{{ inputText.length }} {{ $t('ui.characters') }}</UBadge>
            </div>
          </div>
          <UTextarea v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" :rows="8" autoresize :maxrows="20" size="xl" class="font-mono text-base block w-full" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full' }" @input="generateHash" />
        </div>

        <div v-if="sm3Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-red-500" />
                  {{ $t('ui.hashResult') }} (SM3)
                </label>
                <UBadge color="primary" variant="subtle" size="md">256 {{ $t('ui.bits') }}</UBadge>
              </div>
              <div class="flex gap-2">
                <UInput v-model="sm3Hash" readonly size="lg" class="font-mono text-lg flex-1" :ui="{ base: 'bg-white dark:bg-gray-900' }" @click="() => copyToClipboard(sm3Hash, 'SM3')" />
                <UButton color="neutral" variant="soft" size="lg" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(sm3Hash, 'SM3')">{{ $t('ui.copy') }}</UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' SM3'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import { sm3 } from 'sm-crypto'
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const inputText = ref('')
const sm3Hash = ref('')

function generateHash() {
  if (!inputText.value) { sm3Hash.value = ''; return }
  try { sm3Hash.value = sm3(inputText.value) } catch (e) { console.error('SM3 generation failed', e) }
}

function clearAll() { inputText.value = ''; sm3Hash.value = '' }

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('ui.whatIs') + ' SM3?', icon: 'i-heroicons-question-mark-circle', content: 'SM3 is a cryptographic hash function published by the Chinese State Cryptography Administration (GB/T 32905-2016). It produces a 256-bit hash value and is comparable to SHA-256 in security.' },
  { slot: 'usage', label: t('ui.mainUsage'), icon: 'i-heroicons-rocket-launch', content: 'SM3 is widely used in Chinese financial, e-government, and digital certificate systems. It is a core algorithm in the Chinese commercial cryptography system.' },
  { slot: 'security', label: t('ui.securityNote'), icon: 'i-heroicons-shield-check', content: 'SM3 has strong collision resistance and is considered very secure. It complies with Chinese national cryptography policy requirements.' }
])

useHead({ title: t('pages.sm3.title'), meta: [{ name: 'description', content: t('pages.sm3.description') }] })
</script>
