<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.csvJson.title')" :description="$t('pages.csvJson.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-6 flex items-center gap-4">
      <UButton :color="mode === 'csv-to-json' ? 'primary' : 'neutral'" :variant="mode === 'csv-to-json' ? 'solid' : 'soft'" icon="i-heroicons-arrow-right" @click="mode = 'csv-to-json'">CSV → JSON</UButton>
      <UButton :color="mode === 'json-to-csv' ? 'primary' : 'neutral'" :variant="mode === 'json-to-csv' ? 'solid' : 'soft'" icon="i-heroicons-arrow-left" @click="mode = 'json-to-csv'">JSON → CSV</UButton>
      <div class="ml-auto flex items-center gap-4">
        <div v-if="mode === 'csv-to-json'" class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">Delimiter:</label>
          <USelectMenu v-model="delimiter" :options="delimiterOptions" size="sm" class="w-24" />
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.input') }}</h3>
            <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="clearAll">{{ $t('ui.clear') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="inputText" :placeholder="mode === 'csv-to-json' ? csvPlaceholder : jsonPlaceholder" :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" @input="convert" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <div class="flex items-center gap-2">
              <UButton v-if="outputText" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputText, mode === 'csv-to-json' ? 'JSON' : 'CSV')">{{ $t('ui.copy') }}</UButton>
              <UButton v-if="outputText" color="neutral" variant="soft" size="sm" icon="i-heroicons-arrow-down-tray" @click="download">{{ $t('ui.download') }}</UButton>
            </div>
          </div>
        </template>
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>
        </div>
        <UTextarea v-else v-model="outputText" :rows="20" readonly autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const mode = ref<'csv-to-json' | 'json-to-csv'>('csv-to-json')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const delimiter = ref(',')
const delimiterOptions = [{ label: 'Comma (,)', value: ',' }, { label: 'Semicolon (;)', value: ';' }, { label: 'Tab', value: '\t' }, { label: 'Pipe (|)', value: '|' }]
const csvPlaceholder = `name,age,city\nAlice,25,New York\nBob,30,San Francisco`
const jsonPlaceholder = `[\n  {"name": "Alice", "age": 25, "city": "New York"},\n  {"name": "Bob", "age": 30, "city": "San Francisco"}\n]`

function convert() {
  error.value = ''; outputText.value = ''
  if (!inputText.value.trim()) return
  try {
    if (mode.value === 'csv-to-json') convertCsvToJson()
    else convertJsonToCsv()
  } catch (e) { error.value = e instanceof Error ? e.message : t('ui.operationFailed') }
}

function convertCsvToJson() {
  const lines = inputText.value.trim().split('\n')
  if (lines.length < 2) { error.value = 'CSV needs at least 2 lines'; return }
  const headers = (lines[0] || '').split(delimiter.value).map(h => h.trim())
  const result = []
  for (let i = 1; i < lines.length; i++) {
    const values = (lines[i] || '').split(delimiter.value)
    const obj: Record<string, string> = {}
    headers.forEach((header, index) => { obj[header] = values[index]?.trim() || '' })
    result.push(obj)
  }
  outputText.value = JSON.stringify(result, null, 2)
}

function convertJsonToCsv() {
  const data = JSON.parse(inputText.value)
  if (!Array.isArray(data) || data.length === 0) { error.value = 'JSON must be non-empty array'; return }
  const headers = Object.keys(data[0])
  const csvLines = [headers.join(',')]
  data.forEach(row => {
    const values = headers.map(header => { const value = String(row[header] || ''); return value.includes(',') ? `"${value}"` : value })
    csvLines.push(values.join(','))
  })
  outputText.value = csvLines.join('\n')
}

function clearAll() { inputText.value = ''; outputText.value = ''; error.value = '' }

function download() {
  const ext = mode.value === 'csv-to-json' ? 'json' : 'csv'
  const mimeType = mode.value === 'csv-to-json' ? 'application/json' : 'text/csv'
  const blob = new Blob([outputText.value], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `converted.${ext}`; a.click()
  URL.revokeObjectURL(url)
}

watch(mode, () => clearAll())
watch(delimiter, () => { if (inputText.value) convert() })

useHead({ title: t('pages.csvJson.title'), meta: [{ name: 'description', content: t('pages.csvJson.description') }] })
</script>
