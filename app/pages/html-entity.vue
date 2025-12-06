<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="HTML 实体编码/解码"
      description="将字符转换为 HTML 实体（如 &lt;），防止 XSS 攻击或在网页中显示特殊字符"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <div class="flex justify-center">
          <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <UButton
              :color="mode === 'encode' ? 'primary' : 'neutral'"
              :variant="mode === 'encode' ? 'solid' : 'ghost'"
              size="md"
              class="px-6"
              @click="mode = 'encode'"
            >
              编码 (Encode)
            </UButton>
            <UButton
              :color="mode === 'decode' ? 'primary' : 'neutral'"
              :variant="mode === 'decode' ? 'solid' : 'ghost'"
              size="md"
              class="px-6"
              @click="mode = 'decode'"
            >
              解码 (Decode)
            </UButton>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <!-- 输入 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">输入</label>
            <UTextarea
              v-model="input"
              :placeholder="mode === 'encode' ? '<div class=\'test\'>' : '&lt;div class=&quot;test&quot;&gt;'"
              :rows="12"
              autoresize
              :maxrows="20"
              class="font-mono text-sm w-full"
              :ui="{ base: 'p-4' }"
            />
          </div>

          <!-- 输出 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">输出</label>
              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(output, '结果')"
              >
                复制
              </UButton>
            </div>
            <UTextarea
              v-model="output"
              readonly
              :rows="12"
              autoresize
              :maxrows="20"
              class="font-mono text-sm w-full"
              :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4' }"
            />
          </div>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const mode = ref<'encode' | 'decode'>('encode')
const input = ref('')

const output = computed(() => {
  if (!input.value) return ''
  if (mode.value === 'encode') {
    return encodeHTML(input.value)
  } else {
    return decodeHTML(input.value)
  }
})

// 使用浏览器原生 API 进行转换
function encodeHTML(str: string) {
  const div = document.createElement('div')
  div.innerText = str
  return div.innerHTML
}

function decodeHTML(str: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'HTML 实体编码解码工具 - XSS 防护 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 HTML 实体编码和解码工具，快速转换特殊字符。' }
  ]
})
</script>
