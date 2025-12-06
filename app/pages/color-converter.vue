<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="颜色转换器"
      description="在 HEX、RGB、HSL、HSV 等颜色格式之间互转"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 via-yellow-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-paint-brush" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <!-- 预览区域 -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <UCard>
          <template #header>
            <h3 class="font-semibold">颜色预览</h3>
          </template>

          <div class="space-y-4">
            <div 
              class="w-full h-48 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700"
              :style="{ backgroundColor: currentColor }"
            />
            
            <div class="flex items-center gap-3">
              <UInput 
                v-model="currentColor" 
                type="color" 
                class="w-20 h-12"
              />
              <UInput 
                v-model="currentColor" 
                placeholder="#3b82f6" 
                class="flex-1 font-mono"
                size="xl"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- 转换结果 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
              <h3 class="font-semibold">格式转换</h3>
            </div>
          </template>

          <div class="space-y-4">
            <!-- HEX -->
            <div>
              <label class="text-sm font-medium mb-2 block">HEX</label>
              <div class="flex gap-2">
                <UInput 
                  :model-value="formats.hex" 
                  @update:model-value="updateFromHex"
                  class="flex-1 font-mono" 
                  size="lg"
                />
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(formats.hex, 'HEX')"
                />
              </div>
            </div>

            <!-- RGB -->
            <div>
              <label class="text-sm font-medium mb-2 block">RGB</label>
              <div class="flex gap-2">
                <UInput 
                  :model-value="formats.rgb" 
                  @update:model-value="updateFromRgb"
                  class="flex-1 font-mono" 
                  size="lg"
                />
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(formats.rgb, 'RGB')"
                />
              </div>
            </div>

            <!-- HSL -->
            <div>
              <label class="text-sm font-medium mb-2 block">HSL</label>
              <div class="flex gap-2">
                <UInput 
                  :model-value="formats.hsl" 
                  class="flex-1 font-mono" 
                  size="lg"
                  readonly
                />
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(formats.hsl, 'HSL')"
                />
              </div>
            </div>

            <!-- HSV -->
            <div>
              <label class="text-sm font-medium mb-2 block">HSV</label>
              <div class="flex gap-2">
                <UInput 
                  :model-value="formats.hsv" 
                  class="flex-1 font-mono" 
                  size="lg"
                  readonly
                />
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(formats.hsv, 'HSV')"
                />
              </div>
            </div>

            <!-- CMYK -->
            <div>
              <label class="text-sm font-medium mb-2 block">CMYK</label>
              <div class="flex gap-2">
                <UInput 
                  :model-value="formats.cmyk" 
                  class="flex-1 font-mono" 
                  size="lg"
                  readonly
                />
                <UButton
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(formats.cmyk, 'CMYK')"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- 常用颜色 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5" />
              <h3 class="font-semibold">常用颜色</h3>
            </div>
          </template>

          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="color in commonColors"
              :key="color"
              class="aspect-square rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }"
              @click="currentColor = color"
            />
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const currentColor = ref('#3b82f6')

const formats = computed(() => {
  const color = currentColor.value
  const rgb = hexToRgb(color)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

  return {
    hex: color.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
  }
})

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1] || '0', 16),
    g: parseInt(result[2] || '0', 16),
    b: parseInt(result[3] || '0', 16)
  } : { r: 0, g: 0, b: 0 }
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

function rgbToCmyk(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  
  const k = 1 - Math.max(r, g, b)
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

function updateFromHex(value: string) {
  if (/^#?[0-9A-F]{6}$/i.test(value)) {
    currentColor.value = value.startsWith('#') ? value : '#' + value
  }
}

function updateFromRgb(value: string) {
  const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match && match[1] && match[2] && match[3]) {
    const r = Number(match[1])
    const g = Number(match[2])
    const b = Number(match[3])
    currentColor.value = rgbToHex(r, g, b)
  }
}

const commonColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#000000',
  '#ffffff', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'
]

useHead({
  title: '颜色转换器 - HEX RGB HSL 互转工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线颜色格式转换工具，支持 HEX、RGB、HSL、HSV、CMYK 等格式互转，实时预览颜色效果。' }
  ]
})
</script>
