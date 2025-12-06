<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.ipv4Converter.title')" :description="$t('pages.ipv4Converter.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <ToolCard>
      <div class="space-y-6">
        <div class="grid gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('ui.ipAddress') }} (Dot-decimal)</label>
            <UInput v-model="ip" placeholder="192.168.1.1" @input="updateFromIP" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('ui.decimalInteger') }}</label>
            <UInput v-model="intVal" placeholder="3232235777" @input="updateFromInt" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('ui.hexadecimal') }}</label>
            <UInput v-model="hexVal" placeholder="C0A80101" @input="updateFromHex" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">{{ $t('ui.binary') }}</label>
            <UInput v-model="binVal" placeholder="11000000.10101000.00000001.00000001" @input="updateFromBin" class="w-full" />
          </div>
        </div>
      </div>
    </ToolCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

const ip = ref('192.168.1.1')
const intVal = ref('3232235777')
const hexVal = ref('C0A80101')
const binVal = ref('11000000.10101000.00000001.00000001')

const ipToLong = (ip: string) => {
  const parts = ip.split('.')
  if (parts.length !== 4) return 0
  return ((parseInt(parts[0] || '0') << 24) | (parseInt(parts[1] || '0') << 16) | (parseInt(parts[2] || '0') << 8) | parseInt(parts[3] || '0')) >>> 0
}

const longToIp = (long: number) => [(long >>> 24) & 0xFF, (long >>> 16) & 0xFF, (long >>> 8) & 0xFF, long & 0xFF].join('.')

const updateFromIP = () => {
  try {
    const long = ipToLong(ip.value)
    intVal.value = long.toString()
    hexVal.value = long.toString(16).toUpperCase()
    binVal.value = ip.value.split('.').map(p => parseInt(p).toString(2).padStart(8, '0')).join('.')
  } catch {}
}

const updateFromInt = () => {
  try {
    const long = parseInt(intVal.value)
    if (isNaN(long)) return
    ip.value = longToIp(long)
    hexVal.value = long.toString(16).toUpperCase()
    binVal.value = ip.value.split('.').map(p => parseInt(p).toString(2).padStart(8, '0')).join('.')
  } catch {}
}

const updateFromHex = () => {
  try {
    const long = parseInt(hexVal.value, 16)
    if (isNaN(long)) return
    ip.value = longToIp(long)
    intVal.value = long.toString()
    binVal.value = ip.value.split('.').map(p => parseInt(p).toString(2).padStart(8, '0')).join('.')
  } catch {}
}

const updateFromBin = () => {
  try {
    const cleanBin = binVal.value.replace(/\./g, '')
    const long = parseInt(cleanBin, 2)
    if (isNaN(long)) return
    ip.value = longToIp(long)
    intVal.value = long.toString()
    hexVal.value = long.toString(16).toUpperCase()
  } catch {}
}

useHead({ title: t('pages.ipv4Converter.title'), meta: [{ name: 'description', content: t('pages.ipv4Converter.description') }] })
</script>
