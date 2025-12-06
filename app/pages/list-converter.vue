<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="列表转换器"
      description="将多行文本列表转换为各种常用格式（JSON, SQL, CSV 等）"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-list-bullet" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- 输入 -->
        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">输入列表 (每行一个)</h3>
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
              placeholder="Apple
Banana
Cherry"
              :rows="20"
              class="font-mono text-sm w-full"
              :ui="{ base: 'p-4' }"
            />
          </UCard>
        </div>

        <!-- 转换选项和结果 -->
        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">转换结果</h3>
                <div class="flex gap-2">
                  <USelect v-model="format" :options="formats" size="xs" />
                  <UButton
                    color="primary"
                    variant="soft"
                    size="xs"
                    icon="i-heroicons-clipboard-document"
                    @click="copyToClipboard(output, '结果')"
                  >
                    复制
                  </UButton>
                </div>
              </div>
            </template>
            
            <div class="p-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex gap-4 text-sm">
                <UCheckbox v-model="quote" label="添加引号" />
                <UCheckbox v-model="comma" label="逗号分隔" />
              </div>
            </div>

            <UTextarea
              v-model="output"
              readonly
              :rows="20"
              class="font-mono text-sm w-full"
              :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4' }"
            />
          </UCard>
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

const input = ref('Apple\nBanana\nCherry')
const format = ref('custom')
const quote = ref(false)
const comma = ref(true)

const formats = [
  { label: '自定义 (Custom)', value: 'custom' },
  { label: 'JSON Array', value: 'json' },
  { label: 'SQL IN Clause', value: 'sql' },
  { label: 'HTML <ul>', value: 'html_ul' },
  { label: 'HTML <ol>', value: 'html_ol' },
  { label: 'CSV (一行)', value: 'csv' }
]

const output = computed(() => {
  if (!input.value) return ''
  
  const lines = input.value.split('\n').map(l => l.trim()).filter(l => l)
  
  if (format.value === 'json') {
    return JSON.stringify(lines, null, 2)
  } else if (format.value === 'sql') {
    return `(${lines.map(l => `'${l}'`).join(', ')})`
  } else if (format.value === 'html_ul') {
    return `<ul>\n${lines.map(l => `  <li>${l}</li>`).join('\n')}\n</ul>`
  } else if (format.value === 'html_ol') {
    return `<ol>\n${lines.map(l => `  <li>${l}</li>`).join('\n')}\n</ol>`
  } else if (format.value === 'csv') {
    return lines.join(',')
  } else {
    // Custom
    const q = quote.value ? "'" : ""
    const sep = comma.value ? ", " : " "
    return lines.map(l => `${q}${l}${q}`).join(sep)
  }
})

useHead({
  title: '列表转换器 - List Converter | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线列表转换工具，将文本列表转换为 JSON, SQL, CSV, HTML 等格式。' }
  ]
})
</script>
