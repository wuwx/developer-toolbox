<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.jsMinifier.title')" :description="$t('pages.jsMinifier.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.originalJs') }}</h3></template>
        <UTextarea v-model="inputJs" :placeholder="$t('ui.inputPlaceholder')" :rows="20" class="font-mono text-sm w-full" />
        <div class="mt-4 text-sm text-gray-500">{{ $t('ui.size') }}: {{ originalSize }}</div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ $t('ui.compressedCss') }}</h3>
            <UButton v-if="outputJs" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputJs, 'JavaScript')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="outputJs" :rows="20" readonly class="font-mono text-sm w-full" />
        <div class="mt-4 flex items-center justify-between text-sm">
          <span class="text-gray-500">{{ $t('ui.size') }}: {{ compressedSize }}</span>
          <UBadge v-if="compressionRatio" color="success" variant="subtle">{{ $t('ui.reduced') }} {{ compressionRatio }}%</UBadge>
        </div>
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header><h3 class="font-semibold">{{ $t('ui.compressOptions') }}</h3></template>
      <div class="grid sm:grid-cols-3 gap-4">
        <UCheckbox v-model="options.removeComments" :label="$t('ui.removeComments')" />
        <UCheckbox v-model="options.removeWhitespace" :label="$t('ui.removeWhitespace')" />
        <UCheckbox v-model="options.removeConsole" :label="$t('ui.removeConsole')" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputJs = ref('')
const outputJs = ref('')
const options = reactive({ removeComments: true, removeWhitespace: true, removeConsole: false })

const originalSize = computed(() => !inputJs.value ? '0 B' : formatBytes(new Blob([inputJs.value]).size))
const compressedSize = computed(() => !outputJs.value ? '0 B' : formatBytes(new Blob([outputJs.value]).size))
const compressionRatio = computed(() => {
  if (!inputJs.value || !outputJs.value) return null
  const ratio = ((new Blob([inputJs.value]).size - new Blob([outputJs.value]).size) / new Blob([inputJs.value]).size * 100).toFixed(1)
  return parseFloat(ratio) > 0 ? ratio : null
})

function minify() {
  let js = inputJs.value
  if (!js.trim()) { outputJs.value = ''; return }
  try {
    if (options.removeComments) js = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
    if (options.removeWhitespace) js = js.replace(/\s+/g, ' ').trim()
    if (options.removeConsole) js = js.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '')
    outputJs.value = js
  } catch (e) { outputJs.value = t('ui.error') + ': ' + (e as Error).message }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

watch([inputJs, options], () => { if (inputJs.value) minify() }, { deep: true })

useHead({ title: t('pages.jsMinifier.title'), meta: [{ name: 'description', content: t('pages.jsMinifier.description') }] })
</script>
