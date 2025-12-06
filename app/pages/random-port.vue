<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="随机端口生成器"
      description="生成随机的可用端口号，用于开发测试避免端口冲突"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <!-- 配置 -->
        <div class="flex justify-center gap-8">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">范围</label>
            <UInput type="number" v-model="min" class="w-24" />
            <span>-</span>
            <UInput type="number" v-model="max" class="w-24" />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">数量</label>
            <UInput type="number" v-model="count" class="w-20" min="1" max="50" />
          </div>
        </div>

        <div class="flex justify-center">
          <UButton
            size="lg"
            color="primary"
            icon="i-heroicons-arrow-path"
            @click="generate"
          >
            生成端口
          </UButton>
        </div>

        <!-- 结果 -->
        <div v-if="ports.length > 0" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 animate-fade-in">
          <div 
            v-for="port in ports" 
            :key="port"
            class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer"
            @click="copyToClipboard(port.toString(), '端口')"
          >
            <div class="text-xl font-mono font-bold text-gray-900 dark:text-white">{{ port }}</div>
            <div class="absolute inset-0 flex items-center justify-center bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <UIcon name="i-heroicons-clipboard-document" class="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

definePageMeta({
  layout: 'default'
})

const min = ref(1024)
const max = ref(65535)
const count = ref(10)
const ports = ref<number[]>([])

const generate = () => {
  const newPorts = new Set<number>()
  const range = max.value - min.value + 1
  
  if (range <= 0) return
  
  // 防止死循环
  const limit = Math.min(count.value, range)
  
  while (newPorts.size < limit) {
    const port = Math.floor(Math.random() * range) + parseInt(min.value.toString())
    newPorts.add(port)
  }
  
  ports.value = Array.from(newPorts).sort((a, b) => a - b)
}

onMounted(() => {
  generate()
})

useHead({
  title: '随机端口生成器 - 开发测试端口 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线随机端口生成器，生成指定范围内的可用端口号。' }
  ]
})
</script>
