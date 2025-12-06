<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="UUID v4 生成器"
      description="批量生成随机 UUID (Version 4)，支持一键复制"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-finger-print" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 版本导航 -->
    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <UButton to="/uuid" color="primary" variant="solid" size="sm">UUID v4 (随机)</UButton>
      <UButton to="/uuid/v1" color="neutral" variant="soft" size="sm">UUID v1 (时间戳)</UButton>
      <UButton to="/uuid/v3" color="neutral" variant="soft" size="sm">UUID v3 (MD5)</UButton>
      <UButton to="/uuid/v5" color="neutral" variant="soft" size="sm">UUID v5 (SHA1)</UButton>
    </div>

    <ToolCard>
      <!-- 配置区域 -->
      <div class="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50">
        <div class="flex items-center justify-between mb-4">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">生成数量</label>
          <span class="text-2xl font-bold text-primary-600">{{ count }}</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <URange v-model="count" :min="1" :max="50" size="lg" />
          </div>
          <UButton
            color="primary"
            size="lg"
            icon="i-heroicons-arrow-path"
            :loading="generating"
            @click="generateUUIDs"
          >
            重新生成
          </UButton>
        </div>
      </div>

      <!-- 结果列表 -->
      <div v-if="uuids.length > 0" class="space-y-4 animate-fade-in">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">生成结果</h3>
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

        <div class="grid gap-3">
          <div
            v-for="(uuid, index) in uuids"
            :key="uuid"
            class="group flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 transition-all hover:border-primary-500/50 hover:shadow-sm"
          >
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-mono">
              {{ index + 1 }}
            </div>
            <div class="flex-1 font-mono text-base text-gray-700 dark:text-gray-200 select-all">
              {{ uuid }}
            </div>
            <UTooltip text="复制">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-heroicons-clipboard-document"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                @click="() => copyToClipboard(uuid, 'UUID')"
              />
            </UTooltip>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="关于 UUID" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const count = ref(5)
const uuids = ref<string[]>([])
const generating = ref(false)
const { copyToClipboard } = useToolClipboard()

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 UUID？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'UUID（Universally Unique Identifier）通用唯一识别码，是一种软件建构的标准。本工具生成的是 Version 4 (随机生成) UUID。'
  },
  {
    slot: 'format',
    label: '格式说明',
    icon: 'i-heroicons-code-bracket',
    content: '标准的 UUID 格式为：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12)，共 32 个十六进制字符，加上 4 个连字符。'
  }
]

const generateUUIDs = () => {
  generating.value = true
  uuids.value = []
  
  // 模拟一点延迟让动画更流畅
  setTimeout(() => {
    for (let i = 0; i < count.value; i++) {
      uuids.value.push(crypto.randomUUID())
    }
    generating.value = false
  }, 300)
}

const copyAll = () => {
  copyToClipboard(uuids.value.join('\n'), '所有 UUID')
}

// 监听数量变化自动生成
watch(count, () => {
  generateUUIDs()
})

// 初始生成
onMounted(() => {
  generateUUIDs()
})

useHead({
  title: 'UUID 生成器 - 在线批量生成 UUID v4',
  meta: [
    { name: 'description', content: '免费在线批量生成 UUID v4，支持一键复制，随机唯一标识符生成器' }
  ]
})
</script>
