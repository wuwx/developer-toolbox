<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="JSON 格式化工具"
      description="快速格式化、压缩和验证 JSON 数据，支持语法高亮和错误提示"
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
            格式化
          </UButton>
          <UButton
            :color="mode === 'compress' ? 'primary' : 'neutral'"
            :variant="mode === 'compress' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-arrows-pointing-in"
            class="px-6"
            @click="switchMode('compress')"
          >
            压缩
          </UButton>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket-square" class="w-4 h-4" />
              输入 JSON
            </label>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1" v-if="inputText">
                <UBadge v-if="isValid" color="success" variant="subtle" size="sm" icon="i-heroicons-check-circle">有效</UBadge>
                <UBadge v-else-if="error" color="error" variant="subtle" size="sm" icon="i-heroicons-exclamation-circle">无效</UBadge>
              </div>
              <UButton
                v-if="inputText"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="clearAll"
              >
                清空
              </UButton>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ inputText.length }} 字符
              </UBadge>
            </div>
          </div>
          <UTextarea
            v-model="inputText"
            placeholder='在此输入 JSON 数据...&#10;例如: {"name": "John", "age": 30}'
            :rows="12"
            size="lg"
            autoresize
            :maxrows="20"
            @input="handleInput"
            class="font-mono text-sm leading-relaxed"
            :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 font-ligatures-none' }"
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
              {{ mode === 'format' ? '执行格式化' : '执行压缩' }}
            </UButton>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="animate-fade-in">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            title="JSON 格式错误"
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
              <UIcon name="i-heroicons-document-text" class="w-24 h-24" />
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-clipboard-document-check" class="w-4 h-4 text-indigo-500" />
                  {{ mode === 'format' ? '格式化结果' : '压缩结果' }}
                </label>
                <div class="flex items-center gap-2">
                  <UButton
                    color="neutral"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-arrow-down-tray"
                    @click="downloadJSON"
                  >
                    下载文件
                  </UButton>
                  <UChip :text="`${outputText.length} 字符`" color="success" size="sm" inset />
                </div>
              </div>
              
              <div class="relative">
                <UTextarea
                  v-model="outputText"
                  readonly
                  :rows="12"
                  size="lg"
                  autoresize
                  :maxrows="20"
                  class="font-mono text-sm leading-relaxed w-full"
                  :ui="{ base: 'bg-white dark:bg-gray-900 pr-12 font-ligatures-none' }"
                  @click="() => copyToClipboard(outputText, 'JSON 结果')"
                />
                <div class="absolute top-2 right-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-clipboard-document"
                    @click="() => copyToClipboard(outputText, 'JSON 结果')"
                  />
                </div>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">原始长度</div>
                  <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">处理后长度</div>
                  <div class="font-mono font-bold text-purple-600 dark:text-purple-400">{{ outputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">压缩比例</div>
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
    <ToolInfo title="关于 JSON 格式化" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const mode = ref<'format' | 'compress'>('format')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const isValid = ref(false)
const { copyToClipboard } = useToolClipboard()

// 示例数据
const examples: Example[] = [
  { 
    label: '简单对象', 
    text: '{"name":"John","age":30,"city":"New York"}' 
  },
  { 
    label: '嵌套对象', 
    text: '{"user":{"name":"Alice","profile":{"age":25,"email":"alice@example.com"}}}' 
  },
  { 
    label: '数组数据', 
    text: '{"fruits":["apple","banana","orange"],"count":3}' 
  },
  { 
    label: '复杂结构', 
    text: '{"users":[{"id":1,"name":"John","active":true},{"id":2,"name":"Jane","active":false}],"total":2}' 
  }
]

// 折叠面板数据
const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 JSON？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，易于人阅读和编写，同时也易于机器解析和生成。它基于 JavaScript 的一个子集，但完全独立于编程语言。JSON 使用完全独立于语言的文本格式，广泛应用于 Web 应用程序中。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'JSON 广泛应用于 API 数据传输、配置文件、数据存储、前后端数据交换等场景。几乎所有现代 Web 应用都使用 JSON 作为数据交换格式。它已经成为 RESTful API 的标准数据格式。'
  },
  {
    slot: 'features',
    label: '格式化的好处',
    icon: 'i-heroicons-sparkles',
    content: '格式化后的 JSON 具有良好的缩进和换行，使数据结构清晰可读，便于调试和维护。压缩后的 JSON 可以减小文件大小，提高网络传输效率。本工具支持实时验证 JSON 语法，帮助快速发现和定位错误。'
  },
  {
    slot: 'tips',
    label: '使用技巧',
    icon: 'i-heroicons-light-bulb',
    content: '在开发调试时使用格式化模式，便于查看数据结构；在生产环境中使用压缩模式，减少数据传输量。JSON 的键名必须使用双引号，字符串值也必须使用双引号。支持的数据类型包括：对象、数组、字符串、数字、布尔值和 null。'
  }
]

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
    error.value = err.message || 'JSON 格式错误'
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
    error.value = err.message || 'JSON 格式错误'
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
    alert('下载失败，请重试')
  }
}

// SEO 元信息
useHead({
  title: 'JSON 格式化工具 - 在线 JSON 格式化压缩',
  meta: [
    { name: 'description', content: '免费的在线 JSON 格式化和压缩工具，支持实时验证、语法检查和错误提示' }
  ]
})
</script>
