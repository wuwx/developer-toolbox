<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">SQL 格式化</h1>
      <p class="text-gray-600 dark:text-gray-400">
        美化 SQL 语句，支持多种数据库方言
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 输入 -->
      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">SQL 输入</h3>
                <USelect 
                  v-model="dialect" 
                  :options="dialects" 
                  size="xs" 
                  class="w-32"
                />
              </div>
              <UButton
                v-if="inputSQL"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="inputSQL = ''"
              >
                清空
              </UButton>
            </div>
          </template>
          <UTextarea
            v-model="inputSQL"
            placeholder="SELECT * FROM users WHERE id = 1"
            :rows="20"
            class="font-mono text-sm h-full"
            :ui="{ base: 'h-full' }"
          />
        </UCard>
      </div>

      <!-- 输出 -->
      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">格式化结果</h3>
              <UButton
                v-if="outputSQL"
                color="primary"
                variant="soft"
                size="sm"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(outputSQL, 'SQL')"
              >
                复制
              </UButton>
            </div>
          </template>
          
          <UTextarea
            v-model="outputSQL"
            readonly
            :rows="20"
            class="font-mono text-sm h-full"
            :ui="{ base: 'h-full text-blue-600 dark:text-blue-400' }"
          />
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 简化版正则实现，避免引入 heavy 的 sql-formatter 库
// 生产环境建议使用 sql-formatter

const { copyToClipboard } = useToolClipboard()

const inputSQL = ref('SELECT * FROM users WHERE id = 1 AND created_at > "2023-01-01"')
const outputSQL = ref('')
const dialect = ref('standard')

const dialects = [
  { label: 'Standard SQL', value: 'standard' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' }
]

watch([inputSQL, dialect], () => {
  formatSQL()
})

onMounted(() => {
  formatSQL()
})

function formatSQL() {
  if (!inputSQL.value) {
    outputSQL.value = ''
    return
  }

  // 非常基础的格式化逻辑 (Indent + Newline)
  // 1. 关键词大写
  // 2. 关键子句换行
  
  let sql = inputSQL.value
    .replace(/\s+/g, ' ') // 压缩空格
    .trim()

  // 关键词列表
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 
    'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 
    'SET', 'DELETE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
    'ON', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ]

  // 替换为大写
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi')
    sql = sql.replace(regex, kw)
  })

  // 换行
  const newlines = [
    'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 
    'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'UNION'
  ]

  newlines.forEach(kw => {
    sql = sql.replace(new RegExp(`\\b${kw}\\b`, 'g'), `\n${kw}`)
  })
  
  // 处理 AND/OR 缩进
  sql = sql.replace(/\b(AND|OR)\b/g, '\n  $1')

  // 移除开头的空行
  outputSQL.value = sql.trim()
}

// SEO
useHead({
  title: 'SQL 格式化 - 在线 SQL 美化工具 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 SQL 格式化工具，支持 MySQL, PostgreSQL 等方言，美化 SQL 语句，提高可读性。' }
  ]
})
</script>
