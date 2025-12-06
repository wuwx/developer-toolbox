<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="CSV ↔️ JSON 转换"
      description="CSV 和 JSON 格式互转，支持自定义分隔符"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 模式切换 -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        :color="mode === 'csv-to-json' ? 'primary' : 'neutral'"
        :variant="mode === 'csv-to-json' ? 'solid' : 'soft'"
        icon="i-heroicons-arrow-right"
        @click="mode = 'csv-to-json'"
      >
        CSV → JSON
      </UButton>
      <UButton
        :color="mode === 'json-to-csv' ? 'primary' : 'neutral'"
        :variant="mode === 'json-to-csv' ? 'solid' : 'soft'"
        icon="i-heroicons-arrow-left"
        @click="mode = 'json-to-csv'"
      >
        JSON → CSV
      </UButton>

      <!-- 配置选项 -->
      <div class="ml-auto flex items-center gap-4">
        <div v-if="mode === 'csv-to-json'" class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">分隔符:</label>
          <USelectMenu v-model="delimiter" :options="delimiterOptions" size="sm" class="w-24" />
        </div>
        <UCheckbox v-if="mode === 'json-to-csv'" v-model="prettyJson" label="格式化输出" size="sm" />
      </div>
    </div>

    <!-- 转换区域 -->
    <div class="grid lg:grid-cols-2 gap-4">
      <!-- 输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon :name="mode === 'csv-to-json' ? 'i-heroicons-table-cells' : 'i-heroicons-code-bracket'" class="w-5 h-5" />
              <h3 class="font-semibold">{{ mode === 'csv-to-json' ? 'CSV 输入' : 'JSON 输入' }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="inputText" color="neutral" variant="subtle" size="sm">
                {{ inputText.split('\n').length }} 行
              </UBadge>
              <UButton
                v-if="inputText"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="clearAll"
              >
                清空
              </UButton>
            </div>
          </div>
        </template>

        <UTextarea
          v-model="inputText"
          :placeholder="mode === 'csv-to-json' ? csvPlaceholder : jsonPlaceholder"
          :rows="20"
          autoresize
          :maxrows="30"
          class="font-mono text-sm w-full"
          :ui="{ base: 'p-4' }"
          @input="convert"
        />
      </UCard>

      <!-- 输出 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon :name="mode === 'csv-to-json' ? 'i-heroicons-code-bracket' : 'i-heroicons-table-cells'" class="w-5 h-5" />
              <h3 class="font-semibold">{{ mode === 'csv-to-json' ? 'JSON 输出' : 'CSV 输出' }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <UBadge v-if="!error && outputText" color="success" variant="subtle" size="sm" icon="i-heroicons-check-circle">
                成功
              </UBadge>
              <UButton
                v-if="outputText"
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(outputText, mode === 'csv-to-json' ? 'JSON' : 'CSV')"
              >
                复制
              </UButton>
              <UButton
                v-if="outputText"
                color="neutral"
                variant="soft"
                size="sm"
                icon="i-heroicons-arrow-down-tray"
                @click="download"
              >
                下载
              </UButton>
            </div>
          </div>
        </template>

        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 mt-0.5 shrink-0" />
            <span>{{ error }}</span>
          </div>
        </div>

        <UTextarea
          v-else
          v-model="outputText"
          :placeholder="mode === 'csv-to-json' ? 'JSON 输出将在这里显示...' : 'CSV 输出将在这里显示...'"
          :rows="20"
          readonly
          autoresize
          :maxrows="30"
          class="font-mono text-sm w-full"
          :ui="{ base: 'p-4' }"
        />
      </UCard>
    </div>

    <!-- 示例 -->
    <div class="mt-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
            <h3 class="font-semibold">示例</h3>
          </div>
        </template>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV 示例</div>
            <pre class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs font-mono overflow-x-auto">name,age,city
Alice,25,New York
Bob,30,San Francisco
Charlie,35,London</pre>
          </div>
          <div>
            <div class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">JSON 示例</div>
            <pre class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs font-mono overflow-x-auto">[
  {
    "name": "Alice",
    "age": "25",
    "city": "New York"
  },
  {
    "name": "Bob",
    "age": "30",
    "city": "San Francisco"
  }
]</pre>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const mode = ref<'csv-to-json' | 'json-to-csv'>('csv-to-json')
const inputText = ref('')
const outputText = ref('')
const error = ref('')
const delimiter = ref(',')
const prettyJson = ref(true)

const delimiterOptions = [
  { label: '逗号 (,)', value: ',' },
  { label: '分号 (;)', value: ';' },
  { label: '制表符 (Tab)', value: '\t' },
  { label: '竖线 (|)', value: '|' }
]

const csvPlaceholder = `name,age,city
Alice,25,New York
Bob,30,San Francisco`

const jsonPlaceholder = `[
  {"name": "Alice", "age": 25, "city": "New York"},
  {"name": "Bob", "age": 30, "city": "San Francisco"}
]`

function convert() {
  error.value = ''
  outputText.value = ''
  
  if (!inputText.value.trim()) return
  
  try {
    if (mode.value === 'csv-to-json') {
      convertCsvToJson()
    } else {
      convertJsonToCsv()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '转换失败'
  }
}

function convertCsvToJson() {
  const lines = inputText.value.trim().split('\n')
  if (lines.length < 2) {
    error.value = 'CSV 至少需要两行（表头和数据）'
    return
  }
  
  const headers = (lines[0] || '').split(delimiter.value).map(h => h.trim())
  const result = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = (lines[i] || '').split(delimiter.value)
    const obj: Record<string, string> = {}
    
    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim() || ''
    })
    
    result.push(obj)
  }
  
  outputText.value = prettyJson.value 
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(result)
}

function convertJsonToCsv() {
  const data = JSON.parse(inputText.value)
  
  if (!Array.isArray(data) || data.length === 0) {
    error.value = 'JSON 必须是非空数组'
    return
  }
  
  const headers = Object.keys(data[0])
  const csvLines = [headers.join(',')]
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = String(row[header] || '')
      return value.includes(',') ? `"${value}"` : value
    })
    csvLines.push(values.join(','))
  })
  
  outputText.value = csvLines.join('\n')
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
  error.value = ''
}

function download() {
  const ext = mode.value === 'csv-to-json' ? 'json' : 'csv'
  const mimeType = mode.value === 'csv-to-json' ? 'application/json' : 'text/csv'
  
  const blob = new Blob([outputText.value], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `converted.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

watch(mode, () => {
  clearAll()
})

watch(delimiter, () => {
  if (inputText.value) convert()
})

watch(prettyJson, () => {
  if (inputText.value && mode.value === 'csv-to-json') convert()
})

// SEO
useHead({
  title: 'CSV JSON 转换工具 - CSV 和 JSON 互转 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSV 和 JSON 格式互转工具，支持自定义分隔符，一键下载。数据处理必备工具。' }
  ]
})
</script>
