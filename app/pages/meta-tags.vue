<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="Meta 标签生成器" description="生成 SEO Meta 标签" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-tag" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">网站信息</h3></template>
        <div class="space-y-4">
          <UInput v-model="title" placeholder="网站标题" size="xl" class="w-full"/>
          <UTextarea v-model="description" placeholder="网站描述" :rows="3" class="w-full"/>
          <UInput v-model="keywords" placeholder="关键词（逗号分隔）" size="xl" class="w-full"/>
          <UInput v-model="author" placeholder="作者" size="xl" class="w-full"/>
          <UInput v-model="image" placeholder="图片 URL" size="xl" class="w-full"/>
          <UButton block color="primary" @click="generate">生成 Meta 标签</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">HTML Meta 标签</h3>
            <UButton v-if="meta" color="primary" variant="soft" size="sm" @click="copyToClipboard(meta,'Meta')">复制</UButton>
          </div>
        </template>
        <div class="p-4 bg-gray-900 rounded-lg">
          <pre class="text-xs text-green-400 font-mono whitespace-pre-wrap">{{meta||'填写信息后生成'}}</pre>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {copyToClipboard}=useToolClipboard()
const title=ref('')
const description=ref('')
const keywords=ref('')
const author=ref('')
const image=ref('')
const meta=ref('')

function generate(){
  meta.value=`<title>${title.value}</title>
<meta name="description" content="${description.value}">
<meta name="keywords" content="${keywords.value}">
<meta name="author" content="${author.value}">
<meta property="og:title" content="${title.value}">
<meta property="og:description" content="${description.value}">
<meta property="og:image" content="${image.value}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title.value}">
<meta name="twitter:description" content="${description.value}">
<meta name="twitter:image" content="${image.value}">`
}

useHead({title:'Meta 标签生成器 | 开发者工具箱'})
</script>
