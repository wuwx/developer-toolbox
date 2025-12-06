<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.hex.title')" :description="$t('pages.hex.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-hashtag" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full"/>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="encode">{{ $t('ui.encode') }}</UButton>
          <UButton block color="primary" @click="decode">{{ $t('ui.decode') }}</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Hex')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="font-mono w-full"/>
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

function encode() {
  try {
    output.value = Array.from(new TextEncoder().encode(input.value)).map(b => b.toString(16).padStart(2, '0')).join(' ')
  } catch (e) { output.value = t('ui.operationFailed') }
}

function decode() {
  try {
    const bytes = input.value.split(/\s+/).map(h => parseInt(h, 16))
    output.value = new TextDecoder().decode(new Uint8Array(bytes))
  } catch (e) { output.value = t('ui.operationFailed') }
}

useHead({ title: t('pages.hex.title'), meta: [{ name: 'description', content: t('pages.hex.description') }] })
</script>
