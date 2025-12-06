<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="HTTP 头部分析" description="分析 HTTP 请求响应头" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入 Headers</h3></template>
        <UTextarea v-model="input" placeholder="Content-Type: application/json&#10;Authorization: Bearer token..." :rows="15" @input="parse" />
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">解析结果</h3></template>
        <div class="space-y-2">
          <div v-for="(value, key) in parsed" :key="key" class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="text-sm font-semibold text-primary-600">{{ key }}</div>
            <div class="text-sm font-mono mt-1">{{ value }}</div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const input = ref('')
const parsed = ref<Record<string, string>>({})

function parse() {
  parsed.value = {}
  input.value.split('\n').forEach(line => {
    const [key, ...values] = line.split(':')
    if (key && values.length) {
      parsed.value[key.trim()] = values.join(':').trim()
    }
  })
}

useHead({ title: 'HTTP 头部分析 | 开发者工具箱' })
</script>
