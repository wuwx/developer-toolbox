<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.listConverter.title')" :description="$t('pages.listConverter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-list-bullet" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ $t('ui.inputText') }} ({{ $t('ui.onePerLine') }})</h3>
                <UButton v-if="input" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="input = ''">{{ $t('ui.clear') }}</UButton>
              </div>
            </template>
            <UTextarea v-model="input" placeholder="Apple&#10;Banana&#10;Cherry" :rows="20" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
          </UCard>
        </div>

        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ $t('ui.result') }}</h3>
                <div class="flex gap-2">
                  <USelect v-model="format" :options="formats" size="xs" />
                  <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, t('ui.result'))">{{ $t('ui.copy') }}</UButton>
                </div>
              </div>
            </template>
            <div class="p-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex gap-4 text-sm">
                <UCheckbox v-model="quote" :label="$t('ui.addQuotes')" />
                <UCheckbox v-model="comma" :label="$t('ui.commaSeparated')" />
              </div>
            </div>
            <UTextarea v-model="output" readonly :rows="20" class="font-mono text-sm w-full" :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4' }" />
          </UCard>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const input = ref('Apple\nBanana\nCherry')
const format = ref('custom')
const quote = ref(false)
const comma = ref(true)

const formats = [
  { label: 'Custom', value: 'custom' },
  { label: 'JSON Array', value: 'json' },
  { label: 'SQL IN Clause', value: 'sql' },
  { label: 'HTML <ul>', value: 'html_ul' },
  { label: 'HTML <ol>', value: 'html_ol' },
  { label: 'CSV', value: 'csv' }
]

const output = computed(() => {
  if (!input.value) return ''
  
  const lines = input.value.split('\n').map(l => l.trim()).filter(l => l)
  
  if (format.value === 'json') {
    return JSON.stringify(lines, null, 2)
  } else if (format.value === 'sql') {
    return `(${lines.map(l => `'${l}'`).join(', ')})`
  } else if (format.value === 'html_ul') {
    return `<ul>\n${lines.map(l => `  <li>${l}</li>`).join('\n')}\n</ul>`
  } else if (format.value === 'html_ol') {
    return `<ol>\n${lines.map(l => `  <li>${l}</li>`).join('\n')}\n</ol>`
  } else if (format.value === 'csv') {
    return lines.join(',')
  } else {
    // Custom
    const q = quote.value ? "'" : ""
    const sep = comma.value ? ", " : " "
    return lines.map(l => `${q}${l}${q}`).join(sep)
  }
})

useHead({ title: t('pages.listConverter.title'), meta: [{ name: 'description', content: t('pages.listConverter.description') }] })
</script>
