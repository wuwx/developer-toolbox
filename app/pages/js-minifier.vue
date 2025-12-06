<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="JavaScript 压缩器"
      description="压缩 JavaScript 代码，移除空格和注释"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <h3 class="font-semibold">原始 JavaScript</h3>
        </template>
        <UTextarea v-model="inputJs" placeholder="粘贴 JavaScript 代码..." :rows="20" class="font-mono text-sm" />
        <div class="mt-4 text-sm text-gray-500">大小: {{ originalSize }}</div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">压缩后</h3>
            <UButton v-if="outputJs" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputJs, 'JavaScript')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="outputJs" :rows="20" readonly class="font-mono text-sm" />
        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-gray-500">大小: {{ compressedSize }}</span>
          <UBadge v-if="compressionRatio" color="success" variant="subtle">减少 {{ compressionRatio }}%</UBadge>
        </div>
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header>
        <h3 class="font-semibold">压缩选项</h3>
      </template>
      <div class="grid sm:grid-cols-3 gap-4">
        <UCheckbox v-model="options.removeComments" label="移除注释" />
        <UCheckbox v-model="options.removeWhitespace" label="移除空格" />
        <UCheckbox v-model="options.removeConsole" label="移除 console" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const inputJs = ref('')
const outputJs = ref('')
const options = reactive({ removeComments: true, removeWhitespace: true, removeConsole: false })

const originalSize = computed(() => !inputJs.value ? '0 B' : formatBytes(new Blob([inputJs.value]).size))
const compressedSize = computed(() => !outputJs.value ? '0 B' : formatBytes(new Blob([outputJs.value]).size))
const compressionRatio = computed(() => {
  if (!inputJs.value || !outputJs.value) return null
  const ratio = ((new Blob([inputJs.value]).size - new Blob([outputJs.value]).size) / new Blob([inputJs.value]).size * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function minify() {
  let js = inputJs.value
  if (!js.trim()) { outputJs.value = ''; return }
  try {
    if (options.removeComments) {
      js = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
    }
    if (options.removeWhitespace) {
      js = js.replace(/\s+/g, ' ').trim()
    }
    if (options.removeConsole) {
      js = js.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '')
    }
    outputJs.value = js
  } catch (e) {
    outputJs.value = '压缩失败: ' + (e as Error).message
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch([inputJs, options], () => { if (inputJs.value) minify() }, { deep: true })

useHead({
  title: 'JavaScript 压缩器 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线 JavaScript 压缩工具' }]
})
</script>
