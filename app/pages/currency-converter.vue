<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="汇率换算" description="货币汇率转换工具" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-currency-dollar" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="max-w-2xl mx-auto">
      <UCard>
        <div class="space-y-6">
          <div>
            <label class="text-sm font-medium mb-2 block">金额</label>
            <UInput v-model="amount" type="number" size="xl" placeholder="100" class="w-full" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium mb-2 block">从</label>
              <USelect v-model="from" :options="currencies" class="w-full" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">到</label>
              <USelect v-model="to" :options="currencies" class="w-full" />
            </div>
          </div>
          <UButton block color="primary" size="lg" @click="convert">转换</UButton>
          <div v-if="result" class="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-4xl font-bold text-primary-600">{{ result }}</div>
            <div class="text-sm text-gray-500 mt-2">{{ to }}</div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const amount = ref('100')
const from = ref('CNY')
const to = ref('USD')
const result = ref('')

const currencies = [
  { label: '人民币 (CNY)', value: 'CNY' },
  { label: '美元 (USD)', value: 'USD' },
  { label: '欧元 (EUR)', value: 'EUR' },
  { label: '日元 (JPY)', value: 'JPY' },
  { label: '英镑 (GBP)', value: 'GBP' }
]

const rates: Record<string, number> = {
  'CNY': 1,
  'USD': 0.14,
  'EUR': 0.13,
  'JPY': 20.5,
  'GBP': 0.11
}

function convert() {
  const amt = parseFloat(amount.value)
  if (!amt) return
  const fromRate = rates[from.value]
  const toRate = rates[to.value]
  result.value = ((amt / fromRate) * toRate).toFixed(2)
}

useHead({ title: '汇率换算 | 开发者工具箱' })
</script>
