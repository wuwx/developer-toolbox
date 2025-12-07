<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sha512.title')" :description="$t('pages.sha512.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-xl">
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

        <div v-if="sha512Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-purple-500" />
                  {{ $t('ui.hashResult') }} (SHA512)
                </label>
                <UBadge color="neutral" variant="subtle" size="md">512 {{ $t('ui.bits') }}</UBadge>
              </div>
              <div class="flex gap-2">
                <UTextarea v-model="sha512Hash" readonly :rows="6" autoresize size="lg" class="font-mono text-lg flex-1" :ui="{ base: 'bg-white dark:bg-gray-900 resize-none min-h-[100px] p-4 w-full' }" @click="() => copyToClipboard(sha512Hash, 'SHA512')" />
                <UButton color="neutral" variant="soft" size="lg" class="h-fit" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(sha512Hash, 'SHA512')">{{ $t('ui.copy') }}</UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' SHA512'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const inputText = ref('')
const sha512Hash = ref('')

async function generateHash() {
  if (!inputText.value) { sha512Hash.value = ''; return }
  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)
  const sha512Buffer = await crypto.subtle.digest('SHA-512', data)
  sha512Hash.value = Array.from(new Uint8Array(sha512Buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function clearAll() { inputText.value = ''; sha512Hash.value = '' }

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.sha512.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.sha512.whatContent') },
  { slot: 'usage', label: t('pages.sha512.usage'), icon: 'i-heroicons-rocket-launch', content: t('pages.sha512.usageContent') },
  { slot: 'security', label: t('pages.sha512.security'), icon: 'i-heroicons-shield-check', content: t('pages.sha512.securityContent') }
])

useHead({ title: t('pages.sha512.title'), meta: [{ name: 'description', content: t('pages.sha512.description') }] })
</script>
