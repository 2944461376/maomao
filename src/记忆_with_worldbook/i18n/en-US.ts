export default {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    refresh: 'Refresh',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    clear: 'Clear',
    export: 'Export',
    import: 'Import',
    copy: 'Copy',
    paste: 'Paste',
    generate: 'Generate',
    preview: 'Preview',
  },

  // Main Panel
  panel: {
    title: "mzrodyu's Tool",
    minimize: 'Minimize',
  },

  // Tabs
  tabs: {
    settings: 'Settings',
    history: 'History Summary',
    table: 'Table',
    greetings: 'Greetings',
    regex: 'UI Generator',
    state: 'State Bar',
    projects: 'Projects',
    tools: 'Tools',
    mvu: 'MVU Beta',
    help: 'Help',
  },

  // Settings Page
  settings: {
    title: 'API Configuration',
    provider: 'API Provider',
    endpoint: 'API Endpoint',
    endpointPlaceholder: 'https://your-server/v1',
    endpointHelp: 'Common formats',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'sk-...',
    model: 'Model Name',
    modelPlaceholder: 'Leave empty to use name (e.g., gpt-4o-mini)',
    fetchModels: 'Fetch Models',
    saveConfig: 'Save Config',
    maxTokens: 'Max Tokens',
    maxTokensHelp: 'Recommend 4000+ for detailed summaries',
    temperature: 'Temperature',
    temperatureHelp: 'Recommended: 0.7',
    hiddenFloors: 'Hidden Floors',
    hiddenFloorsDesc: 'Hide specified message floors in summaries (e.g., status bars, combat info)',
    addFloor: 'Add Floor',
    floorIndex: 'Floor Index',
    floorIndexPlaceholder: 'e.g., 0, 1, 2',
    removeFloor: 'Remove',
    columnTemplates: 'Column Templates',
    columnTemplatesDesc: 'Column header templates for table feature',
    templateName: 'Template Name',
    templateNamePlaceholder: 'e.g., Character Template',
    templateContent: 'Template Content',
    templateContentPlaceholder: 'e.g., Name|Age|Gender',
    addTemplate: 'Add Template',
    deleteTemplate: 'Delete Template',
    autoSummary: 'Auto Summary',
    enableAutoSummary: 'Enable Auto Summary',
    summaryInterval: 'Summary Interval (Floors)',
    summaryIntervalPlaceholder: 'e.g., 20',
    summaryIntervalHelp: 'Generate summary every N floors',
    currentStatus: 'Current Summary Status',
    chatId: 'Chat ID',
    lastSummaryFloor: 'Last Summary Floor',
    nextSummaryFloor: 'Next Summary Floor',
    resetStatus: 'Reset Status',
    manualSummary: 'Manual Summary',
    configSaved: 'Config saved',
    apiConfigSaved: 'API config saved',
    fetchError: 'Failed to fetch models',
  },

  // Greetings Page
  greetings: {
    title: 'Greetings Manager',
    character: 'Current Character',
    noCharacter: 'No character found',
    clearConfig: 'Clear Config',
    clearConfigConfirm: 'Are you sure you want to clear all greeting configurations?',
    clearSuccess: 'Configuration cleared',
    help: 'Help',
    helpContent: `
      <h3>Features</h3>
      <p>Set icons, titles, and descriptions for multiple character greetings, and generate a visual selection interface.</p>
      <h3>How to Use</h3>
      <ol>
        <li>Open a character card in SillyTavern</li>
        <li>Configure icon (emoji or URL), title, and description for each greeting</li>
        <li>Click "Generate Style with AI" and describe your desired style</li>
        <li>Preview the generated interface, then copy the code to SillyTavern regex</li>
      </ol>
    `,
    greetingBadge: 'Greeting',
    default: 'Default',
    icon: 'Icon',
    iconPlaceholder: 'emoji or image URL',
    title: 'Title',
    titlePlaceholder: 'Greeting title',
    description: 'Description',
    descriptionPlaceholder: 'Greeting description',
    generateWithAI: 'Generate with AI',
    generating: 'Generating...',
    stylePrompt: 'Style Generation',
    stylePromptPlaceholder: 'Describe your desired interface style, e.g.: Cyberpunk style, neon lights, dark theme',
    generateStyle: 'Generate Style with AI',
    generatingStyle: 'Generating...',
    copyCode: 'Copy Code',
    copySuccess: 'Code copied to clipboard',
    apiFailed: 'API call failed',
    styleGenerated: 'Style generated successfully',
    descGenerated: 'Description generated successfully',
    htmlCode: 'Generated HTML Code',
    regexConfig: 'Regex Config (JSON)',
  },

  // Regex Generator Page
  regex: {
    title: 'UI Generator',
    help: 'Help',
    helpContent: `
      <h3>Features</h3>
      <p>Use AI to generate visual UI based on your description, and automatically convert it to SillyTavern regex format.</p>
      <h3>How to Use</h3>
      <ol>
        <li>Enter trigger text (e.g., #status)</li>
        <li>Describe your desired UI effect in detail</li>
        <li>Click "Generate UI" and AI will create the HTML interface</li>
        <li>Preview on the right, then copy the code to SillyTavern regex</li>
      </ol>
    `,
    triggerText: 'Trigger Text',
    triggerTextPlaceholder: 'e.g., #status',
    uiDescription: 'UI Description',
    uiDescriptionPlaceholder:
      'Describe your desired UI in detail, e.g.: Game-style status bar showing HP, MP, EXP with progress bars',
    generateUI: 'Generate UI',
    generating: 'Generating...',
    preview: 'Preview',
    htmlCode: 'Generated HTML Code',
    regexConfig: 'Regex Config (JSON)',
    copyCode: 'Copy Code',
    copySuccess: 'Code copied',
    apiFailed: 'API call failed',
    generated: 'UI generated successfully',
  },

  // Table Page
  table: {
    title: 'Table Manager',
    help: 'Help',
    selectTemplate: 'Select Template',
    noTemplate: 'No Template',
    floorNumber: 'Floor Number',
    floorNumberPlaceholder: 'e.g., 1',
    generateTable: 'Generate Table',
    updateTable: 'Update Table',
    deleteTable: 'Delete Table',
    clearHistory: 'Clear History',
    tableHistory: 'Table History',
    noHistory: 'No table history',
  },

  // History Summary Page
  history: {
    title: 'History Summary',
    help: 'Help',
    floorRange: 'Floor Range',
    startFloor: 'Start Floor',
    endFloor: 'End Floor',
    generate: 'Generate Summary',
    generating: 'Generating...',
    summary: 'Summary',
    copyToClipboard: 'Copy to Clipboard',
    insertToChat: 'Insert to Chat',
    noSummary: 'No summary yet',
  },

  // Projects Page
  projects: {
    title: 'Project Manager',
    help: 'Help',
    createProject: 'Create Project',
    importProject: 'Import Project',
    projectName: 'Project Name',
    projectList: 'Project List',
    noProjects: 'No projects',
    openEditor: 'Open Editor',
    deleteProject: 'Delete Project',
    exportProject: 'Export Project',
  },

  // Tools Page
  tools: {
    title: 'Tool Templates',
    help: 'Help',
  },

  // MVU Page
  mvu: {
    title: 'MVU Beta',
    help: 'Help',
  },
};
