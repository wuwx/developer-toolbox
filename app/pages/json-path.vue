<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.jsonPath.title')" :description="$t('pages.jsonPath.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-magnifying-glass-circle" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('ui.input') }} JSON</h3>
              <UButton v-if="input" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="input = ''">{{ $t('ui.clear') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="input" placeholder='{"store": {"book": [{"title": "book1"}]}}' :rows="20" class="font-mono text-sm w-full" />
        </UCard>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header><h3 class="font-semibold">{{ $t('ui.queryPath') }}</h3></template>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Path</label>
              <UInput v-model="path" placeholder="store.book[0].title" size="xl" class="font-mono" icon="i-heroicons-magnifying-glass" />
            </div>
          </div>
        </UCard>

        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('ui.result') }}</h3>
              <UButton v-if="resultStr" color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(resultStr, 'Result')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="resultStr" readonly :rows="12" class="font-mono text-sm w-full" :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 text-green-600 dark:text-green-400' }" />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const input = ref('{\n  "store": {\n    "book": [\n      { "category": "reference", "author": "Nigel Rees", "title": "Sayings of the Century", "price": 8.95 },\n      { "category": "fiction", "author": "Evelyn Waugh", "title": "Sword of Honour", "price": 12.99 }\n    ]\n  }\n}')
const path = ref('store.book[0].title')

const resultStr = computed(() => {
  try {
    if (!input.value) return ''
    const obj = JSON.parse(input.value)
    const res = getValue(obj, path.value)
    if (res === undefined) return 'undefined'
    if (typeof res === 'object') return JSON.stringify(res, null, 2)
    return String(res)
  } catch { return 'Error: Invalid JSON or Path' }
})

function getValue(obj: any, pathStr: string) {
  if (!pathStr) return obj
  const cleanPath = pathStr.replace(/^\$\.?/, '')
  const parts = cleanPath.split(/[.\[\]]/).filter(p => p !== '')
  let current = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    current = current[part]
  }
  return current
}

useHead({ title: t('pages.jsonPath.title'), meta: [{ name: 'description', content: t('pages.jsonPath.description') }] })
</script>
