<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Lorem 生成器+" description="生成占位文本" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">配置</h3></template>
        <div class="space-y-4">
          <USelect v-model="type" :options="[{label:'段落',value:'p'},{label:'句子',value:'s'},{label:'单词',value:'w'}]"/>
          <div>
            <label class="text-sm font-medium mb-2 block">数量: {{ count }}</label>
            <URange v-model="count" :min="1" :max="20"/>
          </div>
          <UButton block color="primary" size="lg" @click="generate">生成</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">结果</h3>
            <UButton v-if="result" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(result,'Lorem')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="result" :rows="15" readonly/>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {copyToClipboard}=useToolClipboard()
const type=ref('p')
const count=ref(3)
const result=ref('')
const lorem='Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'

function generate(){
  const words=lorem.split(' ')
  if(type.value==='w'){
    result.value=words.slice(0,count.value).join(' ')
  }else if(type.value==='s'){
    result.value=Array(count.value).fill(lorem).join('. ')+'.'
  }else{
    result.value=Array(count.value).fill(lorem+' '+lorem).join('\n\n')
  }
}

onMounted(()=>generate())
useHead({title:'Lorem 生成器+ | 开发者工具箱'})
</script>
