<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Text Shadow 生成器"
      description="可视化调整文字阴影效果"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <!-- 预览区域 -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <UCard>
          <template #header>
            <h3 class="font-semibold">实时预览</h3>
          </template>

          <div class="relative min-h-[300px] flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <h2 
              class="text-6xl font-bold text-center"
              :style="{ textShadow: textShadowCSS, color: textColor }"
            >
              {{ previewText }}
            </h2>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">CSS 代码</h3>
              </div>
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(`text-shadow: ${textShadowCSS};`, 'CSS')"
              >
                复制
              </UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <code class="font-mono text-sm text-gray-300 break-all">
              <span class="text-purple-400">text-shadow</span>: {{ textShadowCSS }};
            </code>
          </div>
        </UCard>
      </div>

      <!-- 控制区域 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-pencil" class="w-5 h-5" />
              <h3 class="font-semibold">预览文本</h3>
            </div>
          </template>

          <UInput v-model="previewText" placeholder="输入预览文字" size="xl" />
          
          <div class="mt-4">
            <label class="text-sm font-medium mb-2 block">文字颜色</label>
            <UInput v-model="textColor" type="color" class="w-full h-12" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-vertical" class="w-5 h-5" />
              <h3 class="font-semibold">阴影参数</h3>
            </div>
          </template>

          <div class="space-y-6">
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">水平偏移 (X)</label>
                <span class="text-xs text-gray-500">{{ offsetX }}px</span>
              </div>
              <URange v-model="offsetX" :min="-30" :max="30" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">垂直偏移 (Y)</label>
                <span class="text-xs text-gray-500">{{ offsetY }}px</span>
              </div>
              <URange v-model="offsetY" :min="-30" :max="30" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">模糊半径</label>
                <span class="text-xs text-gray-500">{{ blur }}px</span>
              </div>
              <URange v-model="blur" :min="0" :max="50" />
            </div>

            <div>
              <label class="text-sm font-medium mb-2 block">阴影颜色</label>
              <UInput v-model="shadowColor" type="color" class="w-full h-12" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">透明度</label>
                <span class="text-xs text-gray-500">{{ opacity }}%</span>
              </div>
              <URange v-model="opacity" :min="0" :max="100" />
            </div>
          </div>
        </UCard>

        <!-- 预设 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5" />
              <h3 class="font-semibold">常用效果</h3>
            </div>
          </template>

          <div class="grid grid-cols-2 gap-2">
            <UButton
              v-for="preset in presets"
              :key="preset.name"
              color="neutral"
              variant="soft"
              size="sm"
              @click="applyPreset(preset)"
            >
              {{ preset.name }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const previewText = ref('Hello World')
const textColor = ref('#1f2937')
const offsetX = ref(2)
const offsetY = ref(2)
const blur = ref(4)
const shadowColor = ref('#000000')
const opacity = ref(50)

const textShadowCSS = computed(() => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1] || '0', 16),
      g: parseInt(result[2] || '0', 16),
      b: parseInt(result[3] || '0', 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(shadowColor.value)
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.value / 100})`
  
  return `${offsetX.value}px ${offsetY.value}px ${blur.value}px ${rgba}`
})

const presets = [
  { name: '轻微', values: { offsetX: 1, offsetY: 1, blur: 2, opacity: 30 } },
  { name: '常规', values: { offsetX: 2, offsetY: 2, blur: 4, opacity: 50 } },
  { name: '突出', values: { offsetX: 4, offsetY: 4, blur: 8, opacity: 70 } },
  { name: '描边', values: { offsetX: 0, offsetY: 0, blur: 1, opacity: 100 } },
  { name: '浮雕', values: { offsetX: 1, offsetY: -1, blur: 0, opacity: 50 } },
  { name: '霓虹', values: { offsetX: 0, offsetY: 0, blur: 10, opacity: 80 } }
]

function applyPreset(preset: typeof presets[0]) {
  Object.assign({ offsetX, offsetY, blur, opacity }, preset.values)
}

useHead({
  title: 'Text Shadow 生成器 - CSS 文字阴影工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS Text Shadow 生成器，可视化配置文字阴影效果，支持多种预设样式。' }
  ]
})
</script>
