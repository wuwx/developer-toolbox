<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.markdownTable.title')" :description="$t('pages.markdownTable.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-table-cells" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.settings') }}</h3></template>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.rows') }}: {{rows}}</label>
              <URange v-model="rows" :min="2" :max="10"/>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.columns') }}: {{cols}}</label>
              <URange v-model="cols" :min="2" :max="8"/>
            </div>
          </div>
          <UButton block color="primary" @click="generate">{{ $t('ui.generateTable') }}</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">Markdown</h3>
            <UButton v-if="markdown" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(markdown,'Markdown')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="markdown" :rows="15" readonly class="font-mono text-sm w-full"/>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
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
useHead({title:t('pages.markdownTable.title'),meta:[{name:'description',content:t('pages.markdownTable.description')}]})
</script>
