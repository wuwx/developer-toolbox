<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.httpClient.title')" :description="$t('pages.httpClient.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-bolt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.requestConfig') }}</h3></template>
        <div class="space-y-4">
          <USelect v-model="method" :options="['GET','POST','PUT','DELETE','PATCH'].map(m => ({label:m,value:m}))" class="w-full" />
          <UInput v-model="url" placeholder="https://api.example.com/users" size="xl" class="w-full"/>
          <UTextarea v-model="headers" placeholder="Headers (每行一个)&#10;Content-Type: application/json&#10;Authorization: Bearer token" :rows="4" class="w-full"/>
          <UTextarea v-model="body" placeholder="Request Body (JSON)" :rows="6" class="w-full"/>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.generatedRequest') }}</h3>
            <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(generatedCode,'HTTP')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <div class="p-4 bg-gray-900 rounded-lg">
          <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{generatedCode}}</pre>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const {copyToClipboard}=useToolClipboard()
const method=ref('GET')
const url=ref('https://api.example.com/users')
const headers=ref('Content-Type: application/json')
const body=ref('{\n  "name": "张三"\n}')

const generatedCode=computed(()=>{
  const headerLines=headers.value.split('\n').filter(Boolean)
  const headerObj=headerLines.map(h=>{
    const [key,...values]=h.split(':')
    return `  '${key?.trim()}': '${values.join(':').trim()}'`
  }).join(',\n')
  
  return `// Fetch API
fetch('${url.value}', {
  method: '${method.value}',
  headers: {
${headerObj}
  }${method.value!=='GET'?`,\n  body: ${body.value}`:''}
})
.then(res => res.json())
.then(data => console.log(data))

// Axios
axios({
  method: '${method.value.toLowerCase()}',
  url: '${url.value}',
  headers: {
${headerObj}
  }${method.value!=='GET'?`,\n  data: ${body.value}`:''}
})`
})

useHead({title:t('pages.httpClient.title'),meta:[{name:'description',content:t('pages.httpClient.description')}]})
</script>
