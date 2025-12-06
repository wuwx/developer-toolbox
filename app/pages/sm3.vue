<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="SM3 国密哈希"
      description="生成文本的 SM3 国密哈希值，中国国家密码管理局发布的哈希算法标准"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 mb-6 shadow-xl">
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
        <div v-if="sm3Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />

          <!-- SM3 结果 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-red-500" />
                  SM3 哈希值
                </label>
                <UBadge color="primary" variant="subtle" size="md">256 位</UBadge>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="sm3Hash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(sm3Hash, 'SM3')"
                />
                <UButton
                  color="neutral"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(sm3Hash, 'SM3')"
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
    <ToolInfo title="关于 SM3 算法" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import { sm3 } from 'sm-crypto'
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const sm3Hash = ref('')

definePageMeta({
  layout: 'default'
})

function generateHash() {
  if (!inputText.value) {
    sm3Hash.value = ''
    return
  }

  try {
    sm3Hash.value = sm3(inputText.value)
  } catch (e) {
    console.error('SM3 generation failed', e)
  }
}

function clearAll() {
  inputText.value = ''
  sm3Hash.value = ''
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 SM3？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'SM3 是中国国家密码管理局发布的密码散列函数标准（GB/T 32905-2016）。它是一种消息摘要算法，能够将任意长度的消息压缩成 256 位的摘要（哈希值）。SM3 在安全性上与 SHA-256 相当，甚至在某些方面设计得更为严谨。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'SM3 广泛应用于中国的金融、电子政务、数字证书等领域。它是中国商用密码体系（国密）中的核心算法之一，用于数字签名和验证、消息认证码生成以及随机数生成等。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-check',
    content: 'SM3 算法经过了严格的设计和评估，抗碰撞性强。目前被认为是非常安全的哈希算法，符合国家密码管理政策要求，是国内合规系统的首选。'
  }
]

// SEO
useHead({
  title: 'SM3 国密哈希工具 - 在线 SM3 生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SM3 国密哈希生成工具，符合中国国家标准的密码杂凑算法。安全、快速、本地运行。' }
  ]
})
</script>
