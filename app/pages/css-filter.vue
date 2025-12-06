<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.cssFilter.title')" :description="$t('pages.cssFilter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-sparkles" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-photo" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.image') }}</h3>
            </div>
          </template>
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer relative overflow-hidden group" @click="triggerFileInput">
            <img v-if="previewImage" :src="previewImage" class="max-h-32 mx-auto object-contain opacity-50 group-hover:opacity-30 transition-opacity" />
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <UIcon name="i-heroicons-arrow-up-tray" class="w-8 h-8 text-gray-600 dark:text-gray-300 mb-1" />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ $t('ui.import') }}</span>
            </div>
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.presetEffects') }}</h3>
            </div>
          </template>
          <div class="grid grid-cols-2 gap-2">
            <UButton v-for="preset in presets" :key="preset.name" color="neutral" variant="soft" size="sm" @click="applyPreset(preset)">{{ preset.label }}</UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.cssCode') }}</h3>
              </div>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(`filter: ${filterCSS};`, 'CSS')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-3 bg-gray-900 rounded-lg">
            <code class="font-mono text-xs text-gray-300 break-all leading-relaxed"><span class="text-purple-400">filter</span>: {{ filterCSS }};</code>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <UCard class="overflow-hidden bg-gray-900 flex items-center justify-center min-h-[400px]">
          <img :src="previewImage" class="max-w-full max-h-[600px] object-contain transition-all duration-300" :style="{ filter: filterCSS }" />
        </UCard>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.blur') }}</label><span class="text-xs font-mono">{{ filters.blur }}px</span></div>
                <URange v-model="filters.blur" :min="0" :max="20" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.brightness') }}</label><span class="text-xs font-mono">{{ filters.brightness }}%</span></div>
                <URange v-model="filters.brightness" :min="0" :max="200" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.contrast') }}</label><span class="text-xs font-mono">{{ filters.contrast }}%</span></div>
                <URange v-model="filters.contrast" :min="0" :max="200" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.grayscale') }}</label><span class="text-xs font-mono">{{ filters.grayscale }}%</span></div>
                <URange v-model="filters.grayscale" :min="0" :max="100" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.hueRotate') }}</label><span class="text-xs font-mono">{{ filters.hueRotate }}deg</span></div>
                <URange v-model="filters.hueRotate" :min="0" :max="360" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.invert') }}</label><span class="text-xs font-mono">{{ filters.invert }}%</span></div>
                <URange v-model="filters.invert" :min="0" :max="100" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.opacity') }}</label><span class="text-xs font-mono">{{ filters.opacity }}%</span></div>
                <URange v-model="filters.opacity" :min="0" :max="100" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.saturate') }}</label><span class="text-xs font-mono">{{ filters.saturate }}%</span></div>
                <URange v-model="filters.saturate" :min="0" :max="200" />
              </div>
              <div>
                <div class="flex justify-between mb-1"><label class="text-xs font-medium">{{ $t('ui.sepia') }}</label><span class="text-xs font-mono">{{ filters.sepia }}%</span></div>
                <URange v-model="filters.sepia" :min="0" :max="100" />
              </div>
            </div>
          </UCard>
        </div>
        
        <div class="flex justify-end">
          <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-path" @click="reset">{{ $t('ui.resetAll') }}</UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const fileInput = ref<HTMLInputElement | null>(null)
const previewImage = ref('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')

const filters = reactive({ blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 100, sepia: 0 })

const filterCSS = computed(() => {
  const parts = []
  if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`)
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`)
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`)
  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`)
  if (filters.hueRotate > 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`)
  if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`)
  if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`)
  if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`)
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`)
  return parts.join(' ') || 'none'
})

const presets = computed(() => [
  { name: 'bw', label: t('ui.blackWhite'), filters: { grayscale: 100 } },
  { name: 'vintage', label: t('ui.vintage'), filters: { sepia: 80, contrast: 90 } },
  { name: 'overexposed', label: t('ui.overexposed'), filters: { brightness: 150, contrast: 130 } },
  { name: 'cool', label: t('ui.coolTone'), filters: { hueRotate: 180, saturate: 80 } },
  { name: 'inverted', label: t('ui.inverted'), filters: { invert: 100 } },
  { name: 'blurred', label: t('ui.blurred'), filters: { blur: 5 } }
])

function triggerFileInput() { fileInput.value?.click() }
function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => { previewImage.value = e.target?.result as string }
    reader.readAsDataURL(input.files[0])
  }
}
function reset() { Object.assign(filters, { blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, opacity: 100, saturate: 100, sepia: 0 }) }
function applyPreset(preset: any) { reset(); Object.assign(filters, preset.filters) }

useHead({ title: t('pages.cssFilter.title'), meta: [{ name: 'description', content: t('pages.cssFilter.description') }] })
</script>
