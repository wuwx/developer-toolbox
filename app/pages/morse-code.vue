<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.morseCode.title')" :description="$t('pages.morseCode.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-signal" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.enterTextOrMorse')" :rows="15" class="w-full" />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="encode">{{ $t('ui.encode') }}</UButton>
          <UButton block color="primary" @click="decode">{{ $t('ui.decode') }}</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Morse')">{{ $t('ui.copy') }}</UButton>
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

const morseMap: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
}

const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))

function encode() {
  output.value = input.value.toUpperCase().split('').map(c => morseMap[c] || c).join(' ')
}

function decode() {
  output.value = input.value.split(' ').map(c => reverseMorseMap[c] || c).join('')
}

useHead({ title: t('pages.morseCode.title'), meta: [{ name: 'description', content: t('pages.morseCode.description') }] })
</script>
