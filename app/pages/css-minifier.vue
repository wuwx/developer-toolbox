<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="CSS 压缩器"
      description="压缩 CSS 代码，移除空格和注释"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-paint-brush" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
            <h3 class="font-semibold">原始 CSS</h3>
          </div>
        </template>

        <UTextarea
          v-model="inputCss"
          placeholder="粘贴 CSS 代码..."
          :rows="20"
          class="font-mono text-sm"
        />

        <div class="mt-4 text-sm text-gray-500">
          大小: {{ originalSize }}
        </div>
      </UCard>

      <!-- 输出 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
              <h3 class="font-semibold">压缩后</h3>
            </div>
            <UButton
              v-if="outputCss"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(outputCss, 'CSS')"
            >
              复制
            </UButton>
          </div>
        </template>

        <UTextarea
          v-model="outputCss"
          :rows="20"
          readonly
          class="font-mono text-sm"
        />

        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-gray-500">大小: {{ compressedSize }}</span>
          <UBadge v-if="compressionRatio" color="success" variant="subtle">
            减少 {{ compressionRatio }}%
          </UBadge>
        </div>
      </UCard>
    </div>

    <!-- 选项 -->
    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
          <h3 class="font-semibold">压缩选项</h3>
        </div>
      </template>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCheckbox v-model="options.removeComments" label="移除注释" />
        <UCheckbox v-model="options.removeWhitespace" label="移除空格" />
        <UCheckbox v-model="options.removeLastSemicolon" label="移除末尾分号" />
        <UCheckbox v-model="options.shortenColors" label="缩短颜色值" />
        <UCheckbox v-model="options.shortenZeros" label="简化零值" />
        <UCheckbox v-model="options.removeEmptyRules" label="移除空规则" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputCss = ref('')
const outputCss = ref('')

const options = reactive({
  removeComments: true,
  removeWhitespace: true,
  removeLastSemicolon: true,
  shortenColors: true,
  shortenZeros: true,
  removeEmptyRules: true
})

const originalSize = computed(() => {
  if (!inputCss.value) return '0 B'
  return formatBytes(new Blob([inputCss.value]).size)
})

const compressedSize = computed(() => {
  if (!outputCss.value) return '0 B'
  return formatBytes(new Blob([outputCss.value]).size)
})

const compressionRatio = computed(() => {
  if (!inputCss.value || !outputCss.value) return null
  const original = new Blob([inputCss.value]).size
  const compressed = new Blob([outputCss.value]).size
  const ratio = ((original - compressed) / original * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function minify() {
  let css = inputCss.value

  if (!css.trim()) {
    outputCss.value = ''
    return
  }

  try {
    // 移除注释
    if (options.removeComments) {
      css = css.replace(/\/\*[\s\S]*?\*\//g, '')
    }

    // 移除空格
    if (options.removeWhitespace) {
      css = css.replace(/\s+/g, ' ')
      css = css.replace(/\s*([{}:;,])\s*/g, '$1')
      css = css.trim()
    }

    // 移除末尾分号
    if (options.removeLastSemicolon) {
      css = css.replace(/;}/g, '}')
    }

    // 缩短颜色值
    if (options.shortenColors) {
      css = css.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3')
    }

    // 简化零值
    if (options.shortenZeros) {
      css = css.replace(/\b0+(\.\d+)/g, '$1')
      css = css.replace(/(\d)\.0+\b/g, '$1')
      css = css.replace(/\b0+(px|em|rem|%|vh|vw|pt|cm|mm|in)/g, '0')
    }

    // 移除空规则
    if (options.removeEmptyRules) {
      css = css.replace(/[^{}]+\{\s*\}/g, '')
    }

    outputCss.value = css
  } catch (e) {
    outputCss.value = '压缩失败: ' + (e as Error).message
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch([inputCss, options], () => {
  if (inputCss.value) {
    minify()
  }
}, { deep: true })

useHead({
  title: 'CSS 压缩器 - CSS Minifier | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS 压缩工具，移除空格、注释和冗余代码，减小文件大小。' }
  ]
})
</script>
