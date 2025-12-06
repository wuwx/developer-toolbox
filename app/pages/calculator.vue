<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.calculator.title')" :description="$t('pages.calculator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-calculator" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="max-w-md mx-auto">
      <UCard>
        <div class="space-y-4">
          <div class="p-6 bg-gray-900 rounded-lg text-right">
            <div class="text-4xl font-mono text-white">{{ display || '0' }}</div>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <UButton v-for="btn in buttons" :key="btn" @click="press(btn)" :color="getColor(btn)" class="h-16 text-lg font-semibold">{{ btn }}</UButton>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const display = ref('')
const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C','√','²','%']

function press(btn: string) {
  if (btn === '=') {
    try {
      display.value = eval(display.value.replace('²', '**2').replace('√', 'Math.sqrt')).toString()
    } catch { display.value = 'Error' }
  } else if (btn === 'C') {
    display.value = ''
  } else if (btn === '√') {
    display.value += 'Math.sqrt('
  } else if (btn === '²') {
    display.value += '**2'
  } else if (btn === '%') {
    display.value += '/100'
  } else {
    display.value += btn
  }
}

function getColor(btn: string) {
  if ('+-*/'.includes(btn)) return 'primary'
  if (btn === '=') return 'success'
  if (btn === 'C') return 'error'
  return 'neutral'
}

useHead({ title: t('pages.calculator.title') })
</script>
