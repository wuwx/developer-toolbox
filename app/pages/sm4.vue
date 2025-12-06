<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="SM4 国密加密/解密"
      description="使用 SM4 国密分组密码算法，安全加密和解密文本，符合中国国家标准"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主内容卡片 -->
    <ToolCard>
      <!-- 模式切换 -->
      <div class="mb-8 flex justify-center">
        <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <UButton
            :color="mode === 'encrypt' ? 'primary' : 'neutral'"
            :variant="mode === 'encrypt' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-lock-closed"
            class="px-6"
            @click="mode = 'encrypt'"
          >
            加密
          </UButton>
          <UButton
            :color="mode === 'decrypt' ? 'primary' : 'neutral'"
            :variant="mode === 'decrypt' ? 'solid' : 'ghost'"
            size="md"
            icon="i-heroicons-lock-open"
            class="px-6"
            @click="mode = 'decrypt'"
          >
            解密
          </UButton>
        </div>
      </div>

      <div class="space-y-8">
        <!-- 密钥设置 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
          <div class="flex items-center justify-between mb-4">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-key" class="w-4 h-4 text-red-500" />
              密钥 (Hex Key)
            </label>
            <UButton
              color="neutral"
              variant="soft"
              size="xs"
              icon="i-heroicons-sparkles"
              @click="generateKey"
            >
              生成 128 位密钥
            </UButton>
          </div>
          <div class="relative">
            <UInput
              v-model="secretKey"
              placeholder="请输入 32 位十六进制字符串 (128位密钥)"
              size="xl"
              class="font-mono w-full"
              :type="showKey ? 'text' : 'password'"
              :ui="{ base: 'pl-4 pr-12 py-3' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showKey ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                  :padded="false"
                  @click="showKey = !showKey"
                />
              </template>
            </UInput>
            <div v-if="keyError" class="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1">
              <UIcon name="i-heroicons-exclamation-circle" class="w-3 h-3" />
              {{ keyError }}
            </div>
          </div>
        </div>

        <!-- 输入输出区域 -->
        <div class="grid gap-8 lg:grid-cols-2">
          <!-- 输入区域 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                {{ mode === 'encrypt' ? '明文' : '密文 (Hex)' }}
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
              :placeholder="mode === 'encrypt' ? '在此输入需要加密的文本内容...' : '在此输入需要解密的密文内容...'"
              :rows="12"
              autoresize
              :maxrows="20"
              size="xl"
              class="font-mono text-sm block w-full"
              :ui="{ 
                base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[300px] p-4 w-full' 
              }"
            />
          </div>

          <!-- 输出区域 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <UIcon :name="mode === 'encrypt' ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'" class="w-4 h-4 text-primary-500" />
                {{ mode === 'encrypt' ? '加密结果 (Hex)' : '解密结果' }}
              </label>
              <div class="flex items-center gap-2">
                <UButton
                  v-if="outputText"
                  color="neutral"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(outputText, '结果')"
                >
                  复制结果
                </UButton>
              </div>
            </div>
            
            <div class="relative h-full">
              <UTextarea
                v-model="outputText"
                readonly
                :placeholder="error || '等待处理...'"
                :rows="12"
                size="xl"
                autoresize
                :maxrows="20"
                class="font-mono text-sm block w-full h-full"
                :ui="{ 
                  base: `bg-gray-50 dark:bg-gray-800/50 min-h-[300px] p-4 w-full ${error ? 'text-red-500 dark:text-red-400' : ''}`
                }"
                @click="() => outputText && copyToClipboard(outputText, '结果')"
              />
            </div>
          </div>
        </div>

        <!-- 执行按钮 -->
        <div class="flex justify-center pt-4">
          <UButton
            size="xl"
            color="primary"
            class="w-full sm:w-auto min-w-[200px] justify-center font-bold shadow-lg shadow-primary-500/20 transition-all hover:scale-105"
            :icon="mode === 'encrypt' ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'"
            :disabled="!inputText || !secretKey || !!keyError"
            @click="process"
          >
            执行{{ mode === 'encrypt' ? '加密' : '解密' }}
          </UButton>
        </div>
      </div>
    </ToolCard>

    <!-- 说明信息 -->
    <ToolInfo title="关于 SM4 加密" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
// @ts-ignore
import { sm4 } from 'sm-crypto'
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const secretKey = ref('')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const showKey = ref(false)
const keyError = ref('')

definePageMeta({
  layout: 'default'
})

watch(secretKey, () => {
  // SM4 密钥必须是 128 位 (16 字节)，即 32 个 hex 字符
  const hexRegex = /^[0-9a-fA-F]{32}$/
  if (secretKey.value && !hexRegex.test(secretKey.value)) {
    keyError.value = '密钥必须是 32 位十六进制字符串'
  } else {
    keyError.value = ''
  }
})

function generateKey() {
  const chars = '0123456789abcdef'
  let key = ''
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  secretKey.value = key
}

function process() {
  error.value = ''
  outputText.value = ''

  if (!secretKey.value || !!keyError.value) {
    keyError.value = '请输入有效的密钥'
    return
  }

  if (!inputText.value) {
    error.value = '请输入内容'
    return
  }

  try {
    if (mode.value === 'encrypt') {
      // 默认输出 hex
      outputText.value = sm4.encrypt(inputText.value, secretKey.value)
    } else {
      outputText.value = sm4.decrypt(inputText.value, secretKey.value)
    }
  } catch (e) {
    error.value = '操作失败，请检查密钥和输入格式'
    console.error(e)
  }
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

watch(mode, () => {
  clearAll()
})

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 SM4？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'SM4 是中国国家密码管理局发布的无线局域网产品使用的分组密码算法（GB/T 32907-2016）。它是一种对称加密算法，分组长度为 128 位，密钥长度也为 128 位。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-check',
    content: 'SM4 在安全性上与 AES 相当，是我国商用密码体系中的核心对称加密算法。它被广泛应用于金融、无线通信等领域，用于保护数据的机密性。'
  },
  {
    slot: 'tips',
    label: '使用提示',
    icon: 'i-heroicons-light-bulb',
    content: 'SM4 密钥必须是 32 个十六进制字符（128 位）。加密输出默认为十六进制字符串。解密时请输入之前加密得到的十六进制字符串。'
  }
]

// SEO
useHead({
  title: 'SM4 国密加密解密工具 - 在线 SM4 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SM4 国密对称加密解密工具，支持自定义密钥，符合中国国家标准，安全可靠。' }
  ]
})
</script>
