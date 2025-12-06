<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="CSS 单位转换器"
      description="PX, REM, EM, % 等 CSS 单位相互转换，支持自定义基准值"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-right-left" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <!-- 配置 -->
        <div class="flex justify-center">
          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 flex items-center gap-4">
            <label class="text-sm font-medium">基准字体大小 (Base Font Size)</label>
            <div class="w-24 flex items-center gap-2">
              <UInput v-model="baseSize" type="number" size="sm" />
              <span class="text-sm text-gray-500">px</span>
            </div>
          </div>
        </div>

        <!-- 转换表格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- PX -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-center">Pixels (px)</label>
            <UInput v-model="px" type="number" size="xl" class="text-center font-mono" @input="updateFromPx" />
          </div>

          <!-- REM -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-center">REM</label>
            <UInput v-model="rem" type="number" size="xl" class="text-center font-mono" @input="updateFromRem" />
          </div>

          <!-- EM -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-center">EM</label>
            <UInput v-model="em" type="number" size="xl" class="text-center font-mono" @input="updateFromEm" />
          </div>

          <!-- Percent -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-center">Percentage (%)</label>
            <UInput v-model="percent" type="number" size="xl" class="text-center font-mono" @input="updateFromPercent" />
          </div>
        </div>
        
        <div class="text-center text-sm text-gray-500">
          注：默认浏览器字体大小为 16px。REM 相对于根元素 (html)，EM 相对于父元素。此处假设 EM 上下文也为基准值。
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const baseSize = ref(16)
const px = ref(16)
const rem = ref(1)
const em = ref(1)
const percent = ref(100)

const updateFromPx = () => {
  const val = Number(px.value)
  rem.value = parseFloat((val / baseSize.value).toFixed(4))
  em.value = rem.value
  percent.value = parseFloat((rem.value * 100).toFixed(2))
}

const updateFromRem = () => {
  const val = Number(rem.value)
  px.value = parseFloat((val * baseSize.value).toFixed(2))
  em.value = val
  percent.value = parseFloat((val * 100).toFixed(2))
}

const updateFromEm = () => {
  const val = Number(em.value)
  px.value = parseFloat((val * baseSize.value).toFixed(2))
  rem.value = val
  percent.value = parseFloat((val * 100).toFixed(2))
}

const updateFromPercent = () => {
  const val = Number(percent.value)
  rem.value = parseFloat((val / 100).toFixed(4))
  em.value = rem.value
  px.value = parseFloat((rem.value * baseSize.value).toFixed(2))
}

watch(baseSize, () => {
  updateFromPx() // Recalculate based on current PX
})

useHead({
  title: 'CSS 单位转换器 - PX 转 REM/EM | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CSS 单位转换工具，支持 PX, REM, EM, Percentage 相互转换。' }
  ]
})
</script>
