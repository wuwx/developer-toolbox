<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.base32.title')" :description="$t('pages.base32.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full" />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="encode">{{ $t('ui.encode') }}</UButton>
          <UButton block color="primary" @click="decode">{{ $t('ui.decode') }}</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Base32')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="w-full" />
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
const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function encode() {
  try {
    const bytes = new TextEncoder().encode(input.value)
    let bits = ''
    bytes.forEach(byte => bits += byte.toString(2).padStart(8, '0'))
    let result = ''
    for (let i = 0; i < bits.length; i += 5) {
      const chunk = bits.substr(i, 5).padEnd(5, '0')
      result += base32Chars[parseInt(chunk, 2)]
    }
    output.value = result
  } catch (e) { output.value = t('ui.operationFailed') }
}

function decode() {
  try {
    let bits = ''
    for (const char of input.value.toUpperCase()) {
      const index = base32Chars.indexOf(char)
      if (index === -1) continue
      bits += index.toString(2).padStart(5, '0')
    }
    const bytes = []
    for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.substr(i, 8), 2))
    output.value = new TextDecoder().decode(new Uint8Array(bytes))
  } catch (e) { output.value = t('ui.operationFailed') }
}

useHead({ title: t('pages.base32.title'), meta: [{ name: 'description', content: t('pages.base32.description') }] })
</script>
