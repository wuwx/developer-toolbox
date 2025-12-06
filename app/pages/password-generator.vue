<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.passwordGenerator.title')" :description="$t('pages.passwordGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-key" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-adjustments-horizontal" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.options') }}</h3>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm font-medium">{{ $t('ui.length') }}</label>
                <span class="text-sm font-bold text-primary-600">{{ length }}</span>
              </div>
              <URange v-model="length" :min="4" :max="64" />
            </div>
            <div class="space-y-3">
              <UCheckbox v-model="options.uppercase" :label="locale === 'zh-CN' ? '大写字母 (A-Z)' : 'Uppercase (A-Z)'" />
              <UCheckbox v-model="options.lowercase" :label="locale === 'zh-CN' ? '小写字母 (a-z)' : 'Lowercase (a-z)'" />
              <UCheckbox v-model="options.numbers" :label="locale === 'zh-CN' ? '数字 (0-9)' : 'Numbers (0-9)'" />
              <UCheckbox v-model="options.symbols" :label="locale === 'zh-CN' ? '特殊符号 (!@#$)' : 'Symbols (!@#$)'" />
              <UCheckbox v-model="options.excludeSimilar" :label="locale === 'zh-CN' ? '排除易混淆字符' : 'Exclude similar chars'" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.count') }}</label>
              <UInput v-model="count" type="number" :min="1" :max="50" class="w-full" />
            </div>
            <UButton block color="primary" size="lg" icon="i-heroicons-arrow-path" @click="generatePasswords">{{ $t('ui.regenerate') }}</UButton>
          </div>
        </UCard>
      </div>

      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.results') }}</h3>
              </div>
              <UButton color="neutral" variant="soft" size="sm" icon="i-heroicons-clipboard-document-list" @click="copyAll">{{ $t('ui.copyAll') }}</UButton>
            </div>
          </template>
          <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            <div v-for="(pwd, index) in passwords" :key="index" class="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
              <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-xs font-medium text-gray-500">{{ index + 1 }}</div>
              <div class="flex-1 font-mono text-lg text-gray-900 dark:text-white break-all">{{ pwd }}</div>
              <UButton color="neutral" variant="ghost" icon="i-heroicons-clipboard-document" size="sm" class="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity" @click="copyToClipboard(pwd, 'Password')" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()
const { copyToClipboard } = useToolClipboard()

const length = ref(16)
const count = ref(10)
const passwords = ref<string[]>([])

const options = reactive({ uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false })

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
  similar: 'il1Lo0O'
}

function generatePasswords() {
  passwords.value = []
  let chars = ''
  if (options.uppercase) chars += charSets.uppercase
  if (options.lowercase) chars += charSets.lowercase
  if (options.numbers) chars += charSets.numbers
  if (options.symbols) chars += charSets.symbols
  if (options.excludeSimilar) chars = chars.split('').filter(c => !charSets.similar.includes(c)).join('')
  if (!chars) { passwords.value = ['Please select at least one character type']; return }

  for (let i = 0; i < count.value; i++) {
    let password = ''
    const array = new Uint32Array(length.value)
    crypto.getRandomValues(array)
    for (let j = 0; j < length.value; j++) { password += chars[array[j] % chars.length] || '' }
    passwords.value.push(password)
  }
}

function copyAll() { copyToClipboard(passwords.value.join('\n'), 'All passwords') }

watch([length, count, options], () => { generatePasswords() }, { deep: true })
onMounted(() => { generatePasswords() })

useHead({ title: t('pages.passwordGenerator.title'), meta: [{ name: 'description', content: t('pages.passwordGenerator.description') }] })
</script>
