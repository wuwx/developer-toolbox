<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="IP 地址查询" description="查询 IP 地址的地理位置和网络信息" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">查询 IP</h3></template>
        <div class="space-y-4">
          <UInput v-model="ipAddress" placeholder="输入 IP 地址，留空查询本机" size="xl" />
          <UButton block color="primary" size="lg" @click="query" :loading="loading">查询</UButton>
        </div>
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">当前 IP</h3></template>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-2xl font-mono font-bold text-primary-600">{{ myIp || '加载中...' }}</div>
        </div>
      </UCard>
    </div>

    <UCard v-if="result" class="mt-8">
      <template #header><h3 class="font-semibold">查询结果</h3></template>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">IP 地址</div>
          <div class="font-mono font-semibold">{{ result.ip }}</div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">国家/地区</div>
          <div class="font-semibold">{{ result.country }}</div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">城市</div>
          <div class="font-semibold">{{ result.city }}</div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">ISP</div>
          <div class="font-semibold">{{ result.isp }}</div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const ipAddress = ref('')
const myIp = ref('')
const result = ref<any>(null)
const loading = ref(false)

async function query() {
  loading.value = true
  try {
    // 模拟 IP 查询（实际应调用 IP 查询 API）
    await new Promise(resolve => setTimeout(resolve, 500))
    result.value = {
      ip: ipAddress.value || myIp.value,
      country: '中国',
      city: '北京',
      isp: '中国电信'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  myIp.value = '未知'
})

useHead({
  title: 'IP 地址查询 | 开发者工具箱',
  meta: [{ name: 'description', content: '在线 IP 地址查询工具' }]
})
</script>
