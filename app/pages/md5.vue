<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      title="MD5 哈希生成器"
      description="快速将任意文本转换为 MD5 哈希值，完全本地运行，保护数据隐私"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

      <!-- 主内容卡片 -->
      <UCard class="mb-8 shadow-2xl">
        <!-- 输入区域 -->
        <div class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-base font-semibold text-gray-900 dark:text-white">
                输入原文
              </label>
              <UBadge v-if="inputText" color="primary" size="sm">
                {{ inputText.length }} 字符
              </UBadge>
            </div>
            <UTextarea
              v-model="inputText"
              placeholder="在此输入需要加密的文本内容...&#10;支持多行文本、特殊字符等任意内容"
              :rows="8"
              size="lg"
              autoresize
              :maxrows="15"
              @input="handleInput"
              class="font-mono"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              size="lg"
              icon="i-heroicons-sparkles"
              :disabled="!inputText"
              @click="generateMD5"
            >
              生成 MD5
            </UButton>
            <UButton
              size="lg"
              icon="i-heroicons-arrow-path"
              variant="soft"
              :disabled="!inputText && !md5Hash"
              @click="clearAll"
            >
              清空
            </UButton>
            <UButton
              v-if="md5Hash"
              color="success"
              size="lg"
              icon="i-heroicons-clipboard-document-check"
              variant="soft"
              @click="copyToClipboard"
            >
              {{ copied ? '✓ 已复制' : '复制' }}
            </UButton>
          </div>

          <!-- 结果展示区域 -->
          <div v-if="md5Hash" class="pt-6 border-t space-y-6">
            <!-- 成功提示 -->
            <UAlert
              icon="i-heroicons-check-circle"
              title="生成成功"
              description="MD5 哈希值已生成，点击下方输入框可快速复制"
              color="success"
              variant="soft"
            />

            <!-- MD5 哈希值显示 -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  MD5 哈希值
                  <UTooltip text="点击输入框复制哈希值">
                    <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 text-gray-400" />
                  </UTooltip>
                </label>
                <UChip :text="`${md5Hash.length} 位`" color="success" size="sm" />
              </div>
              <UInput
                v-model="md5Hash"
                readonly
                size="lg"
                class="font-mono cursor-pointer"
                @click="copyToClipboard"
              >
                <template #trailing>
                  <UTooltip :text="copied ? '已复制' : '点击复制'">
                    <UIcon 
                      :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" 
                      class="w-5 h-5"
                      :class="copied ? 'text-green-500' : 'text-gray-400'"
                    />
                  </UTooltip>
                </template>
              </UInput>
            </div>

            <!-- 统计卡片 -->
            <div class="grid grid-cols-3 gap-4">
              <UCard>
                <div class="text-center">
                  <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{{ inputText.length }}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">原文长度</div>
                </div>
              </UCard>
              <UCard>
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">32</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">哈希长度</div>
                </div>
              </UCard>
              <UCard>
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">128</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">算法位数</div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 快捷示例 -->
      <UCard class="mb-8">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-yellow-500" />
            <h3 class="text-lg font-semibold">快速示例</h3>
          </div>
        </template>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="example in examples"
            :key="example.label"
            variant="soft"
            size="sm"
            @click="useExample(example.text)"
          >
            {{ example.label }}
          </UButton>
        </div>
      </UCard>

      <!-- 说明信息 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-500" />
            <h3 class="text-lg font-semibold">关于 MD5 算法</h3>
          </div>
        </template>
        
        <UAccordion :items="accordionItems">
          <template #item="{ item }">
            <div class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ item.content }}
            </div>
          </template>
        </UAccordion>
      </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'

definePageMeta({
  layout: 'default'
})

const inputText = ref('')
const md5Hash = ref('')
const copied = ref(false)

// 快捷示例数据
const examples = [
  { label: 'Hello World', text: 'Hello World' },
  { label: '你好世界', text: '你好世界' },
  { label: '123456', text: '123456' },
  { label: 'admin@example.com', text: 'admin@example.com' },
  { label: 'JSON示例', text: '{"name":"John","age":30}' }
]

// 折叠面板数据
const accordionItems = [
  {
    slot: 'what',
    label: '什么是 MD5？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'MD5（Message-Digest Algorithm 5）是一种广泛使用的密码散列函数，可以产生出一个 128 位（16 字节）的散列值，通常用 32 位十六进制数字表示。MD5 由美国密码学家罗纳德·李维斯特设计，于 1992 年公开，用以取代 MD4 算法。'
  },
  {
    slot: 'usage',
    label: '主要用途',
    icon: 'i-heroicons-rocket-launch',
    content: 'MD5 常用于文件完整性校验、数字签名、密码存储（已不推荐）、唯一标识符生成等场景。在下载文件时，网站通常会提供 MD5 值，用户可以验证下载的文件是否完整且未被篡改。'
  },
  {
    slot: 'security',
    label: '安全性说明',
    icon: 'i-heroicons-shield-exclamation',
    content: 'MD5 已被证实存在碰撞漏洞（不同内容可能产生相同的哈希值），因此不再适合用于安全性要求高的场景，如密码加密、数字证书等。对于安全敏感的应用，建议使用 SHA-256 或更强的哈希算法。'
  },
  {
    slot: 'features',
    label: '技术特点',
    icon: 'i-heroicons-cpu-chip',
    content: 'MD5 算法具有不可逆性（无法从哈希值反推原文）、雪崩效应（输入的微小变化会导致输出的巨大变化）、固定长度（无论输入多长，输出始终是 128 位）等特点。运算速度快，适合处理大量数据。'
  }
]

// 生成 MD5
const generateMD5 = () => {
  if (!inputText.value) {
    return
  }
  md5Hash.value = CryptoJS.MD5(inputText.value).toString()
}

// 实时生成（可选）
const handleInput = () => {
  if (inputText.value) {
    generateMD5()
  } else {
    md5Hash.value = ''
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  md5Hash.value = ''
  copied.value = false
}

// 使用示例
const useExample = (text: string) => {
  inputText.value = text
  generateMD5()
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(md5Hash.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    alert('复制失败，请手动选择并复制')
  }
}

// SEO 元信息
useHead({
  title: 'MD5 哈希工具 - 在线 MD5 加密',
  meta: [
    { name: 'description', content: '免费的在线 MD5 哈希生成工具，快速将文本转换为 MD5 哈希值' }
  ]
})
</script>
