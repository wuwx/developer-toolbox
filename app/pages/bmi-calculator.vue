<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.bmiCalculator.title')" :description="$t('pages.bmiCalculator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-heart" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="max-w-2xl mx-auto">
      <UCard>
        <div class="space-y-6">
          <div>
            <label class="text-sm font-medium mb-2 block">{{ $t('pages.bmiCalculator.height') }}</label>
            <UInput v-model="height" type="number" size="xl" placeholder="170" class="w-full" />
          </div>
          <div>
            <label class="text-sm font-medium mb-2 block">{{ $t('pages.bmiCalculator.weight') }}</label>
            <UInput v-model="weight" type="number" size="xl" placeholder="65" class="w-full" />
          </div>
          <UButton block color="primary" size="lg" @click="calculate">{{ $t('pages.bmiCalculator.calculate') }}</UButton>
          <div v-if="bmi" class="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-5xl font-bold text-primary-600 mb-2">{{ bmi }}</div>
            <div class="text-lg font-semibold mb-4" :class="statusColor">{{ status }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p>{{ $t('pages.bmiCalculator.underweight') }}: &lt; 18.5</p>
              <p>{{ $t('pages.bmiCalculator.normal') }}: 18.5 - 23.9</p>
              <p>{{ $t('pages.bmiCalculator.overweight') }}: 24.0 - 27.9</p>
              <p>{{ $t('pages.bmiCalculator.obese') }}: ≥ 28.0</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const height = ref('')
const weight = ref('')
const bmi = ref('')
const status = ref('')

const statusColor = computed(() => {
  const val = parseFloat(bmi.value)
  if (val < 18.5) return 'text-blue-600'
  if (val < 24) return 'text-green-600'
  if (val < 28) return 'text-yellow-600'
  return 'text-red-600'
})

function calculate() {
  const h = parseFloat(height.value) / 100
  const w = parseFloat(weight.value)
  if (!h || !w) return
  const result = (w / (h * h)).toFixed(1)
  bmi.value = result
  const val = parseFloat(result)
  if (val < 18.5) status.value = t('pages.bmiCalculator.underweight')
  else if (val < 24) status.value = t('pages.bmiCalculator.normal')
  else if (val < 28) status.value = t('pages.bmiCalculator.overweight')
  else status.value = t('pages.bmiCalculator.obese')
}

useHead({ title: t('pages.bmiCalculator.title') })
</script>
