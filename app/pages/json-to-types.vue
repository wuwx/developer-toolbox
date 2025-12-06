<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="JSON 转 TypeScript"
      description="将 JSON 对象自动转换为 TypeScript 接口定义"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-code-bracket" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 输入 -->
      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">JSON 输入</h3>
              <div class="flex gap-2">
                <UButton
                  v-if="inputJSON"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="inputJSON = ''"
                >
                  清空
                </UButton>
              </div>
            </div>
          </template>
          <UTextarea
            v-model="inputJSON"
            placeholder='{"name": "John", "age": 30}'
            :rows="20"
            autoresize
            :maxrows="30"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </UCard>
      </div>

      <!-- 输出 -->
      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">TypeScript 接口</h3>
                <UInput v-model="interfaceName" placeholder="接口名称" size="xs" class="w-32" />
              </div>
              <UButton
                v-if="outputTS"
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(outputTS, 'TypeScript')"
              >
                复制
              </UButton>
            </div>
          </template>
          
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <div class="text-sm text-red-600 dark:text-red-400">{{ error }}</div>
          </div>

          <UTextarea
            v-model="outputTS"
            readonly
            :rows="20"
            autoresize
            :maxrows="30"
            class="font-mono text-sm w-full"
            :ui="{ base: 'text-blue-600 dark:text-blue-400 p-4' }"
          />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputJSON = ref('')
const outputTS = ref('')
const interfaceName = ref('RootObject')
const error = ref('')

watch([inputJSON, interfaceName], () => {
  generate()
})

function generate() {
  error.value = ''
  if (!inputJSON.value.trim()) {
    outputTS.value = ''
    return
  }

  try {
    const obj = JSON.parse(inputJSON.value)
    outputTS.value = jsonToTs(obj, interfaceName.value)
  } catch (e) {
    error.value = '无效的 JSON 格式'
    outputTS.value = ''
  }
}

function jsonToTs(obj: any, name: string): string {
  let output = `export interface ${name} {\n`
  const nestedInterfaces: string[] = []

  for (const key in obj) {
    const value = obj[key]
    const type = getType(value)
    let typeStr = type

    if (type === 'object') {
      const nestedName = capitalize(key)
      typeStr = nestedName
      nestedInterfaces.push(jsonToTs(value, nestedName))
    } else if (type === 'array') {
      if (value.length > 0) {
        const itemType = getType(value[0])
        if (itemType === 'object') {
          const nestedName = capitalize(key).slice(0, -1) || 'Item' // Remove 's'
          typeStr = `${nestedName}[]`
          nestedInterfaces.push(jsonToTs(value[0], nestedName))
        } else {
          typeStr = `${itemType}[]`
        }
      } else {
        typeStr = 'any[]'
      }
    }

    output += `  ${key}: ${typeStr};\n`
  }

  output += '}'

  if (nestedInterfaces.length > 0) {
    output += '\n\n' + nestedInterfaces.join('\n\n')
  }

  return output
}

function getType(value: any): string {
  if (value === null) return 'any'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// SEO
useHead({
  title: 'JSON 转 TypeScript - 自动生成接口定义 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 JSON 转 TypeScript 工具，自动分析 JSON 结构并生成对应的 TypeScript Interface 定义，支持嵌套对象。' }
  ]
})
</script>
