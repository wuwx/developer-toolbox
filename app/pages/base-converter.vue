<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.baseConverter.title')" :description="$t('pages.baseConverter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-calculator" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="space-y-6">
      <!-- 二进制 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-green-500" />
            <h3 class="font-semibold">二进制 (Binary)</h3>
            <UBadge color="success" variant="subtle" size="sm">Base 2</UBadge>
          </div>
        </template>

        <div class="flex gap-2">
          <UInput
            v-model="binaryValue"
            placeholder="输入二进制数 (0-1)"
            size="lg"
            class="flex-1 font-mono"
            @input="handleInput('binary')"
          />
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-clipboard-document"
            @click="copyToClipboard(binaryValue, '二进制')"
            :disabled="!binaryValue"
          />
        </div>
      </UCard>

      <!-- 八进制 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-yellow-500" />
            <h3 class="font-semibold">八进制 (Octal)</h3>
            <UBadge color="warning" variant="subtle" size="sm">Base 8</UBadge>
          </div>
        </template>

        <div class="flex gap-2">
          <UInput
            v-model="octalValue"
            placeholder="输入八进制数 (0-7)"
            size="lg"
            class="flex-1 font-mono"
            @input="handleInput('octal')"
          />
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-clipboard-document"
            @click="copyToClipboard(octalValue, '八进制')"
            :disabled="!octalValue"
          />
        </div>
      </UCard>

      <!-- 十进制 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-blue-500" />
            <h3 class="font-semibold">十进制 (Decimal)</h3>
            <UBadge color="primary" variant="subtle" size="sm">Base 10</UBadge>
          </div>
        </template>

        <div class="flex gap-2">
          <UInput
            v-model="decimalValue"
            placeholder="输入十进制数 (0-9)"
            size="lg"
            class="flex-1 font-mono"
            @input="handleInput('decimal')"
          />
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-clipboard-document"
            @click="copyToClipboard(decimalValue, '十进制')"
            :disabled="!decimalValue"
          />
        </div>
      </UCard>

      <!-- 十六进制 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calculator" class="w-5 h-5 text-purple-500" />
            <h3 class="font-semibold">十六进制 (Hexadecimal)</h3>
            <UBadge color="primary" variant="subtle" size="sm">Base 16</UBadge>
          </div>
        </template>

        <div class="flex gap-2">
          <UInput
            v-model="hexValue"
            placeholder="输入十六进制数 (0-9, A-F)"
            size="lg"
            class="flex-1 font-mono"
            @input="handleInput('hex')"
          />
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-clipboard-document"
            @click="copyToClipboard(hexValue, '十六进制')"
            :disabled="!hexValue"
          />
        </div>
      </UCard>

      <!-- 错误提示 -->
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
          <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 mt-0.5 shrink-0" />
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- 快速参考 -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
            <h3 class="font-semibold">进制对照表</h3>
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-gray-200 dark:border-gray-800">
              <tr class="text-left">
                <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">十进制</th>
                <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">二进制</th>
                <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">八进制</th>
                <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">十六进制</th>
              </tr>
            </thead>
            <tbody class="font-mono text-xs">
              <tr v-for="i in 16" :key="i" class="border-b border-gray-100 dark:border-gray-900">
                <td class="py-2">{{ i - 1 }}</td>
                <td class="py-2">{{ (i - 1).toString(2).padStart(4, '0') }}</td>
                <td class="py-2">{{ (i - 1).toString(8) }}</td>
                <td class="py-2">{{ (i - 1).toString(16).toUpperCase() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const binaryValue = ref('')
const octalValue = ref('')
const decimalValue = ref('')
const hexValue = ref('')
const error = ref('')

type Base = 'binary' | 'octal' | 'decimal' | 'hex'

function handleInput(source: Base) {
  error.value = ''
  
  try {
    let decimal: number
    
    switch (source) {
      case 'binary':
        if (binaryValue.value && !/^[01]+$/.test(binaryValue.value)) {
          error.value = '二进制只能包含 0 和 1'
          return
        }
        decimal = parseInt(binaryValue.value || '0', 2)
        break
        
      case 'octal':
        if (octalValue.value && !/^[0-7]+$/.test(octalValue.value)) {
          error.value = '八进制只能包含 0-7'
          return
        }
        decimal = parseInt(octalValue.value || '0', 8)
        break
        
      case 'decimal':
        if (decimalValue.value && !/^\d+$/.test(decimalValue.value)) {
          error.value = '十进制只能包含 0-9'
          return
        }
        decimal = parseInt(decimalValue.value || '0', 10)
        break
        
      case 'hex':
        if (hexValue.value && !/^[0-9A-Fa-f]+$/.test(hexValue.value)) {
          error.value = '十六进制只能包含 0-9 和 A-F'
          return
        }
        decimal = parseInt(hexValue.value || '0', 16)
        break
        
      default:
        return
    }
    
    if (isNaN(decimal)) {
      error.value = '无效的数值'
      return
    }
    
    // 更新其他进制
    if (source !== 'binary') {
      binaryValue.value = decimal.toString(2)
    }
    if (source !== 'octal') {
      octalValue.value = decimal.toString(8)
    }
    if (source !== 'decimal') {
      decimalValue.value = decimal.toString(10)
    }
    if (source !== 'hex') {
      hexValue.value = decimal.toString(16).toUpperCase()
    }
  } catch (e) {
    error.value = '转换失败：' + (e instanceof Error ? e.message : '未知错误')
  }
}

useHead({ title: t('pages.baseConverter.title'), meta: [{ name: 'description', content: t('pages.baseConverter.description') }] })
</script>
