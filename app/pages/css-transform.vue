<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.cssTransform.title')" :description="$t('pages.cssTransform.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrows-pointing-out" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <UCard>
          <template #header><h3 class="font-semibold">{{ $t('ui.transformProps') }}</h3></template>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.rotate') }}: {{rotate}}deg</label>
              <URange v-model="rotate" :min="-180" :max="180"/>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.scale') }}: {{scale}}</label>
              <URange v-model="scale" :min="0.5" :max="2" :step="0.1"/>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.translateX') }}: {{translateX}}px</label>
              <URange v-model="translateX" :min="-100" :max="100"/>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block">{{ $t('ui.translateY') }}: {{translateY}}px</label>
              <URange v-model="translateY" :min="-100" :max="100"/>
            </div>
          </div>
        </UCard>
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-semibold">CSS</h3>
              <UButton color="primary" variant="soft" size="sm" @click="copyToClipboard(css,'CSS')">{{ $t('ui.copy') }}</UButton>
            </div>
          </template>
          <div class="p-4 bg-gray-900 rounded-lg">
            <pre class="text-xs text-green-400">{{css}}</pre>
          </div>
        </UCard>
      </div>
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.preview') }}</h3></template>
        <div class="flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[500px]">
          <div class="w-32 h-32 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold" :style="{transform:transformValue}">BOX</div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
const { t } = useI18n()
const {copyToClipboard}=useToolClipboard()
const rotate=ref(0)
const scale=ref(1)
const translateX=ref(0)
const translateY=ref(0)

const transformValue=computed(()=>`rotate(${rotate.value}deg) scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`)
const css=computed(()=>`transform: ${transformValue.value};`)

useHead({title:t('pages.cssTransform.title'),meta:[{name:'description',content:t('pages.cssTransform.description')}]})
</script>
