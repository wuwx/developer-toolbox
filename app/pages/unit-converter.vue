<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.unitConverter.title')" :description="$t('pages.unitConverter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-scale" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-8">
        <!-- 类型选择 -->
        <div class="flex justify-center">
          <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <UButton :variant="type === 'data' ? 'solid' : 'ghost'" @click="type = 'data'">数据存储</UButton>
            <UButton :variant="type === 'length' ? 'solid' : 'ghost'" @click="type = 'length'">长度</UButton>
            <UButton :variant="type === 'weight' ? 'solid' : 'ghost'" @click="type = 'weight'">重量</UButton>
          </div>
        </div>

        <!-- 转换器 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <div class="grid gap-6 sm:grid-cols-2 items-end">
            <div>
              <label class="block text-sm font-medium mb-2">输入</label>
              <div class="flex gap-2">
                <UInput v-model="inputValue" type="number" size="xl" class="flex-1" />
                <USelect v-model="fromUnit" :options="currentUnits" size="xl" class="w-32 flex-shrink-0" />
              </div>
            </div>
            <div class="text-center text-2xl text-gray-400 hidden sm:block">
              =
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">结果预览</label>
              <div class="space-y-2">
                <div v-for="u in currentUnits" :key="u.value" class="flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
                  <span class="text-sm text-gray-500">{{ u.label }}</span>
                  <span class="font-mono font-medium">{{ convert(inputValue, fromUnit, u.value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const type = ref<'data' | 'length' | 'weight'>('data')
const inputValue = ref(1)
const fromUnit = ref('MB')

// Units definition
// factor: relative to base unit (e.g. Byte, Meter, Gram)
const units = {
  data: [
    { label: 'Byte (B)', value: 'B', factor: 1 },
    { label: 'Kilobyte (KB)', value: 'KB', factor: 1024 },
    { label: 'Megabyte (MB)', value: 'MB', factor: 1024 * 1024 },
    { label: 'Gigabyte (GB)', value: 'GB', factor: 1024 * 1024 * 1024 },
    { label: 'Terabyte (TB)', value: 'TB', factor: 1024 * 1024 * 1024 * 1024 }
  ],
  length: [
    { label: 'Millimeter (mm)', value: 'mm', factor: 0.001 },
    { label: 'Centimeter (cm)', value: 'cm', factor: 0.01 },
    { label: 'Meter (m)', value: 'm', factor: 1 },
    { label: 'Kilometer (km)', value: 'km', factor: 1000 },
    { label: 'Inch (in)', value: 'in', factor: 0.0254 },
    { label: 'Foot (ft)', value: 'ft', factor: 0.3048 }
  ],
  weight: [
    { label: 'Milligram (mg)', value: 'mg', factor: 0.001 },
    { label: 'Gram (g)', value: 'g', factor: 1 },
    { label: 'Kilogram (kg)', value: 'kg', factor: 1000 },
    { label: 'Pound (lb)', value: 'lb', factor: 453.592 },
    { label: 'Ounce (oz)', value: 'oz', factor: 28.3495 }
  ]
}

const currentUnits = computed(() => units[type.value])

watch(type, () => {
  const list = currentUnits.value
  if (list && list.length > 1) {
    fromUnit.value = list[1].value
  } else if (list && list.length > 0) {
    fromUnit.value = list[0].value
  }
})

const convert = (val: number | string, from: string, to: string) => {
  const v = Number(val)
  if (isNaN(v)) return '-'
  
  const fromFactor = currentUnits.value.find(u => u.value === from)?.factor || 1
  const toFactor = currentUnits.value.find(u => u.value === to)?.factor || 1
  
  const result = (v * fromFactor) / toFactor
  
  // Format logic
  if (result >= 1000 || result < 0.001) {
    return result.toExponential(4)
  }
  return parseFloat(result.toFixed(6))
}

useHead({ title: t('pages.unitConverter.title'), meta: [{ name: 'description', content: t('pages.unitConverter.description') }] })
</script>
