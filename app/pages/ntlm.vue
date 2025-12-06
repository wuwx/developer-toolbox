<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="NTLM 哈希生成器"
      description="生成 Windows NTLM 哈希值，用于密码测试和协议研究"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-window" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-key" class="w-4 h-4" />
              输入密码
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
            </div>
          </div>
          <UInput
            v-model="inputText"
            placeholder="在此输入密码..."
            size="xl"
            class="w-full font-mono text-base block"
            :ui="{ 
              base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 py-3 pl-4'
            }"
            @input="generateHash"
          />
        </div>

        <div v-if="ntlmHash" class="space-y-6 animate-fade-in">
          <USeparator icon="i-heroicons-arrow-down" />

          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-blue-500" />
                  NTLM Hash
                </label>
                <UBadge color="neutral" variant="subtle" size="md">32 chars</UBadge>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="ntlmHash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(ntlmHash, 'NTLM Hash')"
                />
                <UButton
                  color="neutral"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(ntlmHash, 'NTLM Hash')"
                >
                  复制
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="关于 NTLM" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import md4 from 'js-md4'
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const ntlmHash = ref('')

definePageMeta({
  layout: 'default'
})

function generateHash() {
  if (!inputText.value) {
    ntlmHash.value = ''
    return
  }
  try {
    // NTLM = MD4(UTF-16LE(password))
    const buffer = new Uint8Array(inputText.value.length * 2)
    const view = new DataView(buffer.buffer)
    for (let i = 0; i < inputText.value.length; i++) {
      view.setUint16(i * 2, inputText.value.charCodeAt(i), true) // true for little-endian
    }
    ntlmHash.value = md4(buffer)
  } catch (e) {
    console.error(e)
  }
}

function clearAll() {
  inputText.value = ''
  ntlmHash.value = ''
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 NTLM？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'NTLM (New Technology LAN Manager) 是 Microsoft Windows 系统中使用的一套安全协议。NTLM 哈希是用户密码的单向哈希值，存储在 Windows 的 SAM 数据库或域控的 NTDS.dit 中。'
  },
  {
    slot: 'algo',
    label: '算法原理',
    icon: 'i-heroicons-calculator',
    content: 'NTLM 哈希的计算方法非常简单：首先将密码转换为 UTF-16LE 编码，然后对结果字节流计算 MD4 哈希值。由于 MD4 算法速度极快且已被攻破，NTLM 哈希被认为是不安全的。'
  }
]

useHead({
  title: 'NTLM 哈希生成器 - Windows 密码 Hash | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线生成 Windows NTLM 哈希值，用于渗透测试、安全研究和协议调试。' }
  ]
})
</script>
