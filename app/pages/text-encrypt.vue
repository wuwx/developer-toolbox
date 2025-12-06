<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="文本加密" description="简单文本加密工具" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入</h3></template>
        <div class="space-y-4">
          <UInput v-model="password" type="password" placeholder="密码" size="xl" />
          <UTextarea v-model="input" placeholder="输入文本..." :rows="12" />
          <div class="grid grid-cols-2 gap-4">
            <UButton block color="primary" @click="encrypt">加密</UButton>
            <UButton block color="primary" @click="decrypt">解密</UButton>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">输出</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, '结果')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const password = ref('')
const input = ref('')
const output = ref('')

function encrypt() {
  if (!password.value) { output.value = '请输入密码'; return }
  try {
    const key = password.value.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    output.value = btoa(input.value.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join(''))
  } catch (e) {
    output.value = '加密失败'
  }
}

function decrypt() {
  if (!password.value) { output.value = '请输入密码'; return }
  try {
    const key = password.value.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    output.value = atob(input.value).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('')
  } catch (e) {
    output.value = '解密失败'
  }
}

useHead({ title: '文本加密 | 开发者工具箱' })
</script>
