<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.traditionalSimplified.title')" :description="$t('pages.traditionalSimplified.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">{{ $t('ui.input') }}</h3></template>
        <UTextarea v-model="input" :placeholder="$t('ui.inputPlaceholder')" :rows="15" class="w-full" />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="toTraditional">{{ $t('ui.toTraditional') }}</UButton>
          <UButton block color="primary" @click="toSimplified">{{ $t('ui.toSimplified') }}</UButton>
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
const input = ref('')
const output = ref('')

const s2t: Record<string, string> = {
  '国': '國', '学': '學', '会': '會', '说': '說', '这': '這',
  '个': '個', '们': '們', '来': '來', '对': '對', '开': '開',
  '关': '關', '门': '門', '问': '問', '题': '題', '时': '時',
  '间': '間', '电': '電', '话': '話', '号': '號', '码': '碼'
}
const t2s = Object.fromEntries(Object.entries(s2t).map(([k, v]) => [v, k]))

function toTraditional() { output.value = input.value.split('').map(c => s2t[c] || c).join('') }
function toSimplified() { output.value = input.value.split('').map(c => t2s[c] || c).join('') }

useHead({ title: t('pages.traditionalSimplified.title'), meta: [{ name: 'description', content: t('pages.traditionalSimplified.description') }] })
</script>
