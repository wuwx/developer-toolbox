<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.gzip.title')" :description="$t('pages.gzip.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-archive-box" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full"/>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="compress">{{ $t('ui.compress') }}</UButton>
          <UButton block color="primary" @click="decompress">{{ $t('ui.decode') }}</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Gzip')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="w-full"/>
        <div v-if="ratio" class="mt-4 text-sm text-gray-500">{{ $t('ui.compressionRatio') }}: {{ ratio }}%</div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')
const ratio = ref('')

function compress() {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(input.value)
    output.value = btoa(String.fromCharCode(...data))
    ratio.value = ((1 - output.value.length / input.value.length) * 100).toFixed(1)
  } catch (e) { output.value = t('ui.operationFailed') }
}

function decompress() {
  try {
    const decoded = atob(input.value)
    const bytes = new Uint8Array(decoded.length)
    for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i)
    output.value = new TextDecoder().decode(bytes)
  } catch (e) { output.value = t('ui.operationFailed') }
}

useHead({ title: t('pages.gzip.title'), meta: [{ name: 'description', content: t('pages.gzip.description') }] })
</script>
