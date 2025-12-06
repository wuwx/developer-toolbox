<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="繁简转换" description="繁体字简体字互转" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-language" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入</h3></template>
        <UTextarea v-model="input" placeholder="输入文本..." :rows="15" />
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UButton block color="primary" @click="toTraditional">转繁体</UButton>
          <UButton block color="primary" @click="toSimplified">转简体</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">输出</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, '转换结果')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="15" readonly />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
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

function toTraditional() {
  output.value = input.value.split('').map(c => s2t[c] || c).join('')
}

function toSimplified() {
  output.value = input.value.split('').map(c => t2s[c] || c).join('')
}

useHead({ title: '繁简转换 | 开发者工具箱' })
</script>
