<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="Base64 编码解码工具"
      description="快速进行 Base64 编码和解码，完全本地运行，保护数据隐私"
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
            编码
          </UButton>
          <UButton
            :color="mode === 'decode' ? 'primary' : 'neutral'"
            :variant="mode === 'decode' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-arrow-left"
            class="px-6"
            @click="switchMode('decode')"
          >
            解码
          </UButton>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon :name="mode === 'encode' ? 'i-heroicons-document-text' : 'i-heroicons-code-bracket'" class="w-4 h-4" />
              {{ mode === 'encode' ? '输入原文' : '输入 Base64 文本' }}
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
                清空
              </UButton>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ inputText.length }} 字符
              </UBadge>
            </div>
          </div>
          <UTextarea
            v-model="inputText"
            :placeholder="mode === 'encode' ? '在此输入需要编码的文本内容...\n支持多行文本、特殊字符等任意内容' : '在此输入需要解码的 Base64 文本...'"
            :rows="6"
            size="lg"
            autoresize
            :maxrows="15"
            @input="handleInput"
            class="font-mono text-base"
            :ui="{ base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20' }"
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
              {{ mode === 'encode' ? '执行编码' : '执行解码' }}
            </UButton>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="animate-fade-in">
          <UAlert
            icon="i-heroicons-exclamation-triangle"
            title="操作失败"
            :description="error"
            color="error"
            variant="subtle"
          />
        </div>

        <!-- 结果展示区域 -->
        <div v-if="outputText" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <UIcon name="i-heroicons-arrows-right-left" class="w-24 h-24" />
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon :name="mode === 'encode' ? 'i-heroicons-code-bracket' : 'i-heroicons-document-text'" class="w-4 h-4 text-orange-500" />
                  {{ mode === 'encode' ? 'Base64 编码结果' : '解码结果' }}
                </label>
                <div class="flex items-center gap-2">
                  <UChip :text="`${outputText.length} 字符`" color="success" size="sm" inset />
                </div>
              </div>
              
              <div class="relative">
                <UTextarea
                  v-model="outputText"
                  readonly
                  :rows="6"
                  size="lg"
                  autoresize
                  :maxrows="15"
                  class="font-mono text-base w-full"
                  :ui="{ base: 'bg-white dark:bg-gray-900 pr-12' }"
                  @click="() => copyToClipboard(outputText, '转换结果')"
                />
                <div class="absolute top-2 right-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-clipboard-document"
                    @click="() => copyToClipboard(outputText, '转换结果')"
                  />
                </div>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">输入长度</div>
                  <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">输出长度</div>
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
    <ToolInfo title="关于 Base64 编码" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

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
  { label: 'JSON示例', text: '{"name":"John","age":30}' }
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
const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 Base64？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方法。它将每 3 个字节的二进制数据编码为 4 个可打印字符，常用于在文本协议中传输二进制数据，如在 Email、URL、HTTP 请求中嵌入图片或其他二进制内容。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'Base64 广泛应用于数据传输、数据存储、Email 附件编码、Data URI（在 HTML/CSS 中嵌入图片）、JWT Token、API 认证、URL 参数编码等场景。它能确保二进制数据在传输过程中不会因为特殊字符而被破坏。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-exclamation',
    content: 'Base64 是编码方式而非加密方式，任何人都可以轻松解码。不要用 Base64 来保护敏感信息！它只用于数据格式转换，不提供任何安全保护。如需加密数据，应使用 AES、RSA 等加密算法。'
  },
  {
    slot: 'features',
    label: '技术特点',
    icon: 'i-heroicons-cpu-chip',
    content: 'Base64 编码后的数据长度约为原数据的 4/3 倍（增加约 33%）。编码使用 A-Z、a-z、0-9、+、/ 共 64 个字符，以及用于填充的 = 字符。编码和解码过程是可逆的，可以完整还原原始数据。'
  }
]

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
    error.value = '编码失败，请检查输入内容'
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
      throw new Error('解码结果为空')
    }
  } catch (err) {
    error.value = '解码失败，请检查输入是否为有效的 Base64 格式'
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
  title: 'Base64 编码解码工具 - 在线 Base64 转换',
  meta: [
    { name: 'description', content: '免费的在线 Base64 编码解码工具，快速进行 Base64 与文本之间的转换' }
  ]
})
</script>
