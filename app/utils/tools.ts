export const tools = [
  {
    label: '编码加密',
    icon: 'i-heroicons-lock-closed',
    leafItems: [
      { 
        label: 'MD5 哈希', 
        to: '/md5', 
        icon: 'i-heroicons-hashtag', 
        desc: '生成 MD5 散列值' 
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
      },
      { 
        label: 'AES 加密', 
        to: '/aes', 
        icon: 'i-heroicons-key', 
        desc: 'AES-GCM 对称加密' 
      }
    ],
    sections: [
      {
        label: '哈希算法',
        items: [
          { 
            label: 'MD4 哈希', 
            to: '/md4', 
            icon: 'i-heroicons-hashtag', 
            desc: '生成 MD4 散列值' 
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
            desc: 'SHA256 哈希生成' 
          },
          { 
            label: 'SHA512 哈希', 
            to: '/sha512', 
            icon: 'i-heroicons-shield-check', 
            desc: 'SHA512 哈希生成' 
          },
          { 
            label: 'NTLM 哈希', 
            to: '/ntlm', 
            icon: 'i-heroicons-window', 
            desc: 'Windows 密码哈希' 
          },
          { 
            label: 'Bcrypt', 
            to: '/bcrypt', 
            icon: 'i-heroicons-lock-closed', 
            desc: 'Bcrypt 密码哈希' 
          },
          { 
            label: '文件哈希', 
            to: '/hash-file', 
            icon: 'i-heroicons-finger-print', 
            desc: 'MD5/SHA 文件校验' 
          }
        ]
      },
      {
        label: '国密算法',
        items: [
          { 
            label: 'SM3 国密哈希', 
            to: '/sm3', 
            icon: 'i-heroicons-shield-check', 
            desc: '国密标准哈希算法' 
          },
          { 
            label: 'SM4 国密加密', 
            to: '/sm4', 
            icon: 'i-heroicons-lock-closed', 
            desc: '国密对称加密算法' 
          }
        ]
      },
      {
        label: 'JWT & Token',
        items: [
          { 
            label: 'JWT Decoder', 
            to: '/jwt-decoder', 
            icon: 'i-heroicons-key', 
            desc: 'JWT 详细解析' 
          }
        ]
      },
      {
        label: '编码转换',
        items: [
          { 
            label: 'Escape', 
            to: '/escape-unescape', 
            icon: 'i-heroicons-code-bracket', 
            desc: '字符串转义' 
          },
          { 
            label: 'Base32', 
            to: '/base32', 
            icon: 'i-heroicons-code-bracket', 
            desc: 'Base32 编解码' 
          },
          { 
            label: 'Hex 编码', 
            to: '/hex-encode', 
            icon: 'i-heroicons-hashtag', 
            desc: '十六进制编解码' 
          },
          { 
            label: 'ROT13', 
            to: '/rot13', 
            icon: 'i-heroicons-arrow-path', 
            desc: 'ROT13 加密' 
          },
          { 
            label: 'Gzip', 
            to: '/gzip', 
            icon: 'i-heroicons-archive-box', 
            desc: 'Gzip 压缩' 
          },
          { 
            label: '文本加密', 
            to: '/text-encrypt', 
            icon: 'i-heroicons-lock-closed', 
            desc: '简单文本加密' 
          }
        ]
      }
    ]
  },
  {
    label: '图形视觉',
    icon: 'i-heroicons-paint-brush',
    leafItems: [
      { 
        label: 'CSS 渐变', 
        to: '/css-gradient', 
        icon: 'i-heroicons-swatch', 
        desc: '渐变背景生成器' 
      },
      { 
        label: '颜色转换器', 
        to: '/color-converter', 
        icon: 'i-heroicons-paint-brush', 
        desc: 'HEX/RGB/HSL 互转' 
      },
      { 
        label: 'Box Shadow', 
        to: '/box-shadow', 
        icon: 'i-heroicons-square-3-stack-3d', 
        desc: '盒子阴影生成' 
      },
      { 
        label: 'Flexbox 生成器', 
        to: '/flexbox-generator', 
        icon: 'i-heroicons-squares-2x2', 
        desc: 'Flexbox 布局' 
      },
      { 
        label: '调色板', 
        to: '/color-palette', 
        icon: 'i-heroicons-swatch', 
        desc: '配色方案' 
      }
    ],
    sections: [
      {
        label: 'CSS 效果',
        items: [
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
            label: 'Text Shadow', 
            to: '/text-shadow', 
            icon: 'i-heroicons-language', 
            desc: '文字阴影生成' 
          },
          { 
            label: '圆角生成', 
            to: '/border-radius', 
            icon: 'i-heroicons-stop', 
            desc: 'Border Radius 调整' 
          },
          { 
            label: 'Clip Path', 
            to: '/css-clip-path', 
            icon: 'i-heroicons-scissors', 
            desc: 'CSS 裁剪' 
          },
          { 
            label: 'Transform', 
            to: '/css-transform', 
            icon: 'i-heroicons-arrows-pointing-out', 
            desc: 'CSS 变换' 
          }
        ]
      },
      {
        label: '布局 & 动画',
        items: [
          { 
            label: 'Grid 生成器', 
            to: '/grid-generator', 
            icon: 'i-heroicons-squares-plus', 
            desc: 'CSS Grid 布局' 
          },
          { 
            label: '动画生成器', 
            to: '/animation-generator', 
            icon: 'i-heroicons-play', 
            desc: 'CSS 动画' 
          },
          { 
            label: '缓动函数', 
            to: '/easing-functions', 
            icon: 'i-heroicons-chart-bar', 
            desc: 'Easing 可视化' 
          },
          { 
            label: 'CSS 单位转换', 
            to: '/css-unit', 
            icon: 'i-heroicons-arrows-right-left', 
            desc: 'PX 转 REM/EM' 
          }
        ]
      },
      {
        label: '图片 & 字体',
        items: [
          { 
            label: 'Gradient', 
            to: '/gradient', 
            icon: 'i-heroicons-swatch', 
            desc: '渐变背景生成' 
          },
          { 
            label: 'Image to Base64', 
            to: '/image-to-base64', 
            icon: 'i-heroicons-photo', 
            desc: '图片转编码' 
          },
          { 
            label: '字体预览', 
            to: '/font-preview', 
            icon: 'i-heroicons-language', 
            desc: 'Web 字体' 
          }
        ]
      }
    ]
  },
  {
    label: '文本代码',
    icon: 'i-heroicons-code-bracket',
    leafItems: [
      { 
        label: 'JSON 格式化', 
        to: '/json', 
        icon: 'i-heroicons-document-text', 
        desc: 'JSON 美化与校验' 
      },
      { 
        label: '正则测试', 
        to: '/regex', 
        icon: 'i-heroicons-command-line', 
        desc: '正则实时测试' 
      },
      { 
        label: 'Markdown', 
        to: '/markdown', 
        icon: 'i-heroicons-pencil-square', 
        desc: 'Markdown 预览' 
      },
      { 
        label: '文本对比', 
        to: '/diff', 
        icon: 'i-heroicons-document-duplicate', 
        desc: 'Diff 差异检测' 
      },
      { 
        label: '文本统计', 
        to: '/text-stats', 
        icon: 'i-heroicons-chart-bar', 
        desc: '字数词频分析' 
      }
    ],
    sections: [
      {
        label: '格式转换',
        items: [
          { 
            label: 'JSON 转 TS', 
            to: '/json-to-types', 
            icon: 'i-heroicons-command-line', 
            desc: '生成 TypeScript 接口' 
          },
          { 
            label: 'XML 格式化', 
            to: '/xml-formatter', 
            icon: 'i-heroicons-code-bracket', 
            desc: 'XML 美化与压缩' 
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
            label: '列表转换器', 
            to: '/list-converter', 
            icon: 'i-heroicons-list-bullet', 
            desc: '文本列表格式转换' 
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
        label: 'SQL & 数据',
        items: [
          { 
            label: 'SQL 格式化', 
            to: '/sql-formatter', 
            icon: 'i-heroicons-table-cells', 
            desc: 'SQL 语句美化' 
          },
          { 
            label: 'SQL 生成器', 
            to: '/sql-generator', 
            icon: 'i-heroicons-table-cells', 
            desc: 'SQL 语句生成' 
          },
          { 
            label: 'JSON 路径提取', 
            to: '/json-path', 
            icon: 'i-heroicons-magnifying-glass-circle', 
            desc: 'JSONPath 数据提取' 
          },
          { 
            label: 'JSON 对比', 
            to: '/json-diff', 
            icon: 'i-heroicons-arrows-right-left', 
            desc: 'JSON 差异对比' 
          },
          { 
            label: 'Markdown 表格', 
            to: '/markdown-table', 
            icon: 'i-heroicons-table-cells', 
            desc: 'Markdown 表格生成' 
          }
        ]
      },
      {
        label: '代码压缩',
        items: [
          { 
            label: 'HTML 压缩', 
            to: '/html-minifier', 
            icon: 'i-heroicons-code-bracket', 
            desc: 'HTML 代码压缩' 
          },
          { 
            label: 'CSS 压缩', 
            to: '/css-minifier', 
            icon: 'i-heroicons-paint-brush', 
            desc: 'CSS 代码压缩' 
          },
          { 
            label: 'JS 压缩', 
            to: '/js-minifier', 
            icon: 'i-heroicons-code-bracket-square', 
            desc: 'JavaScript 压缩' 
          },
          { 
            label: 'SVG 优化', 
            to: '/svg-optimizer', 
            icon: 'i-heroicons-photo', 
            desc: 'SVG 代码优化' 
          }
        ]
      },
      {
        label: '文本处理',
        items: [
          { 
            label: 'HTML 实体编码', 
            to: '/html-entity', 
            icon: 'i-heroicons-code-bracket', 
            desc: 'HTML 特殊字符转换' 
          },
          { 
            label: 'Slugify 转换', 
            to: '/slugify', 
            icon: 'i-heroicons-link', 
            desc: '文本转 URL Slug' 
          },
          { 
            label: '文本去重', 
            to: '/text-deduplicate', 
            icon: 'i-heroicons-funnel', 
            desc: '列表去重排序' 
          },
          { 
            label: '敏感词过滤', 
            to: '/word-filter', 
            icon: 'i-heroicons-shield-exclamation', 
            desc: '敏感词检测' 
          },
          { 
            label: 'ASCII Art', 
            to: '/ascii-art', 
            icon: 'i-heroicons-sparkles', 
            desc: 'ASCII 艺术字' 
          },
          { 
            label: 'Lorem+', 
            to: '/lorem-generator', 
            icon: 'i-heroicons-document-text', 
            desc: '占位文本增强' 
          }
        ]
      },
      {
        label: '正则 & 工具',
        items: [
          { 
            label: '正则速查', 
            to: '/regex-generator', 
            icon: 'i-heroicons-command-line', 
            desc: '常用正则表达式' 
          },
          { 
            label: 'Regex Tester', 
            to: '/regex-tester', 
            icon: 'i-heroicons-magnifying-glass', 
            desc: '正则表达式测试' 
          },
          { 
            label: 'Text Diff', 
            to: '/text-diff', 
            icon: 'i-heroicons-arrows-right-left', 
            desc: '文本差异对比' 
          },
          { 
            label: 'Meta 标签', 
            to: '/meta-tags', 
            icon: 'i-heroicons-tag', 
            desc: 'SEO Meta 生成' 
          }
        ]
      },
      {
        label: '中文处理',
        items: [
          { 
            label: '拼音转换', 
            to: '/pinyin', 
            icon: 'i-heroicons-language', 
            desc: '汉字转拼音' 
          },
          { 
            label: '繁简转换', 
            to: '/traditional-simplified', 
            icon: 'i-heroicons-language', 
            desc: '繁简体互转' 
          },
          { 
            label: '摩斯电码', 
            to: '/morse-code', 
            icon: 'i-heroicons-signal', 
            desc: '摩斯电码转换' 
          }
        ]
      }
    ]
  },
  {
    label: '格式转换',
    icon: 'i-heroicons-arrow-path-rounded-square',
    items: [
      { 
        label: '单位换算', 
        to: '/unit-converter', 
        icon: 'i-heroicons-scale', 
        desc: '数据/长度/重量换算' 
      },
      { 
        label: '时间戳转换', 
        to: '/timestamp', 
        icon: 'i-heroicons-clock', 
        desc: 'Unix 时间戳互转' 
      },
      { 
        label: 'IPv4 转换', 
        to: '/ipv4-converter', 
        icon: 'i-heroicons-globe-alt', 
        desc: 'IP 进制转换' 
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
      },
      { 
        label: 'JSON ↔ CSV', 
        to: '/json-csv', 
        icon: 'i-heroicons-table-cells', 
        desc: 'JSON CSV 互转' 
      }
    ]
  },
  {
    label: '运维网络',
    icon: 'i-heroicons-server-stack',
    items: [
      { 
        label: 'Curl 构建器', 
        to: '/curl-builder', 
        icon: 'i-heroicons-command-line', 
        desc: '生成 Curl 命令' 
      },
      { 
        label: 'Docker 转 Compose', 
        to: '/docker-run-to-compose', 
        icon: 'i-heroicons-cube', 
        desc: '容器配置转换' 
      },
      { 
        label: 'Chmod 计算器', 
        to: '/chmod', 
        icon: 'i-heroicons-command-line', 
        desc: 'Linux 权限计算' 
      },
      { 
        label: 'CIDR 计算器', 
        to: '/cidr', 
        icon: 'i-heroicons-server-stack', 
        desc: 'IP 子网掩码计算' 
      },
      { 
        label: 'HTTP Headers', 
        to: '/http-headers', 
        icon: 'i-heroicons-document-text', 
        desc: 'HTTP 头部分析' 
      },
      { 
        label: '日志解析', 
        to: '/log-parser', 
        icon: 'i-heroicons-document-magnifying-glass', 
        desc: '日志文件解析' 
      },
      { 
        label: '代码沙箱', 
        to: '/code-sandbox', 
        icon: 'i-heroicons-code-bracket-square', 
        desc: 'JS 代码运行' 
      },
      { 
        label: '性能测试', 
        to: '/benchmark', 
        icon: 'i-heroicons-bolt', 
        desc: 'JS 性能测试' 
      }
    ]
  },
  {
    label: '数据生成',
    icon: 'i-heroicons-cpu-chip',
    leafItems: [
      { 
        label: 'UUID v4 (随机)', 
        to: '/uuid', 
        icon: 'i-heroicons-finger-print', 
        desc: '随机生成 UUID v4' 
      },
      { 
        label: '随机密码', 
        to: '/password-generator', 
        icon: 'i-heroicons-key', 
        desc: '安全强密码生成' 
      },
      { 
        label: '二维码生成', 
        to: '/qrcode', 
        icon: 'i-heroicons-qr-code', 
        desc: '自定义二维码' 
      },
      { 
        label: 'Lorem Ipsum', 
        to: '/lorem-ipsum', 
        icon: 'i-heroicons-document-text', 
        desc: '占位文本生成' 
      },
      { 
        label: '数据生成器', 
        to: '/data-generator', 
        icon: 'i-heroicons-table-cells', 
        desc: '测试数据生成' 
      }
    ],
    sections: [
      {
        label: 'UUID & ID',
        items: [
          { 
            label: 'UUID v1 (时间)', 
            to: '/uuid/v1', 
            icon: 'i-heroicons-clock', 
            desc: '基于时间戳的 UUID v1' 
          },
          { 
            label: 'UUID v3 (MD5)', 
            to: '/uuid/v3', 
            icon: 'i-heroicons-hashtag', 
            desc: '基于名称的 UUID v3' 
          },
          { 
            label: 'UUID v5 (SHA1)', 
            to: '/uuid/v5', 
            icon: 'i-heroicons-hashtag', 
            desc: '基于名称的 UUID v5' 
          },
          { 
            label: 'ULID 生成', 
            to: '/ulid', 
            icon: 'i-heroicons-bars-arrow-down', 
            desc: '可排序唯一 ID' 
          },
          { 
            label: 'Nano ID', 
            to: '/nanoid', 
            icon: 'i-heroicons-finger-print', 
            desc: '短小安全的 ID' 
          }
        ]
      },
      {
        label: '其他生成器',
        items: [
          { 
            label: 'MAC 地址生成', 
            to: '/mac-generator', 
            icon: 'i-heroicons-cpu-chip', 
            desc: '随机 MAC 地址' 
          },
          { 
            label: '随机端口', 
            to: '/random-port', 
            icon: 'i-heroicons-arrows-right-left', 
            desc: '生成可用端口号' 
          },
          { 
            label: 'Cron 表达式', 
            to: '/cron', 
            icon: 'i-heroicons-clock', 
            desc: '定时任务配置' 
          }
        ]
      }
    ]
  },
  {
    label: '查询辅助',
    icon: 'i-heroicons-magnifying-glass',
    leafItems: [
      { 
        label: 'HTTP 状态码', 
        to: '/http-status', 
        icon: 'i-heroicons-server', 
        desc: '状态码速查' 
      },
      { 
        label: 'URL 解析', 
        to: '/url-parser', 
        icon: 'i-heroicons-link', 
        desc: 'URL 参数解析编辑' 
      },
      { 
        label: '密码强度', 
        to: '/password-strength', 
        icon: 'i-heroicons-shield-check', 
        desc: '密码安全性检测' 
      },
      { 
        label: '二维码识别', 
        to: '/qr-scanner', 
        icon: 'i-heroicons-qr-code', 
        desc: '识别二维码' 
      },
      { 
        label: '科学计算器', 
        to: '/calculator', 
        icon: 'i-heroicons-calculator', 
        desc: '在线计算器' 
      }
    ],
    sections: [
      {
        label: 'Web & 网络',
        items: [
          { 
            label: 'SSL 证书解码', 
            to: '/cert-decoder', 
            icon: 'i-heroicons-identification', 
            desc: '解析 PEM 证书详情' 
          },
          { 
            label: 'CSR 生成器', 
            to: '/csr-generator', 
            icon: 'i-heroicons-key', 
            desc: '生成 SSL 证书申请' 
          },
          { 
            label: 'User-Agent', 
            to: '/user-agent', 
            icon: 'i-heroicons-device-phone-mobile', 
            desc: '浏览器 UA 解析' 
          },
          { 
            label: 'MIME Types', 
            to: '/mime-types', 
            icon: 'i-heroicons-document', 
            desc: '文件类型查询' 
          },
          { 
            label: '键盘键位', 
            to: '/keycode', 
            icon: 'i-heroicons-computer-desktop', 
            desc: 'KeyCode 查询' 
          }
        ]
      },
      {
        label: '安全 & 数据',
        items: [
          { 
            label: '密码检测', 
            to: '/password-checker', 
            icon: 'i-heroicons-shield-check', 
            desc: '密码安全检测' 
          },
          { 
            label: '数据脱敏', 
            to: '/data-mask', 
            icon: 'i-heroicons-eye-slash', 
            desc: '敏感数据脱敏' 
          }
        ]
      },
      {
        label: '生活工具',
        items: [
          { 
            label: '番茄钟', 
            to: '/pomodoro', 
            icon: 'i-heroicons-clock', 
            desc: '专注计时器' 
          },
          { 
            label: 'BMI 计算器', 
            to: '/bmi-calculator', 
            icon: 'i-heroicons-heart', 
            desc: 'BMI 指数计算' 
          },
          { 
            label: '世界时钟', 
            to: '/world-clock', 
            icon: 'i-heroicons-globe-alt', 
            desc: '全球时间查询' 
          },
          { 
            label: '倒计时', 
            to: '/countdown', 
            icon: 'i-heroicons-clock', 
            desc: '事件倒计时' 
          },
          { 
            label: '汇率换算', 
            to: '/currency-converter', 
            icon: 'i-heroicons-currency-dollar', 
            desc: '货币汇率转换' 
          }
        ]
      }
    ]
  }
]

// 扁平化的工具列表，用于搜索
export const flatTools = tools.flatMap(group => {
  const allItems = []
  
  // 处理普通的 items 数组
  if (group.items) {
    allItems.push(...group.items)
  }
  
  // 处理新结构的 leafItems（直接二级）
  if (group.leafItems) {
    allItems.push(...group.leafItems)
  }
  
  // 处理新结构的 sections（第三级）
  if (group.sections) {
    group.sections.forEach(section => {
      allItems.push(...section.items)
    })
  }
  
  return allItems.map(item => ({
    ...item,
    category: group.label,
    suffix: group.label // 用于 CommandPalette 显示
  }))
})
