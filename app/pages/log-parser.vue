<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="日志解析器" description="解析和过滤日志文件" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-document-magnifying-glass" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">过滤</h3></template>
        <div class="space-y-4">
          <UInput v-model="filter" placeholder="搜索关键词..." />
          <div class="space-y-2">
            <UCheckbox v-model="showError" label="ERROR" />
            <UCheckbox v-model="showWarn" label="WARN" />
            <UCheckbox v-model="showInfo" label="INFO" />
          </div>
        </div>
      </UCard>
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">日志内容</h3>
              <UBadge>{{ filteredLogs.length }} 条</UBadge>
            </div>
          </template>
          <UTextarea v-model="logs" placeholder="粘贴日志内容..." :rows="20" class="font-mono text-xs" />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const logs = ref('')
const filter = ref('')
const showError = ref(true)
const showWarn = ref(true)
const showInfo = ref(true)

const filteredLogs = computed(() => {
  return logs.value.split('\n').filter(line => {
    if (filter.value && !line.toLowerCase().includes(filter.value.toLowerCase())) return false
    if (!showError.value && line.includes('ERROR')) return false
    if (!showWarn.value && line.includes('WARN')) return false
    if (!showInfo.value && line.includes('INFO')) return false
    return true
  })
})

useHead({ title: '日志解析器 | 开发者工具箱' })
</script>
