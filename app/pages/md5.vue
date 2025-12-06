<template>
  <UContainer class="py-8 sm:py-12">
    <!-- Hero 标题 -->
    <UPageHeader
      :title="$t('pages.md5.title')"
      :description="$t('pages.md5.description')"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 主内容卡片 -->
    <ToolCard>
      <!-- 输入区域 -->
      <div class="space-y-6">
        <div class="relative group">
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
              {{ $t('ui.inputText') }}
            </label>
            <div class="flex items-center gap-2">
              <UButton
                v-if="inputText"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="clearAll"
              >
                {{ $t('ui.clear') }}
              </UButton>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ inputText.length }} {{ $t('ui.characters') }}
              </UBadge>
            </div>
          </div>
          <UTextarea
            v-model="inputText"
            :placeholder="$t('ui.inputPlaceholder')"
            :rows="8"
            size="xl"
            autoresize
            :maxrows="20"
            @input="handleInput"
            class="font-mono text-base block w-full"
            :ui="{ 
              base: 'transition-shadow duration-200 focus:ring-2 focus:ring-primary-500/20 min-h-[200px] p-4 w-full'
            }"
          />
          <!-- 底部操作栏 -->
          <div class="mt-4 flex justify-end">
            <UButton
              color="primary"
              size="md"
              icon="i-heroicons-sparkles"
              :disabled="!inputText"
              @click="generateMD5"
              class="px-6"
            >
              {{ $t('pages.md5.generate') }}
            </UButton>
          </div>
        </div>

        <!-- 结果展示区域 -->
        <div v-if="md5Hash" class="animate-fade-in">
          <USeparator class="my-6" icon="i-heroicons-arrow-down" />
          
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 relative overflow-hidden">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <UIcon name="i-heroicons-key" class="w-4 h-4 text-primary-500" />
                  {{ $t('pages.md5.hashResult') }}
                </label>
                <div class="flex items-center gap-2">
                  <UBadge color="success" variant="subtle" size="md">
                    {{ md5Hash.length }} {{ $t('ui.bits') }}
                  </UBadge>
                </div>
              </div>
              
              <div class="flex gap-2">
                <UInput
                  v-model="md5Hash"
                  readonly
                  size="lg"
                  class="font-mono text-lg flex-1"
                  :ui="{ base: 'bg-white dark:bg-gray-900' }"
                  @click="() => copyToClipboard(md5Hash, $t('pages.md5.hashResult'))"
                />
                <UButton
                  color="primary"
                  variant="soft"
                  size="lg"
                  icon="i-heroicons-clipboard-document"
                  @click="() => copyToClipboard(md5Hash, $t('pages.md5.hashResult'))"
                >
                  {{ $t('ui.copy') }}
                </UButton>
              </div>

              <!-- 统计信息 -->
              <div class="mt-6 grid grid-cols-3 gap-4">
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.originalLength') }}</div>
                  <div class="font-mono font-bold text-primary-600">{{ inputText.length }}</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.hashLength') }}</div>
                  <div class="font-mono font-bold text-purple-600">32</div>
                </div>
                <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-xs text-gray-500 mb-1">{{ $t('ui.algorithmBits') }}</div>
                  <div class="font-mono font-bold text-green-600">128</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <!-- 快捷示例 -->
    <ToolExamples :examples="examples" @select="useExample" />

    <!-- 说明信息 -->
    <ToolInfo :title="$t('pages.md5.aboutTitle')" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import type { Example, AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const { t } = useI18n()
const inputText = ref('')
const md5Hash = ref('')
const { copyToClipboard } = useToolClipboard()

// 快捷示例数据
const examples: Example[] = [
  { label: 'Hello World', text: 'Hello World' },
  { label: '你好世界', text: '你好世界' },
  { label: '123456', text: '123456' },
  { label: 'admin@example.com', text: 'admin@example.com' },
  { label: 'JSON', text: '{"name":"John","age":30}' }
]

// 折叠面板数据
const accordionItems = computed<AccordionItem[]>(() => [
  {
    slot: 'what',
    label: t('pages.md5.what'),
    icon: 'i-heroicons-question-mark-circle',
    content: t('pages.md5.whatContent')
  },
  {
    slot: 'usage',
    label: t('pages.md5.usage'),
    icon: 'i-heroicons-rocket-launch',
    content: t('pages.md5.usageContent')
  },
  {
    slot: 'security',
    label: t('pages.md5.security'),
    icon: 'i-heroicons-shield-exclamation',
    content: t('pages.md5.securityContent')
  },
  {
    slot: 'features',
    label: t('pages.md5.features'),
    icon: 'i-heroicons-cpu-chip',
    content: t('pages.md5.featuresContent')
  }
])

// 生成 MD5
const generateMD5 = () => {
  if (!inputText.value) {
    return
  }
  md5Hash.value = CryptoJS.MD5(inputText.value).toString()
}

// 实时生成（可选）
const handleInput = () => {
  if (inputText.value) {
    generateMD5()
  } else {
    md5Hash.value = ''
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  md5Hash.value = ''
}

// 使用示例
const useExample = (text: string) => {
  inputText.value = text
  generateMD5()
}

// SEO 元信息
useHead({
  title: t('pages.md5.seoTitle'),
  meta: [
    { name: 'description', content: t('pages.md5.seoDesc') }
  ]
})
</script>
