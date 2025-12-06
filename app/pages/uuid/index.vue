<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.uuid.title')" :description="$t('pages.uuid.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-finger-print" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <UButton to="/uuid" color="primary" variant="solid" size="sm">UUID v4</UButton>
      <UButton to="/uuid/v1" color="neutral" variant="soft" size="sm">UUID v1</UButton>
      <UButton to="/uuid/v3" color="neutral" variant="soft" size="sm">UUID v3</UButton>
      <UButton to="/uuid/v5" color="neutral" variant="soft" size="sm">UUID v5</UButton>
    </div>

    <ToolCard>
      <div class="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
        <div class="flex items-center justify-between mb-4">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ $t('ui.count') }}</label>
          <span class="text-2xl font-bold text-primary-600">{{ count }}</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex-1"><URange v-model="count" :min="1" :max="50" size="lg" /></div>
          <UButton color="primary" size="lg" icon="i-heroicons-arrow-path" :loading="generating" @click="generateUUIDs">{{ $t('ui.regenerate') }}</UButton>
        </div>
      </div>

      <div v-if="uuids.length > 0" class="space-y-4 animate-fade-in">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">{{ $t('ui.results') }}</h3>
          <UButton color="neutral" variant="soft" size="sm" icon="i-heroicons-clipboard-document-list" @click="copyAll">{{ $t('ui.copyAll') }}</UButton>
        </div>
        <div class="grid gap-3">
          <div v-for="(uuid, index) in uuids" :key="uuid" class="group flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 transition-all hover:border-primary-500/50 hover:shadow-sm">
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-mono">{{ index + 1 }}</div>
            <div class="flex-1 font-mono text-base text-gray-700 dark:text-gray-200 select-all">{{ uuid }}</div>
            <UTooltip :text="$t('ui.copy')">
              <UButton color="neutral" variant="ghost" size="sm" icon="i-heroicons-clipboard-document" class="opacity-0 group-hover:opacity-100 transition-opacity" @click="() => copyToClipboard(uuid, 'UUID')" />
            </UTooltip>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo :title="$t('ui.about') + ' UUID'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const count = ref(5)
const uuids = ref<string[]>([])
const generating = ref(false)
const { copyToClipboard } = useToolClipboard()

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'what', label: t('ui.whatIs') + ' UUID?', icon: 'i-heroicons-question-mark-circle', content: 'UUID (Universally Unique Identifier) is a standard for software construction. This tool generates Version 4 (random) UUIDs.' },
  { slot: 'format', label: 'Format', icon: 'i-heroicons-code-bracket', content: 'Standard UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12), 32 hexadecimal characters plus 4 hyphens.' }
])

const generateUUIDs = () => {
  generating.value = true
  uuids.value = []
  setTimeout(() => {
    for (let i = 0; i < count.value; i++) { uuids.value.push(crypto.randomUUID()) }
    generating.value = false
  }, 300)
}

const copyAll = () => { copyToClipboard(uuids.value.join('\n'), 'All UUIDs') }

watch(count, () => { generateUUIDs() })
onMounted(() => { generateUUIDs() })

useHead({ title: t('pages.uuid.title'), meta: [{ name: 'description', content: t('pages.uuid.description') }] })
</script>
