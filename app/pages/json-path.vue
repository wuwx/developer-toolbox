<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="JSON 路径提取"
      description="使用简单的点号语法提取 JSON 数据中的特定值"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-magnifying-glass-circle" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- JSON 输入 -->
      <div class="lg:col-span-1 space-y-6">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">输入 JSON</h3>
              <UButton
                v-if="input"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="input = ''"
              >
                清空
              </UButton>
            </div>
          </template>
          <UTextarea
            v-model="input"
            placeholder='{"store": {"book": [{"title": "book1"}]}}'
            :rows="20"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </UCard>
      </div>

      <!-- 操作与结果 -->
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold">查询路径</h3>
          </template>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Path</label>
              <UInput 
                v-model="path" 
                placeholder="store.book[0].title" 
                size="xl" 
                class="font-mono"
                icon="i-heroicons-magnifying-glass"
              />
              <div class="text-xs text-gray-500 mt-1">
                支持语法：<code>key</code>, <code>array[0]</code>, <code>nested.key</code>
              </div>
            </div>
          </div>
        </UCard>

        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">提取结果</h3>
              <UButton
                v-if="resultStr"
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(resultStr, '结果')"
              >
                复制
              </UButton>
            </div>
          </template>
          <UTextarea
            v-model="resultStr"
            readonly
            :rows="12"
            class="font-mono text-sm w-full"
            :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4 text-green-600 dark:text-green-400' }"
          />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

definePageMeta({
  layout: 'default'
})

const input = ref('{\n  "store": {\n    "book": [\n      { "category": "reference", "author": "Nigel Rees", "title": "Sayings of the Century", "price": 8.95 },\n      { "category": "fiction", "author": "Evelyn Waugh", "title": "Sword of Honour", "price": 12.99 }\n    ],\n    "bicycle": {\n      "color": "red",\n      "price": 19.95\n    }\n  }\n}')
const path = ref('store.book[0].title')

const resultStr = computed(() => {
  try {
    if (!input.value) return ''
    const obj = JSON.parse(input.value)
    const res = getValue(obj, path.value)
    
    if (res === undefined) return 'undefined'
    if (typeof res === 'object') return JSON.stringify(res, null, 2)
    return String(res)
  } catch (e) {
    return 'Error: Invalid JSON or Path'
  }
})

function getValue(obj: any, pathStr: string) {
  if (!pathStr) return obj
  // Remove leading $. if present
  const cleanPath = pathStr.replace(/^\$\.?/, '')
  
  // Split by . or [ ]
  // This is a very simple parser.
  // "store.book[0].title" -> ["store", "book", "0", "title"]
  const parts = cleanPath.split(/[.\[\]]/).filter(p => p !== '')
  
  let current = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    
    // Handle array index (part is string "0")
    // If current is array and part is numeric string, accessing current[part] works in JS
    current = current[part]
  }
  
  return current
}

useHead({
  title: 'JSON 路径提取工具 - JSON Path Finder | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 JSON 路径提取工具，快速定位和提取 JSON 数据中的值。' }
  ]
})
</script>
