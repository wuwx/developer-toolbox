<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.gradient.title')" :description="$t('pages.gradient.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 via-pink-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-swatch" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <div class="space-y-6 lg:sticky lg:top-24">
        <UCard>
          <template #header><h3 class="font-semibold">{{ $t('ui.preview') }}</h3></template>
          <div class="relative aspect-[4/3] rounded-xl" :style="{ background: gradientCSS }" />
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.cssCode') }}</h3>
              </div>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(`background: ${gradientCSS};`, 'CSS')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <code class="font-mono text-sm text-gray-300 break-all"><span class="text-purple-400">background</span>: {{ gradientCSS }};</code>
          </div>
        </UCard>
      </div>

      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.type') }}</h3>
            </div>
          </template>
          <USelect v-model="gradientType" :options="gradientTypeOptions" size="xl" />
        </UCard>

        <UCard v-if="gradientType === 'linear'">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-arrows-right-left" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.direction') }}</h3>
            </div>
          </template>
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{{ $t('ui.angle') }}</label>
              <span class="text-xs text-gray-500">{{ angle }}deg</span>
            </div>
            <URange v-model="angle" :min="0" :max="360" />
          </div>
          <div class="grid grid-cols-4 gap-2 mt-4">
            <UButton v-for="dir in directions" :key="dir.name" color="neutral" variant="soft" size="sm" @click="angle = dir.angle">{{ dir.name }}</UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-swatch" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.colorStops') }}</h3>
              </div>
              <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-plus" @click="addColor" :disabled="colors.length >= 5">{{ $t('ui.add') }}</UButton>
            </div>
          </template>
          <div class="space-y-4">
            <div v-for="(color, index) in colors" :key="index" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <UInput v-model="color.value" type="color" class="w-16 h-10" />
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1"><span class="text-xs text-gray-500">{{ $t('ui.position') }}: {{ color.position }}%</span></div>
                <URange v-model="color.position" :min="0" :max="100" size="sm" />
              </div>
              <UButton v-if="colors.length > 2" color="error" variant="ghost" size="xs" icon="i-heroicons-trash" @click="removeColor(index)" />
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.presetEffects') }}</h3>
            </div>
          </template>
          <div class="grid grid-cols-2 gap-2">
            <UButton v-for="preset in presets" :key="preset.name" color="neutral" variant="soft" size="sm" @click="applyPreset(preset)">{{ preset.name }}</UButton>
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

const gradientType = ref<'linear' | 'radial'>('linear')
const angle = ref(90)
const colors = ref([{ value: '#667eea', position: 0 }, { value: '#764ba2', position: 100 }])

const gradientTypeOptions = computed(() => [
  { label: t('ui.linearGradient'), value: 'linear' },
  { label: t('ui.radialGradient'), value: 'radial' }
])

const gradientCSS = computed(() => {
  const colorStops = colors.value.sort((a, b) => a.position - b.position).map(c => `${c.value} ${c.position}%`).join(', ')
  return gradientType.value === 'linear' ? `linear-gradient(${angle.value}deg, ${colorStops})` : `radial-gradient(circle, ${colorStops})`
})

const directions = [{ name: '↑', angle: 0 }, { name: '→', angle: 90 }, { name: '↓', angle: 180 }, { name: '←', angle: 270 }]

function addColor() { if (colors.value.length < 5) colors.value.push({ value: '#3b82f6', position: 50 }) }
function removeColor(index: number) { if (colors.value.length > 2) colors.value.splice(index, 1) }

const presets = [
  { name: 'Sunset', colors: [{ value: '#ff6b6b', position: 0 }, { value: '#feca57', position: 100 }] },
  { name: 'Ocean', colors: [{ value: '#667eea', position: 0 }, { value: '#764ba2', position: 100 }] },
  { name: 'Forest', colors: [{ value: '#2ecc71', position: 0 }, { value: '#27ae60', position: 100 }] },
  { name: 'Rainbow', colors: [{ value: '#f093fb', position: 0 }, { value: '#f5576c', position: 100 }] }
]

function applyPreset(preset: typeof presets[0]) { colors.value = JSON.parse(JSON.stringify(preset.colors)) }

useHead({ title: t('pages.gradient.title'), meta: [{ name: 'description', content: t('pages.gradient.description') }] })
</script>
