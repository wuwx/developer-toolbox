<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.csrGenerator.title')" :description="$t('pages.csrGenerator.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-key" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
              {{ $t('ui.input') }}
            </h3>
          </template>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">{{ $t('ui.commonName') }} (CN) <span class="text-red-500">*</span></label>
              <UInput v-model="form.cn" placeholder="example.com" class="w-full" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">{{ $t('ui.organization') }}</label>
                <UInput v-model="form.o" placeholder="Google LLC" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{{ $t('ui.organizationalUnit') }}</label>
                <UInput v-model="form.ou" placeholder="IT Dept" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">{{ $t('ui.locality') }}</label>
                <UInput v-model="form.l" placeholder="Mountain View" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{{ $t('ui.stateProvince') }}</label>
                <UInput v-model="form.st" placeholder="California" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">{{ $t('ui.countryCode') }} <span class="text-red-500">*</span></label>
                <UInput v-model="form.c" placeholder="CN" maxlength="2" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">{{ $t('ui.keySize') }}</label>
                <USelect v-model="keySize" :options="[2048, 4096]" />
              </div>
            </div>

            <UButton block size="lg" color="primary" :loading="generating" :disabled="!isValid" @click="generate">{{ $t('ui.generate') }} CSR</UButton>
          </div>
        </UCard>
      </div>

      <div class="space-y-6">
        <div v-if="result.csr" class="space-y-6 animate-fade-in">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">CSR</h3>
                <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(result.csr, 'CSR')">{{ $t('ui.copy') }}</UButton>
              </div>
            </template>
            <UTextarea v-model="result.csr" readonly :rows="12" class="font-mono text-xs w-full" />
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
                  {{ $t('ui.privateKey') }}
                </h3>
                <UButton color="neutral" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="copyToClipboard(result.privateKey, 'Private Key')">{{ $t('ui.copy') }}</UButton>
              </div>
            </template>
            <div class="bg-red-50 dark:bg-red-900/10 p-2 text-xs text-red-600 dark:text-red-400 mb-2 rounded">{{ $t('ui.privateKeyWarning') }}</div>
            <UTextarea v-model="result.privateKey" readonly :rows="12" class="font-mono text-xs w-full" />
          </UCard>
        </div>

        <div v-else class="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl min-h-[400px]">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-left" class="w-8 h-8 mb-2 mx-auto" />
            <p>{{ $t('ui.inputPlaceholder') }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <ToolInfo :title="$t('ui.about') + ' CSR'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import forge from 'node-forge'
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t } = useI18n()
const { copyToClipboard } = useToolClipboard()

const form = reactive({ cn: '', o: '', ou: '', l: '', st: '', c: 'CN' })
const keySize = ref(2048)
const generating = ref(false)
const result = reactive({ csr: '', privateKey: '' })

const isValid = computed(() => form.cn && form.c && form.c.length === 2)

const generate = () => {
  if (!isValid.value) return
  generating.value = true
  result.csr = ''
  result.privateKey = ''

  setTimeout(() => {
    try {
      const keys = forge.pki.rsa.generateKeyPair(keySize.value)
      const csr = forge.pki.createCertificationRequest()
      csr.publicKey = keys.publicKey
      
      const attrs = [{ name: 'commonName', value: form.cn }, { name: 'countryName', value: form.c }]
      if (form.st) attrs.push({ name: 'stateOrProvinceName', value: form.st })
      if (form.l) attrs.push({ name: 'localityName', value: form.l })
      if (form.o) attrs.push({ name: 'organizationName', value: form.o })
      if (form.ou) attrs.push({ name: 'organizationalUnitName', value: form.ou })
      
      csr.setSubject(attrs)
      csr.sign(keys.privateKey)
      
      result.csr = forge.pki.certificationRequestToPem(csr)
      result.privateKey = forge.pki.privateKeyToPem(keys.privateKey)
    } catch (e) {
      useToast().add({ title: t('ui.error'), description: t('ui.operationFailed'), color: 'error' })
    } finally { generating.value = false }
  }, 100)
}

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'csr', label: t('ui.whatIs') + ' CSR?', icon: 'i-heroicons-question-mark-circle', content: 'CSR (Certificate Signing Request) is a file required when applying for an SSL certificate from a CA.' },
  { slot: 'key', label: t('ui.securityNote'), icon: 'i-heroicons-lock-closed', content: 'The private key must be kept strictly confidential and never shared with anyone.' }
])

useHead({ title: t('pages.csrGenerator.title'), meta: [{ name: 'description', content: t('pages.csrGenerator.description') }] })
</script>
