<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="SHA256 哈希生成器"
      description="生成文本的 SHA256 哈希值，安全性更高，完全本地运行"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
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
        <div v-if="sha256Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />

          <!-- SHA256 结果 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-blue-500" />
                  SHA256 哈希值
                </label>
                <UBadge color="primary" variant="subtle" size="md">256 位</UBadge>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="sha256Hash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(sha256Hash, 'SHA256')"
                />
                <UButton
                  color="neutral"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(sha256Hash, 'SHA256')"
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
    <ToolInfo title="关于 SHA256 算法" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const sha256Hash = ref('')

definePageMeta({
  layout: 'default'
})

async function generateHash() {
  if (!inputText.value) {
    sha256Hash.value = ''
    return
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)

  // SHA-256
  const sha256Buffer = await crypto.subtle.digest('SHA-256', data)
  sha256Hash.value = Array.from(new Uint8Array(sha256Buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function clearAll() {
  inputText.value = ''
  sha256Hash.value = ''
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 SHA-256？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'SHA-256 是 SHA-2 家族中的一种加密哈希函数，生成 256 位（32 字节）的哈希值。它是目前应用最广泛的安全哈希算法之一。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'SHA-256 是比特币等加密货币的核心算法，也广泛用于 SSL/TLS 证书、数字签名、密码存储（通常配合加盐）、文件完整性校验等。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-check',
    content: '目前尚未发现对 SHA-256 的有效攻击方法。它们被认为是加密安全的，广泛推荐用于新系统的开发。'
  }
]

// SEO
useHead({
  title: 'SHA256 哈希工具 - 在线 Hash 生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SHA256 哈希生成工具，用于密码存储、文件校验、数据完整性验证。安全可靠的哈希计算器。' }
  ]
})
</script>
