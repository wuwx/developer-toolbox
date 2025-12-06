<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="JWT Decoder"
      description="解析和查看 JSON Web Token"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-key" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 输入区域 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
            <h3 class="font-semibold">JWT Token</h3>
          </div>
        </template>

        <UTextarea
          v-model="jwtInput"
          placeholder="粘贴 JWT Token..."
          :rows="10"
          class="font-mono text-sm w-full"
        />

        <div v-if="error" class="mt-4 p-3 bg-error-50 dark:bg-error-950/30 rounded-lg">
          <div class="flex items-center gap-2 text-error-600 dark:text-error-400">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
            <span class="text-sm">{{ error }}</span>
          </div>
        </div>
      </UCard>

      <!-- 解析结果 -->
      <div class="space-y-6">
        <!-- Header -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">Header</h3>
              </div>
              <UButton
                v-if="decoded.header"
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(JSON.stringify(decoded.header, null, 2), 'Header')"
              >
                复制
              </UButton>
            </div>
          </template>

          <div v-if="decoded.header" class="p-4 bg-gray-900 rounded-lg">
            <pre class="text-xs text-gray-300 overflow-x-auto">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          </div>
          <div v-else class="text-center py-4 text-gray-400 text-sm">
            暂无数据
          </div>
        </UCard>

        <!-- Payload -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">Payload</h3>
              </div>
              <UButton
                v-if="decoded.payload"
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'Payload')"
              >
                复制
              </UButton>
            </div>
          </template>

          <div v-if="decoded.payload" class="space-y-4">
            <div class="p-4 bg-gray-900 rounded-lg">
              <pre class="text-xs text-gray-300 overflow-x-auto">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
            </div>

            <!-- 常见字段解释 -->
            <div v-if="payloadInfo.length > 0" class="space-y-2">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">字段说明：</div>
              <div
                v-for="info in payloadInfo"
                :key="info.key"
                class="flex gap-2 text-sm"
              >
                <span class="font-mono text-primary-600 font-medium">{{ info.key }}:</span>
                <span class="text-gray-600 dark:text-gray-400">{{ info.description }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-400 text-sm">
            暂无数据
          </div>
        </UCard>

        <!-- Signature -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="w-5 h-5" />
              <h3 class="font-semibold">Signature (签名)</h3>
            </div>
          </template>

          <div v-if="decoded.signature" class="p-4 bg-gray-900 rounded-lg">
            <code class="text-xs text-gray-300 break-all font-mono">{{ decoded.signature }}</code>
          </div>
          <div v-else class="text-center py-4 text-gray-400 text-sm">
            暂无数据
          </div>

          <div class="mt-4 p-3 bg-warning-50 dark:bg-warning-950/30 rounded-lg">
            <div class="flex items-start gap-2 text-warning-600 dark:text-warning-400 text-sm">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
              <span>注意：本工具仅解析 JWT，不验证签名。请勿在生产环境中依赖客户端解析。</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const jwtInput = ref('')
const error = ref('')

interface DecodedJWT {
  header: Record<string, any> | null
  payload: Record<string, any> | null
  signature: string | null
}

const decoded = ref<DecodedJWT>({
  header: null,
  payload: null,
  signature: null
})

const payloadInfo = computed(() => {
  if (!decoded.value.payload) return []

  const info: Array<{ key: string; description: string }> = []
  const payload = decoded.value.payload

  if (payload.iss) info.push({ key: 'iss', description: `签发者: ${payload.iss}` })
  if (payload.sub) info.push({ key: 'sub', description: `主题: ${payload.sub}` })
  if (payload.aud) info.push({ key: 'aud', description: `受众: ${payload.aud}` })
  if (payload.exp) {
    const date = new Date(payload.exp * 1000).toLocaleString('zh-CN')
    info.push({ key: 'exp', description: `过期时间: ${date}` })
  }
  if (payload.nbf) {
    const date = new Date(payload.nbf * 1000).toLocaleString('zh-CN')
    info.push({ key: 'nbf', description: `生效时间: ${date}` })
  }
  if (payload.iat) {
    const date = new Date(payload.iat * 1000).toLocaleString('zh-CN')
    info.push({ key: 'iat', description: `签发时间: ${date}` })
  }
  if (payload.jti) info.push({ key: 'jti', description: `JWT ID: ${payload.jti}` })

  return info
})

function decodeJWT() {
  error.value = ''
  decoded.value = { header: null, payload: null, signature: null }

  if (!jwtInput.value.trim()) {
    return
  }

  try {
    const parts = jwtInput.value.trim().split('.')

    if (parts.length !== 3) {
      throw new Error('JWT 格式错误，应包含三个部分（Header.Payload.Signature）')
    }

    // 解码 Header
    decoded.value.header = JSON.parse(base64UrlDecode(parts[0] ?? ''))

    // 解码 Payload
    decoded.value.payload = JSON.parse(base64UrlDecode(parts[1] ?? ''))

    // Signature（保持 base64）
    decoded.value.signature = parts[2] ?? null
  } catch (e) {
    error.value = '解析失败：' + (e as Error).message
    decoded.value = { header: null, payload: null, signature: null }
  }
}

function base64UrlDecode(str: string): string {
  // Base64 URL 解码
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  
  // 补齐 padding
  while (base64.length % 4) {
    base64 += '='
  }

  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch (e) {
    throw new Error('Base64 解码失败')
  }
}

watch(jwtInput, () => {
  decodeJWT()
})

useHead({
  title: 'JWT Decoder - JSON Web Token 解析工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 JWT 解析工具，快速解码 JSON Web Token，查看 Header、Payload 和 Signature。' }
  ]
})
</script>
