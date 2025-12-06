<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Box Shadow 生成器"
      description="可视化调整盒子阴影效果，支持多层阴影"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-square-3-stack-3d" class="w-10 h-10 text-white" />
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

          <div class="relative aspect-square max-w-[400px] mx-auto flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div 
              class="w-48 h-48 bg-white dark:bg-gray-800 rounded-xl"
              :style="{ boxShadow: boxShadowCSS }"
            />
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
                @click="copyToClipboard(`box-shadow: ${boxShadowCSS};`, 'CSS')"
              >
                复制
              </UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <code class="font-mono text-sm text-gray-300 break-all">
              <span class="text-purple-400">box-shadow</span>: {{ boxShadowCSS }};
            </code>
          </div>
        </UCard>
      </div>

      <!-- 控制区域 -->
      <div class="space-y-6">
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
              <URange v-model="offsetX" :min="-50" :max="50" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">垂直偏移 (Y)</label>
                <span class="text-xs text-gray-500">{{ offsetY }}px</span>
              </div>
              <URange v-model="offsetY" :min="-50" :max="50" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">模糊半径</label>
                <span class="text-xs text-gray-500">{{ blur }}px</span>
              </div>
              <URange v-model="blur" :min="0" :max="100" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">扩散半径</label>
                <span class="text-xs text-gray-500">{{ spread }}px</span>
              </div>
              <URange v-model="spread" :min="-50" :max="50" />
            </div>

            <div>
              <label class="text-sm font-medium mb-2 block">阴影颜色</label>
              <UInput v-model="color" type="color" class="w-full h-12" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">透明度</label>
                <span class="text-xs text-gray-500">{{ opacity }}%</span>
              </div>
              <URange v-model="opacity" :min="0" :max="100" />
            </div>

            <div class="flex items-center gap-2">
              <UCheckbox v-model="inset" label="内阴影 (inset)" />
            </div>
          </div>
        </UCard>

        <!-- 预设 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5" />
              <h3 class="font-semibold">常用预设</h3>
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

const offsetX = ref(0)
const offsetY = ref(8)
const blur = ref(20)
const spread = ref(0)
const color = ref('#000000')
const opacity = ref(20)
const inset = ref(false)

const boxShadowCSS = computed(() => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1] || '0', 16),
      g: parseInt(result[2] || '0', 16),
      b: parseInt(result[3] || '0', 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(color.value)
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.value / 100})`
  const insetStr = inset.value ? 'inset ' : ''
  
  return `${insetStr}${offsetX.value}px ${offsetY.value}px ${blur.value}px ${spread.value}px ${rgba}`
})

const presets = [
  { name: '轻微', values: { offsetX: 0, offsetY: 2, blur: 4, spread: 0, opacity: 10 } },
  { name: '常规', values: { offsetX: 0, offsetY: 4, blur: 12, spread: 0, opacity: 15 } },
  { name: '中等', values: { offsetX: 0, offsetY: 8, blur: 24, spread: 0, opacity: 20 } },
  { name: '强烈', values: { offsetX: 0, offsetY: 16, blur: 40, spread: 0, opacity: 25 } },
  { name: '扁平', values: { offsetX: 0, offsetY: 0, blur: 0, spread: 1, opacity: 20 } },
  { name: '浮起', values: { offsetX: 0, offsetY: 20, blur: 60, spread: -10, opacity: 30 } }
]

function applyPreset(preset: typeof presets[0]) {
  Object.assign({ offsetX, offsetY, blur, spread, opacity }, preset.values)
}

useHead({
  title: 'Box Shadow 生成器 - CSS 阴影工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS Box Shadow 生成器，可视化配置盒子阴影效果，支持多种预设样式。' }
  ]
})
</script>
