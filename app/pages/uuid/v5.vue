<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="UUID v5 生成器"
      description="基于命名空间和名称的 UUID (Version 5, SHA1)"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-hashtag" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <!-- 版本导航 -->
    <div class="flex flex-wrap justify-center gap-2 mb-8">
      <UButton to="/uuid" color="neutral" variant="soft" size="sm">UUID v4 (随机)</UButton>
      <UButton to="/uuid/v1" color="neutral" variant="soft" size="sm">UUID v1 (时间戳)</UButton>
      <UButton to="/uuid/v3" color="neutral" variant="soft" size="sm">UUID v3 (MD5)</UButton>
      <UButton to="/uuid/v5" color="primary" variant="solid" size="sm">UUID v5 (SHA1)</UButton>
    </div>

    <ToolCard>
      <!-- 配置区域 -->
      <div class="mb-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700/50 space-y-6">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">Namespace (必须是有效的 UUID)</label>
          <div class="flex gap-2">
            <UInput v-model="namespace" placeholder="例如：6ba7b810-9dad-11d1-80b4-00c04fd430c8" class="font-mono flex-1" />
            <UButton color="neutral" variant="soft" @click="useDnsNamespace">使用 DNS Namespace</UButton>
            <UButton color="neutral" variant="soft" @click="useUrlNamespace">使用 URL Namespace</UButton>
          </div>
          <div v-if="namespaceError" class="text-xs text-red-500 mt-1">{{ namespaceError }}</div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">名称 (Names)</label>
          <UTextarea 
            v-model="nameInput" 
            placeholder="每行输入一个名称..." 
            :rows="5" 
            class="font-mono text-sm w-full" 
            :ui="{ base: 'p-4' }"
          />
        </div>

        <UButton
          block
          color="primary"
          size="lg"
          icon="i-heroicons-arrow-path"
          :disabled="!isValid"
          @click="generateUUIDs"
        >
          生成 UUID v5
        </UButton>
      </div>

      <!-- 结果列表 -->
      <div v-if="uuids.length > 0" class="space-y-4 animate-fade-in">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">生成结果</h3>
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

        <div class="grid gap-3">
          <div
            v-for="(item, index) in uuids"
            :key="index"
            class="group flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 transition-all hover:border-primary-500/50 hover:shadow-sm"
          >
            <div class="w-32 text-sm text-gray-500 truncate text-right" :title="item.name">
              {{ item.name }}
            </div>
            <div class="flex-1 font-mono text-base text-gray-700 dark:text-gray-200 select-all">
              {{ item.uuid }}
            </div>
            <UTooltip text="复制">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-heroicons-clipboard-document"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
                @click="() => copyToClipboard(item.uuid, 'UUID')"
              />
            </UTooltip>
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="关于 UUID v5" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import { v5 as uuidv5 } from 'uuid'
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const namespace = ref('6ba7b810-9dad-11d1-80b4-00c04fd430c8') // DNS namespace default
const nameInput = ref('example.com\nwww.google.com')
const uuids = ref<{name: string, uuid: string}[]>([])
const { copyToClipboard } = useToolClipboard()

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const namespaceError = computed(() => {
  if (!namespace.value) return 'Namespace 不能为空'
  if (!UUID_REGEX.test(namespace.value)) return 'Namespace 必须是有效的 UUID'
  return ''
})

const isValid = computed(() => !namespaceError.value && !!nameInput.value)

const useDnsNamespace = () => { namespace.value = '6ba7b810-9dad-11d1-80b4-00c04fd430c8' }
const useUrlNamespace = () => { namespace.value = '6ba7b811-9dad-11d1-80b4-00c04fd430c8' }

const generateUUIDs = () => {
  if (!isValid.value) return
  
  uuids.value = []
  const names = nameInput.value.split('\n').filter(n => n.trim())
  
  names.forEach(name => {
    try {
      uuids.value.push({
        name: name.trim(),
        uuid: uuidv5(name.trim(), namespace.value)
      })
    } catch (e) {
      console.error(e)
    }
  })
}

const copyAll = () => {
  copyToClipboard(uuids.value.map(i => i.uuid).join('\n'), '所有 UUID')
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'what',
    label: '什么是 UUID v5？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'UUID Version 5 和 Version 3 类似，都是基于命名空间和名称生成的。区别在于 v5 使用 SHA-1 哈希算法，而 v3 使用 MD5。'
  },
  {
    slot: 'recommendation',
    label: '推荐使用 v5',
    icon: 'i-heroicons-hand-thumb-up',
    content: '由于 SHA-1 比 MD5 更安全（虽然在 UUID 的上下文中安全性不是主要问题，但抗碰撞性更好），如果需要基于名称生成 UUID，通常推荐使用 v5 而不是 v3。'
  }
]

onMounted(() => {
  generateUUIDs()
})

useHead({
  title: 'UUID v5 生成器 - 基于 SHA1 的命名空间 UUID',
  meta: [
    { name: 'description', content: '在线生成 UUID v5，基于 Namespace 和 Name 的 SHA1 哈希生成。' }
  ]
})
</script>
