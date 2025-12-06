<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="ULID 生成器"
      description="生成 ULID (Universally Unique Lexicographically Sortable Identifier)，一种可排序的 UUID 替代方案"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-bars-arrow-down" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <!-- 配置 -->
        <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium">生成数量</label>
            <div class="w-32">
              <UInput type="number" v-model="count" min="1" max="50" />
            </div>
          </div>
          
          <UButton
            size="lg"
            color="primary"
            icon="i-heroicons-arrow-path"
            @click="generate"
          >
            重新生成
          </UButton>
        </div>

        <!-- 结果 -->
        <div v-if="ulids.length > 0" class="space-y-4 animate-fade-in">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold">生成结果</h3>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-heroicons-clipboard-document-list"
              @click="copyAll"
            >
              复制全部
            </UButton>
          </div>

          <div class="grid gap-2">
            <div
              v-for="(ulid, index) in ulids"
              :key="index"
              class="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div class="font-mono text-lg tracking-wide">{{ ulid }}</div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400 font-mono hidden sm:inline">{{ ulidTime(ulid) }}</span>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(ulid, 'ULID')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="关于 ULID" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

definePageMeta({
  layout: 'default'
})

const count = ref(5)
const ulids = ref<string[]>([])

// Simple ULID implementation
const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const ENCODING_LEN = ENCODING.length
const TIME_LEN = 10
const RANDOM_LEN = 16

const encodeTime = (now: number, len: number): string => {
  let str = ''
  for (let i = len; i > 0; i--) {
    const mod = now % ENCODING_LEN
    str = ENCODING.charAt(mod) + str
    now = (now - mod) / ENCODING_LEN
  }
  return str
}

const encodeRandom = (len: number): string => {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += ENCODING.charAt(Math.floor(Math.random() * ENCODING_LEN))
  }
  return str
}

const ulid = (seedTime?: number): string => {
  const now = seedTime || Date.now()
  return encodeTime(now, TIME_LEN) + encodeRandom(RANDOM_LEN)
}

const decodeTime = (id: string): number => {
  if (id.length !== TIME_LEN + RANDOM_LEN) throw new Error('Invalid ULID length')
  const timePart = id.substr(0, TIME_LEN)
  let time = 0
  for (let i = 0; i < TIME_LEN; i++) {
    time = time * ENCODING_LEN + ENCODING.indexOf(timePart.charAt(i))
  }
  return time
}

const ulidTime = (id: string) => {
  try {
    const time = decodeTime(id)
    return new Date(time).toLocaleString()
  } catch (e) {
    return '-'
  }
}

const generate = () => {
  const newUlids = []
  for (let i = 0; i < count.value; i++) {
    newUlids.push(ulid())
  }
  ulids.value = newUlids
}

const copyAll = () => {
  copyToClipboard(ulids.value.join('\n'), '所有 ULID')
}

onMounted(() => {
  generate()
})

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 ULID？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'ULID (Universally Unique Lexicographically Sortable Identifier) 是一种旨在替代 UUID 的标识符。它由 26 个字符组成（Base32 编码），包含 48 位时间戳和 80 位随机数。'
  },
  {
    slot: 'features',
    label: 'ULID 的特点',
    icon: 'i-heroicons-star',
    content: '1. 字典序可排序（按时间顺序）。\n2. 兼容 UUID（128 位）。\n3. 不包含特殊字符（URL 安全，不区分大小写）。\n4. 毫秒级精度。'
  }
]

useHead({
  title: 'ULID 生成器 - 可排序唯一 ID | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 ULID 生成器，生成可排序的唯一标识符，替代 UUID。' }
  ]
})
</script>
