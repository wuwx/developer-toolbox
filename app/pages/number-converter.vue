<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">数字转金额/大写</h1>
      <p class="text-gray-600 dark:text-gray-400">
        将数字转换为中文大写金额、中文数字、英文数字
      </p>
    </div>

    <div class="space-y-6">
      <!-- 输入 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
              <h3 class="font-semibold">输入数字</h3>
            </div>
            <UButton
              v-if="inputNumber"
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              @click="inputNumber = ''"
            >
              清空
            </UButton>
          </div>
        </template>
        
        <UInput
          v-model="inputNumber"
          type="number"
          placeholder="输入金额或数字 (例如: 1234.56)"
          size="xl"
          class="font-mono text-lg"
        />
      </UCard>

      <!-- 结果 -->
      <div v-if="inputNumber" class="grid gap-4">
        <UCard>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-500">人民币大写 (RMB)</div>
            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard(rmbUppercase, 'RMB大写')"
            >
              复制
            </UButton>
          </div>
          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 font-serif break-all">
            {{ rmbUppercase }}
          </div>
        </UCard>

        <div class="grid md:grid-cols-2 gap-4">
          <UCard>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-500">中文数字</div>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(chineseNumber, '中文数字')"
              >
                复制
              </UButton>
            </div>
            <div class="text-lg text-gray-900 dark:text-white font-serif">
              {{ chineseNumber }}
            </div>
          </UCard>

          <UCard>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-500">英文数字</div>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(englishNumber, '英文数字')"
              >
                复制
              </UButton>
            </div>
            <div class="text-lg text-gray-900 dark:text-white capitalize">
              {{ englishNumber }}
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

const inputNumber = ref('')

// 人民币大写
const rmbUppercase = computed(() => {
  const n = parseFloat(inputNumber.value)
  if (isNaN(n)) return '无效数字'
  return digitUppercase(n)
})

// 中文数字 (简化版)
const chineseNumber = computed(() => {
  const n = parseFloat(inputNumber.value)
  if (isNaN(n)) return ''
  // 复用大写逻辑但替换字符
  return digitUppercase(n)
    .replace(/壹/g, '一').replace(/贰/g, '二').replace(/叁/g, '三')
    .replace(/肆/g, '四').replace(/伍/g, '五').replace(/陆/g, '六')
    .replace(/柒/g, '七').replace(/捌/g, '八').replace(/玖/g, '九')
    .replace(/拾/g, '十').replace(/佰/g, '百').replace(/仟/g, '千')
    .replace(/元/g, '').replace(/角/g, '.').replace(/分/g, '')
    .replace(/整/g, '')
})

// 英文数字 (简单实现，支持到百万)
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
    str += ` point ${toWords(decimalPart)}` // 简化处理小数
  }
  
  return str.trim()
}

// SEO
useHead({
  title: '数字转大写金额 - 人民币大写转换 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线数字转人民币大写金额工具，支持中文大写、中文数字转换。财务报销、合同编写必备。' }
  ]
})
</script>
