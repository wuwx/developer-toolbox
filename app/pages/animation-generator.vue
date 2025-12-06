<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.animationGenerator.title')" :description="$t('pages.animationGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-play" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <UCard>
          <template #header><h3 class="font-semibold">{{ $t('ui.animationProps') }}</h3></template>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.animationName') }}</label>
              <UInput v-model="animationName" placeholder="myAnimation" class="w-full" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.duration') }}: {{ duration }}s</label>
              <URange v-model="duration" :min="0.1" :max="5" :step="0.1" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.delay') }}: {{ delay }}s</label>
              <URange v-model="delay" :min="0" :max="3" :step="0.1" />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.easingFunction') }}</label>
              <USelect v-model="timing" :options="['linear','ease','ease-in','ease-out','ease-in-out'].map(t => ({label:t,value:t}))" class="w-full" />
            </div>
            <UCheckbox v-model="infinite" :label="$t('ui.infiniteLoop')" />
          </div>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">{{ $t('ui.cssCode') }}</h3>
              <UButton color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(cssCode, 'CSS')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <pre class="text-xs text-gray-300 overflow-x-auto">{{ cssCode }}</pre>
          </div>
        </UCard>
      </div>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.preview') }}</h3></template>
        <div class="flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[400px]">
          <div class="w-24 h-24 bg-primary-500 rounded-lg" :style="animationStyle"></div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const animationName = ref('fadeIn')
const duration = ref(1)
const delay = ref(0)
const timing = ref('ease')
const infinite = ref(false)

const animationStyle = computed(() => ({
  animation: `${animationName.value} ${duration.value}s ${timing.value} ${delay.value}s ${infinite.value ? 'infinite' : ''}`
}))

const cssCode = computed(() => `@keyframes ${animationName.value} {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.element {
  animation: ${animationName.value} ${duration.value}s ${timing.value} ${delay.value}s${infinite.value ? ' infinite' : ''};
}`)

useHead({ title: t('pages.animationGenerator.title'), meta: [{ name: 'description', content: t('pages.animationGenerator.description') }] })
</script>

<style>
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
