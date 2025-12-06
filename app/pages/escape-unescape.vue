<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Escape / Unescape" description="字符串转义与反转义" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入</h3></template>
        <UTextarea v-model="input" placeholder="输入文本..." :rows="15" />
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

    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      <UButton block color="primary" @click="escapeHtml">HTML Escape</UButton>
      <UButton block color="primary" @click="unescapeHtml">HTML Unescape</UButton>
      <UButton block color="primary" @click="escapeJs">JavaScript Escape</UButton>
      <UButton block color="primary" @click="unescapeJs">JavaScript Unescape</UButton>
      <UButton block color="primary" @click="escapeJson">JSON Escape</UButton>
      <UButton block color="primary" @click="unescapeJson">JSON Unescape</UButton>
      <UButton block color="primary" @click="escapeXml">XML Escape</UButton>
      <UButton block color="primary" @click="unescapeXml">XML Unescape</UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')

function escapeHtml() {
  output.value = input.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function unescapeHtml() {
  output.value = input.value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function escapeJs() {
  output.value = input.value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

function unescapeJs() {
  output.value = input.value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
}

function escapeJson() {
  try {
    output.value = JSON.stringify(input.value)
  } catch (e) {
    output.value = '错误: ' + (e as Error).message
  }
}

function unescapeJson() {
  try {
    output.value = JSON.parse(input.value)
  } catch (e) {
    output.value = '错误: ' + (e as Error).message
  }
}

function escapeXml() {
  escapeHtml()
}

function unescapeXml() {
  unescapeHtml()
}

useHead({
  title: 'Escape / Unescape 工具 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线字符串转义和反转义工具' }]
})
</script>
