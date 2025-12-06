<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Chmod 权限计算器"
      description="Linux 文件权限计算工具，可视化勾选生成 rwx 权限码"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-command-line" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 配置区域 -->
      <ToolCard>
        <div class="space-y-8">
          <!-- Owner -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">所有者 (Owner)</h3>
              <UBadge color="primary" variant="subtle">{{ ownerScore }}</UBadge>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <UCheckbox v-model="permissions.owner.read" label="读取 (4)" />
              <UCheckbox v-model="permissions.owner.write" label="写入 (2)" />
              <UCheckbox v-model="permissions.owner.execute" label="执行 (1)" />
            </div>
          </div>

          <USeparator />

          <!-- Group -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">用户组 (Group)</h3>
              <UBadge color="primary" variant="subtle">{{ groupScore }}</UBadge>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <UCheckbox v-model="permissions.group.read" label="读取 (4)" />
              <UCheckbox v-model="permissions.group.write" label="写入 (2)" />
              <UCheckbox v-model="permissions.group.execute" label="执行 (1)" />
            </div>
          </div>

          <USeparator />

          <!-- Others -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-white">其他用户 (Others)</h3>
              <UBadge color="primary" variant="subtle">{{ otherScore }}</UBadge>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <UCheckbox v-model="permissions.other.read" label="读取 (4)" />
              <UCheckbox v-model="permissions.other.write" label="写入 (2)" />
              <UCheckbox v-model="permissions.other.execute" label="执行 (1)" />
            </div>
          </div>
        </div>
      </ToolCard>

      <!-- 结果区域 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
              计算结果
            </h3>
          </template>

          <div class="space-y-6">
            <!-- 数字表示 -->
            <div class="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-500 mb-2">八进制权限码</div>
              <div class="text-6xl font-bold text-primary-600 font-mono tracking-wider">{{ octalCode }}</div>
            </div>

            <!-- 符号表示 -->
            <div class="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-500 mb-2">符号表示</div>
              <div class="text-2xl font-bold text-gray-700 dark:text-gray-200 font-mono tracking-widest">{{ symbolicCode }}</div>
            </div>

            <!-- 命令示例 -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Linux 命令</label>
              <div class="flex gap-2">
                <UInput
                  :model-value="`chmod ${octalCode} filename`"
                  readonly
                  class="flex-1 font-mono"
                  icon="i-heroicons-command-line"
                />
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(`chmod ${octalCode} filename`, '命令')"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <ToolInfo title="Linux 权限说明" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

const { copyToClipboard } = useToolClipboard()

definePageMeta({
  layout: 'default'
})

const permissions = reactive({
  owner: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  other: { read: true, write: false, execute: false }
})

const calculateScore = (p: { read: boolean, write: boolean, execute: boolean }) => {
  return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0)
}

const getSymbol = (p: { read: boolean, write: boolean, execute: boolean }) => {
  return (p.read ? 'r' : '-') + (p.write ? 'w' : '-') + (p.execute ? 'x' : '-')
}

const ownerScore = computed(() => calculateScore(permissions.owner))
const groupScore = computed(() => calculateScore(permissions.group))
const otherScore = computed(() => calculateScore(permissions.other))

const octalCode = computed(() => `${ownerScore.value}${groupScore.value}${otherScore.value}`)
const symbolicCode = computed(() => 
  getSymbol(permissions.owner) + getSymbol(permissions.group) + getSymbol(permissions.other)
)

const accordionItems: AccordionItem[] = [
  {
    slot: 'basics',
    label: '权限基础',
    icon: 'i-heroicons-academic-cap',
    content: 'Linux/Unix 文件系统权限分为三类用户：所有者 (Owner)、用户组 (Group) 和其他人 (Others)。每类用户都有三种权限：读取 (Read=4)、写入 (Write=2) 和执行 (Execute=1)。'
  },
  {
    slot: 'common',
    label: '常用权限',
    icon: 'i-heroicons-star',
    content: '777 (rwxrwxrwx) - 所有人拥有全部权限（慎用）；755 (rwxr-xr-x) - 所有者全权，其他人可读可执行（常用脚本/目录）；644 (rw-r--r--) - 所有者可读写，其他人只读（常用文件）。'
  }
]

useHead({
  title: 'Chmod 计算器 - Linux 文件权限生成 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 Linux Chmod 权限计算器，可视化转换 rwx 权限和八进制数字。' }
  ]
})
</script>
