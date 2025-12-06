<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.sqlGenerator.title')" :description="$t('pages.sqlGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.settings') }}</h3></template>
        <div class="space-y-4">
          <USelect v-model="type" :options="['SELECT','INSERT','UPDATE','DELETE'].map(t=>({label:t,value:t}))" class="w-full" />
          <UInput v-model="table" :placeholder="$t('ui.tableName')" size="xl" class="w-full" />
          <UTextarea v-model="fields" :placeholder="$t('ui.fieldName')" :rows="6" class="w-full" />
          <UButton block color="primary" size="lg" @click="generate">{{ $t('ui.generateSql') }}</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">SQL</h3>
            <UButton v-if="sql" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(sql,'SQL')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <div class="p-4 bg-gray-900 rounded-lg">
          <pre class="text-sm text-green-400 font-mono">{{ sql || $t('ui.clickToGenerate') }}</pre>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const type = ref('SELECT')
const table = ref('users')
const fields = ref('id\nname\nemail')
const sql = ref('')

function generate() {
  const cols = fields.value.split('\n').filter(Boolean)
  if (type.value === 'SELECT') sql.value = `SELECT ${cols.join(', ')}\nFROM ${table.value};`
  else if (type.value === 'INSERT') sql.value = `INSERT INTO ${table.value} (${cols.join(', ')})\nVALUES (${cols.map(() => '?').join(', ')});`
  else if (type.value === 'UPDATE') sql.value = `UPDATE ${table.value}\nSET ${cols.map(c => c + ' = ?').join(',\n    ')}\nWHERE id = ?;`
  else sql.value = `DELETE FROM ${table.value}\nWHERE id = ?;`
}

useHead({ title: t('pages.sqlGenerator.title'), meta: [{ name: 'description', content: t('pages.sqlGenerator.description') }] })
</script>
