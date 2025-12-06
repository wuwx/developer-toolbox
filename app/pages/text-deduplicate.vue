<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.textDeduplicate.title')" :description="$t('pages.textDeduplicate.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-funnel" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.inputText') }}</h3>
              </div>
              <div class="flex gap-2">
                <UBadge color="neutral" variant="subtle" size="sm">{{ inputLines.length }} {{ $t('ui.lines') }}</UBadge>
                <UButton v-if="inputText" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputText = ''">{{ $t('ui.clear') }}</UButton>
              </div>
            </div>
          </template>
          <div class="flex-1 relative min-h-[400px]">
            <UTextarea v-model="inputText" :placeholder="$t('ui.onePerLine')" class="absolute inset-0 h-full w-full font-mono text-sm" :ui="{ base: 'h-full p-4' }" />
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.options') }}</h3>
            </div>
          </template>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('ui.basicClean') }}</label>
              <div class="space-y-2">
                <UCheckbox v-model="options.trim" :label="$t('ui.trimSpaces')" />
                <UCheckbox v-model="options.removeEmpty" :label="$t('ui.removeEmpty')" />
                <UCheckbox v-model="options.unique" :label="$t('ui.removeDuplicates')" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('ui.sortMethod') }}</label>
              <USelect v-model="options.sort" :options="sortOptions" class="w-full" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('ui.addContent') }}</label>
              <div class="grid grid-cols-2 gap-2">
                <UInput v-model="options.prefix" :placeholder="$t('ui.prefix')" size="sm" class="w-full" />
                <UInput v-model="options.suffix" :placeholder="$t('ui.suffix')" size="sm" class="w-full" />
              </div>
            </div>
            <UButton block color="primary" size="lg" icon="i-heroicons-arrow-right" class="mt-4" @click="process">{{ $t('ui.process') }}</UButton>
          </div>
        </UCard>

        <div v-if="inputText" class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-2xl font-bold">{{ inputLines.length }}</div>
            <div class="text-xs text-gray-500">{{ $t('ui.originalLines') }}</div>
          </div>
          <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary-600">{{ resultLines.length }}</div>
            <div class="text-xs text-primary-600 dark:text-primary-400">{{ $t('ui.processedLines') }}</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-check" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.result') }}</h3>
              </div>
              <UButton v-if="resultText" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(resultText, t('ui.result'))">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="flex-1 relative min-h-[400px]">
            <UTextarea v-model="resultText" readonly :placeholder="$t('ui.resultPlaceholder')" class="absolute inset-0 h-full w-full font-mono text-sm" :ui="{ base: 'h-full p-4' }" />
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const resultText = ref('')

const options = reactive({
  trim: true,
  removeEmpty: true,
  unique: true,
  sort: 'none',
  prefix: '',
  suffix: ''
})

const sortOptions = computed(() => [
  { label: t('ui.noSort'), value: 'none' },
  { label: 'A-Z', value: 'az' },
  { label: 'Z-A', value: 'za' },
  { label: t('ui.lengthAsc'), value: 'length_asc' },
  { label: t('ui.lengthDesc'), value: 'length_desc' },
  { label: t('ui.numAsc'), value: 'num_asc' },
  { label: t('ui.numDesc'), value: 'num_desc' },
  { label: t('ui.random'), value: 'random' },
  { label: t('ui.reverse'), value: 'reverse' }
])

const inputLines = computed(() => inputText.value ? inputText.value.split('\n') : [])
const resultLines = computed(() => resultText.value ? resultText.value.split('\n') : [])

function process() {
  if (!inputText.value) {
    resultText.value = ''
    return
  }

  let lines = inputText.value.split('\n')

  // 1. 基础清理
  if (options.trim) {
    lines = lines.map(l => l.trim())
  }
  
  if (options.removeEmpty) {
    lines = lines.filter(l => l.length > 0)
  }

  // 2. 去重
  if (options.unique) {
    lines = [...new Set(lines)]
  }

  // 3. 排序
  switch (options.sort) {
    case 'az':
      lines.sort() // 默认字典序
      break
    case 'za':
      lines.sort().reverse()
      break
    case 'length_asc':
      lines.sort((a, b) => a.length - b.length)
      break
    case 'length_desc':
      lines.sort((a, b) => b.length - a.length)
      break
    case 'num_asc':
      lines.sort((a, b) => parseFloat(a) - parseFloat(b))
      break
    case 'num_desc':
      lines.sort((a, b) => parseFloat(b) - parseFloat(a))
      break
    case 'random':
      lines.sort(() => Math.random() - 0.5)
      break
    case 'reverse':
      lines.reverse()
      break
  }

  // 4. 添加前后缀
  if (options.prefix || options.suffix) {
    lines = lines.map(l => `${options.prefix}${l}${options.suffix}`)
  }

  resultText.value = lines.join('\n')
}

// 监听输入变化，如果开启自动处理可以这里调用 process，但对于大量文本建议手动
watch(inputText, () => {
  // 简单的自动清理，但不排序去重（除非想做成实时的）
  // 这里不做实时处理，避免性能问题
})

useHead({ title: t('pages.textDeduplicate.title'), meta: [{ name: 'description', content: t('pages.textDeduplicate.description') }] })
</script>
