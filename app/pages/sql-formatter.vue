<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sqlFormatter.title')" :description="$t('pages.sqlFormatter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-server-stack" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold">{{ $t('ui.input') }}</h3>
                <USelect v-model="dialect" :options="dialects" size="xs" class="w-32" />
              </div>
              <UButton v-if="inputSQL" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputSQL = ''">{{ $t('ui.clear') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="inputSQL" placeholder="SELECT * FROM users WHERE id = 1" :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
        </UCard>
      </div>

      <div class="space-y-4">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
              <UButton v-if="outputSQL" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(outputSQL, 'SQL')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <UTextarea v-model="outputSQL" readonly :rows="20" autoresize :maxrows="30" class="font-mono text-sm w-full" :ui="{ base: 'text-blue-600 dark:text-blue-400 p-4' }" />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const inputSQL = ref('SELECT * FROM users WHERE id = 1 AND created_at > "2023-01-01"')
const outputSQL = ref('')
const dialect = ref('standard')
const dialects = [{ label: 'Standard SQL', value: 'standard' }, { label: 'MySQL', value: 'mysql' }, { label: 'PostgreSQL', value: 'postgresql' }]

watch([inputSQL, dialect], () => formatSQL())
onMounted(() => formatSQL())

function formatSQL() {
  if (!inputSQL.value) { outputSQL.value = ''; return }
  let sql = inputSQL.value.replace(/\s+/g, ' ').trim()
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END']
  keywords.forEach(kw => { sql = sql.replace(new RegExp(`\\b${kw}\\b`, 'gi'), kw) })
  const newlines = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'UNION']
  newlines.forEach(kw => { sql = sql.replace(new RegExp(`\\b${kw}\\b`, 'g'), `\n${kw}`) })
  sql = sql.replace(/\b(AND|OR)\b/g, '\n  $1')
  outputSQL.value = sql.trim()
}

useHead({ title: t('pages.sqlFormatter.title'), meta: [{ name: 'description', content: t('pages.sqlFormatter.description') }] })
</script>
