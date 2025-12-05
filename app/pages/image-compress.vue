<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">图片压缩</h1>
      <p class="text-gray-600 dark:text-gray-400">
        纯前端图片压缩，支持调整质量和尺寸，保护隐私不上传
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 左侧：上传和配置 -->
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-photo" class="w-5 h-5" />
              <h3 class="font-semibold">选择图片</h3>
            </div>
          </template>

          <div
            class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
            @click="triggerFileInput"
            @drop.prevent="handleDrop"
            @dragover.prevent
          >
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              accept="image/jpeg,image/png,image/webp"
              @change="handleFileChange"
            />
            <UIcon name="i-heroicons-arrow-up-tray" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div class="text-sm font-medium text-gray-900 dark:text-white">点击或拖拽上传</div>
            <div class="text-xs text-gray-500 mt-1">支持 JPG, PNG, WebP</div>
          </div>
        </UCard>

        <UCard v-if="originalImage">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">压缩设置</h3>
            </div>
          </template>

          <div class="space-y-6">
            <!-- 质量 -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium">质量 ({{ Math.round(quality * 100) }}%)</label>
              </div>
              <URange v-model="quality" :min="0.1" :max="1" :step="0.05" />
            </div>

            <!-- 尺寸缩放 -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium">尺寸缩放 ({{ Math.round(scale * 100) }}%)</label>
              </div>
              <URange v-model="scale" :min="0.1" :max="1" :step="0.1" />
            </div>

            <!-- 格式 -->
            <div>
              <label class="text-sm font-medium mb-2 block">输出格式</label>
              <div class="flex gap-2">
                <UButton
                  v-for="f in formats"
                  :key="f"
                  :color="outputFormat === f ? 'primary' : 'neutral'"
                  :variant="outputFormat === f ? 'solid' : 'soft'"
                  size="sm"
                  @click="outputFormat = f"
                >
                  {{ f.toUpperCase().replace('IMAGE/', '') }}
                </UButton>
              </div>
            </div>

            <UButton block color="primary" size="lg" @click="compress">
              重新压缩
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- 右侧：预览和结果 -->
      <div class="lg:col-span-2 space-y-6">
        <div v-if="originalImage" class="grid sm:grid-cols-2 gap-6">
          <!-- 原始 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-semibold">原始图片</h3>
                <UBadge color="neutral" variant="subtle">{{ formatSize(originalSize) }}</UBadge>
              </div>
            </template>
            <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
              <img :src="originalPreview" class="max-w-full max-h-full object-contain" />
            </div>
          </UCard>

          <!-- 压缩后 -->
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-semibold">压缩后</h3>
                <UBadge :color="compressionRatio > 0 ? 'success' : 'neutral'" variant="subtle">
                  {{ formatSize(compressedSize) }}
                  <span v-if="compressionRatio > 0" class="ml-1">(-{{ compressionRatio }}%)</span>
                </UBadge>
              </div>
            </template>
            <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center relative">
              <div v-if="isCompressing" class="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin" />
              </div>
              <img v-if="compressedPreview" :src="compressedPreview" class="max-w-full max-h-full object-contain" />
            </div>
            <div class="mt-4 flex justify-end">
              <UButton
                v-if="compressedPreview"
                color="primary"
                icon="i-heroicons-arrow-down-tray"
                @click="download"
              >
                下载
              </UButton>
            </div>
          </UCard>
        </div>

        <div v-else class="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          请先上传图片
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)
const originalImage = ref<HTMLImageElement | null>(null)
const originalPreview = ref('')
const originalSize = ref(0)
const compressedPreview = ref('')
const compressedSize = ref(0)
const isCompressing = ref(false)

const quality = ref(0.8)
const scale = ref(1)
const outputFormat = ref('image/jpeg')

const formats = ['image/jpeg', 'image/png', 'image/webp']

const compressionRatio = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

function processFile(file: File) {
  if (!file.type.startsWith('image/')) return
  
  originalSize.value = file.size
  outputFormat.value = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  
  const reader = new FileReader()
  reader.onload = (e) => {
    originalPreview.value = e.target?.result as string
    const img = new Image()
    img.onload = () => {
      originalImage.value = img
      compress()
    }
    img.src = originalPreview.value
  }
  reader.readAsDataURL(file)
}

function compress() {
  if (!originalImage.value) return
  
  isCompressing.value = true
  
  // 使用 requestAnimationFrame 避免阻塞 UI
  requestAnimationFrame(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    const width = originalImage.value!.width * scale.value
    const height = originalImage.value!.height * scale.value
    
    canvas.width = width
    canvas.height = height
    
    // 更好的图片质量
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    ctx.drawImage(originalImage.value!, 0, 0, width, height)
    
    canvas.toBlob((blob) => {
      if (blob) {
        compressedSize.value = blob.size
        compressedPreview.value = URL.createObjectURL(blob)
      }
      isCompressing.value = false
    }, outputFormat.value, quality.value)
  })
}

function download() {
  if (!compressedPreview.value) return
  
  const link = document.createElement('a')
  link.href = compressedPreview.value
  const ext = outputFormat.value.split('/')[1]
  link.download = `compressed.${ext}`
  link.click()
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 监听配置变化自动压缩
watch([quality, scale, outputFormat], () => {
  if (originalImage.value) {
    // 防抖
    const timer = setTimeout(() => {
      compress()
    }, 100)
  }
})

// SEO
useHead({
  title: '图片压缩工具 - 在线图片压缩 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线图片压缩工具，纯前端处理，保护隐私。支持 JPG, PNG, WebP 格式，可调整压缩质量和尺寸。' }
  ]
})
</script>
