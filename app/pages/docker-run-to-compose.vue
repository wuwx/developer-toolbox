<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader
      title="Docker Run 转 Compose"
      description="将 docker run 命令转换为 Docker Compose YAML 配置文件"
      align="center"
    >
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 mb-6 shadow-xl">
          <UIcon name="i-heroicons-cube" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 输入 -->
      <div class="space-y-6">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Docker Run 命令</h3>
              <UButton
                v-if="input"
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-x-mark"
                @click="input = ''"
              >
                清空
              </UButton>
            </div>
          </template>
          <UTextarea
            v-model="input"
            placeholder="docker run -d -p 80:80 --name web nginx"
            :rows="20"
            class="font-mono text-sm w-full"
            :ui="{ base: 'p-4' }"
          />
        </UCard>
      </div>

      <!-- 输出 -->
      <div class="space-y-6">
        <UCard class="h-full flex flex-col">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Docker Compose YAML</h3>
              <UButton
                color="primary"
                variant="soft"
                size="xs"
                icon="i-heroicons-clipboard-document"
                @click="copyToClipboard(output, 'YAML')"
              >
                复制
              </UButton>
            </div>
          </template>
          <UTextarea
            v-model="output"
            readonly
            :rows="20"
            class="font-mono text-sm w-full"
            :ui="{ base: 'bg-gray-50 dark:bg-gray-800/50 p-4 text-blue-600 dark:text-blue-400' }"
          />
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { copyToClipboard } = useToolClipboard()

definePageMeta({
  layout: 'default'
})

const input = ref('docker run -d --name my-web -p 8080:80 -v /html:/usr/share/nginx/html -e ENV=prod --restart always nginx:latest')

const output = computed(() => {
  if (!input.value) return ''
  
  try {
    return parseDockerRun(input.value)
  } catch (e) {
    return '# 无法解析命令，请确保格式正确'
  }
})

// 简易 Docker Run 解析器
function parseDockerRun(cmd: string) {
  // 移除换行和多余空格
  const cleanCmd = cmd.replace(/\\/g, '').replace(/\s+/g, ' ').trim()
  
  if (!cleanCmd.startsWith('docker run')) {
    return '# 命令必须以 "docker run" 开头'
  }

  const args = cleanCmd.split(' ').slice(2) // Skip 'docker', 'run'
  
  const service: any = {}
  let image = ''
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg) continue
    
    if (arg === '-d' || arg === '--detach') {
      // ignore
    } else if (arg === '--rm') {
      // ignore
    } else if (arg.startsWith('--name')) {
      // handled by service name map or just ignore for now (usually used as key)
      // We will use it as key if simple
      const next = args[++i]
      const name = arg.includes('=') ? arg.split('=')[1] : (next || '')
      if (name) service._name = name
    } else if (arg === '-p' || arg === '--publish') {
      const port = args[++i]
      if (port) {
        if (!service.ports) service.ports = []
        service.ports.push(port)
      }
    } else if (arg === '-v' || arg === '--volume') {
      const vol = args[++i]
      if (vol) {
        if (!service.volumes) service.volumes = []
        service.volumes.push(vol)
      }
    } else if (arg === '-e' || arg === '--env') {
      const env = args[++i]
      if (env) {
        if (!service.environment) service.environment = []
        service.environment.push(env)
      }
    } else if (arg === '--restart') {
      const restart = args[++i]
      if (restart) service.restart = restart
    } else if (arg === '--net' || arg === '--network') {
      const net = args[++i]
      if (net) service.network_mode = net
    } else if (!arg.startsWith('-')) {
      // Assume image is the last non-flag argument or near the end
      // Simple logic: last one is image, or last ones are cmd?
      // For now, take the first non-flag that looks like an image? 
      // Actually docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
      // Let's assume the first non-flag after options is image
      if (!image) image = arg
      else {
        if (!service.command) service.command = []
        service.command.push(arg)
      }
    }
  }

  const serviceName = service._name || 'app'
  delete service._name

  let yaml = `version: '3.3'\nservices:\n  ${serviceName}:\n`
  if (service.container_name) yaml += `    container_name: ${service.container_name}\n`
  yaml += `    image: ${image || 'unknown'}\n`
  
  if (service.restart) yaml += `    restart: ${service.restart}\n`
  
  if (service.ports && service.ports.length) {
    yaml += `    ports:\n`
    service.ports.forEach((p: string) => yaml += `      - '${p}'\n`)
  }
  
  if (service.volumes && service.volumes.length) {
    yaml += `    volumes:\n`
    service.volumes.forEach((v: string) => yaml += `      - '${v}'\n`)
  }
  
  if (service.environment && service.environment.length) {
    yaml += `    environment:\n`
    service.environment.forEach((e: string) => yaml += `      - ${e}\n`)
  }

  if (service.network_mode) yaml += `    network_mode: ${service.network_mode}\n`
  
  if (service.command && service.command.length) {
    yaml += `    command: ${service.command.join(' ')}\n`
  }

  return yaml
}

useHead({
  title: 'Docker Run 转 Compose - 容器配置转换 | 开发者工具箱',
  meta: [
    { name: 'description', content: '在线将 docker run 命令转换为 docker-compose.yml 文件。' }
  ]
})
</script>
