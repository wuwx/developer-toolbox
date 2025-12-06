<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.regexGenerator.title')" :description="$t('pages.regexGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-command-line" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="item in regexList" :key="item.name">
        <div class="space-y-3">
          <div class="font-semibold">{{ item.name }}</div>
          <code class="block p-2 bg-gray-900 text-green-400 rounded text-xs font-mono break-all">{{ item.regex }}</code>
          <UButton size="xs" variant="soft" block @click="copyToClipboard(item.regex, item.name)">{{ $t('ui.copy') }}</UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const regexList = [
  { name: 'Email', regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  { name: 'Phone (CN)', regex: '^1[3-9]\\d{9}$' },
  { name: 'ID Card (CN)', regex: '^\\d{17}[\\dXx]$' },
  { name: 'URL', regex: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b' },
  { name: 'IP Address', regex: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$' },
  { name: 'Date (YYYY-MM-DD)', regex: '^\\d{4}-\\d{2}-\\d{2}$' },
  { name: 'Time (HH:MM:SS)', regex: '^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$' },
  { name: 'Chinese', regex: '^[\\u4e00-\\u9fa5]+$' },
  { name: 'Numbers', regex: '^\\d+$' },
  { name: 'Letters', regex: '^[a-zA-Z]+$' },
  { name: 'Postal Code (CN)', regex: '^\\d{6}$' },
  { name: 'UUID', regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' }
]

useHead({ title: t('pages.regexGenerator.title'), meta: [{ name: 'description', content: t('pages.regexGenerator.description') }] })
</script>
