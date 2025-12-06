<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="JSON ↔ CSV" description="JSON 与 CSV 格式互转" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">JSON</h3>
            <UButton color="primary" variant="soft" size="sm" @click="jsonToCsv">转为 CSV →</UButton>
          </div>
        </template>
        <UTextarea v-model="jsonInput" placeholder='[{"name":"张三","age":25},{"name":"李四","age":30}]' :rows="20" class="font-mono text-sm" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <UButton color="primary" variant="soft" size="sm" @click="csvToJson">← 转为 JSON</UButton>
            <h3 class="font-semibold">CSV</h3>
          </div>
        </template>
        <UTextarea v-model="csvOutput" placeholder="name,age&#10;张三,25&#10;李四,30" :rows="20" class="font-mono text-sm" />
      </UCard>
    </div>

    <UCard class="mt-8">
      <template #header><h3 class="font-semibold">选项</h3></template>
      <div class="grid sm:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium mb-2 block">分隔符</label>
          <USelect v-model="delimiter" :options="[{label: '逗号 (,)', value: ','}, {label: '分号 (;)', value: ';'}, {label: '制表符', value: '\\t'}]" />
        </div>
        <div class="flex items-end">
          <UCheckbox v-model="includeHeader" label="包含表头" />
        </div>
        <div class="flex items-end">
          <UCheckbox v-model="prettyJson" label="格式化 JSON" />
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const jsonInput = ref('')
const csvOutput = ref('')
const delimiter = ref(',')
const includeHeader = ref(true)
const prettyJson = ref(true)

function jsonToCsv() {
  try {
    const data = JSON.parse(jsonInput.value)
    if (!Array.isArray(data) || data.length === 0) {
      csvOutput.value = '错误: JSON 必须是非空数组'
      return
    }

    const keys = Object.keys(data[0])
    let csv = ''

    if (includeHeader.value) {
      csv = keys.join(delimiter.value) + '\n'
    }

    data.forEach(row => {
      csv += keys.map(key => {
        const value = row[key]?.toString() || ''
        return value.includes(delimiter.value) || value.includes('\n') ? `"${value}"` : value
      }).join(delimiter.value) + '\n'
    })

    csvOutput.value = csv.trim()
  } catch (e) {
    csvOutput.value = '错误: ' + (e as Error).message
  }
}

function csvToJson() {
  try {
    const lines = csvOutput.value.trim().split('\n')
    if (lines.length === 0) {
      jsonInput.value = '[]'
      return
    }

    const headers = lines[0].split(delimiter.value).map(h => h.trim())
    const startIndex = includeHeader.value ? 1 : 0
    
    const data = lines.slice(startIndex).map(line => {
      const values = line.split(delimiter.value)
      const obj: Record<string, any> = {}
      headers.forEach((header, i) => {
        obj[header] = (values[i] ?? '').trim()
      })
      return obj
    })

    jsonInput.value = prettyJson.value ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  } catch (e) {
    jsonInput.value = '错误: ' + (e as Error).message
  }
}

useHead({
  title: 'JSON CSV 转换器 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线 JSON 和 CSV 格式互转工具' }]
})
</script>
