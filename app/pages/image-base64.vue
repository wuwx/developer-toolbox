<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="图片转 Base64"
      description="将图片转换为 Base64 字符串，支持拖拽上传，本地处理不上传服务器"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-cyan-400 mb-6 shadow-xl">
          <UIcon name="i-heroicons-photo" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <!-- 上传区域 -->
      <div 
        class="relative mb-8 group cursor-pointer"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerUpload"
      >
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="image/*" 
          @change="handleFileSelect"
        />
        
        <div 
          class="border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200"
          :class="[
            isDragging 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 scale-[1.02]' 
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          ]"
        >
          <div v-if="!previewUrl" class="space-y-4">
            <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 text-gray-400 group-hover:text-primary-500" />
            </div>
            <div>
              <p class="text-lg font-medium text-gray-900 dark:text-white">
                点击或拖拽图片到此处
              </p>
              <p class="text-sm text-gray-500 mt-1">
                支持 PNG, JPG, GIF, WEBP, SVG 等格式
              </p>
            </div>
          </div>

          <!-- 图片预览 -->
          <div v-else class="relative inline-block">
            <img 
              :src="previewUrl" 
              class="max-h-64 max-w-full rounded-lg shadow-lg mx-auto object-contain"
              alt="Preview" 
            />
            <div class="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p class="text-white font-medium flex items-center gap-2">
                <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
                更换图片
              </p>
            </div>
            <UButton
              v-if="previewUrl"
              color="error"
              variant="solid"
              size="xs"
              icon="i-heroicons-x-mark"
              class="absolute -top-2 -right-2 rounded-full shadow-md"
              @click.stop="clearFile"
            />
          </div>
        </div>
      </div>

      <!-- 结果输出区 -->
      <div v-if="base64Result" class="space-y-6 animate-fade-in">
        <!-- 图片信息 -->
        <div class="grid grid-cols-3 gap-4">
          <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center border border-gray-200 dark:border-gray-700">
            <div class="text-xs text-gray-500 mb-1">文件名称</div>
            <div class="font-medium truncate px-2" :title="fileInfo.name">{{ fileInfo.name }}</div>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center border border-gray-200 dark:border-gray-700">
            <div class="text-xs text-gray-500 mb-1">文件大小</div>
            <div class="font-mono font-medium text-blue-600">{{ fileInfo.size }}</div>
          </div>
          <div class="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center border border-gray-200 dark:border-gray-700">
            <div class="text-xs text-gray-500 mb-1">图片尺寸</div>
            <div class="font-mono font-medium text-purple-600">{{ fileInfo.dimensions }}</div>
          </div>
        </div>

        <USeparator class="my-6" />

        <!-- Base64 字符串 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-code-bracket" class="w-4 h-4" />
              Base64 字符串
            </label>
            <div class="flex gap-2">
              <UButton
                size="xs"
                :color="copyFormat === 'base64' ? 'primary' : 'neutral'"
                :variant="copyFormat === 'base64' ? 'solid' : 'soft'"
                @click="copyFormat = 'base64'"
              >
                纯文本
              </UButton>
              <UButton
                size="xs"
                :color="copyFormat === 'img' ? 'primary' : 'neutral'"
                :variant="copyFormat === 'img' ? 'solid' : 'soft'"
                @click="copyFormat = 'img'"
              >
                HTML 标签
              </UButton>
              <UButton
                size="xs"
                :color="copyFormat === 'css' ? 'primary' : 'neutral'"
                :variant="copyFormat === 'css' ? 'solid' : 'soft'"
                @click="copyFormat = 'css'"
              >
                CSS 背景
              </UButton>
            </div>
          </div>

          <div class="relative">
            <UTextarea
              :model-value="formattedOutput"
              readonly
              :rows="6"
              size="lg"
              class="font-mono text-xs text-gray-500"
              :ui="{ base: 'bg-gray-50 dark:bg-gray-900 pr-12' }"
              @click="copyResult"
            />
            <div class="absolute top-2 right-2">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyResult"
              />
            </div>
          </div>
          
          <UButton
            block
            size="lg"
            color="primary"
            variant="soft"
            icon="i-heroicons-clipboard-document-check"
            @click="copyResult"
          >
            复制内容
          </UButton>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="使用说明" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const previewUrl = ref('')
const base64Result = ref('')
const copyFormat = ref<'base64' | 'img' | 'css'>('base64')
const fileInfo = reactive({
  name: '-',
  size: '-',
  dimensions: '-'
})

const { copyToClipboard } = useToolClipboard()

const formattedOutput = computed(() => {
  if (!base64Result.value) return ''
  
  switch (copyFormat.value) {
    case 'img':
      return `<img src="${base64Result.value}" alt="${fileInfo.name}" />`
    case 'css':
      return `background-image: url('${base64Result.value}');`
    default:
      return base64Result.value
  }
})

const accordionItems: AccordionItem[] = [
  {
    slot: 'howto',
    label: '如何使用',
    icon: 'i-heroicons-question-mark-circle',
    content: '直接将图片文件拖拽到虚线框内，或者点击虚线框选择文件。工具会自动读取并转换为 Base64 格式。'
  },
  {
    slot: 'format',
    label: '支持格式',
    icon: 'i-heroicons-photo',
    content: '支持所有主流图片格式，如 JPG, PNG, GIF, WEBP, SVG 等。转换是完全在本地进行的，图片不会上传到任何服务器。'
  },
  {
    slot: 'size',
    label: '大小限制',
    icon: 'i-heroicons-exclamation-triangle',
    content: 'Base64 编码后的体积通常比原图大 33% 左右。建议仅对小图标或小图片进行转换，大图转换会导致网页加载变慢。'
  }
]

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const processFile = (file: File) => {
  // 检查是否是图片
  if (!file.type.startsWith('image/')) {
    const toast = useToast()
    toast.add({
      title: '格式错误',
      description: '请上传图片文件',
      color: 'error'
    })
    return
  }

  fileInfo.name = file.name
  fileInfo.size = formatSize(file.size)
  
  const reader = new FileReader()
  
  reader.onload = (e) => {
    const result = e.target?.result as string
    base64Result.value = result
    previewUrl.value = result
    
    // 获取图片尺寸
    const img = new Image()
    img.onload = () => {
      fileInfo.dimensions = `${img.width} × ${img.height}`
    }
    img.src = result
  }
  
  reader.readAsDataURL(file)
}

const clearFile = () => {
  previewUrl.value = ''
  base64Result.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  fileInfo.name = '-'
  fileInfo.size = '-'
  fileInfo.dimensions = '-'
}

const copyResult = () => {
  copyToClipboard(formattedOutput.value, '转换内容')
}

useHead({
  title: '图片转 Base64 - 在线图片编码工具',
  meta: [
    { name: 'description', content: '免费在线图片转 Base64 工具，支持拖拽上传，生成 CSS 背景或 HTML 图片标签' }
  ]
})
</script>
