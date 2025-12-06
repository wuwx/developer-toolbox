<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.httpStatus.title')" :description="$t('pages.httpStatus.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-signal" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="mb-8 flex flex-wrap gap-4">
      <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" :placeholder="$t('common.search')" size="lg" class="flex-1 min-w-[200px]" />
      <div class="flex gap-2">
        <UButton v-for="cat in categories" :key="cat.value" :color="selectedCategory === cat.value ? 'primary' : 'neutral'" :variant="selectedCategory === cat.value ? 'solid' : 'soft'" size="sm" @click="selectedCategory = cat.value">{{ cat.label }}</UButton>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <UCard v-for="code in filteredCodes" :key="code.code" class="group hover:ring-2 hover:ring-primary-500/50 transition-all">
        <div class="flex items-start justify-between mb-2">
          <UBadge :color="getColor(code.code)" size="lg" variant="solid">{{ code.code }}</UBadge>
          <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" @click="showDetail(code)" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ code.phrase }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ code.description }}</p>
      </UCard>
    </div>

    <UModal v-model="isOpen">
      <div class="p-6" v-if="currentCode">
        <div class="flex items-center gap-4 mb-6">
          <UBadge :color="getColor(currentCode.code)" size="xl" variant="solid" class="text-xl px-4 py-2">{{ currentCode.code }}</UBadge>
          <div><h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ currentCode.phrase }}</h3></div>
        </div>
        <div class="space-y-6">
          <div><div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</div><p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ currentCode.description }}</p></div>
          <div v-if="currentCode.solution"><div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Solution</div><div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-600 dark:text-gray-300">{{ currentCode.solution }}</div></div>
        </div>
        <div class="mt-6 flex justify-end"><UButton color="neutral" variant="ghost" @click="isOpen = false">Close</UButton></div>
      </div>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

interface StatusCode { code: number; phrase: string; description: string; solution?: string }

const searchQuery = ref('')
const selectedCategory = ref('all')
const isOpen = ref(false)
const currentCode = ref<StatusCode | null>(null)

const categories = [{ label: 'All', value: 'all' }, { label: '1xx Info', value: '1' }, { label: '2xx Success', value: '2' }, { label: '3xx Redirect', value: '3' }, { label: '4xx Client', value: '4' }, { label: '5xx Server', value: '5' }]

const codes: StatusCode[] = [
  { code: 100, phrase: 'Continue', description: 'Server received partial request, client should continue.' },
  { code: 101, phrase: 'Switching Protocols', description: 'Server switching to different protocol.' },
  { code: 200, phrase: 'OK', description: 'Request succeeded.' },
  { code: 201, phrase: 'Created', description: 'Request succeeded and resource created.' },
  { code: 204, phrase: 'No Content', description: 'Request succeeded but no content returned.' },
  { code: 301, phrase: 'Moved Permanently', description: 'Resource permanently moved to new URI.' },
  { code: 302, phrase: 'Found', description: 'Resource temporarily moved.' },
  { code: 304, phrase: 'Not Modified', description: 'Resource not modified since last request.' },
  { code: 400, phrase: 'Bad Request', description: 'Server cannot process due to client error.', solution: 'Check request syntax and parameters.' },
  { code: 401, phrase: 'Unauthorized', description: 'Authentication required.', solution: 'Provide valid credentials or token.' },
  { code: 403, phrase: 'Forbidden', description: 'Server refuses to authorize request.', solution: 'Check permissions.' },
  { code: 404, phrase: 'Not Found', description: 'Resource not found.', solution: 'Check URL spelling.' },
  { code: 405, phrase: 'Method Not Allowed', description: 'HTTP method not allowed.', solution: 'Use correct HTTP method.' },
  { code: 429, phrase: 'Too Many Requests', description: 'Rate limit exceeded.', solution: 'Reduce request frequency.' },
  { code: 500, phrase: 'Internal Server Error', description: 'Server encountered error.', solution: 'Check server logs.' },
  { code: 502, phrase: 'Bad Gateway', description: 'Invalid response from upstream.', solution: 'Check upstream service.' },
  { code: 503, phrase: 'Service Unavailable', description: 'Server temporarily unavailable.', solution: 'Retry later.' },
  { code: 504, phrase: 'Gateway Timeout', description: 'Upstream server timeout.', solution: 'Increase timeout or check upstream.' }
]

const filteredCodes = computed(() => codes.filter(code => {
  const matchSearch = code.code.toString().includes(searchQuery.value) || code.phrase.toLowerCase().includes(searchQuery.value.toLowerCase()) || code.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  const matchCategory = selectedCategory.value === 'all' || Math.floor(code.code / 100).toString() === selectedCategory.value
  return matchSearch && matchCategory
}))

function getColor(code: number) {
  if (code >= 500) return 'error'
  if (code >= 400) return 'warning'
  if (code >= 300) return 'primary'
  if (code >= 200) return 'success'
  return 'neutral'
}

function showDetail(code: StatusCode) { currentCode.value = code; isOpen.value = true }

useHead({ title: t('pages.httpStatus.title'), meta: [{ name: 'description', content: t('pages.httpStatus.description') }] })
</script>
