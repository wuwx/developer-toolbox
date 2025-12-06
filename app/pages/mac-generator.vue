<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="MAC 地址生成器"
      description="随机生成 MAC 地址，支持自定义分隔符和大小写，用于测试或模拟"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-500 to-gray-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-cpu-chip" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <!-- 配置 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium mb-2">分隔符</label>
              <USelect v-model="separator" :options="[{label: '冒号 (:)', value: ':'}, {label: '短横线 (-)', value: '-'}, {label: '无', value: ''}]" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">大小写</label>
              <USelect v-model="casing" :options="[{label: '大写', value: 'upper'}, {label: '小写', value: 'lower'}]" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">生成数量</label>
              <UInput type="number" v-model="count" min="1" max="100" />
            </div>
          </div>
          
          <div class="mt-6">
            <UButton
              block
              size="lg"
              color="primary"
              icon="i-heroicons-arrow-path"
              @click="generate"
            >
              重新生成
            </UButton>
          </div>
        </div>

        <!-- 结果 -->
        <div v-if="macs.length > 0" class="space-y-4 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">生成结果</h3>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document-list"
              @click="copyAll"
            >
              复制全部
            </UButton>
          </div>

          <div class="grid gap-2">
            <div
              v-for="(mac, index) in macs"
              :key="index"
              class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div class="font-mono text-lg">{{ mac }}</div>
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(mac, 'MAC 地址')"
              />
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

const separator = ref(':')
const casing = ref('upper')
const count = ref(5)
const macs = ref<string[]>([])

const generate = () => {
  const newMacs = []
  const hex = '0123456789ABCDEF'
  
  for (let i = 0; i < count.value; i++) {
    let mac = ''
    for (let j = 0; j < 12; j++) {
      mac += hex.charAt(Math.floor(Math.random() * 16))
    }
    
    // Format
    let formatted = ''
    if (separator.value) {
      formatted = mac.match(/.{1,2}/g)?.join(separator.value) || mac
    } else {
      formatted = mac
    }
    
    if (casing.value === 'lower') {
      formatted = formatted.toLowerCase()
    }
    
    newMacs.push(formatted)
  }
  
  macs.value = newMacs
}

const copyAll = () => {
  copyToClipboard(macs.value.join('\n'), '所有 MAC')
}

onMounted(() => {
  generate()
})

useHead({
  title: 'MAC 地址生成器 - 随机物理地址 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线随机 MAC 地址生成器，支持自定义分隔符和大小写。' }
  ]
})
</script>
