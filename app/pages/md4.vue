<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.md4.title')" :description="$t('pages.md4.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-hashtag" class="w-10 h-10 text-white" />
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

        <div v-if="md4Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-open" class="w-4 h-4 text-gray-500" />
                  {{ $t('ui.hashResult') }} (MD4)
                </label>
                <UBadge color="neutral" variant="subtle" size="md">128 {{ $t('ui.bits') }}</UBadge>
              </div>
              <div class="flex gap-2">
                <UInput v-model="md4Hash" readonly size="lg" class="font-mono text-lg flex-1" :ui="{ base: 'bg-white dark:bg-gray-900' }" @click="() => copyToClipboard(md4Hash, 'MD4')" />
                <UButton color="neutral" variant="soft" size="lg" icon="i-heroicons-clipboard-document" @click="() => copyToClipboard(md4Hash, 'MD4')">{{ $t('ui.copy') }}</UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' MD4'" :items="accordionItems" />
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
const md4Hash = ref('')

function generateHash() {
  if (!inputText.value) { md4Hash.value = ''; return }
  try { md4Hash.value = md4(inputText.value) } catch (e) { console.error(e) }
}

function clearAll() { inputText.value = ''; md4Hash.value = '' }

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('pages.md4.what'), icon: 'i-heroicons-question-mark-circle', content: t('pages.md4.whatContent') },
  { slot: 'security', label: t('pages.md4.security'), icon: 'i-heroicons-exclamation-triangle', content: t('pages.md4.securityContent') }
])

useHead({ title: t('pages.md4.title'), meta: [{ name: 'description', content: t('pages.md4.description') }] })
</script>
