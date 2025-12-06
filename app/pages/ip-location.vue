<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.ipLocation.title')" :description="$t('pages.ipLocation.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.queryIp') }}</h3></template>
        <div class="space-y-4">
          <UInput v-model="ipAddress" :placeholder="$t('ui.enterIpPlaceholder')" size="xl" class="w-full" />
          <UButton block color="primary" size="lg" @click="query" :loading="loading">{{ $t('ui.query') }}</UButton>
        </div>
      </UCard>

      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.currentIp') }}</h3></template>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-2xl font-mono font-bold text-primary-600">{{ myIp || $t('ui.loading') }}</div>
        </div>
      </UCard>
    </div>

    <UCard v-if="result" class="mt-8">
      <template #header><h3 class="font-semibold">{{ $t('ui.queryResult') }}</h3></template>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">{{ $t('ui.ipAddress') }}</div>
          <div class="font-mono font-semibold">{{ result.ip }}</div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">{{ $t('ui.country') }}</div>
          <div class="font-semibold">{{ result.country }}</div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-sm text-gray-500 mb-1">{{ $t('ui.city') }}</div>
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
definePageMeta({ layout: 'default' })
const { t } = useI18n()
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
  title: t('pages.ipLocation.title'),
  meta: [{ name: 'description', content: t('pages.ipLocation.description') }]
})
</script>
