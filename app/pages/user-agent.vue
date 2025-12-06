<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      :title="$t('pages.userAgent.title')"
      :description="$t('pages.userAgent.description')"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- 输入区域 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Current UA -->
        <UCard>
          <div class="flex flex-col gap-2">
            <div class="text-sm font-medium text-gray-500">{{ $t('ui.yourUserAgent') }}</div>
            <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 font-mono text-sm break-all text-primary-600 dark:text-primary-400">
              {{ currentUserAgent }}
            </div>
            <div class="flex gap-2 mt-1">
              <UButton
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-arrow-down"
                @click="userAgent = currentUserAgent"
              >
                {{ $t('ui.parseThis') }}
              </UButton>
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(currentUserAgent, 'User-Agent')"
              >
                {{ $t('ui.copy') }}
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Parse Input -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.parseUserAgent') }}</h3>
              </div>
              <UButton
                v-if="userAgent"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="userAgent = ''"
              >
                {{ $t('ui.clear') }}
              </UButton>
            </div>
          </template>

          <UTextarea
            v-model="userAgent"
            :placeholder="$t('ui.enterUserAgent')"
            :rows="6"
            size="xl"
            autoresize
            :maxrows="12"
            class="font-mono text-sm block w-full"
            :ui="{ base: 'p-4' }"
          />
        </UCard>

        <!-- Parse Result -->
        <div v-if="result" class="grid sm:grid-cols-2 gap-4">
          <!-- Browser -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.browser') }}</h3>
              </div>
            </template>
            <div class="space-y-2">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ result.browser.name }}</div>
              <div class="text-sm text-gray-500">{{ $t('ui.version') }}: {{ result.browser.version }}</div>
              <div class="text-sm text-gray-500">{{ $t('ui.engine') }}: {{ result.engine.name }} {{ result.engine.version }}</div>
            </div>
          </UCard>

          <!-- OS -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
                <UIcon name="i-heroicons-computer-desktop" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.operatingSystem') }}</h3>
              </div>
            </template>
            <div class="space-y-2">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ result.os.name }}</div>
              <div class="text-sm text-gray-500">{{ $t('ui.version') }}: {{ result.os.version }}</div>
              <div class="text-sm text-gray-500">{{ $t('ui.architecture') }}: {{ result.cpu.architecture || $t('ui.unknown') }}</div>
            </div>
          </UCard>

          <!-- Device -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.device') }}</h3>
              </div>
            </template>
            <div class="space-y-2">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ result.device.vendor || $t('ui.unknownVendor') }}</div>
              <div class="text-sm text-gray-500">{{ $t('ui.model') }}: {{ result.device.model || $t('ui.unknownModel') }}</div>
              <div class="text-sm text-gray-500">{{ $t('ui.type') }}: {{ result.device.type || 'Desktop' }}</div>
            </div>
          </UCard>

          <!-- Raw Data -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <UIcon name="i-heroicons-code-bracket" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.rawData') }}</h3>
              </div>
            </template>
            <div class="font-mono text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <div>OS: {{ result.os.name }} {{ result.os.version }}</div>
              <div>Browser: {{ result.browser.name }} {{ result.browser.version }}</div>
              <div>Device: {{ result.device.vendor }} {{ result.device.model }}</div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- 右侧：常见 UA -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.commonUserAgents') }}</h3>
            </div>
          </template>

          <div class="space-y-2">
            <button
              v-for="ua in commonUAs"
              :key="ua.name"
              class="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
              @click="userAgent = ua.ua"
            >
              <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {{ ua.name }}
              </div>
              <div class="text-xs font-mono text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ ua.ua }}
              </div>
            </button>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const userAgent = ref('')
const currentUserAgent = ref('')

// 初始化
onMounted(() => {
  if (process.client) {
    currentUserAgent.value = navigator.userAgent
    userAgent.value = navigator.userAgent
  }
})

// 简单的 UA 解析逻辑 (无依赖)
const result = computed(() => {
  if (!userAgent.value) return null
  
  const ua = userAgent.value
  const r = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    device: { vendor: '', model: '', type: 'Desktop' },
    cpu: { architecture: '' },
    engine: { name: '', version: '' }
  }
  
  // Browser
  if (/Firefox\/([0-9.]+)/.test(ua)) {
    r.browser.name = 'Firefox'
    r.browser.version = RegExp.$1
    r.engine.name = 'Gecko'
  } else if (/Chrome\/([0-9.]+)/.test(ua)) {
    r.browser.name = 'Chrome'
    r.browser.version = RegExp.$1
    r.engine.name = 'Blink'
    if (/Edg\/([0-9.]+)/.test(ua)) {
      r.browser.name = 'Edge'
      r.browser.version = RegExp.$1
    }
  } else if (/Safari\/([0-9.]+)/.test(ua) && !/Chrome/.test(ua)) {
    r.browser.name = 'Safari'
    r.browser.version = (ua.match(/Version\/([0-9.]+)/) || [])[1] || ''
    r.engine.name = 'WebKit'
  }
  
  // OS
  if (/Windows NT ([0-9.]+)/.test(ua)) {
    r.os.name = 'Windows'
    const ver = RegExp.$1
    r.os.version = ver === '10.0' ? '10/11' : ver
  } else if (/Mac OS X ([0-9_]+)/.test(ua)) {
    r.os.name = 'macOS'
    r.os.version = RegExp.$1.replace(/_/g, '.')
  } else if (/Android ([0-9.]+)/.test(ua)) {
    r.os.name = 'Android'
    r.os.version = RegExp.$1
    r.device.type = 'Mobile'
  } else if (/iPhone OS ([0-9_]+)/.test(ua)) {
    r.os.name = 'iOS'
    r.os.version = RegExp.$1.replace(/_/g, '.')
    r.device.type = 'Mobile'
    r.device.vendor = 'Apple'
    r.device.model = 'iPhone'
  } else if (/Linux/.test(ua)) {
    r.os.name = 'Linux'
  }
  
  // Device
  if (/Mobile/.test(ua)) r.device.type = 'Mobile'
  if (/Tablet/.test(ua) || /iPad/.test(ua)) r.device.type = 'Tablet'
  
  return r
})

// 常见 UA
const commonUAs = [
  {
    name: 'Chrome (Windows)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  {
    name: 'Chrome (Mac)',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  {
    name: 'Safari (iPhone)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Firefox (Windows)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
  },
  {
    name: 'Googlebot',
    ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
]

// SEO
useHead({
  title: t('pages.userAgent.title'),
  meta: [{ name: 'description', content: t('pages.userAgent.description') }]
})
</script>
