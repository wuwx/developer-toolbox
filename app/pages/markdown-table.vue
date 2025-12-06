<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Markdown 表格生成器" description="可视化生成 Markdown 表格" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">配置</h3></template>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium mb-2 block">行数: {{rows}}</label>
              <URange v-model="rows" :min="2" :max="10"/>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">列数: {{cols}}</label>
              <URange v-model="cols" :min="2" :max="8"/>
            </div>
          </div>
          <UButton block color="primary" @click="generate">生成表格</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">Markdown</h3>
            <UButton v-if="markdown" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(markdown,'Markdown')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="markdown" :rows="15" readonly class="font-mono text-sm w-full"/>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {copyToClipboard}=useToolClipboard()
const rows=ref(3)
const cols=ref(3)
const markdown=ref('')

function generate(){
  let result='|'
  for(let i=0;i<cols.value;i++)result+=' Header '+(i+1)+' |'
  result+='\n|'
  for(let i=0;i<cols.value;i++)result+=' --- |'
  for(let r=0;r<rows.value-1;r++){
    result+='\n|'
    for(let c=0;c<cols.value;c++)result+=' Cell '+(r+1)+'-'+(c+1)+' |'
  }
  markdown.value=result
}

onMounted(()=>generate())
useHead({title:'Markdown 表格生成器 | 开发者工具箱'})
</script>
