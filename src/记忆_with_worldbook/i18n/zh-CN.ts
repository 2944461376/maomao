export default {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    refresh: '刷新',
    search: '搜索',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    clear: '清空',
    export: '导出',
    import: '导入',
    copy: '复制',
    paste: '粘贴',
    generate: '生成',
    preview: '预览',
  },

  // 主面板
  panel: {
    title: 'mzrodyu猫猫的小破烂',
    minimize: '最小化',
  },

  // 标签页
  tabs: {
    settings: '设置',
    history: '历史总转',
    table: '表格',
    greetings: '开场白',
    regex: '界面生成器',
    state: '状态栏生成',
    projects: '前端项目',
    tools: '工具模板',
    mvu: 'MVU Beta',
    help: '帮助',
  },

  // 设置页
  settings: {
    title: 'API 配置',
    provider: 'API 提供商',
    endpoint: 'API 端点',
    endpointPlaceholder: 'https://你的服务器/v1',
    endpointHelp: '常见格式示例',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'sk-...',
    model: '模型名称',
    modelPlaceholder: '不输入会使用名称（如 gpt-4o-mini）',
    fetchModels: '拉取模型列表',
    saveConfig: '保存配置',
    maxTokens: '最大 Token 数',
    maxTokensHelp: '建议4000以上获得更详细的总结',
    temperature: 'Temperature (温度)',
    temperatureHelp: '推荐 0.7',
    hiddenFloors: '隐藏楼层管理',
    hiddenFloorsDesc: '在总结时隐藏指定楼层的消息（例如状态栏、战斗信息等）',
    addFloor: '添加隐藏楼层',
    floorIndex: '楼层索引',
    floorIndexPlaceholder: '例如：0, 1, 2',
    removeFloor: '移除',
    columnTemplates: '列头模板管理',
    columnTemplatesDesc: '用于表格功能的列头模板',
    templateName: '模板名称',
    templateNamePlaceholder: '例如：角色卡模板',
    templateContent: '模板内容',
    templateContentPlaceholder: '例如：姓名|年龄|性别',
    addTemplate: '添加模板',
    deleteTemplate: '删除模板',
    autoSummary: '自动总结配置',
    enableAutoSummary: '启用自动总结',
    summaryInterval: '总结间隔（楼层数）',
    summaryIntervalPlaceholder: '例如：20',
    summaryIntervalHelp: '每隔多少楼层自动生成一次总结',
    currentStatus: '当前总结状态',
    chatId: '聊天ID',
    lastSummaryFloor: '上次总结楼层',
    nextSummaryFloor: '下次总结楼层',
    resetStatus: '重置总结状态',
    manualSummary: '手动触发总结',
    configSaved: '配置已保存',
    apiConfigSaved: 'API 配置已保存',
    fetchError: '拉取模型列表失败',
  },

  // 开场白页
  greetings: {
    title: '开场白管理',
    character: '当前角色卡',
    noCharacter: '未找到角色卡',
    clearConfig: '清空配置',
    clearConfigConfirm: '确定要清空所有开场白的配置吗？',
    clearSuccess: '配置已清空',
    help: '使用帮助',
    helpContent: `
      <h3>功能说明</h3>
      <p>为角色卡的多个开场白设置图标、标题、描述，并生成可视化选择界面。</p>
      <h3>使用步骤</h3>
      <ol>
        <li>在酒馆中打开一个角色卡</li>
        <li>为每个开场白配置图标（emoji或URL）、标题和描述</li>
        <li>点击"AI生成界面样式"按钮，输入你想要的风格描述</li>
        <li>预览生成的界面，满意后复制代码到酒馆的正则表达式中</li>
      </ol>
    `,
    greetingBadge: '开场白',
    default: '默认',
    icon: '图标',
    iconPlaceholder: 'emoji 或图片URL',
    title: '标题',
    titlePlaceholder: '开场白标题',
    description: '描述',
    descriptionPlaceholder: '开场白描述',
    generateWithAI: 'AI生成',
    generating: '生成中...',
    stylePrompt: '界面风格生成',
    stylePromptPlaceholder: '描述你想要的界面风格，例如：赛博朋克风格，霓虹灯效果，暗色调',
    generateStyle: 'AI生成界面样式',
    generatingStyle: '生成中...',
    copyCode: '复制代码',
    copySuccess: '代码已复制到剪贴板',
    apiFailed: 'API调用失败',
    styleGenerated: '界面样式生成成功',
    descGenerated: '描述生成成功',
    htmlCode: '生成的HTML代码',
    regexConfig: '正则配置（JSON）',
  },

  // 正则生成器页
  regex: {
    title: 'UI 生成器',
    help: '使用帮助',
    helpContent: `
      <h3>功能说明</h3>
      <p>使用 AI 根据你的描述生成可视化的 UI 界面，并自动转换为酒馆正则表达式格式。</p>
      <h3>使用步骤</h3>
      <ol>
        <li>在"触发文本"中输入触发关键词（例如：#状态栏）</li>
        <li>在"UI描述"中详细描述你想要的界面效果</li>
        <li>点击"生成UI"，AI会生成对应的HTML界面</li>
        <li>在右侧预览效果，满意后复制代码到酒馆正则中</li>
      </ol>
    `,
    triggerText: '触发文本',
    triggerTextPlaceholder: '例如：#状态栏',
    uiDescription: 'UI 描述',
    uiDescriptionPlaceholder:
      '详细描述你想要的界面效果，例如：游戏风格的状态栏，显示生命值、魔法值、经验值，使用进度条展示',
    generateUI: '生成 UI',
    generating: '生成中...',
    preview: '预览',
    htmlCode: '生成的HTML代码',
    regexConfig: '正则配置（JSON）',
    copyCode: '复制代码',
    copySuccess: '代码已复制',
    apiFailed: 'API调用失败',
    generated: 'UI生成成功',
  },

  // 表格页
  table: {
    title: '表格管理',
    help: '使用帮助',
    selectTemplate: '选择列头模板',
    noTemplate: '无模板',
    floorNumber: '楼层号',
    floorNumberPlaceholder: '例如：1',
    generateTable: '生成表格',
    updateTable: '更新表格',
    deleteTable: '删除表格',
    clearHistory: '清空历史',
    tableHistory: '表格历史',
    noHistory: '暂无表格历史',
  },

  // 历史总结页
  history: {
    title: '历史总结',
    help: '使用帮助',
    floorRange: '楼层范围',
    startFloor: '起始楼层',
    endFloor: '结束楼层',
    generate: '生成总结',
    generating: '生成中...',
    summary: '总结内容',
    copyToClipboard: '复制到剪贴板',
    insertToChat: '插入到聊天',
    noSummary: '暂无总结',
  },

  // 前端项目页
  projects: {
    title: '前端项目管理',
    help: '使用帮助',
    createProject: '创建新项目',
    importProject: '导入项目',
    projectName: '项目名称',
    projectList: '项目列表',
    noProjects: '暂无项目',
    openEditor: '打开编辑器',
    deleteProject: '删除项目',
    exportProject: '导出项目',
  },

  // 工具模板页
  tools: {
    title: '工具模板',
    help: '使用帮助',
  },

  // MVU页
  mvu: {
    title: 'MVU Beta',
    help: '使用帮助',
  },
};
