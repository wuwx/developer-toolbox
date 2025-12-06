<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.htmlMinifier.title')" :description="$t('pages.htmlMinifier.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
            <h3 class="font-semibold">{{ $t('ui.originalHtml') }}</h3>
          </div>
        </template>
        <UTextarea v-model="inputHtml" :placeholder="$t('ui.inputPlaceholder')" :rows="20" class="font-mono text-sm w-full" />
        <div class="mt-4 text-sm text-gray-500">{{ $t('ui.size') }}: {{ originalSize }}</div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.compressedCss') }}</h3>
            </div>
            <UButton v-if="outputHtml" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputHtml, 'HTML')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="outputHtml" :rows="20" readonly class="font-mono text-sm w-full" />
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
        <UCheckbox v-model="options.collapseWhitespace" :label="$t('ui.collapseWhitespace')" />
        <UCheckbox v-model="options.removeEmptyAttributes" :label="$t('ui.removeEmptyAttributes')" />
        <UCheckbox v-model="options.minifyCSS" :label="$t('ui.minifyInlineCss')" />
        <UCheckbox v-model="options.minifyJS" :label="$t('ui.minifyInlineJs')" />
        <UCheckbox v-model="options.removeOptionalTags" :label="$t('ui.removeOptionalTags')" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputHtml = ref('')
const outputHtml = ref('')
const options = reactive({ removeComments: true, collapseWhitespace: true, removeEmptyAttributes: true, minifyCSS: true, minifyJS: false, removeOptionalTags: false })

const originalSize = computed(() => !inputHtml.value ? '0 B' : formatBytes(new Blob([inputHtml.value]).size))
const compressedSize = computed(() => !outputHtml.value ? '0 B' : formatBytes(new Blob([outputHtml.value]).size))
const compressionRatio = computed(() => {
  if (!inputHtml.value || !outputHtml.value) return null
  const original = new Blob([inputHtml.value]).size
  const compressed = new Blob([outputHtml.value]).size
  const ratio = ((original - compressed) / original * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function minify() {
  let html = inputHtml.value
  if (!html.trim()) { outputHtml.value = ''; return }
  try {
    if (options.removeComments) html = html.replace(/<!--[\s\S]*?-->/g, '')
    if (options.collapseWhitespace) { html = html.replace(/\s+/g, ' '); html = html.replace(/>\s+</g, '><'); html = html.trim() }
    if (options.removeEmptyAttributes) html = html.replace(/\s+[a-z-]+=""\s*/gi, ' ')
    if (options.minifyCSS) {
      html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
        const minified = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim()
        return match.replace(css, minified)
      })
      html = html.replace(/style="([^"]*)"/g, (match, style) => {
        const minified = style.replace(/\s*:\s*/g, ':').replace(/\s*;\s*/g, ';').replace(/;\s*$/, '')
        return `style="${minified}"`
      })
    }
    if (options.removeOptionalTags) html = html.replace(/<\/?(html|head|body)>/gi, '')
    outputHtml.value = html
  } catch (e) { outputHtml.value = t('ui.error') + ': ' + (e as Error).message }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch([inputHtml, options], () => { if (inputHtml.value) minify() }, { deep: true })

useHead({ title: t('pages.htmlMinifier.title'), meta: [{ name: 'description', content: t('pages.htmlMinifier.description') }] })
</script>
