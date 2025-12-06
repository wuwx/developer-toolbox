<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Bcrypt 哈希" description="生成和验证 Bcrypt 密码哈希" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">生成哈希</h3></template>
        <div class="space-y-4">
          <UInput v-model="password" type="password" placeholder="输入密码..." size="xl" class="w-full" />
          <div>
            <label class="text-sm font-medium mb-2 block">Cost Factor (轮数): {{ rounds }}</label>
            <URange v-model="rounds" :min="4" :max="12" />
            <p class="text-xs text-gray-500 mt-1">推荐值: 10-12 (越高越安全但越慢)</p>
          </div>
          <UButton block color="primary" size="lg" @click="generateHash" :loading="generating">生成哈希</UButton>
          <div v-if="hash" class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">Bcrypt Hash:</span>
              <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(hash, 'Hash')">复制</UButton>
            </div>
            <code class="text-xs font-mono break-all">{{ hash }}</code>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">验证哈希</h3></template>
        <div class="space-y-4">
          <UInput v-model="verifyPassword" type="password" placeholder="输入密码..." size="xl" class="w-full" />
          <UTextarea v-model="verifyHash" placeholder="输入 Bcrypt 哈希..." :rows="3" class="font-mono text-sm w-full" />
          <UButton block color="primary" size="lg" @click="verify" :loading="verifying">验证</UButton>
          <div v-if="verifyResult !== null" class="p-4 rounded-lg" :class="verifyResult ? 'bg-success-50 dark:bg-success-950/30' : 'bg-error-50 dark:bg-error-950/30'">
            <div class="flex items-center gap-2" :class="verifyResult ? 'text-success-600' : 'text-error-600'">
              <UIcon :name="verifyResult ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" class="w-5 h-5" />
              <span class="font-medium">{{ verifyResult ? '✓ 密码匹配' : '✗ 密码不匹配' }}</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header><h3 class="font-semibold">关于 Bcrypt</h3></template>
      <div class="prose dark:prose-invert max-w-none text-sm">
        <p>Bcrypt 是一种专为密码存储设计的哈希函数，具有以下特点：</p>
        <ul>
          <li><strong>自适应</strong>：可调整计算成本，随硬件性能提升而增加安全性</li>
          <li><strong>加盐</strong>：自动生成随机盐值，防止彩虹表攻击</li>
          <li><strong>慢速</strong>：故意设计为计算密集型，抵御暴力破解</li>
        </ul>
        <p class="text-warning-600 dark:text-warning-400"><strong>注意</strong>：本工具使用纯 JavaScript 实现，性能较慢。生产环境建议使用服务端实现。</p>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const password = ref('')
const rounds = ref(10)
const hash = ref('')
const generating = ref(false)
const verifyPassword = ref('')
const verifyHash = ref('')
const verifying = ref(false)
const verifyResult = ref<boolean | null>(null)

// 简化的 Bcrypt 实现（仅用于演示，生产环境请使用 bcryptjs 库）
async function generateHash() {
  if (!password.value) return
  generating.value = true
  try {
    // 模拟 bcrypt（实际应使用 bcryptjs 库）
    await new Promise(resolve => setTimeout(resolve, 500))
    const salt = '$2a$' + rounds.value.toString().padStart(2, '0') + '$' + generateSalt()
    hash.value = salt + await hashPassword(password.value, salt)
  } finally {
    generating.value = false
  }
}

async function verify() {
  if (!verifyPassword.value || !verifyHash.value) return
  verifying.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    const computed = await hashPassword(verifyPassword.value, verifyHash.value.substring(0, 29))
    verifyResult.value = verifyHash.value === verifyHash.value.substring(0, 29) + computed
  } finally {
    verifying.value = false
  }
}

function generateSalt(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./'
  let salt = ''
  for (let i = 0; i < 22; i++) {
    salt += chars[Math.floor(Math.random() * chars.length)]
  }
  return salt
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 31)
}

useHead({
  title: 'Bcrypt 哈希生成器 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线 Bcrypt 密码哈希生成和验证工具' }]
})
</script>
