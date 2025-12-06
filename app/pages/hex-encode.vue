<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Hex 编码" description="十六进制编码解码" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-hashtag" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入</h3></template>
        <UTextarea v-model="input" placeholder="输入文本..." :rows="15" class="w-full"/>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="encode">编码</UButton>
          <UButton block color="primary" @click="decode">解码</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">输出</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Hex')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="font-mono w-full"/>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')

function encode() {
  try {
    output.value = Array.from(new TextEncoder().encode(input.value))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ')
  } catch (e) {
    output.value = '编码失败'
  }
}

function decode() {
  try {
    const bytes = input.value.split(/\s+/).map(h => parseInt(h, 16))
    output.value = new TextDecoder().decode(new Uint8Array(bytes))
  } catch (e) {
    output.value = '解码失败'
  }
}

useHead({ title: 'Hex 编码 | 开发者工具箱' })
</script>
