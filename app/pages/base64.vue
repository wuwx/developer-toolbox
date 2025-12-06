<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      :title="$t('pages.base64.title')"
      :description="$t('pages.base64.description')"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主内容卡片 -->
    <ToolCard>
      <!-- 模式切换 -->
      <div class="mb-8 flex justify-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <UButton
            :color="mode === 'encode' ? 'primary' : 'neutral'"
            :variant="mode === 'encode' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-arrow-right"
            class="px-6"
            @click="switchMode('encode')"
          >
            {{ $t('ui.encode') }}
          </UButton>
          <UButton
            :color="mode === 'decode' ? 'primary' : 'neutral'"
            :variant="mode === 'decode' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-arrow-left"
            class="px-6"
            @click="switchMode('decode')"
          >
            {{ $t('ui.decode') }}
          </UButton>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon :name="mode === 'encode' ? 'i-heroicons-document-text' : 'i-heroicons-code-bracket'" class="w-4 h-4" />
              {{ mode === 'encode' ? $t('ui.inputText') : $t('pages.base64.inputBase64') }}
            </label>
            <div class="flex items-center gap-2">
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
            :placeholder="$t('ui.inputPlaceholder')"
            :rows="8"
            size="xl"
            autoresize
            :maxrows="20"
            @input="handleInput"
            class="font-mono text-base block w-full"
            :ui="{ 
              base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full'
            }"
          />
          
          <!-- 底部操作栏 -->
          <div class="mt-4 flex justify-end">
            <UButton
              color="primary"
              size="md"
              :icon="mode === 'encode' ? 'i-heroicons-arrow-right' : 'i-heroicons-arrow-left'"
              :disabled="!inputText"
              @click="process"
              class="px-6"
            >
              {{ mode === 'encode' ? $t('pages.base64.executeEncode') : $t('pages.base64.executeDecode') }}
            </UButton>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="animate-fade-in">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            :title="$t('ui.operationFailed')"
            :description="error"
            color="error"
            variant="subtle"
          />
        </div>

        <!-- 结果展示区域 -->
        <div v-if="outputText" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon :name="mode === 'encode' ? 'i-heroicons-code-bracket' : 'i-heroicons-document-text'" class="w-4 h-4 text-orange-500" />
                  {{ mode === 'encode' ? $t('pages.base64.encodeResult') : $t('pages.base64.decodeResult') }}
                </label>
                <div class="flex items-center gap-2">
                  <UBadge color="success" variant="subtle" size="md">
                    {{ outputText.length }} {{ $t('ui.characters') }}
                  </UBadge>
                </div>
              </div>
              
              <div class="relative">
                <UTextarea
                  v-model="outputText"
                  readonly
                  :rows="8"
                  size="xl"
                  autoresize
                  :maxrows="20"
                  class="font-mono text-base w-full block"
                  :ui="{ 
                    base: 'bg-white dark:bg-gray-900 pr-12 min-h-[200px] p-4 w-full'
                  }"
                  @click="() => copyToClipboard(outputText, $t('ui.output'))"
                />
                <div class="absolute top-2 right-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-clipboard-document"
                    @click="() => copyToClipboard(outputText, $t('ui.output'))"
                  />
                </div>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.inputLength') }}</div>
                  <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.outputLength') }}</div>
                  <div class="font-mono font-bold text-purple-600 dark:text-purple-400">{{ outputText.length }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <!-- 快捷示例 -->
    <ToolExamples :examples="currentExamples" @select="useExample" />

    <!-- 说明信息 -->
    <ToolInfo :title="$t('pages.base64.aboutTitle')" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const { copyToClipboard } = useToolClipboard()

// 编码示例数据
const encodeExamples: Example[] = [
  { label: 'Hello World', text: 'Hello World' },
  { label: '你好世界', text: '你好世界' },
  { label: '123456', text: '123456' },
  { label: 'admin@example.com', text: 'admin@example.com' },
  { label: 'JSON', text: '{"name":"John","age":30}' }
]

// 解码示例数据
const decodeExamples: Example[] = [
  { label: 'Hello World', text: 'SGVsbG8gV29ybGQ=' },
  { label: '你好世界', text: '5L2g5aW95LiW55WM' },
  { label: '123456', text: 'MTIzNDU2' },
  { label: 'Email', text: 'YWRtaW5AZXhhbXBsZS5jb20=' },
  { label: 'JSON', text: 'eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9' }
]

// 当前示例
const currentExamples = computed(() => {
  return mode.value === 'encode' ? encodeExamples : decodeExamples
})

// 折叠面板数据
const accordionItems = computed<AccordionItem[]>(() => [
  {
    slot: 'what',
    label: t('pages.base64.what'),
    icon: 'i-heroicons-question-mark-circle',
    content: t('pages.base64.whatContent')
  },
  {
    slot: 'usage',
    label: t('pages.base64.usage'),
    icon: 'i-heroicons-rocket-launch',
    content: t('pages.base64.usageContent')
  },
  {
    slot: 'security',
    label: t('pages.base64.security'),
    icon: 'i-heroicons-shield-exclamation',
    content: t('pages.base64.securityContent')
  },
  {
    slot: 'features',
    label: t('pages.base64.features'),
    icon: 'i-heroicons-cpu-chip',
    content: t('pages.base64.featuresContent')
  }
])

// 切换模式
const switchMode = (newMode: 'encode' | 'decode') => {
  mode.value = newMode
  clearAll()
}

// Base64 编码
const encode = () => {
  try {
    error.value = ''
    const wordArray = CryptoJS.enc.Utf8.parse(inputText.value)
    outputText.value = CryptoJS.enc.Base64.stringify(wordArray)
  } catch (err) {
    error.value = t('pages.base64.encodeFailed')
    outputText.value = ''
  }
}

// Base64 解码
const decode = () => {
  try {
    error.value = ''
    const wordArray = CryptoJS.enc.Base64.parse(inputText.value)
    outputText.value = CryptoJS.enc.Utf8.stringify(wordArray)
    if (!outputText.value && inputText.value) {
      throw new Error('Empty result')
    }
  } catch (err) {
    error.value = t('pages.base64.decodeFailed')
    outputText.value = ''
  }
}

// 处理（编码或解码）
const process = () => {
  if (!inputText.value) {
    return
  }
  if (mode.value === 'encode') {
    encode()
  } else {
    decode()
  }
}

// 实时处理
const handleInput = () => {
  if (inputText.value) {
    process()
  } else {
    outputText.value = ''
    error.value = ''
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

// 使用示例
const useExample = (text: string) => {
  inputText.value = text
  process()
}

// SEO 元信息
useHead({
  title: t('pages.base64.seoTitle'),
  meta: [
    { name: 'description', content: t('pages.base64.seoDesc') }
  ]
})
</script>
