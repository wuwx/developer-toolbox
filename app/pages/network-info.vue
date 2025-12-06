<template>
  <UContainer class="py-8 sm:py-12">
    <UPageHeader title="网络信息查看" description="查看浏览器网络信息" align="center">
      <template #icon>
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl">
          <UIcon name="i-heroicons-globe-alt" class="w-10 h-10 text-white" />
        </div>
      </template>
    </UPageHeader>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard>
        <template #header><h3 class="font-semibold">连接信息</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">连接类型</div>
            <div class="font-semibold">{{connectionType}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">有效类型</div>
            <div class="font-semibold">{{effectiveType}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">下行速度</div>
            <div class="font-semibold">{{downlink}} Mbps</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">浏览器信息</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">在线状态</div>
            <div class="font-semibold">{{online?'在线':'离线'}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">语言</div>
            <div class="font-semibold">{{language}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">平台</div>
            <div class="font-semibold">{{platform}}</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">屏幕信息</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">分辨率</div>
            <div class="font-semibold">{{screenWidth}} × {{screenHeight}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">可用区域</div>
            <div class="font-semibold">{{availWidth}} × {{availHeight}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">色深</div>
            <div class="font-semibold">{{colorDepth}} bit</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">时区信息</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">时区</div>
            <div class="font-semibold">{{timezone}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">时区偏移</div>
            <div class="font-semibold">UTC{{timezoneOffset}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">当前时间</div>
            <div class="font-semibold">{{currentTime}}</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">硬件信息</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">CPU 核心数</div>
            <div class="font-semibold">{{cpuCores}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">内存</div>
            <div class="font-semibold">{{memory}} GB</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">触摸支持</div>
            <div class="font-semibold">{{touchSupport?'是':'否'}}</div>
          </div>
        </div>
      </UCard>
      <UCard>
        <template #header><h3 class="font-semibold">存储信息</h3></template>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-500">Cookies 启用</div>
            <div class="font-semibold">{{cookieEnabled?'是':'否'}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">LocalStorage</div>
            <div class="font-semibold">{{localStorageAvailable?'可用':'不可用'}}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">SessionStorage</div>
            <div class="font-semibold">{{sessionStorageAvailable?'可用':'不可用'}}</div>
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const connectionType=ref('unknown')
const effectiveType=ref('unknown')
const downlink=ref(0)
const online=ref(navigator.onLine)
const language=ref(navigator.language)
const platform=ref(navigator.platform)
const screenWidth=ref(screen.width)
const screenHeight=ref(screen.height)
const availWidth=ref(screen.availWidth)
const availHeight=ref(screen.availHeight)
const colorDepth=ref(screen.colorDepth)
const timezone=ref(Intl.DateTimeFormat().resolvedOptions().timeZone)
const timezoneOffset=ref('')
const currentTime=ref('')
const cpuCores=ref(navigator.hardwareConcurrency||0)
const memory=ref(0)
const touchSupport=ref('ontouchstart' in window)
const cookieEnabled=ref(navigator.cookieEnabled)
const localStorageAvailable=ref(false)
const sessionStorageAvailable=ref(false)

onMounted(()=>{
  const conn=(navigator as any).connection||(navigator as any).mozConnection||(navigator as any).webkitConnection
  if(conn){
    connectionType.value=conn.type||'unknown'
    effectiveType.value=conn.effectiveType||'unknown'
    downlink.value=conn.downlink||0
  }
  
  const offset=new Date().getTimezoneOffset()
  const hours=Math.abs(Math.floor(offset/60))
  const minutes=Math.abs(offset%60)
  timezoneOffset.value=`${offset<=0?'+':'-'}${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`
  
  const nav=navigator as any
  if(nav.deviceMemory){
    memory.value=nav.deviceMemory
  }
  
  try{
    localStorage.setItem('test','test')
    localStorage.removeItem('test')
    localStorageAvailable.value=true
  }catch{}
  
  try{
    sessionStorage.setItem('test','test')
    sessionStorage.removeItem('test')
    sessionStorageAvailable.value=true
  }catch{}
  
  setInterval(()=>{
    currentTime.value=new Date().toLocaleString('zh-CN')
  },1000)
})

useHead({title:'网络信息查看 | 开发者工具箱'})
</script>
