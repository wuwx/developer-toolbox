<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.numberConverter.title')" :description="$t('pages.numberConverter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-calculator" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="space-y-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.inputNumber') }}</h3>
            </div>
            <UButton v-if="inputNumber" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputNumber = ''">
              {{ $t('ui.clear') }}
            </UButton>
          </div>
        </template>
        
        <UInput v-model="inputNumber" type="number" :placeholder="$t('ui.inputNumber') + ' (e.g. 1234.56)'" size="xl" class="font-mono text-lg" />
      </UCard>

      <div v-if="inputNumber" class="grid gap-4">
        <UCard>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-500">{{ $t('ui.rmbUppercase') }}</div>
            <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(rmbUppercase, $t('ui.rmbUppercase'))">
              {{ $t('ui.copy') }}
            </UButton>
          </div>
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 font-serif break-all">
            {{ rmbUppercase }}
          </div>
        </UCard>

        <div class="grid md:grid-cols-2 gap-4">
          <UCard>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-500">{{ $t('ui.chineseNumber') }}</div>
              <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(chineseNumber, $t('ui.chineseNumber'))">
                {{ $t('ui.copy') }}
              </UButton>
            </div>
            <div class="text-lg text-gray-900 dark:text-white font-serif">
              {{ chineseNumber }}
            </div>
          </UCard>

          <UCard>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-500">{{ $t('ui.englishNumber') }}</div>
              <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(englishNumber, $t('ui.englishNumber'))">
                {{ $t('ui.copy') }}
              </UButton>
            </div>
            <div class="text-lg text-gray-900 dark:text-white capitalize">
              {{ englishNumber }}
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const inputNumber = ref('')

const rmbUppercase = computed(() => {
  const n = parseFloat(inputNumber.value)
  if (isNaN(n)) return t('ui.invalidNumber')
  return digitUppercase(n)
})

const chineseNumber = computed(() => {
  const n = parseFloat(inputNumber.value)
  if (isNaN(n)) return ''
  return digitUppercase(n)
    .replace(/壹/g, '一').replace(/贰/g, '二').replace(/叁/g, '三')
    .replace(/肆/g, '四').replace(/伍/g, '五').replace(/陆/g, '六')
    .replace(/柒/g, '七').replace(/捌/g, '八').replace(/玖/g, '九')
    .replace(/拾/g, '十').replace(/佰/g, '百').replace(/仟/g, '千')
    .replace(/元/g, '').replace(/角/g, '.').replace(/分/g, '')
    .replace(/整/g, '')
})

const englishNumber = computed(() => {
  const n = parseFloat(inputNumber.value)
  if (isNaN(n)) return 'Invalid Number'
  return numberToEnglish(n)
})

function digitUppercase(n: number) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    const digitIndex = Math.floor(n * 10 * Math.pow(10, i)) % 10
    s += ((digit[digitIndex] || '') + (fraction[i] || '')).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      const digitIndex = n % 10
      p = (digit[digitIndex] || '') + (unit[1][j] || '') + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + (unit[0][i] || '') + s
  }
  
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

function numberToEnglish(n: number): string {
  const toWords = (num: number): string => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    
    if (num < 20) return ones[num] || ''
    const digit = num % 10
    if (num < 100) return (tens[Math.floor(num / 10)] || '') + (digit ? '-' + (ones[digit] || '') : '')
    if (num < 1000) return (ones[Math.floor(num / 100)] || '') + ' hundred' + (num % 100 === 0 ? '' : ' and ' + toWords(num % 100))
    return ''
  }

  if (n === 0) return 'zero'
  
  const integerPart = Math.floor(n)
  const decimalPart = Math.round((n - integerPart) * 100)
  
  let str = ''
  if (integerPart >= 1000000) return 'Number too large'
  if (integerPart >= 1000) {
    str += toWords(Math.floor(integerPart / 1000)) + ' thousand '
    if (integerPart % 1000 !== 0) str += toWords(integerPart % 1000)
  } else {
    str += toWords(integerPart)
  }
  
  if (decimalPart > 0) {
    str += ` point ${toWords(decimalPart)}`
  }
  
  return str.trim()
}

useHead({
  title: t('pages.numberConverter.title'),
  meta: [{ name: 'description', content: t('pages.numberConverter.description') }]
})
</script>
