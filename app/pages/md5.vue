<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="MD5 哈希生成器"
      description="快速将任意文本转换为 MD5 哈希值，完全本地运行，保护数据隐私"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主内容卡片 -->
    <ToolCard>
      <!-- 输入区域 -->
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              输入原文
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
            placeholder="在此输入需要加密的文本内容..."
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
              icon="i-heroicons-sparkles"
              :disabled="!inputText"
              @click="generateMD5"
              class="px-6"
            >
              生成 MD5
            </UButton>
          </div>
        </div>

        <!-- 结果展示区域 -->
        <div v-if="md5Hash" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-key" class="w-4 h-4 text-primary-500" />
                  MD5 哈希值
                </label>
                <div class="flex items-center gap-2">
                  <UBadge color="success" variant="subtle" size="md">
                    {{ md5Hash.length }} 位
                  </UBadge>
                </div>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="md5Hash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(md5Hash, 'MD5 哈希值')"
                />
                <UButton
                  color="primary"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(md5Hash, 'MD5 哈希值')"
                >
                  复制
                </UButton>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">原文长度</div>
                  <div class="font-mono font-bold text-primary-600">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">哈希长度</div>
                  <div class="font-mono font-bold text-purple-600">32</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">算法位数</div>
                  <div class="font-mono font-bold text-green-600">128</div>
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
    <ToolInfo title="关于 MD5 算法" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const inputText = ref('')
const md5Hash = ref('')
const { copyToClipboard } = useToolClipboard()

// 快捷示例数据
const examples: Example[] = [
  { label: 'Hello World', text: 'Hello World' },
  { label: '你好世界', text: '你好世界' },
  { label: '123456', text: '123456' },
  { label: 'admin@example.com', text: 'admin@example.com' },
  { label: 'JSON示例', text: '{"name":"John","age":30}' }
]

// 折叠面板数据
const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 MD5？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'MD5（Message-Digest Algorithm 5）是一种广泛使用的密码散列函数，可以产生出一个 128 位（16 字节）的散列值，通常用 32 位十六进制数字表示。MD5 由美国密码学家罗纳德·李维斯特设计，于 1992 年公开，用以取代 MD4 算法。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'MD5 常用于文件完整性校验、数字签名、密码存储（已不推荐）、唯一标识符生成等场景。在下载文件时，网站通常会提供 MD5 值，用户可以验证下载的文件是否完整且未被篡改。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-exclamation',
    content: 'MD5 已被证实存在碰撞漏洞（不同内容可能产生相同的哈希值），因此不再适合用于安全性要求高的场景，如密码加密、数字证书等。对于安全敏感的应用，建议使用 SHA-256 或更强的哈希算法。'
  },
  {
    slot: 'features',
    label: '技术特点',
    icon: 'i-heroicons-cpu-chip',
    content: 'MD5 算法具有不可逆性（无法从哈希值反推原文）、雪崩效应（输入的微小变化会导致输出的巨大变化）、固定长度（无论输入多长，输出始终是 128 位）等特点。运算速度快，适合处理大量数据。'
  }
]

// 生成 MD5
const generateMD5 = () => {
  if (!inputText.value) {
    return
  }
  md5Hash.value = CryptoJS.MD5(inputText.value).toString()
}

// 实时生成（可选）
const handleInput = () => {
  if (inputText.value) {
    generateMD5()
  } else {
    md5Hash.value = ''
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  md5Hash.value = ''
  // copied 状态在 useToolClipboard 内部管理，不需要手动重置
}

// 使用示例
const useExample = (text: string) => {
  inputText.value = text
  generateMD5()
}

// SEO 元信息
useHead({
  title: 'MD5 哈希工具 - 在线 MD5 加密',
  meta: [
    { name: 'description', content: '免费的在线 MD5 哈希生成工具，快速将文本转换为 MD5 哈希值' }
  ]
})
</script>
