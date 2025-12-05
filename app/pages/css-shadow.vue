<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">CSS 阴影生成器</h1>
      <p class="text-gray-600 dark:text-gray-400">
        可视化配置 CSS box-shadow 属性，支持多层阴影
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 配置区域 -->
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">阴影配置</h3>
            </div>
          </template>

          <div class="space-y-6">
            <!-- 阴影层列表 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium">阴影层级</label>
                <UButton
                  color="primary"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-plus"
                  @click="addLayer"
                >
                  添加
                </UButton>
              </div>
              
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div
                  v-for="(layer, index) in layers"
                  :key="index"
                  class="flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer"
                  :class="activeLayerIndex === index ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-900 border-transparent hover:border-gray-200'"
                  @click="activeLayerIndex = index"
                >
                  <div 
                    class="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                    :style="{ backgroundColor: layer.color }"
                  />
                  <span class="text-xs text-gray-600 flex-1">Layer {{ index + 1 }}</span>
                  <UButton
                    v-if="layers.length > 1"
                    color="error"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-trash"
                    @click.stop="removeLayer(index)"
                  />
                </div>
              </div>
            </div>

            <USeparator />

            <!-- 当前层参数 -->
            <div v-if="activeLayer" class="space-y-4">
              <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs">水平位移 (X)</label>
                  <span class="text-xs font-mono">{{ activeLayer.x }}px</span>
                </div>
                <URange v-model="activeLayer.x" :min="-100" :max="100" />
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs">垂直位移 (Y)</label>
                  <span class="text-xs font-mono">{{ activeLayer.y }}px</span>
                </div>
                <URange v-model="activeLayer.y" :min="-100" :max="100" />
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs">模糊半径 (Blur)</label>
                  <span class="text-xs font-mono">{{ activeLayer.blur }}px</span>
                </div>
                <URange v-model="activeLayer.blur" :min="0" :max="100" />
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <label class="text-xs">扩展半径 (Spread)</label>
                  <span class="text-xs font-mono">{{ activeLayer.spread }}px</span>
                </div>
                <URange v-model="activeLayer.spread" :min="-50" :max="50" />
              </div>

              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <label class="text-xs block mb-1">颜色</label>
                  <div class="flex gap-2">
                    <input
                      v-model="activeLayer.color"
                      type="color"
                      class="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <UInput v-model="activeLayer.color" size="xs" class="flex-1 font-mono" />
                  </div>
                </div>
                <div>
                  <label class="text-xs block mb-1">内阴影</label>
                  <UToggle v-model="activeLayer.inset" />
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 预览和代码 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 预览 -->
        <UCard class="min-h-[400px] flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">预览</h3>
              <div class="flex items-center gap-2">
                <label class="text-xs text-gray-500">背景色</label>
                <input
                  v-model="previewBg"
                  type="color"
                  class="w-6 h-6 rounded cursor-pointer border-0"
                />
                <label class="text-xs text-gray-500 ml-2">方块色</label>
                <input
                  v-model="boxColor"
                  type="color"
                  class="w-6 h-6 rounded cursor-pointer border-0"
                />
              </div>
            </div>
          </template>

          <div 
            class="flex-1 rounded-lg flex items-center justify-center p-8 transition-colors duration-300"
            :style="{ backgroundColor: previewBg }"
          >
            <div
              class="w-48 h-48 rounded-2xl transition-all duration-300"
              :style="{
                backgroundColor: boxColor,
                boxShadow: boxShadowCSS
              }"
            />
          </div>
        </UCard>

        <!-- 代码 -->
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

          <div class="p-4 bg-gray-900 rounded-lg group relative">
            <code class="font-mono text-sm text-gray-300 break-all">
              <span class="text-purple-400">box-shadow</span>: {{ boxShadowCSS }};
            </code>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

interface ShadowLayer {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

const layers = ref<ShadowLayer[]>([
  { x: 0, y: 4, blur: 6, spread: -1, color: '#0000001a', inset: false },
  { x: 0, y: 2, blur: 4, spread: -1, color: '#0000000f', inset: false }
])

const activeLayerIndex = ref(0)
const previewBg = ref('#f3f4f6')
const boxColor = ref('#ffffff')

const activeLayer = computed(() => layers.value[activeLayerIndex.value])

const boxShadowCSS = computed(() => {
  return layers.value.map(l => {
    const inset = l.inset ? 'inset ' : ''
    return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`
  }).join(', ')
})

function addLayer() {
  layers.value.push({
    x: 0,
    y: 10,
    blur: 15,
    spread: -3,
    color: '#0000001a',
    inset: false
  })
  activeLayerIndex.value = layers.value.length - 1
}

function removeLayer(index: number) {
  layers.value.splice(index, 1)
  if (activeLayerIndex.value >= layers.value.length) {
    activeLayerIndex.value = Math.max(0, layers.value.length - 1)
  }
}

// SEO
useHead({
  title: 'CSS 阴影生成器 - Box Shadow 可视化配置 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS 阴影生成器，可视化配置 box-shadow 属性，支持多层阴影叠加，一键生成 CSS 代码。' }
  ]
})
</script>
