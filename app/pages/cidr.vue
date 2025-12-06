<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="CIDR 子网计算器"
      description="IP 地址 CIDR 子网掩码计算，快速计算网络地址、广播地址和可用主机范围"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-server-stack" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- 输入 -->
        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <label class="block text-sm font-medium mb-2">IP 地址 / CIDR</label>
            <div class="flex gap-4 items-center">
              <div class="flex-1">
                <UInput 
                  v-model="ipInput" 
                  placeholder="192.168.1.1" 
                  size="xl" 
                  class="font-mono"
                  :ui="{ base: 'py-3 px-4' }"
                />
              </div>
              <div class="text-xl text-gray-400">/</div>
              <div class="w-24">
                <UInput 
                  v-model="maskInput" 
                  type="number" 
                  placeholder="24" 
                  min="0" 
                  max="32" 
                  size="xl"
                  class="font-mono"
                />
              </div>
            </div>
            <div class="mt-4">
              <URange v-model="maskInput" :min="0" :max="32" />
            </div>
            <div v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</div>
          </div>

          <!-- 掩码详情 -->
          <div v-if="result" class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span class="text-sm text-gray-500">子网掩码</span>
              <span class="font-mono font-bold text-primary-600">{{ result.netmask }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span class="text-sm text-gray-500">通配符掩码 (Wildcard)</span>
              <span class="font-mono font-medium">{{ result.wildcard }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span class="text-sm text-gray-500">CIDR 表示法</span>
              <span class="font-mono font-medium">{{ result.cidr }}</span>
            </div>
          </div>
        </div>

        <!-- 结果 -->
        <div class="space-y-6">
          <div v-if="result" class="grid gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div class="text-sm text-blue-600 dark:text-blue-400 mb-1">可用主机数量</div>
              <div class="text-3xl font-bold text-blue-700 dark:text-blue-300 font-mono">{{ result.hosts.toLocaleString() }}</div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">网络地址 (Network)</div>
                <div class="text-lg font-mono font-bold">{{ result.network }}</div>
                <div class="text-xs text-gray-400 font-mono mt-1">{{ result.networkBinary }}</div>
              </div>

              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">广播地址 (Broadcast)</div>
                <div class="text-lg font-mono font-bold">{{ result.broadcast }}</div>
                <div class="text-xs text-gray-400 font-mono mt-1">{{ result.broadcastBinary }}</div>
              </div>

              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">起始 IP (First Host)</div>
                <div class="text-lg font-mono font-bold">{{ result.firstHost }}</div>
              </div>

              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">结束 IP (Last Host)</div>
                <div class="text-lg font-mono font-bold">{{ result.lastHost }}</div>
              </div>
            </div>
          </div>
          
          <div v-else class="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
            请输入有效的 IP 地址
          </div>
        </div>
      </div>
    </ToolCard>

    <ToolInfo title="关于 CIDR" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const ipInput = ref('192.168.1.1')
const maskInput = ref(24)
const error = ref('')

// IP 工具函数
const ip2long = (ip: string): number => {
  const parts = ip.split('.')
  if (parts.length !== 4) throw new Error('Invalid IP')
  return ((parseInt(parts[0] || '0') << 24) | (parseInt(parts[1] || '0') << 16) | (parseInt(parts[2] || '0') << 8) | parseInt(parts[3] || '0')) >>> 0
}

const long2ip = (long: number): string => {
  return [
    (long >>> 24) & 0xFF,
    (long >>> 16) & 0xFF,
    (long >>> 8) & 0xFF,
    long & 0xFF
  ].join('.')
}

const toBinary = (ip: string): string => {
  return ip.split('.').map(part => parseInt(part).toString(2).padStart(8, '0')).join('.')
}

const result = computed(() => {
  error.value = ''
  try {
    if (!ipInput.value) return null
    // 简单验证 IP
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ipInput.value)) {
      return null
    }

    const ip = ip2long(ipInput.value)
    const cidr = Number(maskInput.value)
    
    // 计算掩码
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
    const wildcard = (~mask) >>> 0
    
    // 计算网络和广播
    const network = (ip & mask) >>> 0
    const broadcast = (network | wildcard) >>> 0
    
    // 计算主机范围
    // 对于 /31 和 /32，没有广播和网络地址的概念，只有主机
    const firstHost = cidr >= 31 ? network : (network + 1) >>> 0
    const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0
    
    const hosts = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.pow(2, 32 - cidr) - 2

    return {
      cidr: `${long2ip(ip)}/${cidr}`,
      netmask: long2ip(mask),
      wildcard: long2ip(wildcard),
      network: long2ip(network),
      networkBinary: toBinary(long2ip(network)),
      broadcast: long2ip(broadcast),
      broadcastBinary: toBinary(long2ip(broadcast)),
      firstHost: long2ip(firstHost),
      lastHost: long2ip(lastHost),
      hosts: hosts < 0 ? 0 : hosts
    }
  } catch (e) {
    error.value = 'IP 地址格式错误'
    return null
  }
})

// 支持输入格式如 192.168.1.1/24
watch(ipInput, (val) => {
  if (val.includes('/')) {
    const parts = val.split('/')
    if (parts.length >= 2) {
      ipInput.value = parts[0] || ''
      const mask = parseInt(parts[1] || '')
      if (!isNaN(mask)) {
        maskInput.value = mask
      }
    }
  }
})

const accordionItems: AccordionItem[] = [
  {
    slot: 'cidr',
    label: '什么是 CIDR？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'CIDR (Classless Inter-Domain Routing) 无类别域间路由，是一个用于给互联网服务提供商分配 IP 地址和进行 IP 路由选择的方法。它消除了传统的 A 类、B 类、C 类地址概念。'
  },
  {
    slot: 'mask',
    label: '子网掩码',
    icon: 'i-heroicons-calculator',
    content: '子网掩码用于将 IP 地址划分为网络地址和主机地址两部分。CIDR 记法中的 /24 表示掩码的前 24 位为 1，即 255.255.255.0。'
  }
]

useHead({
  title: 'CIDR 子网计算器 - IP 掩码计算 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线 CIDR 子网计算器，计算 IP 范围、子网掩码、广播地址和可用主机数量。网络工程师必备工具。' }
  ]
})
</script>
