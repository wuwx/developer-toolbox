<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.ntlm.title')" :description="$t('pages.ntlm.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-window" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-key" class="w-4 h-4" />
              {{ $t('ui.inputText') }}
            </label>
            <div class="flex items-center gap-2">
              <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
            </div>
          </div>
          <UInput v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" size="xl" class="w-full font-mono text-base block" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 py-3 pl-4' }" @input="generateHash" />
        </div>

        <div v-if="ntlmHash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-blue-500" />
                  {{ $t('ui.hashResult') }} (NTLM)
                </label>
                <UBadge color="neutral" variant="subtle" size="md">32 {{ $t('ui.characters') }}</UBadge>
              </div>
              <div class="flex gap-2">
                <UInput v-model="ntlmHash" readonly size="lg" class="font-mono text-lg flex-1" :ui="{ base: 'bg-white dark:bg-gray-900' }" @click="() => copyToClipboard(ntlmHash, 'NTLM Hash')" />
                <UButton color="neutral" variant="soft" size="lg" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(ntlmHash, 'NTLM Hash')">{{ $t('ui.copy') }}</UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' NTLM'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import md4 from 'js-md4'
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const inputText = ref('')
const ntlmHash = ref('')

function generateHash() {
  if (!inputText.value) { ntlmHash.value = ''; return }
  try {
    const buffer = new Uint8Array(inputText.value.length * 2)
    const view = new DataView(buffer.buffer)
    for (let i = 0; i < inputText.value.length; i++) {
      view.setUint16(i * 2, inputText.value.charCodeAt(i), true)
    }
    ntlmHash.value = md4(buffer)
  } catch (e) { console.error(e) }
}

function clearAll() { inputText.value = ''; ntlmHash.value = '' }

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.ntlm.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.ntlm.whatContent') },
  { slot: 'algo', label: t('pages.ntlm.algo'), icon: 'i-heroicons-calculator', content: t('pages.ntlm.algoContent') }
])

useHead({ title: t('pages.ntlm.title'), meta: [{ name: 'description', content: t('pages.ntlm.description') }] })
</script>
