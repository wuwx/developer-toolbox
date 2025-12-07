<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader :title="$t('pages.certDecoder.title')" :description="$t('pages.certDecoder.description')" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-identification" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">{{ $t('ui.input') }} (PEM)</h3>
              </div>
              <div class="flex gap-2">
                <UButton v-if="inputCert" color="neutral" variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="inputCert = ''">{{ $t('ui.clear') }}</UButton>
                <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-clipboard-document" @click="pasteCert">{{ $t('ui.paste') }}</UButton>
              </div>
            </div>
          </template>
          <UTextarea v-model="inputCert" placeholder="-----BEGIN CERTIFICATE-----..." :rows="20" autoresize :maxrows="30" class="font-mono text-xs w-full" :ui="{ base: 'p-4 font-mono' }" />
        </UCard>
      </div>

      <div class="space-y-6">
        <UCard v-if="certInfo" class="h-full">
          <template #header>
            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
              <h3 class="font-semibold">{{ $t('ui.result') }}</h3>
            </div>
          </template>

          <div class="space-y-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-gray-500">{{ $t('ui.status') }}:</span>
              <UBadge :color="isExpired ? 'error' : 'success'" variant="subtle">
                {{ isExpired ? $t('ui.expired') : $t('ui.valid') }}
              </UBadge>
              <span v-if="daysRemaining > 0" class="text-xs text-gray-500">({{ daysRemaining }} {{ $t('ui.daysRemaining') }})</span>
            </div>

            <USeparator />

            <div class="grid grid-cols-1 gap-4">
              <div>
                <div class="text-gray-500 mb-1">{{ $t('ui.commonName') }} (CN)</div>
                <div class="font-medium font-mono select-all">{{ certInfo.commonName }}</div>
              </div>
              <div>
                <div class="text-gray-500 mb-1">{{ $t('ui.altNames') }} (SANs)</div>
                <div class="font-mono text-xs space-y-1">
                  <div v-for="san in certInfo.sans" :key="san" class="select-all">{{ san }}</div>
                  <div v-if="certInfo.sans.length === 0" class="text-gray-400 italic">{{ $t('ui.none') }}</div>
                </div>
              </div>
            </div>

            <USeparator />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-gray-500 mb-1">{{ $t('ui.validFrom') }}</div>
                <div class="font-medium">{{ formatDate(certInfo.validFrom) }}</div>
              </div>
              <div>
                <div class="text-gray-500 mb-1">{{ $t('ui.validTo') }}</div>
                <div class="font-medium" :class="isExpired ? 'text-red-500' : ''">{{ formatDate(certInfo.validTo) }}</div>
              </div>
            </div>

            <USeparator />

            <div>
              <div class="text-gray-500 mb-1">{{ $t('ui.issuer') }}</div>
              <div class="font-medium break-all">{{ certInfo.issuer }}</div>
            </div>

            <div>
              <div class="text-gray-500 mb-1">{{ $t('ui.serialNumber') }}</div>
              <div class="font-mono text-xs break-all">{{ certInfo.serialNumber }}</div>
            </div>
            
            <div>
              <div class="text-gray-500 mb-1">SHA-1 {{ $t('ui.fingerprint') }}</div>
              <div class="font-mono text-xs break-all">{{ certInfo.fingerprint }}</div>
            </div>
          </div>
        </UCard>

        <UCard v-else-if="error" class="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
            <span class="font-medium">{{ $t('ui.error') }}</span>
          </div>
          <p class="mt-2 text-sm text-red-500 dark:text-red-400">{{ error }}</p>
        </UCard>

        <div v-else class="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-left" class="w-8 h-8 mb-2 mx-auto" />
            <p>{{ $t('ui.inputPlaceholder') }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <ToolInfo :title="$t('ui.about') + ' SSL'" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import forge from 'node-forge'
import type { AccordionItem } from '~/types'

definePageMeta({ layout: 'default' })

const { t, locale } = useI18n()

const inputCert = ref('')
const error = ref('')
const certInfo = ref<any>(null)

const pasteCert = async () => {
  try { inputCert.value = await navigator.clipboard.readText() } catch {}
}

watch(inputCert, () => {
  if (!inputCert.value.trim()) { certInfo.value = null; error.value = ''; return }
  decodeCert()
})

const decodeCert = () => {
  try {
    error.value = ''
    const cert = forge.pki.certificateFromPem(inputCert.value)
    
    const cnObj = cert.subject.attributes.find((attr: any) => attr.name === 'commonName')
    const commonName = cnObj ? cnObj.value : 'Unknown'

    const issuerObj = cert.issuer.attributes.find((attr: any) => attr.name === 'commonName')
    const issuerOrg = cert.issuer.attributes.find((attr: any) => attr.name === 'organizationName')
    const issuer = (issuerObj ? issuerObj.value : '') + (issuerOrg ? ` (${issuerOrg.value})` : '') || 'Unknown'

    const altNameExt = cert.getExtension('subjectAltName')
    const sans: string[] = []
    if (altNameExt && altNameExt.altNames) {
      altNameExt.altNames.forEach((an: any) => {
        if (an.type === 2) sans.push(an.value)
        else if (an.type === 7) sans.push(an.ip)
      })
    }

    const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()
    const md = forge.md.sha1.create()
    md.update(der)
    const fingerprint = md.digest().toHex().toUpperCase().match(/.{1,2}/g)?.join(':')

    certInfo.value = { commonName, issuer, validFrom: cert.validity.notBefore, validTo: cert.validity.notAfter, serialNumber: cert.serialNumber, sans, fingerprint }
  } catch (e: any) {
    certInfo.value = null
    error.value = t('ui.formatError')
  }
}

const isExpired = computed(() => certInfo.value ? new Date() > certInfo.value.validTo : false)
const daysRemaining = computed(() => {
  if (!certInfo.value) return 0
  const now = new Date().getTime()
  const end = certInfo.value.validTo.getTime()
  return now > end ? 0 : Math.ceil((end - now) / (1000 * 60 * 60 * 24))
})

const formatDate = (date: Date) => new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' }).format(date)

const accordionItems = computed<AccordionItem[]>(() => [
  { slot: 'pem', label: t('pages.certDecoder.pem'), icon: 'i-heroicons-question-mark-circle', content: t('pages.certDecoder.pemContent') },
  { slot: 'san', label: t('pages.certDecoder.san'), icon: 'i-heroicons-globe-alt', content: t('pages.certDecoder.sanContent') }
])

useHead({ title: t('pages.certDecoder.title'), meta: [{ name: 'description', content: t('pages.certDecoder.description') }] })
</script>
