<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      :title="$t('pages.color.title')"
      :description="$t('pages.color.description')"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-swatch" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Color Picker -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-swatch" class="w-5 h-5" />
            <h3 class="font-semibold">{{ $t('ui.colorPicker') }}</h3>
          </div>
        </template>

        <div class="space-y-6">
          <!-- 颜色选择器 -->
          <div class="flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <input
              v-model="currentColor"
              type="color"
              class="w-32 h-32 rounded-lg cursor-pointer border-4 border-white dark:border-gray-800 shadow-xl"
              @input="updateFromColorPicker"
            />
            <div 
              class="w-full h-24 rounded-lg shadow-inner"
              :style="{ backgroundColor: currentColor }"
            />
          </div>

          <!-- HEX 输入 -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UIcon name="i-heroicons-hashtag" class="w-4 h-4" />
              HEX
            </label>
            <div class="flex gap-2">
              <UInput
                v-model="hexValue"
                placeholder="#000000"
                size="lg"
                @input="updateFromHex"
                class="flex-1 font-mono"
              />
              <UButton
                color="neutral"
                variant="soft"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(hexValue, 'HEX')"
              />
            </div>
          </div>

          <!-- RGB 输入 -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UIcon name="i-heroicons-square-3-stack-3d" class="w-4 h-4" />
              RGB
            </label>
            <div class="grid grid-cols-3 gap-2">
              <UInput
                v-model.number="rgb.r"
                type="number"
                min="0"
                max="255"
                placeholder="R"
                size="lg"
                @input="updateFromRgb"
                class="font-mono"
              />
              <UInput
                v-model.number="rgb.g"
                type="number"
                min="0"
                max="255"
                placeholder="G"
                size="lg"
                @input="updateFromRgb"
                class="font-mono"
              />
              <UInput
                v-model.number="rgb.b"
                type="number"
                min="0"
                max="255"
                placeholder="B"
                size="lg"
                @input="updateFromRgb"
                class="font-mono"
              />
            </div>
            <div class="flex gap-2 mt-2">
              <UInput
                :model-value="rgbString"
                readonly
                size="sm"
                class="flex-1 font-mono text-xs"
              />
              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(rgbString, 'RGB')"
              />
            </div>
          </div>

          <!-- HSL 输入 -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-4 h-4" />
              HSL
            </label>
            <div class="grid grid-cols-3 gap-2">
              <UInput
                v-model.number="hsl.h"
                type="number"
                min="0"
                max="360"
                placeholder="H"
                size="lg"
                @input="updateFromHsl"
                class="font-mono"
              />
              <UInput
                v-model.number="hsl.s"
                type="number"
                min="0"
                max="100"
                placeholder="S%"
                size="lg"
                @input="updateFromHsl"
                class="font-mono"
              />
              <UInput
                v-model.number="hsl.l"
                type="number"
                min="0"
                max="100"
                placeholder="L%"
                size="lg"
                @input="updateFromHsl"
                class="font-mono"
              />
            </div>
            <div class="flex gap-2 mt-2">
              <UInput
                :model-value="hslString"
                readonly
                size="sm"
                class="flex-1 font-mono text-xs"
              />
              <UButton
                color="neutral"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(hslString, 'HSL')"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- 调色板和对比度 -->
      <div class="space-y-6">
        <!-- Color Palette -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-paint-brush" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.colorShades') }}</h3>
            </div>
          </template>

          <div class="grid grid-cols-5 gap-2">
            <div
              v-for="shade in colorShades"
              :key="shade.label"
              class="group cursor-pointer"
              @click="copyToClipboard(shade.hex, '颜色')"
            >
              <div 
                class="h-16 rounded-lg shadow-sm group-hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700"
                :style="{ backgroundColor: shade.hex }"
              />
              <div class="text-xs text-center mt-1 text-gray-500 dark:text-gray-400 font-mono">
                {{ shade.label }}
              </div>
            </div>
          </div>
        </UCard>

        <!-- Contrast Check -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-eye" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.contrastCheck') }} (WCAG)</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex gap-2">
              <input
                v-model="bgColor"
                type="color"
                class="w-12 h-12 rounded cursor-pointer"
              />
              <UInput
                v-model="bgColor"
                :placeholder="$t('ui.backgroundColor')"
                class="flex-1 font-mono"
              />
            </div>

            <!-- Contrast Result -->
            <div class="p-6 rounded-lg" :style="{ backgroundColor: bgColor, color: currentColor }">
              <div class="text-2xl font-bold mb-2">{{ $t('ui.sampleText') }}</div>
              <div class="text-sm">{{ $t('ui.readabilityTest') }}</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ contrastRatioText }}
                </div>
                <div class="text-xs text-gray-500">{{ $t('ui.contrastRatio') }}</div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div class="text-sm space-y-1">
                  <div class="flex items-center gap-2">
                    <UIcon
                      :name="contrastRatio >= 7 ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                      :class="contrastRatio >= 7 ? 'text-green-500' : 'text-red-500'"
                    />
                    <span class="text-xs">AAA</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon
                      :name="contrastRatio >= 4.5 ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                      :class="contrastRatio >= 4.5 ? 'text-green-500' : 'text-red-500'"
                    />
                    <span class="text-xs">AA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

// 当前颜色
const currentColor = ref('#3b82f6')
const hexValue = ref('#3b82f6')
const rgb = ref({ r: 59, g: 130, b: 246 })
const hsl = ref({ h: 217, s: 91, l: 60 })
const bgColor = ref('#ffffff')

// 计算属性
const rgbString = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`)
const hslString = computed(() => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`)

// 色阶调色板
const colorShades = computed(() => {
  const base = hexToRgb(currentColor.value)
  if (!base) return []
  
  return [
    { label: '100', hex: rgbToHex(lighten(base, 0.8)) },
    { label: '300', hex: rgbToHex(lighten(base, 0.4)) },
    { label: '500', hex: currentColor.value },
    { label: '700', hex: rgbToHex(darken(base, 0.3)) },
    { label: '900', hex: rgbToHex(darken(base, 0.6)) }
  ]
})

// 对比度计算
const contrastRatio = computed(() => {
  const fg = hexToRgb(currentColor.value)
  const bg = hexToRgb(bgColor.value)
  if (!fg || !bg) return 1
  
  return calculateContrast(fg, bg)
})

const contrastRatioText = computed(() => `${contrastRatio.value.toFixed(2)}:1`)

// 颜色转换函数
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result || !result[1] || !result[2] || !result[3]) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

function rgbToHsl(rgb: { r: number; g: number; b: number }): { h: number; s: number; l: number } {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(hsl: { h: number; s: number; l: number }): { r: number; g: number; b: number } {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function lighten(rgb: { r: number; g: number; b: number }, amount: number) {
  return {
    r: rgb.r + (255 - rgb.r) * amount,
    g: rgb.g + (255 - rgb.g) * amount,
    b: rgb.b + (255 - rgb.b) * amount
  }
}

function darken(rgb: { r: number; g: number; b: number }, amount: number) {
  return {
    r: rgb.r * (1 - amount),
    g: rgb.g * (1 - amount),
    b: rgb.b * (1 - amount)
  }
}

function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const values = [rgb.r, rgb.g, rgb.b].map(v => {
    v = v / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  const [r = 0, g = 0, b = 0] = values
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function calculateContrast(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lum1 = getLuminance(rgb1)
  const lum2 = getLuminance(rgb2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

// 更新函数
function updateFromColorPicker() {
  hexValue.value = currentColor.value
  const rgbVal = hexToRgb(currentColor.value)
  if (rgbVal) {
    rgb.value = rgbVal
    hsl.value = rgbToHsl(rgbVal)
  }
}

function updateFromHex() {
  if (/^#[0-9A-F]{6}$/i.test(hexValue.value)) {
    currentColor.value = hexValue.value
    const rgbVal = hexToRgb(hexValue.value)
    if (rgbVal) {
      rgb.value = rgbVal
      hsl.value = rgbToHsl(rgbVal)
    }
  }
}

function updateFromRgb() {
  currentColor.value = rgbToHex(rgb.value)
  hexValue.value = currentColor.value
  hsl.value = rgbToHsl(rgb.value)
}

function updateFromHsl() {
  const rgbVal = hslToRgb(hsl.value)
  rgb.value = rgbVal
  currentColor.value = rgbToHex(rgbVal)
  hexValue.value = currentColor.value
}

// SEO
useHead({
  title: t('pages.color.title'),
  meta: [{ name: 'description', content: t('pages.color.description') }]
})
</script>
