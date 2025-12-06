<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Gzip 压缩" description="文本 Gzip 压缩解压" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-archive-box" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入</h3></template>
        <UTextarea v-model="input" placeholder="输入文本..." :rows="15"/>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="compress">压缩</UButton>
          <UButton block color="primary" @click="decompress">解压</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">输出</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Gzip')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly/>
        <div v-if="ratio" class="mt-4 text-sm text-gray-500">压缩率: {{ ratio }}%</div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')
const ratio = ref('')

function compress() {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(input.value)
    output.value = btoa(String.fromCharCode(...data))
    const compressed = output.value.length
    const original = input.value.length
    ratio.value = ((1 - compressed / original) * 100).toFixed(1)
  } catch (e) {
    output.value = '压缩失败'
  }
}

function decompress() {
  try {
    const decoded = atob(input.value)
    const bytes = new Uint8Array(decoded.length)
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i)
    }
    output.value = new TextDecoder().decode(bytes)
  } catch (e) {
    output.value = '解压失败'
  }
}

useHead({ title: 'Gzip 压缩 | 开发者工具箱' })
</script>
