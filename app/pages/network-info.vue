<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.networkInfo.title')" :description="$t('pages.networkInfo.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.connectionInfo') }}</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.connectionType') }}</div>
            <div class="font-semibold">{{ connectionType }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.effectiveType') }}</div>
            <div class="font-semibold">{{ effectiveType }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.downlinkSpeed') }}</div>
            <div class="font-semibold">{{ downlink }} Mbps</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.browserInfo') }}</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.onlineStatus') }}</div>
            <div class="font-semibold">{{ online ? $t('ui.online') : $t('ui.offline') }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.language') }}</div>
            <div class="font-semibold">{{ language }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.platform') }}</div>
            <div class="font-semibold">{{ platform }}</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.screenInfo') }}</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.resolution') }}</div>
            <div class="font-semibold">{{ screenWidth }} × {{ screenHeight }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.availableArea') }}</div>
            <div class="font-semibold">{{ availWidth }} × {{ availHeight }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.colorDepth') }}</div>
            <div class="font-semibold">{{ colorDepth }} bit</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.timezoneInfo') }}</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.timezone') }}</div>
            <div class="font-semibold">{{ timezone }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.timezoneOffset') }}</div>
            <div class="font-semibold">UTC{{ timezoneOffset }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.currentTime') }}</div>
            <div class="font-semibold">{{ currentTime }}</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.hardwareInfo') }}</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.cpuCores') }}</div>
            <div class="font-semibold">{{ cpuCores }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.memory') }}</div>
            <div class="font-semibold">{{ memory }} GB</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.touchSupport') }}</div>
            <div class="font-semibold">{{ touchSupport ? $t('ui.yes') : $t('ui.no') }}</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.storageInfo') }}</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.cookiesEnabled') }}</div>
            <div class="font-semibold">{{ cookieEnabled ? $t('ui.yes') : $t('ui.no') }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.localStorage') }}</div>
            <div class="font-semibold">{{ localStorageAvailable ? $t('ui.available') : $t('ui.unavailable') }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">{{ $t('ui.sessionStorage') }}</div>
            <div class="font-semibold">{{ sessionStorageAvailable ? $t('ui.available') : $t('ui.unavailable') }}</div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()

const connectionType = ref('unknown')
const effectiveType = ref('unknown')
const downlink = ref(0)
const online = ref(true)
const language = ref('')
const platform = ref('')
const screenWidth = ref(0)
const screenHeight = ref(0)
const availWidth = ref(0)
const availHeight = ref(0)
const colorDepth = ref(0)
const timezone = ref('')
const timezoneOffset = ref('')
const currentTime = ref('')
const cpuCores = ref(0)
const memory = ref(0)
const touchSupport = ref(false)
const cookieEnabled = ref(false)
const localStorageAvailable = ref(false)
const sessionStorageAvailable = ref(false)

onMounted(() => {
  online.value = navigator.onLine
  language.value = navigator.language
  platform.value = navigator.platform
  screenWidth.value = screen.width
  screenHeight.value = screen.height
  availWidth.value = screen.availWidth
  availHeight.value = screen.availHeight
  colorDepth.value = screen.colorDepth
  timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  cpuCores.value = navigator.hardwareConcurrency || 0
  cookieEnabled.value = navigator.cookieEnabled

  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  if (conn) {
    connectionType.value = conn.type || 'unknown'
    effectiveType.value = conn.effectiveType || 'unknown'
    downlink.value = conn.downlink || 0
  }
  
  const offset = new Date().getTimezoneOffset()
  const hours = Math.abs(Math.floor(offset / 60))
  const minutes = Math.abs(offset % 60)
  timezoneOffset.value = `${offset <= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  
  const nav = navigator as any
  if (nav.deviceMemory) memory.value = nav.deviceMemory
  
  touchSupport.value = 'ontouchstart' in window
  
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    localStorageAvailable.value = true
  } catch {}
  
  try {
    sessionStorage.setItem('test', 'test')
    sessionStorage.removeItem('test')
    sessionStorageAvailable.value = true
  } catch {}
  
  setInterval(() => {
    currentTime.value = new Date().toLocaleString(locale.value === 'zh-CN' ? 'zh-CN' : 'en-US')
  }, 1000)
})

useHead({ title: t('pages.networkInfo.title'), meta: [{ name: 'description', content: t('pages.networkInfo.description') }] })
</script>
