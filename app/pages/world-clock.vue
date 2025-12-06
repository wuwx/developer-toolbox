<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.worldClock.title')" :description="$t('pages.worldClock.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="city in cities" :key="city.name">
        <div class="text-center">
          <div class="text-lg font-semibold mb-2">{{ city.name }}</div>
          <div class="text-3xl font-mono font-bold text-primary-600 mb-1">{{ city.time }}</div>
          <div class="text-sm text-gray-500">{{ city.timezone }}</div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const cities = ref([
  { name: '北京', timezone: 'Asia/Shanghai', time: '' },
  { name: '东京', timezone: 'Asia/Tokyo', time: '' },
  { name: '纽约', timezone: 'America/New_York', time: '' },
  { name: '伦敦', timezone: 'Europe/London', time: '' },
  { name: '巴黎', timezone: 'Europe/Paris', time: '' },
  { name: '悉尼', timezone: 'Australia/Sydney', time: '' }
])

function updateTimes() {
  cities.value.forEach(city => {
    city.time = new Date().toLocaleTimeString('zh-CN', { timeZone: city.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  })
}

onMounted(() => {
  updateTimes()
  setInterval(updateTimes, 1000)
})

useHead({ title: t('pages.worldClock.title') })
</script>
