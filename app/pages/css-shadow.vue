<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.cssShadow.title')" :description="$t('pages.cssShadow.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-square-2-stack" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.shadowConfig') }}</h3>
            </div>
          </template>

          <div class="space-y-6">
            <div class="space-y-2">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium">{{ $t('ui.shadowLayers') }}</label>
                <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-plus" @click="addLayer">{{ $t('ui.add') }}</UButton>
              </div>
              
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div v-for="(layer, index) in layers" :key="index" class="flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer" :class="activeLayerIndex === index ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : 'bg-gray-50 dark:bg-gray-900 border-transparent hover:border-gray-200'" @click="activeLayerIndex = index">
                  <div class="w-4 h-4 rounded-full border border-gray-200 shadow-sm" :style="{ backgroundColor: layer.color }" />
                  <span class="text-xs text-gray-600 flex-1">Layer {{ index + 1 }}</span>
                  <UButton v-if="layers.length > 1" color="error" variant="ghost" size="xs" icon="i-heroicons-trash" @click.stop="removeLayer(index)" />
                </div>
              </div>
            </div>

            <USeparator />

            <div v-if="activeLayer" class="space-y-4">
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs">{{ $t('ui.horizontalOffset') }}</label><span class="text-xs font-mono">{{ activeLayer.x }}px</span></div>
                <URange v-model="activeLayer.x" :min="-100" :max="100" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs">{{ $t('ui.verticalOffset') }}</label><span class="text-xs font-mono">{{ activeLayer.y }}px</span></div>
                <URange v-model="activeLayer.y" :min="-100" :max="100" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs">{{ $t('ui.blurRadius') }}</label><span class="text-xs font-mono">{{ activeLayer.blur }}px</span></div>
                <URange v-model="activeLayer.blur" :min="0" :max="100" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs">{{ $t('ui.spreadRadius') }}</label><span class="text-xs font-mono">{{ activeLayer.spread }}px</span></div>
                <URange v-model="activeLayer.spread" :min="-50" :max="50" />
              </div>
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <label class="text-xs block mb-1">{{ $t('ui.color') }}</label>
                  <div class="flex gap-2">
                    <input v-model="activeLayer.color" type="color" class="w-8 h-8 rounded cursor-pointer border-0" />
                    <UInput v-model="activeLayer.color" size="xs" class="flex-1 font-mono" />
                  </div>
                </div>
                <div>
                  <label class="text-xs block mb-1">{{ $t('ui.insetShadow') }}</label>
                  <UToggle v-model="activeLayer.inset" />
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <UCard class="min-h-[400px] flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('ui.preview') }}</h3>
              <div class="flex items-center gap-2">
                <label class="text-xs text-gray-500">{{ $t('ui.backgroundColor') }}</label>
                <input v-model="previewBg" type="color" class="w-6 h-6 rounded cursor-pointer border-0" />
                <label class="text-xs text-gray-500 ml-2">{{ $t('ui.boxColor') }}</label>
                <input v-model="boxColor" type="color" class="w-6 h-6 rounded cursor-pointer border-0" />
              </div>
            </div>
          </template>
          <div class="flex-1 rounded-lg flex items-center justify-center p-8 transition-colors duration-300" :style="{ backgroundColor: previewBg }">
            <div class="w-48 h-48 rounded-2xl transition-all duration-300" :style="{ backgroundColor: boxColor, boxShadow: boxShadowCSS }" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.cssCode') }}</h3>
              </div>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(`box-shadow: ${boxShadowCSS};`, 'CSS')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <code class="font-mono text-sm text-gray-300 break-all"><span class="text-purple-400">box-shadow</span>: {{ boxShadowCSS }};</code>
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

interface ShadowLayer { x: number; y: number; blur: number; spread: number; color: string; inset: boolean }

const layers = ref<ShadowLayer[]>([
  { x: 0, y: 4, blur: 6, spread: -1, color: '#0000001a', inset: false },
  { x: 0, y: 2, blur: 4, spread: -1, color: '#0000000f', inset: false }
])

const activeLayerIndex = ref(0)
const previewBg = ref('#f3f4f6')
const boxColor = ref('#ffffff')

const activeLayer = computed(() => layers.value[activeLayerIndex.value])
const boxShadowCSS = computed(() => layers.value.map(l => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(', '))

function addLayer() {
  layers.value.push({ x: 0, y: 10, blur: 15, spread: -3, color: '#0000001a', inset: false })
  activeLayerIndex.value = layers.value.length - 1
}

function removeLayer(index: number) {
  layers.value.splice(index, 1)
  if (activeLayerIndex.value >= layers.value.length) activeLayerIndex.value = Math.max(0, layers.value.length - 1)
}

useHead({ title: t('pages.cssShadow.title'), meta: [{ name: 'description', content: t('pages.cssShadow.description') }] })
</script>
