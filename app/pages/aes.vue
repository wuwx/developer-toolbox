<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">AES 加密/解密</h1>
      <p class="text-gray-600 dark:text-gray-400">
        使用 AES-256-GCM 对称加密算法，安全加密和解密文本
      </p>
    </div>

    <!-- 模式切换 -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        :color="mode === 'encrypt' ? 'primary' : 'neutral'"
        :variant="mode === 'encrypt' ? 'solid' : 'soft'"
        icon="i-heroicons-lock-closed"
        @click="mode = 'encrypt'"
      >
        加密
      </UButton>
      <UButton
        :color="mode === 'decrypt' ? 'primary' : 'neutral'"
        :variant="mode === 'decrypt' ? 'solid' : 'soft'"
        icon="i-heroicons-lock-open"
        @click="mode = 'decrypt'"
      >
        解密
      </UButton>
    </div>

    <div class="space-y-6">
      <!-- 密钥输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-key" class="w-5 h-5" />
            <h3 class="font-semibold">密钥 (Key)</h3>
          </div>
        </template>

        <div class="space-y-4">
          <UInput
            v-model="secretKey"
            placeholder="输入密钥（至少 16 个字符）"
            size="lg"
            class="font-mono"
            :type="showKey ? 'text' : 'password'"
          />
          <div class="flex items-center gap-2">
            <UCheckbox v-model="showKey" label="显示密钥" size="sm" />
            <UButton
              color="neutral"
              variant="soft"
              size="xs"
              icon="i-heroicons-sparkles"
              @click="generateKey"
            >
              生成随机密钥
            </UButton>
          </div>
          <div v-if="keyError" class="text-sm text-red-600 dark:text-red-400">
            {{ keyError }}
          </div>
        </div>
      </UCard>

      <!-- 输入文本 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">{{ mode === 'encrypt' ? '明文' : '密文' }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="inputText" color="neutral" variant="subtle" size="sm">
                {{ inputText.length }} 字符
              </UBadge>
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
        </template>

        <UTextarea
          v-model="inputText"
          :placeholder="mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的密文...'"
          :rows="8"
          autoresize
          :maxrows="15"
          size="lg"
          class="font-mono text-sm"
        />
      </UCard>

      <!-- 操作按钮 -->
      <div class="flex justify-center">
        <UButton
          color="primary"
          size="lg"
          :icon="mode === 'encrypt' ? 'i-heroicons-lock-closed' : 'i-heroicons-lock-open'"
          :disabled="!inputText || !secretKey"
          @click="process"
        >
          {{ mode === 'encrypt' ? '加密' : '解密' }}
        </UButton>
      </div>

      <!-- 结果 -->
      <UCard v-if="outputText || error">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-check" class="w-5 h-5" />
              <h3 class="font-semibold">{{ mode === 'encrypt' ? '密文' : '明文' }}</h3>
            </div>
            <UButton
              v-if="outputText"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(outputText, mode === 'encrypt' ? '密文' : '明文')"
            >
              复制
            </UButton>
          </div>
        </template>

        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 mt-0.5 shrink-0" />
            <span>{{ error }}</span>
          </div>
        </div>

        <div v-else class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div class="font-mono text-sm break-all text-gray-900 dark:text-white">
            {{ outputText }}
          </div>
        </div>
      </UCard>

      <!-- 说明 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
            <h3 class="font-semibold">使用说明</h3>
          </div>
        </template>

        <div class="prose prose-sm dark:prose-invert max-w-none">
          <ul>
            <li>使用 <strong>AES-256-GCM</strong> 加密算法，安全可靠</li>
            <li>密钥至少需要 <strong>16 个字符</strong>，建议使用随机生成的密钥</li>
            <li>加密后的密文包含 IV（初始化向量），可以直接用于解密</li>
            <li>解密时需要使用<strong>相同的密钥</strong>，否则会失败</li>
            <li>所有操作在浏览器本地完成，数据不会上传到服务器</li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const secretKey = ref('')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const showKey = ref(false)
const keyError = ref('')

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
    error.value = '密钥至少需要 16 个字符'
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

// SEO
useHead({
  title: 'AES 加密解密工具 - AES-256-GCM 在线加密 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 AES-256-GCM 加密解密工具，安全可靠的对称加密，支持随机密钥生成。所有操作本地完成，保护数据隐私。' }
  ]
})
</script>
