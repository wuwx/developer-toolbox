export const tools = [
  {
    label: '编码加密',
    icon: 'i-heroicons-lock-closed',
    items: [
      { 
        label: 'MD5 哈希', 
        to: '/md5', 
        icon: 'i-heroicons-hashtag', 
        desc: '生成 MD5 散列值' 
      },
      { 
        label: 'SHA1 哈希', 
        to: '/sha1', 
        icon: 'i-heroicons-shield-check', 
        desc: '生成 SHA1 散列值' 
      },
      { 
        label: 'SHA256 哈希', 
        to: '/sha256', 
        icon: 'i-heroicons-lock-closed', 
        desc: 'SHA256/SHA512 哈希' 
      },
      { 
        label: 'AES 加密', 
        to: '/aes', 
        icon: 'i-heroicons-key', 
        desc: 'AES-GCM 对称加密' 
      },
      { 
        label: 'Base64 编码', 
        to: '/base64', 
        icon: 'i-heroicons-arrows-right-left', 
        desc: 'Base64 文本互转' 
      },
      { 
        label: 'URL 编码', 
        to: '/url', 
        icon: 'i-heroicons-link', 
        desc: 'URL 参数编码解码' 
      },
      { 
        label: 'JWT 解码', 
        to: '/jwt', 
        icon: 'i-heroicons-identification', 
        desc: '解析 JWT Token' 
      }
    ]
  },
  {
    label: '图形视觉',
    icon: 'i-heroicons-paint-brush',
    items: [
      { 
        label: 'CSS 渐变', 
        to: '/css-gradient', 
        icon: 'i-heroicons-swatch', 
        desc: '渐变背景生成器' 
      },
      { 
        label: 'CSS 滤镜', 
        to: '/css-filter', 
        icon: 'i-heroicons-adjustments-horizontal', 
        desc: '图片滤镜调节' 
      },
      { 
        label: 'CSS 阴影', 
        to: '/css-shadow', 
        icon: 'i-heroicons-square-3-stack-3d', 
        desc: 'Box Shadow 生成' 
      },
      { 
        label: '圆角生成', 
        to: '/border-radius', 
        icon: 'i-heroicons-stop', 
        desc: 'Border Radius 调整' 
      }
    ]
  },
  {
    label: '文本代码',
    icon: 'i-heroicons-code-bracket',
    items: [
      { 
        label: 'JSON 格式化', 
        to: '/json', 
        icon: 'i-heroicons-document-text', 
        desc: 'JSON 美化与校验' 
      },
      { 
        label: 'JSON 转 TS', 
        to: '/json-to-types', 
        icon: 'i-heroicons-command-line', 
        desc: '生成 TypeScript 接口' 
      },
      { 
        label: 'SQL 格式化', 
        to: '/sql-formatter', 
        icon: 'i-heroicons-table-cells', 
        desc: 'SQL 语句美化' 
      },
      { 
        label: 'YAML 转 JSON', 
        to: '/yaml-json', 
        icon: 'i-heroicons-arrows-right-left', 
        desc: '配置文件互转' 
      },
      { 
        label: 'CSV 转 JSON', 
        to: '/csv-json', 
        icon: 'i-heroicons-table-cells', 
        desc: '表格数据转换' 
      },
      { 
        label: '正则测试', 
        to: '/regex', 
        icon: 'i-heroicons-command-line', 
        desc: '正则实时测试' 
      },
      { 
        label: '文本对比', 
        to: '/diff', 
        icon: 'i-heroicons-document-duplicate', 
        desc: 'Diff 差异检测' 
      },
      { 
        label: 'Markdown', 
        to: '/markdown', 
        icon: 'i-heroicons-pencil-square', 
        desc: 'Markdown 预览' 
      },
      { 
        label: '文本统计', 
        to: '/text-stats', 
        icon: 'i-heroicons-chart-bar', 
        desc: '字数词频分析' 
      },
      { 
        label: '文本去重', 
        to: '/text-deduplicate', 
        icon: 'i-heroicons-funnel', 
        desc: '列表去重排序' 
      },
      { 
        label: '大小写转换', 
        to: '/case-converter', 
        icon: 'i-heroicons-arrows-up-down', 
        desc: 'Camel/Snake 互转' 
      }
    ]
  },
  {
    label: '格式转换',
    icon: 'i-heroicons-arrow-path-rounded-square',
    items: [
      { 
        label: '时间戳转换', 
        to: '/timestamp', 
        icon: 'i-heroicons-clock', 
        desc: 'Unix 时间戳互转' 
      },
      { 
        label: '进制转换', 
        to: '/base-converter', 
        icon: 'i-heroicons-calculator', 
        desc: '2/8/10/16 进制' 
      },
      { 
        label: '数字转金额', 
        to: '/number-converter', 
        icon: 'i-heroicons-banknotes', 
        desc: '大写金额转换' 
      },
      { 
        label: 'Unicode 转换', 
        to: '/unicode', 
        icon: 'i-heroicons-globe-alt', 
        desc: '字符编码互转' 
      },
      { 
        label: '颜色转换', 
        to: '/color', 
        icon: 'i-heroicons-swatch', 
        desc: 'HEX/RGB/HSL' 
      },
      { 
        label: '图片 Base64', 
        to: '/image-base64', 
        icon: 'i-heroicons-photo', 
        desc: '图片转 Base64' 
      },
      { 
        label: '图片压缩', 
        to: '/image-compress', 
        icon: 'i-heroicons-photo', 
        desc: 'JPG/PNG 压缩' 
      }
    ]
  },
  {
    label: '数据生成',
    icon: 'i-heroicons-cpu-chip',
    items: [
      { 
        label: 'UUID 生成', 
        to: '/uuid', 
        icon: 'i-heroicons-finger-print', 
        desc: '批量生成 UUID' 
      },
      { 
        label: '随机密码', 
        to: '/password-generator', 
        icon: 'i-heroicons-key', 
        desc: '安全强密码生成' 
      },
      { 
        label: 'Lorem Ipsum', 
        to: '/lorem-ipsum', 
        icon: 'i-heroicons-document-text', 
        desc: '占位文本生成' 
      },
      { 
        label: 'Cron 表达式', 
        to: '/cron', 
        icon: 'i-heroicons-clock', 
        desc: '定时任务配置' 
      },
      { 
        label: '二维码生成', 
        to: '/qrcode', 
        icon: 'i-heroicons-qr-code', 
        desc: '自定义二维码' 
      }
    ]
  },
  {
    label: '查询辅助',
    icon: 'i-heroicons-magnifying-glass',
    items: [
      { 
        label: 'URL 解析', 
        to: '/url-parser', 
        icon: 'i-heroicons-link', 
        desc: 'URL 参数解析编辑' 
      },
      { 
        label: 'User-Agent', 
        to: '/user-agent', 
        icon: 'i-heroicons-device-phone-mobile', 
        desc: '浏览器 UA 解析' 
      },
      { 
        label: 'HTTP 状态码', 
        to: '/http-status', 
        icon: 'i-heroicons-server', 
        desc: '状态码速查' 
      },
      { 
        label: '键盘键位', 
        to: '/keycode', 
        icon: 'i-heroicons-computer-desktop', 
        desc: 'KeyCode 查询' 
      },
      { 
        label: '密码强度', 
        to: '/password-strength', 
        icon: 'i-heroicons-shield-check', 
        desc: '密码安全性检测' 
      },
      { 
        label: '番茄钟', 
        to: '/pomodoro', 
        icon: 'i-heroicons-clock', 
        desc: '专注计时器' 
      }
    ]
  }
]

// 扁平化的工具列表，用于搜索
export const flatTools = tools.flatMap(group => 
  group.items.map(item => ({
    ...item,
    category: group.label,
    suffix: group.label // 用于 CommandPalette 显示
  }))
)
