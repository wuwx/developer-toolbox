<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="AES 加密/解密"
      description="使用 AES-256-GCM 对称加密算法，安全加密和解密文本，完全本地运行"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-xl">
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
              <UIcon name="i-heroicons-key" class="w-4 h-4 text-emerald-500" />
              密钥 (Key)
            </label>
            <UButton
              color="neutral"
              variant="soft"
              size="xs"
              icon="i-heroicons-sparkles"
              @click="generateKey"
            >
              随机生成
            </UButton>
          </div>
          <div class="relative">
            <UInput
              v-model="secretKey"
              placeholder="请输入至少 16 位的安全密钥"
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
                {{ mode === 'encrypt' ? '明文' : '密文' }}
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
                {{ mode === 'encrypt' ? '加密结果' : '解密结果' }}
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

        <!-- 执行按钮 (移动端更显眼) -->
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
    <ToolInfo title="关于 AES 加密" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
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
  if (secretKey.value.length > 0 && secretKey.value.length < 16) {
    keyError.value = '密钥至少需要 16 个字符'
  } else {
    keyError.value = ''
  }
})

function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let key = ''
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  secretKey.value = key
}

async function process() {
  error.value = ''
  outputText.value = ''

  if (!secretKey.value || secretKey.value.length < 16) {
    keyError.value = '密钥至少需要 16 个字符'
    return
  }

  if (!inputText.value) {
    error.value = '请输入内容'
    return
  }

  try {
    if (mode.value === 'encrypt') {
      outputText.value = await encrypt(inputText.value, secretKey.value)
    } else {
      outputText.value = await decrypt(inputText.value, secretKey.value)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败'
  }
}

async function getKeyMaterial(password: string) {
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array) {
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function encrypt(text: string, password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  
  const keyMaterial = await getKeyMaterial(password)
  const key = await deriveKey(keyMaterial, salt)
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )
  
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  result.set(salt, 0)
  result.set(iv, salt.length)
  result.set(new Uint8Array(encrypted), salt.length + iv.length)
  
  return btoa(String.fromCharCode(...result))
}

async function decrypt(ciphertext: string, password: string): Promise<string> {
  try {
    const data = new Uint8Array(
      atob(ciphertext).split('').map(c => c.charCodeAt(0))
    )
    
    const salt = data.slice(0, 16)
    const iv = data.slice(16, 28)
    const encrypted = data.slice(28)
    
    const keyMaterial = await getKeyMaterial(password)
    const key = await deriveKey(keyMaterial, salt)
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )
    
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  } catch (e) {
    throw new Error('解密失败，请检查密钥是否正确')
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
    label: '什么是 AES-GCM？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'AES（高级加密标准）是目前最流行的对称加密算法。GCM（Galois/Counter Mode）是一种认证加密模式，它不仅提供数据保密性，还提供数据完整性验证。这意味着如果密文被篡改，解密过程会立即失败，而不会输出乱码。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-check',
    content: 'AES-256 被认为是目前最安全的加密标准之一，被广泛用于政府和金融领域。本工具使用 PBKDF2 进行密钥派生（10万次迭代），每次加密都会生成随机的盐（Salt）和初始化向量（IV），确保即使相同的明文和密钥，每次加密结果也完全不同。'
  },
  {
    slot: 'tips',
    label: '使用提示',
    icon: 'i-heroicons-light-bulb',
    content: '密钥长度建议至少 16 位，越长越安全。加密后的结果是 Base64 编码的字符串，其中已经包含了 Salt 和 IV，因此你只需要保存这个字符串和你的密钥即可。请妥善保管你的密钥，一旦丢失将无法解密数据。'
  }
]

// SEO
useHead({
  title: 'AES 加密解密工具 - AES-256-GCM 在线加密 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 AES-256-GCM 加密解密工具，安全可靠的对称加密，支持随机密钥生成。所有操作本地完成，保护数据隐私。' }
  ]
})
</script>
