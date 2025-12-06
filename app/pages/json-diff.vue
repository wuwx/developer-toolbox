<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="JSON 对比" description="对比两个 JSON 的差异" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">JSON 1</h3></template>
        <UTextarea v-model="json1" placeholder='{"name":"张三"}' :rows="15" class="font-mono text-sm"/>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">JSON 2</h3></template>
        <UTextarea v-model="json2" placeholder='{"name":"李四"}' :rows="15" class="font-mono text-sm"/>
      </UCard>
    </div>
    <UCard class="mt-8">
      <template #header><h3 class="font-semibold">差异</h3></template>
      <UButton class="mb-4" color="primary" @click="compare">对比</UButton>
      <div v-if="diff" class="space-y-2">
        <div v-for="(d,i) in diff" :key="i" class="p-3 rounded-lg" :class="d.type==='added'?'bg-green-50 dark:bg-green-950/30':'bg-red-50 dark:bg-red-950/30'">
          <span class="font-mono text-sm">{{d.path}}: {{d.value}}</span>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const json1=ref('')
const json2=ref('')
const diff=ref<any[]>([])

function compare(){
  try{
    const obj1=JSON.parse(json1.value)
    const obj2=JSON.parse(json2.value)
    diff.value=[]
    Object.keys(obj2).forEach(key=>{
      if(obj1[key]!==obj2[key]){
        diff.value.push({type:'added',path:key,value:obj2[key]})
      }
    })
  }catch(e){
    alert('JSON 格式错误')
  }
}

useHead({title:'JSON 对比 | 开发者工具箱'})
</script>
