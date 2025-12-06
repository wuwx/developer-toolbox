<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.wordFilter.title')" :description="$t('pages.wordFilter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-shield-exclamation" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.inputText') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full" @input="filter" />
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.filterResult') }}</h3>
            <UBadge v-if="count" color="error">{{ count }} {{ $t('ui.matches') }}</UBadge>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" class="w-full" readonly />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

const input = ref('')
const output = ref('')
const count = ref(0)

const sensitiveWords = ['test', 'example', 'demo']

function filter() {
  let result = input.value
  count.value = 0
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    const matches = result.match(regex)
    if (matches) count.value += matches.length
    result = result.replace(regex, '*'.repeat(word.length))
  })
  output.value = result
}

useHead({ title: t('pages.wordFilter.title'), meta: [{ name: 'description', content: t('pages.wordFilter.description') }] })
</script>
