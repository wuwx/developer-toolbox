<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Border Radius 生成器</h1>
      <p class="text-gray-600 dark:text-gray-400">
        可视化调整圆角，支持生成复杂的 8 值圆角形状
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <!-- 预览区域 -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <UCard class="overflow-visible">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">实时预览</h3>
              <div class="flex gap-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-arrow-path"
                  @click="randomize"
                >
                  随机形状
                </UButton>
              </div>
            </div>
          </template>

          <div class="relative aspect-square max-w-[400px] mx-auto flex items-center justify-center p-8">
            <!-- 形状本体 -->
            <div 
              class="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 shadow-xl transition-all duration-300"
              :style="{ borderRadius: borderRadiusCSS }"
            />

            <!-- 控制点 (仅示意，实际实现复杂拖拽太繁琐，用滑块替代) -->
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
                @click="copyToClipboard(`border-radius: ${borderRadiusCSS};`, 'CSS')"
              >
                复制
              </UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <code class="font-mono text-sm text-gray-300 break-all">
              <span class="text-purple-400">border-radius</span>: {{ borderRadiusCSS }};
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
              <h3 class="font-semibold">参数调整</h3>
            </div>
          </template>

          <div class="space-y-8">
            <!-- 简单模式 -->
            <div v-if="!advanced" class="space-y-4">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium">统一圆角</label>
                <UToggle v-model="advanced" label="高级模式" />
              </div>
              <URange v-model="simpleRadius" :min="0" :max="100" />
            </div>

            <!-- 高级模式 (8个值) -->
            <div v-else class="space-y-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">水平半径 (Horizontal)</h4>
                <UToggle v-model="advanced" label="高级模式" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">左上 (Top-Left)</label>
                  <URange v-model="radii.tl_x" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">右上 (Top-Right)</label>
                  <URange v-model="radii.tr_x" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">右下 (Bottom-Right)</label>
                  <URange v-model="radii.br_x" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">左下 (Bottom-Left)</label>
                  <URange v-model="radii.bl_x" :min="0" :max="100" size="sm" />
                </div>
              </div>

              <USeparator />

              <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4">垂直半径 (Vertical)</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">左上 (Top-Left)</label>
                  <URange v-model="radii.tl_y" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">右上 (Top-Right)</label>
                  <URange v-model="radii.tr_y" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">右下 (Bottom-Right)</label>
                  <URange v-model="radii.br_y" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">左下 (Bottom-Left)</label>
                  <URange v-model="radii.bl_y" :min="0" :max="100" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- 预设形状 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5" />
              <h3 class="font-semibold">常用形状</h3>
            </div>
          </template>

          <div class="grid grid-cols-4 gap-2">
            <UButton
              v-for="shape in shapes"
              :key="shape.name"
              color="neutral"
              variant="soft"
              size="sm"
              class="justify-center"
              @click="applyShape(shape)"
            >
              {{ shape.name }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const advanced = ref(false)
const simpleRadius = ref(20)

const radii = reactive({
  tl_x: 30, tr_x: 70, br_x: 70, bl_x: 30,
  tl_y: 30, tr_y: 30, br_y: 70, bl_y: 70
})

const borderRadiusCSS = computed(() => {
  if (!advanced.value) {
    return `${simpleRadius.value}px`
  }
  
  const horizontal = `${radii.tl_x}% ${radii.tr_x}% ${radii.br_x}% ${radii.bl_x}%`
  const vertical = `${radii.tl_y}% ${radii.tr_y}% ${radii.br_y}% ${radii.bl_y}%`
  
  return `${horizontal} / ${vertical}`
})

function randomize() {
  advanced.value = true
  Object.keys(radii).forEach(k => {
    radii[k as keyof typeof radii] = Math.floor(Math.random() * 100)
  })
}

const shapes = [
  { name: '叶子', radii: { tl_x: 0, tr_x: 100, br_x: 0, bl_x: 100, tl_y: 0, tr_y: 100, br_y: 0, bl_y: 100 } },
  { name: '水滴', radii: { tl_x: 0, tr_x: 50, br_x: 50, bl_x: 50, tl_y: 0, tr_y: 50, br_y: 50, bl_y: 50 } },
  { name: '盾牌', radii: { tl_x: 50, tr_x: 50, br_x: 50, bl_x: 50, tl_y: 15, tr_y: 15, br_y: 100, bl_y: 100 } },
  { name: '柠檬', radii: { tl_x: 10, tr_x: 90, br_x: 10, bl_x: 90, tl_y: 90, tr_y: 10, br_y: 90, bl_y: 10 } }
]

function applyShape(shape: typeof shapes[0]) {
  advanced.value = true
  Object.assign(radii, shape.radii)
}

// SEO
useHead({
  title: 'Border Radius 生成器 - CSS 圆角工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS Border Radius 生成器，可视化配置圆角属性，支持 8 值复杂圆角生成，轻松制作不规则形状。' }
  ]
})
</script>
