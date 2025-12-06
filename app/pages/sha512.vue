<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="SHA512 哈希生成器"
      description="生成文本的 SHA512 哈希值，安全性更高，完全本地运行"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-shield-check" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主内容卡片 -->
    <ToolCard>
      <div class="space-y-8">
        <!-- 输入区域 -->
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
            placeholder="在此输入要生成哈希的文本..."
            :rows="8"
            autoresize
            :maxrows="20"
            size="xl"
            class="font-mono text-base block w-full"
            :ui="{ 
              base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full'
            }"
            @input="generateHash"
          />
        </div>

        <!-- 结果展示区域 -->
        <div v-if="sha512Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />

          <!-- SHA512 结果 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-purple-500" />
                  SHA512 哈希值
                </label>
                <UBadge color="neutral" variant="subtle" size="md">512 位</UBadge>
              </div>
              
              <div class="flex gap-2">
                <UTextarea
                  v-model="sha512Hash"
                  readonly
                  :rows="6"
                  autoresize
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900 resize-none min-h-[100px] p-4 w-full' }"
                  @click="() => copyToClipboard(sha512Hash, 'SHA512')"
                />
                <UButton
                  color="neutral"
                  variant="soft"
                  size="lg"
                  class="h-fit"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(sha512Hash, 'SHA512')"
                >
                  复制
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <!-- 说明信息 -->
    <ToolInfo title="关于 SHA512 算法" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const sha512Hash = ref('')

definePageMeta({
  layout: 'default'
})

async function generateHash() {
  if (!inputText.value) {
    sha512Hash.value = ''
    return
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)

  // SHA-512
  const sha512Buffer = await crypto.subtle.digest('SHA-512', data)
  sha512Hash.value = Array.from(new Uint8Array(sha512Buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function clearAll() {
  inputText.value = ''
  sha512Hash.value = ''
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 SHA-512？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'SHA-512 是 SHA-2 家族中的一种加密哈希函数，生成 512 位（64 字节）的哈希值。它通常用 128 位十六进制数字表示。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'SHA-512 广泛用于需要高安全性的场景，如数字证书、密码哈希（通常配合盐值）、区块链等。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-check',
    content: 'SHA-512 提供了极高的抗碰撞性，目前被认为是非常安全的。它比 SHA-256 更安全，但在某些 32 位系统上计算速度可能稍慢。'
  }
]

// SEO
useHead({
  title: 'SHA512 哈希工具 - 在线 Hash 生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SHA512 哈希生成工具，生成 512 位安全哈希值，用于密码存储、文件校验、数据完整性验证。' }
  ]
})
</script>
