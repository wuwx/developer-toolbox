<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="SHA1 哈希生成器"
      description="快速将任意文本转换为 SHA1 哈希值，完全本地运行，保护数据隐私"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
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
              @click="generateSHA1"
              class="px-6"
            >
              生成 SHA1
            </UButton>
          </div>
        </div>

        <!-- 结果展示区域 -->
        <div v-if="sha1Hash" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-key" class="w-4 h-4 text-green-500" />
                  SHA1 哈希值
                </label>
                <div class="flex items-center gap-2">
                  <UBadge color="success" variant="subtle" size="md">
                    {{ sha1Hash.length }} 位
                  </UBadge>
                </div>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="sha1Hash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(sha1Hash, 'SHA1 哈希值')"
                />
                <UButton
                  color="primary"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(sha1Hash, 'SHA1 哈希值')"
                >
                  复制
                </UButton>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">原文长度</div>
                  <div class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">哈希长度</div>
                  <div class="font-mono font-bold text-purple-600 dark:text-purple-400">40</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">算法位数</div>
                  <div class="font-mono font-bold text-green-600 dark:text-green-400">160</div>
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
    <ToolInfo title="关于 SHA1 算法" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const inputText = ref('')
const sha1Hash = ref('')
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
    label: '什么是 SHA1？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'SHA1（Secure Hash Algorithm 1）是一种密码散列函数，由美国国家安全局设计，并由美国国家标准与技术研究院（NIST）发布为联邦数据处理标准（FIPS）。SHA1 可以产生一个 160 位（20 字节）的散列值，通常用 40 位十六进制数字表示。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'SHA1 广泛应用于 Git 版本控制系统、数字签名、SSL 证书、文件完整性校验等场景。许多软件和服务使用 SHA1 来验证数据的完整性，确保文件在传输或存储过程中未被篡改。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-exclamation',
    content: 'SHA1 已被证实存在理论上的碰撞攻击，2017 年 Google 成功演示了实际的碰撞攻击。因此，SHA1 不再适合用于需要高安全性的场景，如 SSL 证书、代码签名等。对于安全敏感的应用，建议使用 SHA-256、SHA-3 或更强的哈希算法。'
  },
  {
    slot: 'features',
    label: '技术特点',
    icon: 'i-heroicons-cpu-chip',
    content: 'SHA1 算法具有单向性（无法从哈希值反推原文）、雪崩效应（输入的微小变化会导致输出的巨大变化）、固定长度（无论输入多长，输出始终是 160 位）等特点。相比 MD5 提供了更高的安全性和更长的哈希值。'
  }
]

// 生成 SHA1
const generateSHA1 = () => {
  if (!inputText.value) {
    return
  }
  sha1Hash.value = CryptoJS.SHA1(inputText.value).toString()
}

// 实时生成（可选）
const handleInput = () => {
  if (inputText.value) {
    generateSHA1()
  } else {
    sha1Hash.value = ''
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  sha1Hash.value = ''
  // copied 状态在 useToolClipboard 内部管理，不需要手动重置
}

// 使用示例
const useExample = (text: string) => {
  inputText.value = text
  generateSHA1()
}

// SEO 元信息
useHead({
  title: 'SHA1 哈希工具 - 在线 SHA1 加密',
  meta: [
    { name: 'description', content: '免费的在线 SHA1 哈希生成工具，快速将文本转换为 SHA1 哈希值' }
  ]
})
</script>
