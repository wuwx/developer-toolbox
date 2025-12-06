<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="URL 编码/解码"
      description="对 URL 参数进行编码或解码，处理特殊字符"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-link" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

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

      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon :name="mode === 'encode' ? 'i-heroicons-document-text' : 'i-heroicons-link'" class="w-4 h-4" />
              {{ mode === 'encode' ? '输入普通文本' : '输入 URL 编码文本' }}
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
            :placeholder="mode === 'encode' ? '在此输入需要编码的文本...' : '在此输入需要解码的 URL...'"
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
            title="转换失败"
            :description="error"
            color="error"
            variant="subtle"
          />
        </div>

        <!-- 结果展示 -->
        <div v-if="outputText" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon :name="mode === 'encode' ? 'i-heroicons-link' : 'i-heroicons-document-text'" class="w-4 h-4 text-pink-500" />
                  {{ mode === 'encode' ? 'URL 编码结果' : '解码结果' }}
                </label>
                <div class="flex items-center gap-2">
                  <UBadge color="success" variant="subtle" size="md">
                    {{ outputText.length }} 字符
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
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolExamples :examples="currentExamples" @select="useExample" />
    <ToolInfo title="关于 URL 编码" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const { copyToClipboard } = useToolClipboard()

// 编码示例
const encodeExamples: Example[] = [
  { label: '空格处理', text: 'Hello World' },
  { label: '中文处理', text: '你好世界' },
  { label: '特殊符号', text: 'a&b=c?d' },
  { label: '复杂 URL', text: 'https://example.com/search?q=test&page=1' }
]

// 解码示例
const decodeExamples: Example[] = [
  { label: '空格处理', text: 'Hello%20World' },
  { label: '中文处理', text: '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C' },
  { label: '特殊符号', text: 'a%26b%3Dc%3Fd' },
  { label: '复杂 URL', text: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtest%26page%3D1' }
]

const currentExamples = computed(() => mode.value === 'encode' ? encodeExamples : decodeExamples)

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 URL 编码？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'URL 编码（也称百分号编码）是一种将字符转换为互联网传输格式的机制。URL 只能包含 ASCII 字符集中的一部分字符，其他字符（如汉字、特殊符号等）必须进行编码。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: '当 URL 参数中包含空格、特殊符号（如 &、=、?）或非 ASCII 字符时，必须进行编码，否则会导致 URL 解析错误或数据丢失。'
  }
]

const switchMode = (newMode: 'encode' | 'decode') => {
  mode.value = newMode
  clearAll()
}

const process = () => {
  if (!inputText.value) return
  
  try {
    error.value = ''
    if (mode.value === 'encode') {
      outputText.value = encodeURIComponent(inputText.value)
    } else {
      outputText.value = decodeURIComponent(inputText.value)
    }
  } catch (err) {
    error.value = '转换失败，请检查输入格式是否正确'
    outputText.value = ''
  }
}

const handleInput = () => {
  if (inputText.value) process()
  else {
    outputText.value = ''
    error.value = ''
  }
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

const useExample = (text: string) => {
  inputText.value = text
  process()
}

useHead({
  title: 'URL 编码解码工具 - 在线 URL Encode/Decode',
  meta: [
    { name: 'description', content: '免费在线 URL 编码和解码工具，支持中文和特殊字符处理' }
  ]
})
</script>
