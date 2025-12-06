<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.yamlJson.title')" :description="$t('pages.yamlJson.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-6 flex items-center gap-4">
      <UButton :color="mode === 'yaml-to-json' ? 'primary' : 'neutral'" :variant="mode === 'yaml-to-json' ? 'solid' : 'soft'" icon="i-heroicons-arrow-right" @click="mode = 'yaml-to-json'">YAML → JSON</UButton>
      <UButton :color="mode === 'json-to-yaml' ? 'primary' : 'neutral'" :variant="mode === 'json-to-yaml' ? 'solid' : 'soft'" icon="i-heroicons-arrow-left" @click="mode = 'json-to-yaml'">JSON → YAML</UButton>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.input') }}</h3>
            <UButton v-if="input" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="input = ''">{{ $t('ui.clear') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="input" :placeholder="mode === 'yaml-to-json' ? yamlPlaceholder : jsonPlaceholder" :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" @input="convert" />
      </UCard>

      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, mode === 'yaml-to-json' ? 'JSON' : 'YAML')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <div class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>
        </div>
        <UTextarea v-model="output" readonly :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'text-blue-600 dark:text-blue-400 p-4' }" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const mode = ref<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
const input = ref('')
const output = ref('')
const error = ref('')

const yamlPlaceholder = `name: John Doe\nage: 30\nskills:\n  - JavaScript\n  - Python`
const jsonPlaceholder = `{\n  "name": "John Doe",\n  "age": 30,\n  "skills": ["JavaScript", "Python"]\n}`

function convert() {
  error.value = ''
  if (!input.value.trim()) { output.value = ''; return }
  try {
    if (mode.value === 'yaml-to-json') {
      const lines = input.value.split('\n')
      const obj: any = {}
      lines.forEach(line => { const [key, ...val] = line.split(':'); if (key && val) obj[key.trim()] = val.join(':').trim() })
      error.value = 'Note: Simplified YAML parser, only supports simple key-value pairs.'
      output.value = JSON.stringify(obj, null, 2)
    } else {
      const obj = JSON.parse(input.value)
      output.value = jsonToYaml(obj)
    }
  } catch (e) { error.value = t('ui.operationFailed'); output.value = '' }
}

function jsonToYaml(obj: any, indent = 0): string {
  const spacing = ' '.repeat(indent)
  let yaml = ''
  for (const key in obj) {
    const value = obj[key]
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        yaml += `${spacing}${key}:\n`
        value.forEach(item => { yaml += `${spacing}  - ${typeof item === 'object' ? 'object' : item}\n` })
      } else yaml += `${spacing}${key}:\n${jsonToYaml(value, indent + 2)}`
    } else yaml += `${spacing}${key}: ${value}\n`
  }
  return yaml
}

watch(mode, () => { input.value = ''; output.value = ''; error.value = '' })

useHead({ title: t('pages.yamlJson.title'), meta: [{ name: 'description', content: t('pages.yamlJson.description') }] })
</script>
