<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="SQL 生成器" description="可视化生成 SQL 语句" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">配置</h3></template>
        <div class="space-y-4">
          <USelect v-model="type" :options="['SELECT','INSERT','UPDATE','DELETE'].map(t=>({label:t,value:t}))"/>
          <UInput v-model="table" placeholder="表名" size="xl"/>
          <UTextarea v-model="fields" placeholder="字段（每行一个）" :rows="6"/>
          <UButton block color="primary" size="lg" @click="generate">生成 SQL</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">SQL</h3>
            <UButton v-if="sql" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(sql,'SQL')">复制</UButton>
          </div>
        </template>
        <div class="p-4 bg-gray-900 rounded-lg">
          <pre class="text-sm text-green-400 font-mono">{{sql||'点击生成按钮'}}</pre>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {copyToClipboard}=useToolClipboard()
const type=ref('SELECT')
const table=ref('users')
const fields=ref('id\nname\nemail')
const sql=ref('')

function generate(){
  const cols=fields.value.split('\n').filter(Boolean)
  if(type.value==='SELECT'){
    sql.value=`SELECT ${cols.join(', ')}\nFROM ${table.value};`
  }else if(type.value==='INSERT'){
    sql.value=`INSERT INTO ${table.value} (${cols.join(', ')})\nVALUES (${cols.map(()=>'?').join(', ')});`
  }else if(type.value==='UPDATE'){
    sql.value=`UPDATE ${table.value}\nSET ${cols.map(c=>c+' = ?').join(',\n    ')}\nWHERE id = ?;`
  }else{
    sql.value=`DELETE FROM ${table.value}\nWHERE id = ?;`
  }
}

useHead({title:'SQL 生成器 | 开发者工具箱'})
</script>
