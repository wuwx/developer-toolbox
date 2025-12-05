<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">文本去重与排序</h1>
      <p class="text-gray-600 dark:text-gray-400">
        强大的列表处理工具，支持去重、排序、过滤、随机打乱
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 左侧：输入 -->
      <div class="lg:col-span-1 space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">输入列表</h3>
              </div>
              <div class="flex gap-2">
                <UBadge color="neutral" variant="subtle" size="sm">
                  {{ inputLines.length }} 行
                </UBadge>
                <UButton
                  v-if="inputText"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="inputText = ''"
                >
                  清空
                </UButton>
              </div>
            </div>
          </template>

          <div class="flex-1 relative min-h-[400px]">
            <UTextarea
              v-model="inputText"
              placeholder="每行一个项目..."
              class="absolute inset-0 h-full w-full font-mono text-sm"
              :ui="{ base: 'h-full' }"
            />
          </div>
        </UCard>
      </div>

      <!-- 中间：操作 -->
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">处理选项</h3>
            </div>
          </template>

          <div class="space-y-6">
            <!-- 基础清理 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">基础清理</label>
              <div class="space-y-2">
                <UCheckbox v-model="options.trim" label="去除首尾空格" />
                <UCheckbox v-model="options.removeEmpty" label="移除空行" />
                <UCheckbox v-model="options.unique" label="去除重复行 (去重)" />
              </div>
            </div>

            <!-- 排序 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">排序方式</label>
              <USelect v-model="options.sort" :options="sortOptions" />
            </div>

            <!-- 装饰 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">添加内容</label>
              <div class="grid grid-cols-2 gap-2">
                <UInput v-model="options.prefix" placeholder="前缀..." size="sm" />
                <UInput v-model="options.suffix" placeholder="后缀..." size="sm" />
              </div>
            </div>

            <UButton
              block
              color="primary"
              size="lg"
              icon="i-heroicons-arrow-right"
              class="mt-4"
              @click="process"
            >
              执行处理
            </UButton>
          </div>
        </UCard>

        <!-- 统计 -->
        <div v-if="inputText" class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-2xl font-bold">{{ inputLines.length }}</div>
            <div class="text-xs text-gray-500">原始行数</div>
          </div>
          <div class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
            <div class="text-2xl font-bold text-primary-600">{{ resultLines.length }}</div>
            <div class="text-xs text-primary-600 dark:text-primary-400">处理后行数</div>
          </div>
        </div>
      </div>

      <!-- 右侧：结果 -->
      <div class="lg:col-span-1 space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-check" class="w-5 h-5" />
                <h3 class="font-semibold">处理结果</h3>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="resultText"
                  color="primary"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(resultText, '结果')"
                >
                  复制
                </UButton>
              </div>
            </div>
          </template>

          <div class="flex-1 relative min-h-[400px]">
            <UTextarea
              v-model="resultText"
              readonly
              placeholder="结果将显示在这里..."
              class="absolute inset-0 h-full w-full font-mono text-sm"
              :ui="{ base: 'h-full' }"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputText = ref('')
const resultText = ref('')

const options = reactive({
  trim: true,
  removeEmpty: true,
  unique: true,
  sort: 'none',
  prefix: '',
  suffix: ''
})

const sortOptions = [
  { label: '不排序', value: 'none' },
  { label: 'A-Z 升序', value: 'az' },
  { label: 'Z-A 降序', value: 'za' },
  { label: '长度 (短到长)', value: 'length_asc' },
  { label: '长度 (长到短)', value: 'length_desc' },
  { label: '数值 (小到大)', value: 'num_asc' },
  { label: '数值 (大到小)', value: 'num_desc' },
  { label: '随机打乱', value: 'random' },
  { label: '反转列表', value: 'reverse' }
]

const inputLines = computed(() => inputText.value ? inputText.value.split('\n') : [])
const resultLines = computed(() => resultText.value ? resultText.value.split('\n') : [])

function process() {
  if (!inputText.value) {
    resultText.value = ''
    return
  }

  let lines = inputText.value.split('\n')

  // 1. 基础清理
  if (options.trim) {
    lines = lines.map(l => l.trim())
  }
  
  if (options.removeEmpty) {
    lines = lines.filter(l => l.length > 0)
  }

  // 2. 去重
  if (options.unique) {
    lines = [...new Set(lines)]
  }

  // 3. 排序
  switch (options.sort) {
    case 'az':
      lines.sort() // 默认字典序
      break
    case 'za':
      lines.sort().reverse()
      break
    case 'length_asc':
      lines.sort((a, b) => a.length - b.length)
      break
    case 'length_desc':
      lines.sort((a, b) => b.length - a.length)
      break
    case 'num_asc':
      lines.sort((a, b) => parseFloat(a) - parseFloat(b))
      break
    case 'num_desc':
      lines.sort((a, b) => parseFloat(b) - parseFloat(a))
      break
    case 'random':
      lines.sort(() => Math.random() - 0.5)
      break
    case 'reverse':
      lines.reverse()
      break
  }

  // 4. 添加前后缀
  if (options.prefix || options.suffix) {
    lines = lines.map(l => `${options.prefix}${l}${options.suffix}`)
  }

  resultText.value = lines.join('\n')
}

// 监听输入变化，如果开启自动处理可以这里调用 process，但对于大量文本建议手动
watch(inputText, () => {
  // 简单的自动清理，但不排序去重（除非想做成实时的）
  // 这里不做实时处理，避免性能问题
})

// SEO
useHead({
  title: '文本去重排序工具 - List Deduplication | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线文本列表去重、排序、过滤工具。支持 A-Z 排序、数值排序、随机打乱、去除空行等功能。' }
  ]
})
</script>
