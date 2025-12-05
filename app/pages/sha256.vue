<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">SHA256 哈希</h1>
      <p class="text-gray-600 dark:text-gray-400">
        生成文本的 SHA256 和 SHA512 哈希值，安全性更高
      </p>
    </div>

    <div class="space-y-6">
      <!-- 输入区域 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
              <h3 class="font-semibold">输入文本</h3>
            </div>
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
        </template>

        <UTextarea
          v-model="inputText"
          placeholder="在此输入要生成哈希的文本..."
          :rows="8"
          autoresize
          :maxrows="15"
          size="lg"
          class="font-mono"
          @input="generateHash"
        />
      </UCard>

      <!-- SHA256 结果 -->
      <UCard v-if="sha256Hash">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-blue-500" />
            <h3 class="font-semibold">SHA256</h3>
            <UBadge color="primary" variant="subtle" size="sm">256 位</UBadge>
          </div>
        </template>

        <div class="relative group">
          <div class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div class="font-mono text-sm break-all text-gray-900 dark:text-white leading-relaxed">
              {{ sha256Hash }}
            </div>
          </div>
          <UButton
            color="primary"
            variant="soft"
            icon="i-heroicons-clipboard-document"
            size="sm"
            class="absolute top-2 right-2"
            @click="copyToClipboard(sha256Hash, 'SHA256')"
          >
            复制
          </UButton>
        </div>
      </UCard>

      <!-- SHA512 结果 -->
      <UCard v-if="sha512Hash">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-purple-500" />
            <h3 class="font-semibold">SHA512</h3>
            <UBadge color="primary" variant="subtle" size="sm">512 位</UBadge>
          </div>
        </template>

        <div class="relative group">
          <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <div class="font-mono text-sm break-all text-gray-900 dark:text-white leading-relaxed">
              {{ sha512Hash }}
            </div>
          </div>
          <UButton
            color="primary"
            variant="soft"
            icon="i-heroicons-clipboard-document"
            size="sm"
            class="absolute top-2 right-2"
            @click="copyToClipboard(sha512Hash, 'SHA512')"
          >
            复制
          </UButton>
        </div>
      </UCard>

      <!-- 使用说明 -->
      <UCard v-if="!inputText">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
            <h3 class="font-semibold">关于 SHA256/SHA512</h3>
          </div>
        </template>

        <div class="prose prose-sm dark:prose-invert max-w-none">
          <ul>
            <li><strong>SHA256</strong>：生成 256 位（64 字符）哈希值，广泛用于密码存储、数字签名等</li>
            <li><strong>SHA512</strong>：生成 512 位（128 字符）哈希值，安全性更高</li>
            <li>这些算法是单向的，无法从哈希值反推原文</li>
            <li>相同输入总是产生相同输出，微小变化会导致完全不同的哈希值</li>
            <li>适用于文件校验、密码存储、数据完整性验证等场景</li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const sha256Hash = ref('')
const sha512Hash = ref('')

async function generateHash() {
  if (!inputText.value) {
    sha256Hash.value = ''
    sha512Hash.value = ''
    return
  }

  const encoder = new TextEncoder()
  const data = encoder.encode(inputText.value)

  // SHA-256
  const sha256Buffer = await crypto.subtle.digest('SHA-256', data)
  sha256Hash.value = Array.from(new Uint8Array(sha256Buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // SHA-512
  const sha512Buffer = await crypto.subtle.digest('SHA-512', data)
  sha512Hash.value = Array.from(new Uint8Array(sha512Buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

function clearAll() {
  inputText.value = ''
  sha256Hash.value = ''
  sha512Hash.value = ''
}

// SEO
useHead({
  title: 'SHA256 SHA512 哈希工具 - 在线 Hash 生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SHA256 和 SHA512 哈希生成工具，用于密码存储、文件校验、数据完整性验证。安全可靠的哈希计算器。' }
  ]
})
</script>
