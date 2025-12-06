<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.rot13.title')" :description="$t('pages.rot13.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full" @input="transform" />
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'ROT13')">{{ $t('ui.copy') }}</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly class="w-full" />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()
const input = ref('')
const output = ref('')

function transform() {
  output.value = input.value.replace(/[a-zA-Z]/g, char => {
    const code = char.charCodeAt(0)
    const base = code >= 97 ? 97 : 65
    return String.fromCharCode(((code - base + 13) % 26) + base)
  })
}

useHead({ title: t('pages.rot13.title'), meta: [{ name: 'description', content: t('pages.rot13.description') }] })
</script>
