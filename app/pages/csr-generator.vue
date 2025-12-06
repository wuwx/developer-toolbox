<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="CSR 生成器"
      description="在线生成证书签名请求 (CSR) 和私钥，用于申请 SSL 证书"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-key" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 表单 -->
      <div class="space-y-6">
        <UCard>
          <template #header>
            <h3 class="font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
              填写信息
            </h3>
          </template>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">通用名称 (Common Name) <span class="text-red-500">*</span></label>
              <UInput v-model="form.cn" placeholder="例如：example.com" class="w-full" />
              <div class="text-xs text-gray-500 mt-1">域名，如 www.google.com 或 *.google.com</div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">组织 (Organization)</label>
                <UInput v-model="form.o" placeholder="例如：Google LLC" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">部门 (Organizational Unit)</label>
                <UInput v-model="form.ou" placeholder="例如：IT Dept" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">城市 (Locality)</label>
                <UInput v-model="form.l" placeholder="例如：Mountain View" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">省份 (State/Province)</label>
                <UInput v-model="form.st" placeholder="例如：California" class="w-full" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">国家代码 (Country) <span class="text-red-500">*</span></label>
                <UInput v-model="form.c" placeholder="CN" maxlength="2" class="w-full" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">加密位数</label>
                <USelect v-model="keySize" :options="[2048, 4096]" />
              </div>
            </div>

            <UButton
              block
              size="lg"
              color="primary"
              :loading="generating"
              :disabled="!isValid"
              @click="generate"
            >
              生成 CSR 和私钥
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- 结果 -->
      <div class="space-y-6">
        <div v-if="result.csr" class="space-y-6 animate-fade-in">
          <!-- CSR -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">CSR 文件</h3>
                <UButton
                  color="neutral"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(result.csr, 'CSR')"
                >
                  复制
                </UButton>
              </div>
            </template>
            <UTextarea
              v-model="result.csr"
              readonly
              :rows="12"
              class="font-mono text-xs w-full"
              :ui="{ base: 'p-4' }"
            />
          </UCard>

          <!-- Private Key -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
                  私钥 (Private Key)
                </h3>
                <UButton
                  color="neutral"
                  variant="soft"
                  size="xs"
                  icon="i-heroicons-clipboard-document"
                  @click="copyToClipboard(result.privateKey, 'Private Key')"
                >
                  复制
                </UButton>
              </div>
            </template>
            <div class="bg-red-50 dark:bg-red-900/10 p-2 text-xs text-red-600 dark:text-red-400 mb-2 rounded">
              请妥善保存私钥！一旦丢失无法恢复。本工具在本地生成，私钥不会上传。
            </div>
            <UTextarea
              v-model="result.privateKey"
              readonly
              :rows="12"
              class="font-mono text-xs w-full"
              :ui="{ base: 'p-4' }"
            />
          </UCard>
        </div>

        <div v-else class="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl min-h-[400px]">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-left" class="w-8 h-8 mb-2 mx-auto lg:hidden" />
            <UIcon name="i-heroicons-arrow-left" class="w-8 h-8 mb-2 mx-auto hidden lg:block rotate-90 lg:rotate-0" />
            <p>填写左侧信息生成 CSR</p>
          </div>
        </div>
      </div>
    </div>
    
    <ToolInfo title="关于 CSR" :items="accordionItems" />
  </UContainer>
</template>

<script setup lang="ts">
import forge from 'node-forge'
import type { AccordionItem } from '~/types'

definePageMeta({
  layout: 'default'
})

const { copyToClipboard } = useToolClipboard()

const form = reactive({
  cn: '',
  o: '',
  ou: '',
  l: '',
  st: '',
  c: 'CN'
})

const keySize = ref(2048)
const generating = ref(false)
const result = reactive({
  csr: '',
  privateKey: ''
})

const isValid = computed(() => {
  return form.cn && form.c && form.c.length === 2
})

const generate = () => {
  if (!isValid.value) return
  
  generating.value = true
  result.csr = ''
  result.privateKey = ''

  // 让 UI 有机会更新 loading 状态
  setTimeout(() => {
    try {
      // 1. 生成密钥对
      const keys = forge.pki.rsa.generateKeyPair(keySize.value)
      
      // 2. 创建 CSR
      const csr = forge.pki.createCertificationRequest()
      csr.publicKey = keys.publicKey
      
      const attrs = [
        { name: 'commonName', value: form.cn },
        { name: 'countryName', value: form.c }
      ]
      
      if (form.st) attrs.push({ name: 'stateOrProvinceName', value: form.st })
      if (form.l) attrs.push({ name: 'localityName', value: form.l })
      if (form.o) attrs.push({ name: 'organizationName', value: form.o })
      if (form.ou) attrs.push({ name: 'organizationalUnitName', value: form.ou })
      
      csr.setSubject(attrs)
      
      // 3. 签名
      csr.sign(keys.privateKey) // 默认 SHA256
      
      // 4. 导出
      result.csr = forge.pki.certificationRequestToPem(csr)
      result.privateKey = forge.pki.privateKeyToPem(keys.privateKey)
      
    } catch (e) {
      console.error(e)
      const toast = useToast()
      toast.add({
        title: '生成失败',
        description: '请检查输入信息是否合法',
        color: 'error'
      })
    } finally {
      generating.value = false
    }
  }, 100)
}

const accordionItems: AccordionItem[] = [
  {
    slot: 'csr',
    label: '什么是 CSR？',
    icon: 'i-heroicons-question-mark-circle',
    content: 'CSR (Certificate Signing Request) 是向 CA (证书颁发机构) 申请 SSL 证书时所需的文件。它包含了您的公钥和一些身份信息（如域名、组织名称）。CA 会验证这些信息并用他们的私钥对您的 CSR 进行签名，生成最终的证书。'
  },
  {
    slot: 'key',
    label: '私钥安全性',
    icon: 'i-heroicons-lock-closed',
    content: '私钥与 CSR 是成对生成的。私钥必须严格保密，决不能泄露给任何人（包括 CA）。如果私钥丢失，证书将无法使用；如果私钥泄露，证书将不再安全。本工具在浏览器本地生成私钥，不会上传到服务器。'
  }
]

useHead({
  title: 'CSR 生成器 - 在线生成 SSL 证书申请文件',
  meta: [
    { name: 'description', content: '在线生成 CSR (Certificate Signing Request) 和 RSA 私钥，用于申请 HTTPS/SSL 证书。' }
  ]
})
</script>
