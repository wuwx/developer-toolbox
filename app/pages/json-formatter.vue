<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.jsonFormatter.title')" :description="$t('pages.jsonFormatter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }} JSON</h3></template>
        <UTextarea v-model="input" placeholder='{"name":"John","age":25}' :rows="20" class="font-mono text-sm w-full" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'JSON')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="20" readonly class="font-mono text-sm w-full" />
      </UCard>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <UButton block color="primary" @click="formatJson">{{ $t('ui.format') }} (2)</UButton>
      <UButton block color="primary" @click="format4">{{ $t('ui.format') }} (4)</UButton>
      <UButton block color="primary" @click="compress">{{ $t('ui.compress') }}</UButton>
      <UButton block color="primary" @click="sortKeys">{{ $t('ui.sortKeys') }}</UButton>
      <UButton block color="primary" @click="removeDuplicates">{{ $t('ui.deduplicate') }}</UButton>
      <UButton block color="primary" @click="escape">{{ $t('ui.escape') }}</UButton>
      <UButton block color="primary" @click="unescape">{{ $t('ui.unescape') }}</UButton>
      <UButton block color="primary" @click="validate">{{ $t('ui.validate') }}</UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')

function formatJson() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    output.value = t('ui.error') + ': ' + (e as Error).message
  }
}

function format4() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 4)
  } catch (e) {
    output.value = t('ui.error') + ': ' + (e as Error).message
  }
}

function compress() {
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
  } catch (e) {
    output.value = t('ui.error') + ': ' + (e as Error).message
  }
}

function sortKeys() {
  try {
    const obj = JSON.parse(input.value)
    const sorted = sortObjectKeys(obj)
    output.value = JSON.stringify(sorted, null, 2)
  } catch (e) {
    output.value = t('ui.error') + ': ' + (e as Error).message
  }
}

function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((result: any, key) => {
      result[key] = sortObjectKeys(obj[key])
      return result
    }, {})
  }
  return obj
}

function removeDuplicates() {
  try {
    const obj = JSON.parse(input.value)
    if (Array.isArray(obj)) {
      const unique = [...new Set(obj.map(JSON.stringify))].map(JSON.parse)
      output.value = JSON.stringify(unique, null, 2)
    } else {
      output.value = t('ui.arrayOnly')
    }
  } catch (e) {
    output.value = t('ui.error') + ': ' + (e as Error).message
  }
}

function escape() {
  output.value = JSON.stringify(input.value)
}

function unescape() {
  try {
    output.value = JSON.parse(input.value)
  } catch (e) {
    output.value = t('ui.error') + ': ' + (e as Error).message
  }
}

function validate() {
  try {
    JSON.parse(input.value)
    output.value = '✓ ' + t('ui.validJson')
  } catch (e) {
    output.value = '✗ ' + t('ui.invalidJson') + ':\n' + (e as Error).message
  }
}

useHead({ title: t('pages.jsonFormatter.title'), meta: [{ name: 'description', content: t('pages.jsonFormatter.description') }] })
</script>
