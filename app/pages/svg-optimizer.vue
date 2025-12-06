<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="SVG 优化器"
      description="压缩和优化 SVG 代码，减小文件大小"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-photo" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 输入区域 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
            <h3 class="font-semibold">原始 SVG</h3>
          </div>
        </template>

        <UTextarea
          v-model="inputSvg"
          placeholder="粘贴 SVG 代码..."
          :rows="15"
          class="font-mono text-sm w-full"
        />

        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-gray-500">原始大小: {{ originalSize }}</span>
        </div>
      </UCard>

      <!-- 输出区域 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
              <h3 class="font-semibold">优化后</h3>
            </div>
            <UButton
              v-if="outputSvg"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(outputSvg, 'SVG')"
            >
              复制
            </UButton>
          </div>
        </template>

        <UTextarea
          v-model="outputSvg"
          :rows="15"
          readonly
          class="font-mono text-sm w-full"
        />

        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">优化后大小: {{ optimizedSize }}</span>
            <UBadge v-if="compressionRatio" color="success" variant="subtle">
              减少 {{ compressionRatio }}%
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 优化选项 -->
    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
          <h3 class="font-semibold">优化选项</h3>
        </div>
      </template>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCheckbox v-model="options.removeComments" label="移除注释" />
        <UCheckbox v-model="options.removeMetadata" label="移除元数据" />
        <UCheckbox v-model="options.removeEmptyAttrs" label="移除空属性" />
        <UCheckbox v-model="options.removeWhitespace" label="移除多余空格" />
        <UCheckbox v-model="options.minifyStyles" label="压缩样式" />
        <UCheckbox v-model="options.removeHiddenElems" label="移除隐藏元素" />
      </div>

      <div class="mt-6">
        <UButton
          block
          color="primary"
          size="lg"
          icon="i-heroicons-sparkles"
          @click="optimize"
        >
          优化 SVG
        </UButton>
      </div>
    </UCard>

    <!-- 预览 -->
    <div v-if="outputSvg" class="mt-8 grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <h3 class="font-semibold">原始预览</h3>
        </template>
        <div class="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg" v-html="inputSvg"></div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold">优化后预览</h3>
        </template>
        <div class="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg" v-html="outputSvg"></div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputSvg = ref('')
const outputSvg = ref('')

const options = reactive({
  removeComments: true,
  removeMetadata: true,
  removeEmptyAttrs: true,
  removeWhitespace: true,
  minifyStyles: true,
  removeHiddenElems: true
})

const originalSize = computed(() => {
  if (!inputSvg.value) return '0 B'
  return formatBytes(new Blob([inputSvg.value]).size)
})

const optimizedSize = computed(() => {
  if (!outputSvg.value) return '0 B'
  return formatBytes(new Blob([outputSvg.value]).size)
})

const compressionRatio = computed(() => {
  if (!inputSvg.value || !outputSvg.value) return null
  const original = new Blob([inputSvg.value]).size
  const optimized = new Blob([outputSvg.value]).size
  const ratio = ((original - optimized) / original * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function optimize() {
  let svg = inputSvg.value

  if (!svg.trim()) {
    outputSvg.value = ''
    return
  }

  try {
    // 移除注释
    if (options.removeComments) {
      svg = svg.replace(/<!--[\s\S]*?-->/g, '')
    }

    // 移除元数据
    if (options.removeMetadata) {
      svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
      svg = svg.replace(/<title[\s\S]*?<\/title>/gi, '')
      svg = svg.replace(/<desc[\s\S]*?<\/desc>/gi, '')
    }

    // 移除空属性
    if (options.removeEmptyAttrs) {
      svg = svg.replace(/\s+[a-z-]+=""\s*/gi, ' ')
    }

    // 移除多余空格
    if (options.removeWhitespace) {
      svg = svg.replace(/\s+/g, ' ')
      svg = svg.replace(/>\s+</g, '><')
      svg = svg.trim()
    }

    // 压缩样式
    if (options.minifyStyles) {
      svg = svg.replace(/style="([^"]*)"/g, (match, style) => {
        const minified = style
          .replace(/\s*:\s*/g, ':')
          .replace(/\s*;\s*/g, ';')
          .replace(/;\s*$/, '')
        return `style="${minified}"`
      })
    }

    // 移除隐藏元素
    if (options.removeHiddenElems) {
      svg = svg.replace(/<[^>]*display\s*:\s*none[^>]*>[\s\S]*?<\/[^>]+>/gi, '')
      svg = svg.replace(/<[^>]*visibility\s*:\s*hidden[^>]*>[\s\S]*?<\/[^>]+>/gi, '')
    }

    outputSvg.value = svg
  } catch (e) {
    outputSvg.value = '优化失败: ' + (e as Error).message
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch(inputSvg, () => {
  if (inputSvg.value) {
    optimize()
  }
})

useHead({
  title: 'SVG 优化器 - SVG 压缩工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SVG 优化压缩工具，移除冗余代码，减小文件大小，提升加载速度。' }
  ]
})
</script>
