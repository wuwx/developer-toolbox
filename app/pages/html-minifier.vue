<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="HTML 压缩器"
      description="压缩 HTML 代码，移除空格和注释"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
            <h3 class="font-semibold">原始 HTML</h3>
          </div>
        </template>

        <UTextarea
          v-model="inputHtml"
          placeholder="粘贴 HTML 代码..."
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
              v-if="outputHtml"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(outputHtml, 'HTML')"
            >
              复制
            </UButton>
          </div>
        </template>

        <UTextarea
          v-model="outputHtml"
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
        <UCheckbox v-model="options.collapseWhitespace" label="折叠空白" />
        <UCheckbox v-model="options.removeEmptyAttributes" label="移除空属性" />
        <UCheckbox v-model="options.minifyCSS" label="压缩内联 CSS" />
        <UCheckbox v-model="options.minifyJS" label="压缩内联 JS" />
        <UCheckbox v-model="options.removeOptionalTags" label="移除可选标签" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputHtml = ref('')
const outputHtml = ref('')

const options = reactive({
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: true,
  minifyCSS: true,
  minifyJS: false,
  removeOptionalTags: false
})

const originalSize = computed(() => {
  if (!inputHtml.value) return '0 B'
  return formatBytes(new Blob([inputHtml.value]).size)
})

const compressedSize = computed(() => {
  if (!outputHtml.value) return '0 B'
  return formatBytes(new Blob([outputHtml.value]).size)
})

const compressionRatio = computed(() => {
  if (!inputHtml.value || !outputHtml.value) return null
  const original = new Blob([inputHtml.value]).size
  const compressed = new Blob([outputHtml.value]).size
  const ratio = ((original - compressed) / original * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function minify() {
  let html = inputHtml.value

  if (!html.trim()) {
    outputHtml.value = ''
    return
  }

  try {
    // 移除注释
    if (options.removeComments) {
      html = html.replace(/<!--[\s\S]*?-->/g, '')
    }

    // 折叠空白
    if (options.collapseWhitespace) {
      html = html.replace(/\s+/g, ' ')
      html = html.replace(/>\s+</g, '><')
      html = html.trim()
    }

    // 移除空属性
    if (options.removeEmptyAttributes) {
      html = html.replace(/\s+[a-z-]+=""\s*/gi, ' ')
    }

    // 压缩内联 CSS
    if (options.minifyCSS) {
      html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
        const minified = css
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*([{}:;,])\s*/g, '$1')
          .trim()
        return match.replace(css, minified)
      })
      
      html = html.replace(/style="([^"]*)"/g, (match, style) => {
        const minified = style
          .replace(/\s*:\s*/g, ':')
          .replace(/\s*;\s*/g, ';')
          .replace(/;\s*$/, '')
        return `style="${minified}"`
      })
    }

    // 移除可选标签（简化版）
    if (options.removeOptionalTags) {
      html = html.replace(/<\/?(html|head|body)>/gi, '')
    }

    outputHtml.value = html
  } catch (e) {
    outputHtml.value = '压缩失败: ' + (e as Error).message
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch([inputHtml, options], () => {
  if (inputHtml.value) {
    minify()
  }
}, { deep: true })

useHead({
  title: 'HTML 压缩器 - HTML Minifier | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 HTML 压缩工具，移除空格、注释和冗余代码，减小文件大小。' }
  ]
})
</script>
