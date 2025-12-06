<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.jsonCsv.title')" :description="$t('pages.jsonCsv.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">JSON</h3>
            <UButton color="primary" variant="soft" size="sm" @click="jsonToCsv">{{ $t('ui.convert') }} CSV →</UButton>
          </div>
        </template>
        <UTextarea v-model="jsonInput" placeholder='[{"name":"John","age":25}]' :rows="20" class="font-mono text-sm w-full" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <UButton color="primary" variant="soft" size="sm" @click="csvToJson">← {{ $t('ui.convert') }} JSON</UButton>
            <h3 class="font-semibold">CSV</h3>
          </div>
        </template>
        <UTextarea v-model="csvOutput" placeholder="name,age&#10;John,25" :rows="20" class="font-mono text-sm w-full" />
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header><h3 class="font-semibold">{{ $t('ui.options') }}</h3></template>
      <div class="grid sm:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium mb-2 block">{{ $t('ui.delimiter') }}</label>
          <USelect v-model="delimiter" :options="delimiterOptions" class="w-full" />
        </div>
        <div class="flex items-end"><UCheckbox v-model="includeHeader" :label="$t('ui.includeHeader')" /></div>
        <div class="flex items-end"><UCheckbox v-model="prettyJson" :label="$t('ui.formatJson')" /></div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

const jsonInput = ref('')
const csvOutput = ref('')
const delimiter = ref(',')
const includeHeader = ref(true)
const prettyJson = ref(true)

const delimiterOptions = computed(() => [
  { label: t('ui.comma') + ' (,)', value: ',' },
  { label: t('ui.semicolon') + ' (;)', value: ';' },
  { label: t('ui.tab'), value: '\t' }
])

function jsonToCsv() {
  try {
    const data = JSON.parse(jsonInput.value)
    if (!Array.isArray(data) || data.length === 0) { csvOutput.value = t('ui.error') + ': JSON must be non-empty array'; return }
    const keys = Object.keys(data[0])
    let csv = includeHeader.value ? keys.join(delimiter.value) + '\n' : ''
    data.forEach(row => {
      csv += keys.map(key => {
        const value = row[key]?.toString() || ''
        return value.includes(delimiter.value) || value.includes('\n') ? `"${value}"` : value
      }).join(delimiter.value) + '\n'
    })
    csvOutput.value = csv.trim()
  } catch (e) { csvOutput.value = t('ui.error') + ': ' + (e as Error).message }
}

function csvToJson() {
  try {
    const lines = csvOutput.value.trim().split('\n')
    if (lines.length === 0) { jsonInput.value = '[]'; return }
    const headers = lines[0].split(delimiter.value).map(h => h.trim())
    const startIndex = includeHeader.value ? 1 : 0
    const data = lines.slice(startIndex).map(line => {
      const values = line.split(delimiter.value)
      const obj: Record<string, any> = {}
      headers.forEach((header, i) => { obj[header] = (values[i] ?? '').trim() })
      return obj
    })
    jsonInput.value = prettyJson.value ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  } catch (e) { jsonInput.value = t('ui.error') + ': ' + (e as Error).message }
}

useHead({ title: t('pages.jsonCsv.title'), meta: [{ name: 'description', content: t('pages.jsonCsv.description') }] })
</script>
