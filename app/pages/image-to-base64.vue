<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Image to Base64"
      description="将图片转换为 Base64 编码，支持直接粘贴图片"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-photo" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 上传区域 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5" />
            <h3 class="font-semibold">上传图片</h3>
          </div>
        </template>

        <div class="space-y-4">
          <!-- 拖拽上传区 -->
          <div
            class="relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors"
            :class="isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : 'border-gray-300 dark:border-gray-700 hover:border-primary-400'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="fileInput?.click()"
          >
            <UIcon name="i-heroicons-cloud-arrow-up" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p class="text-lg font-medium mb-2">拖拽图片到这里</p>
            <p class="text-sm text-gray-500">或点击选择文件</p>
            <p class="text-xs text-gray-400 mt-2">支持 JPG, PNG, GIF, WebP (最大 5MB)</p>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />

          <!-- 预览 -->
          <div v-if="previewUrl" class="relative">
            <img :src="previewUrl" alt="Preview" class="w-full rounded-xl shadow-lg" />
            <div class="mt-2 text-sm text-gray-500 text-center">
              {{ fileInfo }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- 结果区域 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
              <h3 class="font-semibold">Base64 编码</h3>
            </div>
            <UButton
              v-if="base64Result"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(base64Result, 'Base64')"
            >
              复制
            </UButton>
          </div>
        </template>

        <div v-if="base64Result" class="space-y-4">
          <!-- 格式选择 -->
          <div class="flex gap-2">
            <UButton
              v-for="format in formats"
              :key="format.value"
              :color="selectedFormat === format.value ? 'primary' : 'neutral'"
              :variant="selectedFormat === format.value ? 'soft' : 'ghost'"
              size="sm"
              @click="selectedFormat = format.value"
            >
              {{ format.label }}
            </UButton>
          </div>

          <!-- Base64 输出 -->
          <UTextarea
            :model-value="formattedBase64"
            :rows="15"
            readonly
            class="font-mono text-xs"
          />

          <!-- 统计信息 -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="text-gray-500 mb-1">原始大小</div>
              <div class="font-semibold">{{ originalSize }}</div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="text-gray-500 mb-1">Base64 大小</div>
              <div class="font-semibold">{{ base64Size }}</div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-400">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto mb-4" />
          <p>上传图片后显示 Base64 编码</p>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const isDragging = ref(false)
const previewUrl = ref('')
const base64Result = ref('')
const fileInfo = ref('')
const originalSize = ref('')
const base64Size = ref('')
const selectedFormat = ref('plain')

const fileInput = ref<HTMLInputElement | null>(null)

const formats = [
  { label: '纯文本', value: 'plain' },
  { label: 'Data URL', value: 'dataurl' },
  { label: 'CSS', value: 'css' },
  { label: 'HTML', value: 'html' }
]

const formattedBase64 = computed(() => {
  if (!base64Result.value) return ''

  switch (selectedFormat.value) {
    case 'plain':
      return base64Result.value.split(',')[1] || base64Result.value
    case 'dataurl':
      return base64Result.value
    case 'css':
      return `background-image: url(${base64Result.value});`
    case 'html':
      return `<img src="${base64Result.value}" alt="image" />`
    default:
      return base64Result.value
  }
})

function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

function processFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    alert('文件大小超过 5MB 限制')
    return
  }

  originalSize.value = formatFileSize(file.size)
  fileInfo.value = `${file.name} (${originalSize.value})`

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    previewUrl.value = result
    base64Result.value = result
    base64Size.value = formatFileSize(result.length * 0.75) // Base64 大约增加 33%
  }
  reader.readAsDataURL(file)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

useHead({
  title: 'Image to Base64 - 图片转 Base64 工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线图片转 Base64 编码工具，支持拖拽上传、粘贴图片，输出多种格式。' }
  ]
})
</script>
