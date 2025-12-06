<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="正则生成器" description="常用正则表达式速查" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-command-line" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="item in regexList" :key="item.name">
        <div class="space-y-3">
          <div class="font-semibold">{{item.name}}</div>
          <code class="block p-2 bg-gray-900 text-green-400 rounded text-xs font-mono break-all">{{item.regex}}</code>
          <UButton size="xs" variant="soft" block @click="copyToClipboard(item.regex,item.name)">复制</UButton>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {copyToClipboard}=useToolClipboard()
const regexList=[
  {name:'邮箱',regex:'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'},
  {name:'手机号',regex:'^1[3-9]\\d{9}$'},
  {name:'身份证',regex:'^\\d{17}[\\dXx]$'},
  {name:'URL',regex:'^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b'},
  {name:'IP地址',regex:'^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$'},
  {name:'日期',regex:'^\\d{4}-\\d{2}-\\d{2}$'},
  {name:'时间',regex:'^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$'},
  {name:'中文',regex:'^[\\u4e00-\\u9fa5]+$'},
  {name:'数字',regex:'^\\d+$'},
  {name:'字母',regex:'^[a-zA-Z]+$'},
  {name:'邮政编码',regex:'^\\d{6}$'},
  {name:'QQ号',regex:'^[1-9]\\d{4,10}$'}
]

useHead({title:'正则生成器 | 开发者工具箱'})
</script>
