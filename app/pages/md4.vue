<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="MD4 哈希生成器"
      description="生成文本的 MD4 哈希值，仅供兼容性测试，不建议用于新系统"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-hashtag" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
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

        <div v-if="md4Hash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />

          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-open" class="w-4 h-4 text-gray-500" />
                  MD4 哈希值
                </label>
                <UBadge color="neutral" variant="subtle" size="md">128 位</UBadge>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="md4Hash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(md4Hash, 'MD4')"
                />
                <UButton
                  color="neutral"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(md4Hash, 'MD4')"
                >
                  复制
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="关于 MD4 算法" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import md4 from 'js-md4'
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const md4Hash = ref('')

definePageMeta({
  layout: 'default'
})

function generateHash() {
  if (!inputText.value) {
    md4Hash.value = ''
    return
  }
  try {
    md4Hash.value = md4(inputText.value)
  } catch (e) {
    console.error(e)
  }
}

function clearAll() {
  inputText.value = ''
  md4Hash.value = ''
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 MD4？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'MD4 是由 Ronald Rivest 在 1990 年设计的消息摘要算法。它生成 128 位（16 字节）的哈希值。MD4 影响了后来的 MD5、SHA-1 和 RIPEMD 等算法的设计。'
  },
  {
    slot: 'security',
    label: '安全性警告',
    icon: 'i-heroicons-exclamation-triangle',
    content: 'MD4 已经被证明非常不安全，极其容易遭受碰撞攻击。它不应该用于任何安全目的。本工具仅用于研究、兼容性测试或生成非安全用途的标识符。'
  }
]

useHead({
  title: 'MD4 哈希工具 - 在线 Hash 生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 MD4 哈希生成工具。注意：MD4 算法已不再安全，仅供学习和兼容性测试使用。' }
  ]
})
</script>
