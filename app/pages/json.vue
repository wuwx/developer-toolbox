<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      :title="$t('pages.json.title')"
      :description="$t('pages.json.description')"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主内容卡片 -->
    <ToolCard>
      <!-- 模式切换 -->
      <div class="mb-8 flex justify-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <UButton
            :color="mode === 'format' ? 'primary' : 'neutral'"
            :variant="mode === 'format' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-arrows-pointing-out"
            class="px-6"
            @click="switchMode('format')"
          >
            {{ $t('ui.format') }}
          </UButton>
          <UButton
            :color="mode === 'compress' ? 'primary' : 'neutral'"
            :variant="mode === 'compress' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-arrows-pointing-in"
            class="px-6"
            @click="switchMode('compress')"
          >
            {{ $t('ui.compress') }}
          </UButton>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket-square" class="w-4 h-4" />
              {{ $t('ui.inputJson') }}
            </label>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1" v-if="inputText">
                <UBadge v-if="isValid" color="success" variant="subtle" size="sm" icon="i-heroicons-check-circle">{{ $t('ui.valid') }}</UBadge>
                <UBadge v-else-if="error" color="error" variant="subtle" size="sm" icon="i-heroicons-exclamation-circle">{{ $t('ui.invalid') }}</UBadge>
              </div>
              <UButton
                v-if="inputText"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="clearAll"
              >
                {{ $t('ui.clear') }}
              </UButton>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ inputText.length }} {{ $t('ui.characters') }}
              </UBadge>
            </div>
          </div>
          <UTextarea
            v-model="inputText"
            :placeholder='`${$t("ui.inputJson")}...\n${t("ui.quickExamples")}: {"name": "John", "age": 30}`'
            :rows="12"
            size="xl"
            autoresize
            :maxrows="20"
            @input="handleInput"
            class="font-mono text-sm leading-relaxed block w-full"
            :ui="{ 
              base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 font-ligatures-none min-h-[300px] p-4 w-full' 
            }"
          />
          
          <!-- 底部操作栏 -->
          <div class="mt-4 flex justify-end">
            <UButton
              color="primary"
              size="md"
              :icon="mode === 'format' ? 'i-heroicons-arrows-pointing-out' : 'i-heroicons-arrows-pointing-in'"
              :disabled="!inputText || !isValid"
              @click="process"
              class="px-6"
            >
              {{ mode === 'format' ? $t('ui.executeFormat') : $t('ui.executeCompress') }}
            </UButton>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="animate-fade-in">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            :title="$t('ui.jsonFormatError')"
            :description="error"
            color="error"
            variant="subtle"
          />
        </div>

        <!-- 结果展示区域 -->
        <div v-if="outputText && isValid" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-4 h-4 text-indigo-500" />
                  {{ mode === 'format' ? $t('ui.formatResult') : $t('ui.compressResult') }}
                </label>
                <div class="flex items-center gap-2">
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-arrow-down-tray"
                    @click="downloadJSON"
                  >
                    {{ $t('ui.downloadFile') }}
                  </UButton>
                  <UBadge color="success" variant="subtle" size="md">
                    {{ outputText.length }} {{ $t('ui.characters') }}
                  </UBadge>
                </div>
              </div>
              
              <div class="relative">
                <UTextarea
                  v-model="outputText"
                  readonly
                  :rows="12"
                  size="xl"
                  autoresize
                  :maxrows="20"
                  class="font-mono text-sm leading-relaxed w-full block"
                  :ui="{ 
                    base: 'bg-white dark:bg-gray-900 pr-12 font-ligatures-none min-h-[300px] p-4 w-full' 
                  }"
                  @click="() => copyToClipboard(outputText, t('ui.jsonResult'))"
                />
                <div class="absolute top-2 right-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-clipboard-document"
                    @click="() => copyToClipboard(outputText, t('ui.jsonResult'))"
                  />
                </div>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.originalLength') }}</div>
                  <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.processedLength') }}</div>
                  <div class="font-mono font-bold text-purple-600 dark:text-purple-400">{{ outputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.compressionRatio') }}</div>
                  <div class="font-mono font-bold text-green-600 dark:text-green-400">{{ compressionRatio }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <!-- 快捷示例 -->
    <ToolExamples :examples="examples" @select="useExample" />

    <!-- 说明信息 -->
    <ToolInfo :title="$t('ui.aboutJson')" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()

const mode = ref<'format' | 'compress'>('format')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const isValid = ref(false)
const { copyToClipboard } = useToolClipboard()

// 示例数据
const examples: Example[] = [
  { 
    label: 'Simple Object', 
    text: '{"name":"John","age":30,"city":"New York"}' 
  },
  { 
    label: 'Nested Object', 
    text: '{"user":{"name":"Alice","profile":{"age":25,"email":"alice@example.com"}}}' 
  },
  { 
    label: 'Array Data', 
    text: '{"fruits":["apple","banana","orange"],"count":3}' 
  },
  { 
    label: 'Complex Structure', 
    text: '{"users":[{"id":1,"name":"John","active":true},{"id":2,"name":"Jane","active":false}],"total":2}' 
  }
]

// 折叠面板数据
const accordionItems = computed<AccordionItem[]>(() => [
  {
    slot: 'what',
    label: t('ui.whatIsJson'),
    icon: 'i-heroicons-question-mark-circle',
    content: t('ui.whatIsJsonContent')
  },
  {
    slot: 'usage',
    label: t('ui.jsonMainUsage'),
    icon: 'i-heroicons-rocket-launch',
    content: t('ui.jsonMainUsageContent')
  },
  {
    slot: 'features',
    label: t('ui.formatBenefits'),
    icon: 'i-heroicons-sparkles',
    content: t('ui.formatBenefitsContent')
  },
  {
    slot: 'tips',
    label: t('ui.jsonUsageTips'),
    icon: 'i-heroicons-light-bulb',
    content: t('ui.jsonUsageTipsContent')
  }
])

// 压缩比例
const compressionRatio = computed(() => {
  if (!inputText.value || !outputText.value) return '0%'
  const ratio = ((1 - outputText.value.length / inputText.value.length) * 100).toFixed(1)
  return ratio === '-0.0' ? '0%' : `${ratio}%`
})

// 切换模式
const switchMode = (newMode: 'format' | 'compress') => {
  mode.value = newMode
  if (isValid.value && inputText.value) {
    process()
  }
}

// 验证并格式化 JSON
const formatJSON = () => {
  try {
    error.value = ''
    const parsed = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(parsed, null, 2)
    isValid.value = true
  } catch (err: any) {
    error.value = err.message || t('ui.jsonFormatError')
    outputText.value = ''
    isValid.value = false
  }
}

// 验证并压缩 JSON
const compressJSON = () => {
  try {
    error.value = ''
    const parsed = JSON.parse(inputText.value)
    outputText.value = JSON.stringify(parsed)
    isValid.value = true
  } catch (err: any) {
    error.value = err.message || t('ui.jsonFormatError')
    outputText.value = ''
    isValid.value = false
  }
}

// 处理（格式化或压缩）
const process = () => {
  if (!inputText.value) {
    return
  }
  if (mode.value === 'format') {
    formatJSON()
  } else {
    compressJSON()
  }
}

// 实时处理
const handleInput = () => {
  if (inputText.value) {
    process()
  } else {
    outputText.value = ''
    error.value = ''
    isValid.value = false
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
  isValid.value = false
}

// 使用示例
const useExample = (text: string) => {
  inputText.value = text
  process()
}

// 下载 JSON 文件
const downloadJSON = () => {
  try {
    const blob = new Blob([outputText.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formatted-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to download:', err)
    alert(t('ui.downloadFailed'))
  }
}

// SEO 元信息
useHead({
  title: t('pages.json.title'),
  meta: [
    { name: 'description', content: t('pages.json.description') }
  ]
})
</script>
