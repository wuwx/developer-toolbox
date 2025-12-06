<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Nano ID 生成器" description="生成短小、安全、URL 友好的唯一 ID" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-finger-print" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">配置</h3></template>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">长度: {{ size }}</label>
            <URange v-model="size" :min="8" :max="64" />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">数量: {{ count }}</label>
            <URange v-model="count" :min="1" :max="100" />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">字符集</label>
            <USelect v-model="alphabet" :options="alphabets" size="lg" />
          </div>
          <UButton block color="primary" size="lg" icon="i-heroicons-arrow-path" @click="generate">生成</UButton>
        </div>
      </UCard>

      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">生成结果 ({{ ids.length }})</h3>
              <UButton v-if="ids.length" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(ids.join('\\n'), 'Nano IDs')">全部复制</UButton>
            </div>
          </template>
          <div v-if="ids.length" class="space-y-2 max-h-[500px] overflow-y-auto">
            <div v-for="(id, i) in ids" :key="i" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
              <code class="flex-1 font-mono text-sm break-all">{{ id }}</code>
              <UButton color="primary" variant="ghost" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(id, 'ID')" class="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-400">
            <UIcon name="i-heroicons-finger-print" class="w-16 h-16 mx-auto mb-4" />
            <p>点击生成按钮创建 Nano ID</p>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const size = ref(21)
const count = ref(10)
const alphabet = ref('default')
const ids = ref<string[]>([])

const alphabets = [
  { label: '默认 (A-Za-z0-9_-)', value: 'default' },
  { label: '数字 (0-9)', value: 'numbers' },
  { label: '小写字母 (a-z)', value: 'lowercase' },
  { label: '大写字母 (A-Z)', value: 'uppercase' },
  { label: '十六进制 (0-9a-f)', value: 'hex' }
]

const charSets: Record<string, string> = {
  default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-',
  numbers: '0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  hex: '0123456789abcdef'
}

function generate() {
  const charset = charSets[alphabet.value] || charSets.default
  ids.value = Array.from({ length: count.value }, () => {
    let id = ''
    const bytes = new Uint8Array(size.value)
    crypto.getRandomValues(bytes)
    for (let i = 0; i < size.value; i++) {
      id += charset[bytes[i]! % charset.length]
    }
    return id
  })
}

onMounted(() => generate())

useHead({
  title: 'Nano ID 生成器 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线 Nano ID 生成工具，短小安全的唯一标识符' }]
})
</script>
