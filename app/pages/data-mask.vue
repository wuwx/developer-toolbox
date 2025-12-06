<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="数据脱敏" description="敏感数据脱敏工具" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-eye-slash" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid lg:grid-cols-2 gap-8">
      <UCard>
        <template #header><h3 class="font-semibold">输入数据</h3></template>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium mb-2 block">数据类型</label>
            <USelect v-model="maskType" :options="[
              {label: '手机号', value: 'phone'},
              {label: '身份证', value: 'idcard'},
              {label: '邮箱', value: 'email'},
              {label: '银行卡', value: 'bankcard'},
              {label: '姓名', value: 'name'}
            ]" />
          </div>
          <UTextarea v-model="input" placeholder="输入需要脱敏的数据..." :rows="10" />
          <UButton block color="primary" size="lg" @click="mask">脱敏</UButton>
        </div>
      </UCard>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-semibold">脱敏结果</h3>
            <UButton v-if="output" color="primary" variant="soft" size="sm" icon="i-heroicons-clipboard-document" @click="copyToClipboard(output, '脱敏数据')">复制</UButton>
          </div>
        </template>
        <UTextarea v-model="output" :rows="10" readonly />
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()
const maskType = ref('phone')
const input = ref('')
const output = ref('')

function mask() {
  const lines = input.value.split('\n')
  output.value = lines.map(line => {
    switch (maskType.value) {
      case 'phone':
        return line.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      case 'idcard':
        return line.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
      case 'email':
        return line.replace(/(.{2}).*(@.*)/, '$1***$2')
      case 'bankcard':
        return line.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
      case 'name':
        return line.replace(/^(.)(.+)$/, '$1*')
      default:
        return line
    }
  }).join('\n')
}

useHead({ title: '数据脱敏 | 开发者工具箱' })
</script>
