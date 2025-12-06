<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.imageCompress.title')" :description="$t('pages.imageCompress.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-photo" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-photo" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.selectImage') }}</h3>
            </div>
          </template>
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
            <input ref="fileInput" type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="handleFileChange" />
            <UIcon name="i-heroicons-arrow-up-tray" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('ui.clickOrDrag') }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ $t('ui.supportFormats') }}</div>
          </div>
        </UCard>

        <UCard v-if="originalImage">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.compressSettings') }}</h3>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between mb-2"><label class="text-sm font-medium">{{ $t('ui.quality') }} ({{ Math.round(quality * 100) }}%)</label></div>
              <URange v-model="quality" :min="0.1" :max="1" :step="0.05" />
            </div>
            <div>
              <div class="flex justify-between mb-2"><label class="text-sm font-medium">{{ $t('ui.scaleSize') }} ({{ Math.round(scale * 100) }}%)</label></div>
              <URange v-model="scale" :min="0.1" :max="1" :step="0.1" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.outputFormat') }}</label>
              <div class="flex gap-2">
                <UButton v-for="f in formats" :key="f" :color="outputFormat === f ? 'primary' : 'neutral'" :variant="outputFormat === f ? 'solid' : 'soft'" size="sm" @click="outputFormat = f">{{ f.toUpperCase().replace('IMAGE/', '') }}</UButton>
              </div>
            </div>
            <UButton block color="primary" size="lg" @click="compress">{{ $t('ui.recompress') }}</UButton>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div v-if="originalImage" class="grid sm:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-semibold">{{ $t('ui.originalImage') }}</h3>
                <UBadge color="neutral" variant="subtle">{{ formatSize(originalSize) }}</UBadge>
              </div>
            </template>
            <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
              <img :src="originalPreview" class="max-w-full max-h-full object-contain" />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="font-semibold">{{ $t('ui.compressedImage') }}</h3>
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
              <UButton v-if="compressedPreview" color="primary" icon="i-heroicons-arrow-down-tray" @click="download">{{ $t('ui.download') }}</UButton>
            </div>
          </UCard>
        </div>

        <div v-else class="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">{{ $t('ui.inputPlaceholder') }}</div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

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

function triggerFileInput() { fileInput.value?.click() }
function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) processFile(input.files[0])
}
function handleDrop(event: DragEvent) {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) processFile(event.dataTransfer.files[0])
}

function processFile(file: File) {
  if (!file.type.startsWith('image/')) return
  originalSize.value = file.size
  outputFormat.value = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const reader = new FileReader()
  reader.onload = (e) => {
    originalPreview.value = e.target?.result as string
    const img = new Image()
    img.onload = () => { originalImage.value = img; compress() }
    img.src = originalPreview.value
  }
  reader.readAsDataURL(file)
}

function compress() {
  if (!originalImage.value) return
  isCompressing.value = true
  requestAnimationFrame(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const width = originalImage.value!.width * scale.value
    const height = originalImage.value!.height * scale.value
    canvas.width = width
    canvas.height = height
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(originalImage.value!, 0, 0, width, height)
    canvas.toBlob((blob) => {
      if (blob) { compressedSize.value = blob.size; compressedPreview.value = URL.createObjectURL(blob) }
      isCompressing.value = false
    }, outputFormat.value, quality.value)
  })
}

function download() {
  if (!compressedPreview.value) return
  const link = document.createElement('a')
  link.href = compressedPreview.value
  link.download = `compressed.${outputFormat.value.split('/')[1]}`
  link.click()
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

watch([quality, scale, outputFormat], () => { if (originalImage.value) setTimeout(() => compress(), 100) })

useHead({ title: t('pages.imageCompress.title'), meta: [{ name: 'description', content: t('pages.imageCompress.description') }] })
</script>
