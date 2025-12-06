<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="缓动函数" description="CSS 缓动函数可视化" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-chart-bar" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard v-for="easing in easings" :key="easing.name" @click="selected = easing.name" class="cursor-pointer" :class="selected === easing.name ? 'ring-2 ring-primary-500' : ''">
        <div class="space-y-4">
          <div class="font-semibold">{{ easing.name }}</div>
          <div class="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-end p-4">
            <div class="w-8 h-8 bg-primary-500 rounded" :style="{animation: `move 2s ${easing.value} infinite`}"></div>
          </div>
          <code class="text-xs">{{ easing.value }}</code>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const selected = ref('ease')
const easings = [
  { name: 'Linear', value: 'linear' },
  { name: 'Ease', value: 'ease' },
  { name: 'Ease In', value: 'ease-in' },
  { name: 'Ease Out', value: 'ease-out' },
  { name: 'Ease In Out', value: 'ease-in-out' },
  { name: 'Cubic Bezier', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
]

useHead({ title: '缓动函数 | 开发者工具箱' })
</script>

<style>
@keyframes move {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(200px); }
}
</style>
