<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="SSL 证书解码"
      description="在线解析 X.509 证书 (PEM/CRT)，查看有效期、颁发者、域名等详细信息"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-identification" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 输入区域 -->
      <div class="space-y-6">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5" />
                <h3 class="font-semibold">输入证书 (PEM 格式)</h3>
              </div>
              <div class="flex gap-2">
                <UButton
                  v-if="inputCert"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark"
                  @click="inputCert = ''"
                >
                  清空
                </UButton>
                <UButton
                  color="primary"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-clipboard-document"
                  @click="pasteCert"
                >
                  粘贴
                </UButton>
              </div>
            </div>
          </template>
          
          <UTextarea
            v-model="inputCert"
            placeholder="-----BEGIN CERTIFICATE-----..."
            :rows="20"
            autoresize
            :maxrows="30"
            class="font-mono text-xs w-full"
            :ui="{ base: 'p-4 font-mono' }"
          />
        </UCard>
      </div>

      <!-- 结果区域 -->
      <div class="space-y-6">
        <UCard v-if="certInfo" class="h-full">
          <template #header>
            <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
              <h3 class="font-semibold">解析成功</h3>
            </div>
          </template>

          <div class="space-y-6 text-sm">
            <!-- 状态 -->
            <div class="flex items-center gap-2">
              <span class="text-gray-500">状态:</span>
              <UBadge :color="isExpired ? 'error' : 'success'" variant="subtle">
                {{ isExpired ? '已过期' : '有效' }}
              </UBadge>
              <span v-if="daysRemaining > 0" class="text-xs text-gray-500">
                (剩余 {{ daysRemaining }} 天)
              </span>
            </div>

            <USeparator />

            <!-- 通用信息 -->
            <div class="grid grid-cols-1 gap-4">
              <div>
                <div class="text-gray-500 mb-1">通用名称 (CN)</div>
                <div class="font-medium font-mono select-all">{{ certInfo.commonName }}</div>
              </div>
              <div>
                <div class="text-gray-500 mb-1">备用名称 (SANs)</div>
                <div class="font-mono text-xs space-y-1">
                  <div v-for="san in certInfo.sans" :key="san" class="select-all">{{ san }}</div>
                  <div v-if="certInfo.sans.length === 0" class="text-gray-400 italic">无</div>
                </div>
              </div>
            </div>

            <USeparator />

            <!-- 有效期 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-gray-500 mb-1">生效时间</div>
                <div class="font-medium">{{ formatDate(certInfo.validFrom) }}</div>
              </div>
              <div>
                <div class="text-gray-500 mb-1">过期时间</div>
                <div class="font-medium" :class="isExpired ? 'text-red-500' : ''">
                  {{ formatDate(certInfo.validTo) }}
                </div>
              </div>
            </div>

            <USeparator />

            <!-- 颁发者 -->
            <div>
              <div class="text-gray-500 mb-1">颁发者 (Issuer)</div>
              <div class="font-medium break-all">{{ certInfo.issuer }}</div>
            </div>

            <!-- 序列号 -->
            <div>
              <div class="text-gray-500 mb-1">序列号 (Serial Number)</div>
              <div class="font-mono text-xs break-all">{{ certInfo.serialNumber }}</div>
            </div>
            
            <!-- 指纹 -->
            <div>
              <div class="text-gray-500 mb-1">SHA-1 指纹</div>
              <div class="font-mono text-xs break-all">{{ certInfo.fingerprint }}</div>
            </div>
          </div>
        </UCard>

        <UCard v-else-if="error" class="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5" />
            <span class="font-medium">解析失败</span>
          </div>
          <p class="mt-2 text-sm text-red-500 dark:text-red-400">{{ error }}</p>
        </UCard>

        <div v-else class="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-left" class="w-8 h-8 mb-2 mx-auto lg:hidden" />
            <UIcon name="i-heroicons-arrow-left" class="w-8 h-8 mb-2 mx-auto hidden lg:block rotate-90 lg:rotate-0" />
            <p>请在左侧输入证书内容</p>
          </div>
        </div>
      </div>
    </div>
    
    <ToolInfo title="关于 SSL 证书" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import forge from 'node-forge'
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const inputCert = ref('')
const error = ref('')
const certInfo = ref<any>(null)

const pasteCert = async () => {
  try {
    inputCert.value = await navigator.clipboard.readText()
  } catch (e) {
    // 权限被拒绝或不支持
  }
}

watch(inputCert, () => {
  if (!inputCert.value.trim()) {
    certInfo.value = null
    error.value = ''
    return
  }
  decodeCert()
})

const decodeCert = () => {
  try {
    error.value = ''
    const cert = forge.pki.certificateFromPem(inputCert.value)
    
    // Common Name
    const cnObj = cert.subject.attributes.find((attr: any) => attr.name === 'commonName')
    const commonName = cnObj ? cnObj.value : 'Unknown'

    // Issuer
    const issuerObj = cert.issuer.attributes.find((attr: any) => attr.name === 'commonName')
    const issuerOrg = cert.issuer.attributes.find((attr: any) => attr.name === 'organizationName')
    const issuer = (issuerObj ? issuerObj.value : '') + (issuerOrg ? ` (${issuerOrg.value})` : '') || 'Unknown'

    // SANs
    const altNameExt = cert.getExtension('subjectAltName')
    const sans: string[] = []
    if (altNameExt && altNameExt.altNames) {
      altNameExt.altNames.forEach((an: any) => {
        if (an.type === 2) { // DNS Name
          sans.push(an.value)
        } else if (an.type === 7) { // IP Address
          sans.push(an.ip)
        }
      })
    }

    // Fingerprint (SHA1)
    const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()
    const md = forge.md.sha1.create()
    md.update(der)
    const fingerprint = md.digest().toHex().toUpperCase().match(/.{1,2}/g)?.join(':')

    certInfo.value = {
      commonName,
      issuer,
      validFrom: cert.validity.notBefore,
      validTo: cert.validity.notAfter,
      serialNumber: cert.serialNumber,
      sans,
      fingerprint
    }
  } catch (e: any) {
    console.error(e)
    certInfo.value = null
    error.value = '无法解析证书，请确保格式正确（PEM 格式，以 -----BEGIN CERTIFICATE----- 开头）。'
  }
}

const isExpired = computed(() => {
  if (!certInfo.value) return false
  return new Date() > certInfo.value.validTo
})

const daysRemaining = computed(() => {
  if (!certInfo.value) return 0
  const now = new Date().getTime()
  const end = certInfo.value.validTo.getTime()
  if (now > end) return 0
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date)
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'pem',
    label: '什么是 PEM 格式？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'PEM (Privacy Enhanced Mail) 是最常见的证书格式，通常以 .crt, .pem, .cer, .key 为扩展名。它以 "-----BEGIN CERTIFICATE-----" 开头，以 "-----END CERTIFICATE-----" 结尾，中间是 Base64 编码的 ASCII 字符。'
  },
  {
    slot: 'san',
    label: '什么是 SANs？',
    icon: 'i-heroicons-globe-alt',
    content: 'SAN (Subject Alternative Name) 扩展允许在 SSL 证书中指定多个域名、子域名或 IP 地址。这使得一个证书可以保护多个不同的网站。'
  }
]

useHead({
  title: 'SSL 证书解码 - 在线查看证书详情',
  meta: [
    { name: 'description', content: '在线 SSL/TLS 证书解码工具，查看证书有效期、颁发者、SAN域名列表等信息。' }
  ]
})
</script>
