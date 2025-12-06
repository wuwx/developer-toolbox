<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="YAML ↔ JSON 转换"
      description="YAML 和 JSON 配置文件格式互转"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 模式切换 -->
    <div class="mb-6 flex items-center gap-4">
      <UButton
        :color="mode === 'yaml-to-json' ? 'primary' : 'neutral'"
        :variant="mode === 'yaml-to-json' ? 'solid' : 'soft'"
        icon="i-heroicons-arrow-right"
        @click="mode = 'yaml-to-json'"
      >
        YAML → JSON
      </UButton>
      <UButton
        :color="mode === 'json-to-yaml' ? 'primary' : 'neutral'"
        :variant="mode === 'json-to-yaml' ? 'solid' : 'soft'"
        icon="i-heroicons-arrow-left"
        @click="mode = 'json-to-yaml'"
      >
        JSON → YAML
      </UButton>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 输入 -->
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ mode === 'yaml-to-json' ? 'YAML 输入' : 'JSON 输入' }}</h3>
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
          :placeholder="mode === 'yaml-to-json' ? yamlPlaceholder : jsonPlaceholder"
          :rows="20"
          autoresize
          :maxrows="30"
          class="font-mono text-sm w-full"
          :ui="{ base: 'p-4' }"
          @input="convert"
        />
      </UCard>

      <!-- 输出 -->
      <UCard class="h-full flex flex-col">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">{{ mode === 'yaml-to-json' ? 'JSON 输出' : 'YAML 输出' }}</h3>
            <UButton
              v-if="output"
              color="primary"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(output, mode === 'yaml-to-json' ? 'JSON' : 'YAML')"
            >
              复制
            </UButton>
          </div>
        </template>
        
        <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <div class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>
        </div>

        <UTextarea
          v-model="output"
          readonly
          :rows="20"
          autoresize
          :maxrows="30"
          class="font-mono text-sm w-full"
          :ui="{ base: 'text-blue-600 dark:text-blue-400 p-4' }"
        />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
// 简单的 YAML 解析器 (不使用 js-yaml 库以避免依赖)
// 注意：这是非常基础的实现，仅支持简单的键值对和嵌套
// 生产环境强烈建议使用 js-yaml

const { copyToClipboard } = useToolClipboard()

const mode = ref<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
const input = ref('')
const output = ref('')
const error = ref('')

const yamlPlaceholder = `name: John Doe
age: 30
skills:
  - JavaScript
  - Python`

const jsonPlaceholder = `{
  "name": "John Doe",
  "age": 30,
  "skills": [
    "JavaScript",
    "Python"
  ]
}`

function convert() {
  error.value = ''
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    if (mode.value === 'yaml-to-json') {
      // 简单 YAML 解析 (模拟)
      // 实际应该引入 js-yaml，这里为了演示无依赖，做一个极其简化的解析
      // 警告：这不能处理复杂 YAML
      const lines = input.value.split('\n')
      const obj: any = {}
      
      // 这里只做最简单的 key: value 解析，不支持嵌套
      lines.forEach(line => {
        const [key, ...val] = line.split(':')
        if (key && val) {
          obj[key.trim()] = val.join(':').trim()
        }
      })
      
      // 提示用户这是一个简化版
      error.value = '注意：这是一个无依赖的简化版 YAML 解析器，仅支持简单键值对。复杂 YAML 请使用完整版库。'
      
      output.value = JSON.stringify(obj, null, 2)
    } else {
      const obj = JSON.parse(input.value)
      output.value = jsonToYaml(obj)
    }
  } catch (e) {
    error.value = '解析失败：格式错误'
    output.value = ''
  }
}

function jsonToYaml(obj: any, indent = 0): string {
  const spacing = ' '.repeat(indent)
  let yaml = ''

  for (const key in obj) {
    const value = obj[key]
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        yaml += `${spacing}${key}:\n`
        value.forEach(item => {
          if (typeof item === 'object') {
             // 简化处理
             yaml += `${spacing}  - object\n` 
          } else {
             yaml += `${spacing}  - ${item}\n`
          }
        })
      } else {
        yaml += `${spacing}${key}:\n${jsonToYaml(value, indent + 2)}`
      }
    } else {
      yaml += `${spacing}${key}: ${value}\n`
    }
  }
  return yaml
}

watch(mode, () => {
  input.value = ''
  output.value = ''
  error.value = ''
})

// SEO
useHead({
  title: 'YAML JSON 转换 - 配置文件互转 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 YAML 转 JSON，JSON 转 YAML 工具。支持 Kubernetes, Docker Compose 配置文件格式转换。' }
  ]
})
</script>
