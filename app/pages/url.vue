<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.url.title')" :description="$t('pages.url.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-link" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="mb-8 flex justify-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <UButton :color="mode === 'encode' ? 'primary' : 'neutral'" :variant="mode === 'encode' ? 'solid' : 'ghost'" size="md" icon="i-heroicons-arrow-right" class="px-6" @click="switchMode('encode')">{{ $t('ui.encode') }}</UButton>
          <UButton :color="mode === 'decode' ? 'primary' : 'neutral'" :variant="mode === 'decode' ? 'solid' : 'ghost'" size="md" icon="i-heroicons-arrow-left" class="px-6" @click="switchMode('decode')">{{ $t('ui.decode') }}</UButton>
        </div>
      </div>

      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon :name="mode === 'encode' ? 'i-heroicons-document-text' : 'i-heroicons-link'" class="w-4 h-4" />
              {{ mode === 'encode' ? $t('ui.inputNormal') : $t('ui.inputEncoded') }}
            </label>
            <div class="flex items-center gap-2">
              <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
              <UBadge color="neutral" variant="subtle" size="sm">{{ inputText.length }} {{ $t('ui.characters') }}</UBadge>
            </div>
          </div>
          <UTextarea v-model="inputText" :placeholder="$t('ui.inputPlaceholder')" :rows="8" size="xl" autoresize :maxrows="20" @input="handleInput" class="font-mono text-base block w-full" :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full' }" />
          <div class="mt-4 flex justify-end">
            <UButton color="primary" size="md" :icon="mode === 'encode' ? 'i-heroicons-arrow-right' : 'i-heroicons-arrow-left'" :disabled="!inputText" @click="process" class="px-6">
              {{ mode === 'encode' ? $t('ui.encode') : $t('ui.decode') }}
            </UButton>
          </div>
        </div>

        <div v-if="error" class="animate-fade-in">
          <UAlert icon="i-heroicons-exclamation-triangle" :title="$t('ui.conversionFailed')" :description="error" color="error" variant="subtle" />
        </div>

        <div v-if="outputText" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon :name="mode === 'encode' ? 'i-heroicons-link' : 'i-heroicons-document-text'" class="w-4 h-4 text-pink-500" />
                  {{ mode === 'encode' ? $t('ui.encodeResult') : $t('ui.decodeResult') }}
                </label>
                <UBadge color="success" variant="subtle" size="md">{{ outputText.length }} {{ $t('ui.characters') }}</UBadge>
              </div>
              <div class="relative">
                <UTextarea v-model="outputText" readonly :rows="8" size="xl" autoresize :maxrows="20" class="font-mono text-base w-full block" :ui="{ base: 'bg-white dark:bg-gray-900 pr-12 min-h-[200px] p-4 w-full' }" @click="() => copyToClipboard(outputText, $t('ui.result'))" />
                <div class="absolute top-2 right-2">
                  <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(outputText, $t('ui.result'))" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolExamples :examples="currentExamples" @select="useExample" />
    <ToolInfo :title="$t('ui.about') + ' URL'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { Example, AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const { copyToClipboard } = useToolClipboard()

const encodeExamples: Example[] = [
  { label: 'Hello World', text: 'Hello World' },
  { label: '中文', text: '你好世界' },
  { label: 'Special', text: 'a&b=c?d' },
  { label: 'URL', text: 'https://example.com/search?q=test&page=1' }
]

const decodeExamples: Example[] = [
  { label: 'Hello World', text: 'Hello%20World' },
  { label: '中文', text: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C' },
  { label: 'Special', text: 'a%26b%3Dc%3Fd' },
  { label: 'URL', text: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtest%26page%3D1' }
]

const currentExamples = computed(() => mode.value === 'encode' ? encodeExamples : decodeExamples)

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.url.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.url.whatContent') },
  { slot: 'usage', label: t('pages.url.usage'), icon: 'i-heroicons-rocket-launch', content: t('pages.url.usageContent') }
])

const switchMode = (newMode: 'encode' | 'decode') => { mode.value = newMode; clearAll() }

const process = () => {
  if (!inputText.value) return
  try {
    error.value = ''
    outputText.value = mode.value === 'encode' ? encodeURIComponent(inputText.value) : decodeURIComponent(inputText.value)
  } catch (err) {
    error.value = t('ui.conversionFailed')
    outputText.value = ''
  }
}

const handleInput = () => { if (inputText.value) process(); else { outputText.value = ''; error.value = '' } }
const clearAll = () => { inputText.value = ''; outputText.value = ''; error.value = '' }
const useExample = (text: string) => { inputText.value = text; process() }

useHead({ title: t('pages.url.title'), meta: [{ name: 'description', content: t('pages.url.description') }] })
</script>
