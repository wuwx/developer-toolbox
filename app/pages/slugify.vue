<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.slugify.title')" :description="$t('pages.slugify.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-link" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ $t('ui.inputText') }}</h3>
                <UButton v-if="input" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="input = ''">{{ $t('ui.clear') }}</UButton>
              </div>
            </template>
            <UTextarea v-model="input" placeholder="Hello World! This is a test." :rows="8" autoresize class="font-mono text-sm w-full" :ui="{ base: 'p-4' }" />
          </UCard>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">{{ $t('ui.separator') }}</label>
              <UInput v-model="separator" placeholder="-" class="w-full" />
            </div>
            <div class="flex items-end mb-1">
              <UCheckbox v-model="lowercase" :label="$t('ui.toLowercase')" />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <UCard class="h-full flex flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ $t('ui.result') }} (Slug)</h3>
                <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Slug')">{{ $t('ui.copy') }}</UButton>
              </div>
            </template>
            <UTextarea v-model="output" readonly :rows="8" autoresize class="font-mono text-sm w-full h-full" :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4 h-full' }" />
          </UCard>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const input = ref('Hello World! This is a test.')
const separator = ref('-')
const lowercase = ref(true)

const output = computed(() => {
  if (!input.value) return ''
  let text = input.value.toString().trim()
  if (lowercase.value) text = text.toLowerCase()
  const sep = separator.value || '-'
  return text
    .replace(/\s+/g, sep)
    .replace(/&/g, `${sep}and${sep}`)
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, sep)
    .replace(new RegExp(`^${sep}+|${sep}+$`, 'g'), '')
})

useHead({ title: t('pages.slugify.title'), meta: [{ name: 'description', content: t('pages.slugify.description') }] })
</script>
