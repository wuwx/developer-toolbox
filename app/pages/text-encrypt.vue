<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.textEncrypt.title')" :description="$t('pages.textEncrypt.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <div class="space-y-4">
          <UInput v-model="password" type="password" placeholder="Password" size="xl" class="w-full" />
          <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="12" class="w-full" />
          <div class="grid grid-cols-2 gap-4">
            <UButton block color="primary" @click="encrypt">{{ $t('ui.encrypt') }}</UButton>
            <UButton block color="primary" @click="decrypt">{{ $t('ui.decrypt') }}</UButton>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">{{ $t('ui.output') }}</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, 'Result')">{{ $t('ui.copy') }}</UButton>
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
const password = ref('')
const input = ref('')
const output = ref('')

function encrypt() {
  if (!password.value) { output.value = 'Please enter password'; return }
  try {
    const key = password.value.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    output.value = btoa(input.value.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join(''))
  } catch (e) { output.value = t('ui.operationFailed') }
}

function decrypt() {
  if (!password.value) { output.value = 'Please enter password'; return }
  try {
    const key = password.value.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    output.value = atob(input.value).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('')
  } catch (e) { output.value = t('ui.operationFailed') }
}

useHead({ title: t('pages.textEncrypt.title'), meta: [{ name: 'description', content: t('pages.textEncrypt.description') }] })
</script>
