<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.cssMinifier.title')" :description="$t('pages.cssMinifier.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-paint-brush" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
            <h3 class="font-semibold">{{ $t('ui.originalCss') }}</h3>
          </div>
        </template>
        <UTextarea v-model="inputCss" :placeholder="$t('ui.inputPlaceholder')" :rows="20" class="font-mono text-sm w-full" />
        <div class="mt-4 text-sm text-gray-500">{{ $t('ui.size') }}: {{ originalSize }}</div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.compressedCss') }}</h3>
            </div>
            <UButton v-if="outputCss" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputCss, 'CSS')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="outputCss" :rows="20" readonly class="font-mono text-sm w-full" />
        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ $t('ui.size') }}: {{ compressedSize }}</span>
          <UBadge v-if="compressionRatio" color="success" variant="subtle">{{ $t('ui.reduced') }} {{ compressionRatio }}%</UBadge>
        </div>
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
          <h3 class="font-semibold">{{ $t('ui.compressOptions') }}</h3>
        </div>
      </template>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCheckbox v-model="options.removeComments" :label="$t('ui.removeComments')" />
        <UCheckbox v-model="options.removeWhitespace" :label="$t('ui.removeWhitespace')" />
        <UCheckbox v-model="options.removeLastSemicolon" :label="$t('ui.removeLastSemicolon')" />
        <UCheckbox v-model="options.shortenColors" :label="$t('ui.shortenColors')" />
        <UCheckbox v-model="options.shortenZeros" :label="$t('ui.shortenZeros')" />
        <UCheckbox v-model="options.removeEmptyRules" :label="$t('ui.removeEmptyRules')" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputCss = ref('')
const outputCss = ref('')
const options = reactive({ removeComments: true, removeWhitespace: true, removeLastSemicolon: true, shortenColors: true, shortenZeros: true, removeEmptyRules: true })

const originalSize = computed(() => !inputCss.value ? '0 B' : formatBytes(new Blob([inputCss.value]).size))
const compressedSize = computed(() => !outputCss.value ? '0 B' : formatBytes(new Blob([outputCss.value]).size))
const compressionRatio = computed(() => {
  if (!inputCss.value || !outputCss.value) return null
  const original = new Blob([inputCss.value]).size
  const compressed = new Blob([outputCss.value]).size
  const ratio = ((original - compressed) / original * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function minify() {
  let css = inputCss.value
  if (!css.trim()) { outputCss.value = ''; return }
  try {
    if (options.removeComments) css = css.replace(/\/\*[\s\S]*?\*\//g, '')
    if (options.removeWhitespace) { css = css.replace(/\s+/g, ' '); css = css.replace(/\s*([{}:;,])\s*/g, '$1'); css = css.trim() }
    if (options.removeLastSemicolon) css = css.replace(/;}/g, '}')
    if (options.shortenColors) css = css.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3')
    if (options.shortenZeros) { css = css.replace(/\b0+(\.\d+)/g, '$1'); css = css.replace(/(\d)\.0+\b/g, '$1'); css = css.replace(/\b0+(px|em|rem|%|vh|vw|pt|cm|mm|in)/g, '0') }
    if (options.removeEmptyRules) css = css.replace(/[^{}]+\{\s*\}/g, '')
    outputCss.value = css
  } catch (e) { outputCss.value = t('ui.error') + ': ' + (e as Error).message }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch([inputCss, options], () => { if (inputCss.value) minify() }, { deep: true })

useHead({ title: t('pages.cssMinifier.title'), meta: [{ name: 'description', content: t('pages.cssMinifier.description') }] })
</script>
