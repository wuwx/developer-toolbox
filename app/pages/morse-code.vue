<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="摩斯电码" description="摩斯电码编码解码" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-signal" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入</h3></template>
        <UTextarea v-model="input" placeholder="输入文本或摩斯电码..." :rows="15" class="w-full" />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="encode">编码</UButton>
          <UButton block color="primary" @click="decode">解码</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">输出</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, '摩斯电码')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="w-full" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
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

useHead({ title: '摩斯电码 | 开发者工具箱' })
</script>
