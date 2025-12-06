<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="敏感词过滤" description="检测和过滤敏感词" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-shield-exclamation" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入文本</h3></template>
        <UTextarea v-model="input" placeholder="输入文本..." :rows="15" @input="filter" />
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">过滤结果</h3>
            <UBadge v-if="count" color="error">检测到 {{ count }} 个敏感词</UBadge>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const input = ref('')
const output = ref('')
const count = ref(0)

const sensitiveWords = ['敏感词1', '敏感词2', '测试', '示例']

function filter() {
  let result = input.value
  count.value = 0
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'g')
    const matches = result.match(regex)
    if (matches) count.value += matches.length
    result = result.replace(regex, '*'.repeat(word.length))
  })
  output.value = result
}

useHead({ title: '敏感词过滤 | 开发者工具箱' })
</script>
