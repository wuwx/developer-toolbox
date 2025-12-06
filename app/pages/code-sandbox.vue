<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="代码沙箱" description="在线运行 JavaScript 代码" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket-square" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">JavaScript 代码</h3>
            <UButton color="primary" @click="run" icon="i-heroicons-play">运行</UButton>
          </div>
        </template>
        <UTextarea v-model="code" placeholder="console.log('Hello World')" :rows="20" class="font-mono text-sm" />
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">输出</h3></template>
        <div class="p-4 bg-gray-900 rounded-lg min-h-[400px]">
          <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{ output || '点击运行按钮执行代码' }}</pre>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const code = ref('console.log("Hello World")')
const output = ref('')

function run() {
  output.value = ''
  const logs: string[] = []
  const originalLog = console.log
  console.log = (...args) => {
    logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
  }
  try {
    eval(code.value)
    output.value = logs.join('\n') || '执行完成，无输出'
  } catch (e) {
    output.value = 'Error: ' + (e as Error).message
  } finally {
    console.log = originalLog
  }
}

useHead({ title: '代码沙箱 | 开发者工具箱' })
</script>
