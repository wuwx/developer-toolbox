<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.cidr.title')" :description="$t('pages.cidr.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-server-stack" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <label class="block text-sm font-medium mb-2">IP / CIDR</label>
            <div class="flex gap-4 items-center">
              <div class="flex-1"><UInput v-model="ipInput" placeholder="192.168.1.1" size="xl" class="font-mono" :ui="{ base: 'py-3 px-4' }" /></div>
              <div class="text-xl text-gray-400">/</div>
              <div class="w-24"><UInput v-model="maskInput" type="number" placeholder="24" min="0" max="32" size="xl" class="font-mono" /></div>
            </div>
            <div class="mt-4"><URange v-model="maskInput" :min="0" :max="32" /></div>
            <div v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</div>
          </div>

          <div v-if="result" class="space-y-3">
            <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span class="text-sm text-gray-500">Netmask</span><span class="font-mono font-bold text-primary-600">{{ result.netmask }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span class="text-sm text-gray-500">Wildcard</span><span class="font-mono font-medium">{{ result.wildcard }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <span class="text-sm text-gray-500">CIDR</span><span class="font-mono font-medium">{{ result.cidr }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div v-if="result" class="grid gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div class="text-sm text-blue-600 dark:text-blue-400 mb-1">Available Hosts</div>
              <div class="text-3xl font-bold text-blue-700 dark:text-blue-300 font-mono">{{ result.hosts.toLocaleString() }}</div>
            </div>
            <div class="grid grid-cols-1 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">Network</div>
                <div class="text-lg font-mono font-bold">{{ result.network }}</div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">Broadcast</div>
                <div class="text-lg font-mono font-bold">{{ result.broadcast }}</div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">First Host</div>
                <div class="text-lg font-mono font-bold">{{ result.firstHost }}</div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 mb-1 uppercase tracking-wider">Last Host</div>
                <div class="text-lg font-mono font-bold">{{ result.lastHost }}</div>
              </div>
            </div>
          </div>
          <div v-else class="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">Enter valid IP address</div>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>


<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const ipInput = ref('192.168.1.1')
const maskInput = ref(24)
const error = ref('')

interface CIDRResult {
  netmask: string
  wildcard: string
  cidr: string
  network: string
  broadcast: string
  firstHost: string
  lastHost: string
  hosts: number
}

const result = computed<CIDRResult | null>(() => {
  error.value = ''
  if (!ipInput.value) return null
  
  const ipParts = ipInput.value.split('.').map(Number)
  if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
    error.value = 'Invalid IP address'
    return null
  }
  
  const mask = Number(maskInput.value)
  if (isNaN(mask) || mask < 0 || mask > 32) {
    error.value = 'Invalid mask (0-32)'
    return null
  }
  
  const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]
  const maskNum = mask === 0 ? 0 : (~0 << (32 - mask)) >>> 0
  const wildcardNum = (~maskNum) >>> 0
  const networkNum = (ipNum & maskNum) >>> 0
  const broadcastNum = (networkNum | wildcardNum) >>> 0
  
  const numToIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
  
  const hosts = mask >= 31 ? (mask === 32 ? 1 : 2) : Math.pow(2, 32 - mask) - 2
  const firstHost = mask >= 31 ? networkNum : networkNum + 1
  const lastHost = mask >= 31 ? broadcastNum : broadcastNum - 1
  
  return {
    netmask: numToIp(maskNum),
    wildcard: numToIp(wildcardNum),
    cidr: `${numToIp(networkNum)}/${mask}`,
    network: numToIp(networkNum),
    broadcast: numToIp(broadcastNum),
    firstHost: numToIp(firstHost),
    lastHost: numToIp(lastHost),
    hosts
  }
})

useHead({ title: t('pages.cidr.title'), meta: [{ name: 'description', content: t('pages.cidr.description') }] })
</script>
