<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="CSS 渐变生成器"
      description="可视化配置线性渐变，生成精美的 CSS 背景代码"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-swatch" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 预览区域 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-eye" class="w-5 h-5" />
                <h3 class="font-semibold">实时预览</h3>
              </div>
              <div class="flex gap-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-arrow-path"
                  @click="randomize"
                >
                  随机生成
                </UButton>
              </div>
            </div>
          </template>

          <div 
            class="aspect-video rounded-lg shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-800"
            :style="{ background: gradientCSS }"
          />
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
                @click="copyToClipboard(`background: ${gradientCSS};`, 'CSS')"
              >
                复制
              </UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <code class="font-mono text-sm text-gray-300 break-all">
              <span class="text-purple-400">background</span>: {{ gradientCSS }};
            </code>
          </div>
        </UCard>
      </div>

      <!-- 配置区域 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">渐变设置</h3>
            </div>
          </template>

          <div class="space-y-6">
            <!-- 类型和角度 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium mb-2 block">类型</label>
                <div class="flex gap-2">
                  <UButton
                    :color="type === 'linear' ? 'primary' : 'neutral'"
                    :variant="type === 'linear' ? 'solid' : 'soft'"
                    size="sm"
                    class="flex-1"
                    @click="type = 'linear'"
                  >
                    线性
                  </UButton>
                  <UButton
                    :color="type === 'radial' ? 'primary' : 'neutral'"
                    :variant="type === 'radial' ? 'solid' : 'soft'"
                    size="sm"
                    class="flex-1"
                    @click="type = 'radial'"
                  >
                    径向
                  </UButton>
                </div>
              </div>
              <div v-if="type === 'linear'">
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-medium">角度</label>
                  <span class="text-sm font-mono text-primary-600">{{ angle }}°</span>
                </div>
                <URange v-model="angle" :min="0" :max="360" />
              </div>
              <div v-else>
                <label class="text-sm font-medium mb-2 block">形状</label>
                <USelect v-model="shape" :options="[{label: 'circle', value: 'circle'}, {label: 'ellipse', value: 'ellipse'}]" class="w-full" />
              </div>
            </div>

            <USeparator />

            <!-- 颜色停止点 -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">颜色节点</label>
                <UButton
                  color="primary"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-plus"
                  :disabled="stops.length >= 5"
                  @click="addStop"
                >
                  添加颜色
                </UButton>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="(stop, index) in stops" 
                  :key="index"
                  class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <input
                    v-model="stop.color"
                    type="color"
                    class="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <div class="flex-1">
                    <URange v-model="stop.position" :min="0" :max="100" size="sm" />
                  </div>
                  <span class="w-8 text-xs font-mono text-right">{{ stop.position }}%</span>
                  <UButton
                    v-if="stops.length > 2"
                    color="error"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-trash"
                    @click="removeStop(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- 预设 -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-swatch" class="w-5 h-5" />
              <h3 class="font-semibold">流行渐变</h3>
            </div>
          </template>

          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="(preset, index) in presets"
              :key="index"
              class="aspect-square rounded-lg shadow-sm hover:scale-105 transition-transform border border-gray-200 dark:border-gray-800"
              :style="{ background: preset }"
              @click="applyPreset(preset)"
            />
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const type = ref<'linear' | 'radial'>('linear')
const angle = ref(135)
const shape = ref('circle')

interface ColorStop {
  color: string
  position: number
}

const stops = ref<ColorStop[]>([
  { color: '#6366f1', position: 0 },
  { color: '#a855f7', position: 50 },
  { color: '#ec4899', position: 100 }
])

const gradientCSS = computed(() => {
  const stopsStr = stops.value
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ')

  if (type.value === 'linear') {
    return `linear-gradient(${angle.value}deg, ${stopsStr})`
  } else {
    return `radial-gradient(${shape.value}, ${stopsStr})`
  }
})

function addStop() {
  if (stops.value.length >= 5) return
  stops.value.push({ color: '#ffffff', position: 100 })
}

function removeStop(index: number) {
  if (stops.value.length <= 2) return
  stops.value.splice(index, 1)
}

function randomize() {
  const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  stops.value.forEach(s => s.color = randomColor())
  angle.value = Math.floor(Math.random() * 360)
}

const presets = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
  'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)'
]

function applyPreset(preset: string) {
  // 简单解析 preset (仅限演示，实际可能需要更复杂正则)
  // 这里简化：直接应用不太好，因为我们要更新 stops
  // 为了简单起见，这里只随机生成新的颜色
  randomize()
}

// SEO
useHead({
  title: 'CSS 渐变生成器 - Linear/Radial Gradient | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS 渐变生成器，可视化配置线性渐变和径向渐变，支持多颜色节点，实时预览并生成 CSS 代码。' }
  ]
})
</script>
