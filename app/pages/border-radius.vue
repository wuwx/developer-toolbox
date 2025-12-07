<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.borderRadius.title')" :description="$t('pages.borderRadius.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-stop" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <!-- 预览区域 -->
      <div class="space-y-6 lg:sticky lg:top-24">
        <UCard class="overflow-visible">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('pages.borderRadius.preview') }}</h3>
              <div class="flex gap-2">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-arrow-path"
                  @click="randomize"
                >
                  {{ $t('pages.borderRadius.randomShape') }}
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
                <h3 class="font-semibold">{{ $t('pages.borderRadius.cssCode') }}</h3>
              </div>
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(`border-radius: ${borderRadiusCSS};`, 'CSS')"
              >
                {{ $t('ui.copy') }}
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
              <h3 class="font-semibold">{{ $t('pages.borderRadius.settings') }}</h3>
            </div>
          </template>

          <div class="space-y-8">
            <!-- 简单模式 -->
            <div v-if="!advanced" class="space-y-4">
              <div class="flex justify-between items-center">
                <label class="text-sm font-medium">{{ $t('pages.borderRadius.uniformRadius') }}</label>
                <UToggle v-model="advanced" :label="$t('pages.borderRadius.advancedMode')" />
              </div>
              <URange v-model="simpleRadius" :min="0" :max="100" />
            </div>

            <!-- 高级模式 (8个值) -->
            <div v-else class="space-y-6">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('pages.borderRadius.horizontalRadius') }}</h4>
                <UToggle v-model="advanced" :label="$t('pages.borderRadius.advancedMode')" />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.topLeft') }}</label>
                  <URange v-model="radii.tl_x" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.topRight') }}</label>
                  <URange v-model="radii.tr_x" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.bottomRight') }}</label>
                  <URange v-model="radii.br_x" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.bottomLeft') }}</label>
                  <URange v-model="radii.bl_x" :min="0" :max="100" size="sm" />
                </div>
              </div>

              <USeparator />

              <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-4">{{ $t('pages.borderRadius.verticalRadius') }}</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.topLeft') }}</label>
                  <URange v-model="radii.tl_y" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.topRight') }}</label>
                  <URange v-model="radii.tr_y" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.bottomRight') }}</label>
                  <URange v-model="radii.br_y" :min="0" :max="100" size="sm" />
                </div>
                <div>
                  <label class="text-xs text-gray-500 mb-1 block">{{ $t('pages.borderRadius.bottomLeft') }}</label>
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
              <h3 class="font-semibold">{{ $t('pages.borderRadius.presets') }}</h3>
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
              {{ $t(`pages.borderRadius.shape${shape.key}`) }}
            </UButton>
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
  { key: 'Leaf', name: 'Leaf', radii: { tl_x: 0, tr_x: 100, br_x: 0, bl_x: 100, tl_y: 0, tr_y: 100, br_y: 0, bl_y: 100 } },
  { key: 'Drop', name: 'Drop', radii: { tl_x: 0, tr_x: 50, br_x: 50, bl_x: 50, tl_y: 0, tr_y: 50, br_y: 50, bl_y: 50 } },
  { key: 'Shield', name: 'Shield', radii: { tl_x: 50, tr_x: 50, br_x: 50, bl_x: 50, tl_y: 15, tr_y: 15, br_y: 100, bl_y: 100 } },
  { key: 'Lemon', name: 'Lemon', radii: { tl_x: 10, tr_x: 90, br_x: 10, bl_x: 90, tl_y: 90, tr_y: 10, br_y: 90, bl_y: 10 } }
]

function applyShape(shape: typeof shapes[0]) {
  advanced.value = true
  Object.assign(radii, shape.radii)
}

useHead({ title: t('pages.borderRadius.title'), meta: [{ name: 'description', content: t('pages.borderRadius.description') }] })
</script>
