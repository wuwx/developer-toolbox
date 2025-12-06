<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.jsonToTypes.title')" :description="$t('pages.jsonToTypes.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('ui.input') }} JSON</h3>
              <UButton v-if="inputJSON" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputJSON = ''">{{ $t('ui.clear') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="inputJSON" placeholder='{"name": "John", "age": 30}' :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" />
        </UCard>
      </div>

      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">TypeScript Interface</h3>
                <UInput v-model="interfaceName" :placeholder="$t('ui.interfaceName')" size="xs" class="w-32" />
              </div>
              <UButton v-if="outputTS" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputTS, 'TypeScript')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <div class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>
          </div>
          <UTextarea v-model="outputTS" readonly :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'text-blue-600 dark:text-blue-400' }" />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputJSON = ref('')
const outputTS = ref('')
const interfaceName = ref('RootObject')
const error = ref('')

watch([inputJSON, interfaceName], () => generate())

function generate() {
  error.value = ''
  if (!inputJSON.value.trim()) { outputTS.value = ''; return }
  try {
    const obj = JSON.parse(inputJSON.value)
    outputTS.value = jsonToTs(obj, interfaceName.value)
  } catch { error.value = t('ui.invalidJson'); outputTS.value = '' }
}

function jsonToTs(obj: any, name: string): string {
  let output = `export interface ${name} {\n`
  const nestedInterfaces: string[] = []
  for (const key in obj) {
    const value = obj[key]
    const type = getType(value)
    let typeStr = type
    if (type === 'object') {
      const nestedName = capitalize(key)
      typeStr = nestedName
      nestedInterfaces.push(jsonToTs(value, nestedName))
    } else if (type === 'array') {
      if (value.length > 0) {
        const itemType = getType(value[0])
        if (itemType === 'object') {
          const nestedName = capitalize(key).slice(0, -1) || 'Item'
          typeStr = `${nestedName}[]`
          nestedInterfaces.push(jsonToTs(value[0], nestedName))
        } else { typeStr = `${itemType}[]` }
      } else { typeStr = 'any[]' }
    }
    output += `  ${key}: ${typeStr};\n`
  }
  output += '}'
  if (nestedInterfaces.length > 0) output += '\n\n' + nestedInterfaces.join('\n\n')
  return output
}

function getType(value: any): string {
  if (value === null) return 'any'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function capitalize(str: string) { return str.charAt(0).toUpperCase() + str.slice(1) }

useHead({ title: t('pages.jsonToTypes.title'), meta: [{ name: 'description', content: t('pages.jsonToTypes.description') }] })
</script>
