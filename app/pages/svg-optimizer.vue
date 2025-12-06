<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.svgOptimizer.title')" :description="$t('pages.svgOptimizer.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-photo" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-5 h-5" />
            <h3 class="font-semibold">{{ $t('ui.originalSvg') }}</h3>
          </div>
        </template>
        <UTextarea v-model="inputSvg" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="font-mono text-sm w-full" />
        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ $t('ui.size') }}: {{ originalSize }}</span>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.optimizedSvg') }}</h3>
            </div>
            <UButton v-if="outputSvg" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputSvg, 'SVG')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="outputSvg" :rows="15" readonly class="font-mono text-sm w-full" />
        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">{{ $t('ui.size') }}: {{ optimizedSize }}</span>
            <UBadge v-if="compressionRatio" color="success" variant="subtle">{{ $t('ui.reduced') }} {{ compressionRatio }}%</UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
          <h3 class="font-semibold">{{ $t('ui.options') }}</h3>
        </div>
      </template>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCheckbox v-model="options.removeComments" :label="$t('ui.removeComments')" />
        <UCheckbox v-model="options.removeMetadata" label="Remove metadata" />
        <UCheckbox v-model="options.removeEmptyAttrs" :label="$t('ui.removeEmptyAttributes')" />
        <UCheckbox v-model="options.removeWhitespace" :label="$t('ui.removeWhitespace')" />
        <UCheckbox v-model="options.minifyStyles" label="Minify styles" />
        <UCheckbox v-model="options.removeHiddenElems" label="Remove hidden elements" />
      </div>
      <div class="mt-6">
        <UButton block color="primary" size="lg" icon="i-heroicons-sparkles" @click="optimize">{{ $t('ui.compress') }}</UButton>
      </div>
    </UCard>

    <div v-if="outputSvg" class="mt-8 grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.preview') }} ({{ $t('ui.originalImage') }})</h3></template>
        <div class="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg" v-html="inputSvg"></div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.preview') }} ({{ $t('ui.optimizedSvg') }})</h3></template>
        <div class="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg" v-html="outputSvg"></div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputSvg = ref('')
const outputSvg = ref('')
const options = reactive({ removeComments: true, removeMetadata: true, removeEmptyAttrs: true, removeWhitespace: true, minifyStyles: true, removeHiddenElems: true })

const originalSize = computed(() => !inputSvg.value ? '0 B' : formatBytes(new Blob([inputSvg.value]).size))
const optimizedSize = computed(() => !outputSvg.value ? '0 B' : formatBytes(new Blob([outputSvg.value]).size))
const compressionRatio = computed(() => {
  if (!inputSvg.value || !outputSvg.value) return null
  const original = new Blob([inputSvg.value]).size
  const optimized = new Blob([outputSvg.value]).size
  const ratio = ((original - optimized) / original * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function optimize() {
  let svg = inputSvg.value
  if (!svg.trim()) { outputSvg.value = ''; return }
  try {
    if (options.removeComments) svg = svg.replace(/<!--[\s\S]*?-->/g, '')
    if (options.removeMetadata) { svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, ''); svg = svg.replace(/<title[\s\S]*?<\/title>/gi, ''); svg = svg.replace(/<desc[\s\S]*?<\/desc>/gi, '') }
    if (options.removeEmptyAttrs) svg = svg.replace(/\s+[a-z-]+=""\s*/gi, ' ')
    if (options.removeWhitespace) { svg = svg.replace(/\s+/g, ' '); svg = svg.replace(/>\s+</g, '><'); svg = svg.trim() }
    if (options.minifyStyles) svg = svg.replace(/style="([^"]*)"/g, (match, style) => `style="${style.replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').replace(/;\s*$/, '')}"`)
    if (options.removeHiddenElems) { svg = svg.replace(/<[^>]*display\s*:\s*none[^>]*>[\s\S]*?<\/[^>]+>/gi, ''); svg = svg.replace(/<[^>]*visibility\s*:\s*hidden[^>]*>[\s\S]*?<\/[^>]+>/gi, '') }
    outputSvg.value = svg
  } catch (e) { outputSvg.value = t('ui.error') + ': ' + (e as Error).message }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch(inputSvg, () => { if (inputSvg.value) optimize() })

useHead({ title: t('pages.svgOptimizer.title'), meta: [{ name: 'description', content: t('pages.svgOptimizer.description') }] })
</script>
