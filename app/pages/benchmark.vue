<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="性能测试" description="JavaScript 性能基准测试" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-bolt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="space-y-6">
      <UCard>
        <template #header><h3 class="font-semibold">测试代码</h3></template>
        <UTextarea v-model="code" placeholder="// 输入要测试的代码&#10;for(let i=0; i<1000; i++) {}" :rows="10" class="font-mono text-sm w-full" />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium mb-2 block">运行次数: {{ iterations }}</label>
            <URange v-model="iterations" :min="100" :max="10000" :step="100" />
          </div>
          <div class="flex items-end">
            <UButton block color="primary" size="lg" @click="test" :loading="testing">开始测试</UButton>
          </div>
        </div>
      </UCard>
      <UCard v-if="result">
        <template #header><h3 class="font-semibold">测试结果</h3></template>
        <div class="grid sm:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-3xl font-bold text-primary-600">{{ result.time }}ms</div>
            <div class="text-sm text-gray-500 mt-2">总耗时</div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-3xl font-bold text-primary-600">{{ result.avg }}ms</div>
            <div class="text-sm text-gray-500 mt-2">平均耗时</div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-3xl font-bold text-primary-600">{{ result.ops }}</div>
            <div class="text-sm text-gray-500 mt-2">ops/s</div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const code = ref('for(let i=0; i<1000; i++) {}')
const iterations = ref(1000)
const testing = ref(false)
const result = ref<any>(null)

async function test() {
  testing.value = true
  await new Promise(resolve => setTimeout(resolve, 100))
  try {
    const start = performance.now()
    for (let i = 0; i < iterations.value; i++) {
      eval(code.value)
    }
    const end = performance.now()
    const time = (end - start).toFixed(2)
    const avg = (parseFloat(time) / iterations.value).toFixed(4)
    const ops = Math.floor(1000 / parseFloat(avg))
    result.value = { time, avg, ops }
  } catch (e) {
    alert('测试失败: ' + (e as Error).message)
  } finally {
    testing.value = false
  }
}

useHead({ title: '性能测试 | 开发者工具箱' })
</script>
