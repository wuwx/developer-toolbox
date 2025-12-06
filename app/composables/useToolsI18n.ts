export const useToolsI18n = () => {
  const { t } = useI18n()
  
  // 工具键名映射
  const toolKeyMap: Record<string, string> = {
    '/md5': 'md5',
    '/base64': 'base64',
    '/url': 'url',
    '/jwt': 'jwt',
    '/aes': 'aes',
    '/md4': 'md4',
    '/sha1': 'sha1',
    '/sha256': 'sha256',
    '/sha512': 'sha512',
    '/ntlm': 'ntlm',
    '/bcrypt': 'bcrypt',
    '/hash-file': 'hashFile',
    '/sm3': 'sm3',
    '/sm4': 'sm4',
    '/jwt-decoder': 'jwtDecoder',
    '/escape-unescape': 'escape',
    '/base32': 'base32',
    '/hex-encode': 'hex',
    '/rot13': 'rot13',
    '/gzip': 'gzip',
    '/text-encrypt': 'textEncrypt',
    '/css-gradient': 'cssGradient',
    '/color-converter': 'colorConverter',
    '/box-shadow': 'boxShadow',
    '/flexbox-generator': 'flexbox',
    '/color-palette': 'colorPalette',
    '/css-filter': 'cssFilter',
    '/css-shadow': 'cssShadow',
    '/text-shadow': 'textShadow',
    '/border-radius': 'borderRadius',
    '/css-clip-path': 'clipPath',
    '/css-transform': 'transform',
    '/grid-generator': 'grid',
    '/animation-generator': 'animation',
    '/easing-functions': 'easing',
    '/css-unit': 'cssUnit',
    '/gradient': 'gradient',
    '/image-to-base64': 'imageBase64',
    '/font-preview': 'fontPreview',
    '/json': 'json',
    '/regex': 'regex',
    '/markdown': 'markdown',
    '/diff': 'diff',
    '/text-stats': 'textStats',
    '/json-to-types': 'jsonToTypes',
    '/xml-formatter': 'xmlFormatter',
    '/yaml-json': 'yamlJson',
    '/csv-json': 'csvJson',
    '/list-converter': 'listConverter',
    '/case-converter': 'caseConverter',
    '/sql-formatter': 'sqlFormatter',
    '/sql-generator': 'sqlGenerator',
    '/json-path': 'jsonPath',
    '/json-diff': 'jsonDiff',
    '/markdown-table': 'markdownTable',
    '/html-minifier': 'htmlMinifier',
    '/css-minifier': 'cssMinifier',
    '/js-minifier': 'jsMinifier',
    '/svg-optimizer': 'svgOptimizer',
    '/html-entity': 'htmlEntity',
    '/slugify': 'slugify',
    '/text-deduplicate': 'textDeduplicate',
    '/word-filter': 'wordFilter',
    '/ascii-art': 'asciiArt',
    '/lorem-generator': 'loremGenerator',
    '/regex-generator': 'regexGenerator',
    '/regex-tester': 'regexTester',
    '/text-diff': 'textDiff',
    '/meta-tags': 'metaTags',
    '/pinyin': 'pinyin',
    '/traditional-simplified': 'traditionalSimplified',
    '/morse-code': 'morseCode',
    '/unit-converter': 'unitConverter',
    '/timestamp': 'timestamp',
    '/ipv4-converter': 'ipv4Converter',
    '/base-converter': 'baseConverter',
    '/number-converter': 'numberConverter',
    '/unicode': 'unicode',
    '/color': 'color',
    '/image-base64': 'imageToBase64',
    '/image-compress': 'imageCompress',
    '/json-csv': 'jsonCsv',
    '/curl-builder': 'curlBuilder',
    '/docker-run-to-compose': 'dockerCompose',
    '/chmod': 'chmod',
    '/cidr': 'cidr',
    '/http-headers': 'httpHeaders',
    '/log-parser': 'logParser',
    '/code-sandbox': 'codeSandbox',
    '/benchmark': 'benchmark',
    '/uuid': 'uuid',
    '/password-generator': 'passwordGenerator',
    '/qrcode': 'qrcode',
    '/lorem-ipsum': 'loremIpsum',
    '/data-generator': 'dataGenerator',
    '/uuid/v1': 'uuidV1',
    '/uuid/v3': 'uuidV3',
    '/uuid/v5': 'uuidV5',
    '/ulid': 'ulid',
    '/nanoid': 'nanoid',
    '/mac-generator': 'macGenerator',
    '/random-port': 'randomPort',
    '/cron': 'cron',
    '/http-status': 'httpStatus',
    '/url-parser': 'urlParser',
    '/password-strength': 'passwordStrength',
    '/qr-scanner': 'qrScanner',
    '/calculator': 'calculator',
    '/cert-decoder': 'certDecoder',
    '/csr-generator': 'csrGenerator',
    '/user-agent': 'userAgent',
    '/mime-types': 'mimeTypes',
    '/keycode': 'keycode',
    '/password-checker': 'passwordChecker',
    '/data-mask': 'dataMask',
    '/pomodoro': 'pomodoro',
    '/bmi-calculator': 'bmiCalculator',
    '/world-clock': 'worldClock',
    '/countdown': 'countdown',
    '/currency-converter': 'currencyConverter'
  }
  
  // 分类键名映射
  const categoryKeyMap: Record<string, string> = {
    '编码加密': 'encoding',
    '图形视觉': 'graphics',
    '文本代码': 'text',
    '格式转换': 'converter',
    '运维网络': 'devops',
    '数据生成': 'generator',
    '查询辅助': 'query'
  }
  
  // 分组键名映射
  const sectionKeyMap: Record<string, string> = {
    '哈希算法': 'hashAlgorithms',
    '国密算法': 'nationalCrypto',
    'JWT & Token': 'jwtToken',
    '编码转换': 'encodingConversion',
    'CSS 效果': 'cssEffects',
    '布局 & 动画': 'layoutAnimation',
    '图片 & 字体': 'imageFont',
    '格式转换': 'formatConversion',
    'SQL & 数据': 'sqlData',
    '代码压缩': 'codeMinify',
    '文本处理': 'textProcessing',
    '正则 & 工具': 'regexTools',
    '中文处理': 'chineseProcessing',
    'UUID & ID': 'uuidId',
    '其他生成器': 'otherGenerators',
    'Web & 网络': 'webNetwork',
    '安全 & 数据': 'securityData',
    '生活工具': 'lifeTools'
  }
  
  // 获取工具的翻译
  const getToolLabel = (to: string) => {
    const key = toolKeyMap[to]
    return key ? t(`tools.${key}.label`) : ''
  }
  
  const getToolDesc = (to: string) => {
    const key = toolKeyMap[to]
    return key ? t(`tools.${key}.desc`) : ''
  }
  
  // 获取分类的翻译
  const getCategoryLabel = (label: string) => {
    const key = categoryKeyMap[label]
    return key ? t(`categories.${key}`) : label
  }
  
  // 获取分组的翻译
  const getSectionLabel = (label: string) => {
    const key = sectionKeyMap[label]
    return key ? t(`sections.${key}`) : label
  }
  
  return {
    getToolLabel,
    getToolDesc,
    getCategoryLabel,
    getSectionLabel
  }
}
