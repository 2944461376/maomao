import { createPinia } from 'pinia';
import { createApp } from 'vue';
import i18n from './i18n';
import 浮动面板 from './浮动面板.vue';

$(() => {
  console.log('浮动面板.ts 开始执行');

  // 注入移动端响应式CSS
  if ($('#memory-panel-responsive-css').length === 0) {
    const responsiveCSS = `
      <style id="memory-panel-responsive-css">
        /* 桌面端（横屏）：隐藏移动端专用标题 */
        .panel-title-mobile {
          display: none;
        }
        
        /* 桌面端（横屏）：显示完整标题 */
        .panel-title {
          display: inline;
        }
        
        /* 移动端全局样式（竖屏 portrait） */
        @media (orientation: portrait) {
          /* 移动端：面板容器全屏显示 - 使用最高优先级覆盖内联样式 */
          body #memoryManagementPanel {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            transform: none !important;
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100vh !important;
            max-height: 100vh !important;
            min-width: 100vw !important;
            min-height: 100vh !important;
            border-radius: 0 !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* 移动端：隐藏完整标题，显示简短标题 */
          .panel-title {
            display: none !important;
          }
          
          .panel-title-mobile {
            display: inline !important;
            font-size: 14px !important;
          }
          
          /* 移动端：隐藏最小化按钮 */
          .minimize-button {
            display: none !important;
          }
          
          /* 移动端：调整头部样式 */
          .panel-header {
            padding: 10px 12px !important;
            border-radius: 0 !important;
          }
          
          .panel-header .header-left {
            gap: 6px !important;
          }
          
          .panel-header .header-left span {
            font-size: 20px !important;
          }
          
          .panel-header > div:last-child {
            gap: 6px !important;
          }
          
          .close-button {
            padding: 4px 8px !important;
          }
          
          /* 移动端：标签栏可横向滚动 */
          .panel-tabs {
            overflow-x: auto !important;
            overflow-y: hidden !important;
            white-space: nowrap !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .panel-tabs::-webkit-scrollbar {
            height: 2px !important;
          }
          
          .panel-tabs .tab-item {
            flex: 0 0 auto !important;
            padding: 10px 12px !important;
            font-size: 12px !important;
            gap: 4px !important;
            min-width: auto !important;
          }
          
          .panel-tabs .tab-item .tab-label {
            white-space: nowrap !important;
          }
          
          /* 移动端：内容区域优化 */
          .memory-panel-container {
            font-size: 14px !important;
          }
          
          /* 移动端：面板内容区域滚动优化 */
          .panel-content {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            height: 100% !important;
            padding: 12px !important;
          }
          
          /* 移动端：确保标签页内容不超出 */
          .memory-panel-container .tab-content {
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
          
          /* 移动端：按钮优化 */
          .memory-panel-container button,
          .memory-panel-container .el-button {
            padding: 10px 16px !important;
            font-size: 13px !important;
            min-height: 44px !important; /* iOS推荐的最小触摸区域 */
          }
          
          /* 移动端：按钮组堆叠（只针对按钮组，不影响主布局） */
          .memory-panel-container .button-group,
          .memory-panel-container .project-action-buttons {
            flex-direction: column !important;
            gap: 8px !important;
          }
          
          .memory-panel-container .button-group > *,
          .memory-panel-container .button-group button,
          .memory-panel-container .project-action-buttons > button {
            width: 100% !important;
            margin: 0 !important;
          }
          
          /* 移动端：对话框内的按钮堆叠 */
          .memory-panel-container .dialog-actions,
          .memory-panel-container [style*="justify-content: flex-end"] {
            flex-direction: column !important;
            gap: 10px !important;
          }
          
          .memory-panel-container .dialog-actions > button {
            width: 100% !important;
          }
          
          /* 移动端：输入框优化 */
          .memory-panel-container input,
          .memory-panel-container textarea,
          .memory-panel-container select {
            font-size: 16px !important; /* 防止iOS自动缩放 */
            padding: 12px !important;
            min-height: 44px !important;
          }
          
          .memory-panel-container textarea {
            min-height: 120px !important;
          }
          
          /* 移动端：表单项间距 */
          .memory-panel-container .form-group,
          .memory-panel-container [style*="margin"] {
            margin-bottom: 16px !important;
          }
          
          /* 移动端：卡片/面板内边距 */
          .memory-panel-container .card,
          .memory-panel-container .panel,
          .memory-panel-container .section {
            padding: 12px !important;
            margin: 8px 0 !important;
          }
          
          /* 移动端：字段组优化 */
          .memory-panel-container .field-group,
          .memory-panel-container [class*="field"] {
            padding: 8px !important;
            margin-bottom: 12px !important;
          }
          
          /* 移动端：工具区域优化 */
          .memory-panel-container .tool-section,
          .memory-panel-container .section-content {
            padding: 12px 8px !important;
          }
          
          /* 移动端：预览区域优化 */
          .memory-panel-container .preview-container,
          .memory-panel-container [class*="preview"] {
            padding: 8px !important;
            max-width: 100% !important;
            overflow-x: auto !important;
          }
          
          /* 移动端：标题字体 */
          .memory-panel-container h1,
          .memory-panel-container h2,
          .memory-panel-container h3,
          .memory-panel-container h4,
          .memory-panel-container h5 {
            font-size: 16px !important;
            margin-bottom: 12px !important;
          }
          
          /* 移动端：对话框全屏 */
          .memory-panel-container .modal,
          .memory-panel-container .dialog {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
          }
          
          /* 移动端：滚动条优化 */
          .memory-panel-container ::-webkit-scrollbar {
            width: 3px !important;
            height: 3px !important;
          }
          
          /* 移动端：减小字段间的gap */
          .memory-panel-container [style*="gap: 1"] {
            gap: 8px !important;
          }
          
          .memory-panel-container [style*="gap: 2"] {
            gap: 12px !important;
          }
          
          /* 移动端：工具区域按钮组优化 */
          .memory-panel-container .tool-section .button-group {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
          }
          
          /* 移动端：状态栏生成器字段优化（只针对字段，不影响主布局） */
          .memory-panel-container .field-item {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          .memory-panel-container .field-item > * {
            width: 100% !important;
            margin-bottom: 8px !important;
          }
          
          /* 移动端：两栏布局改为单列（只针对设置项，不影响主布局） */
          .memory-panel-container [style*="display: grid"][style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          
          /* 移动端：删除/操作按钮优化 */
          .memory-panel-container .delete-button,
          .memory-panel-container [class*="delete"],
          .memory-panel-container .action-button {
            min-width: 44px !important;
            min-height: 44px !important;
            padding: 8px !important;
          }
          
          /* 移动端：表单label优化 */
          .memory-panel-container label {
            font-size: 13px !important;
            margin-bottom: 6px !important;
            display: block !important;
          }
          
          /* 移动端：防止内容超出视口（只针对表单元素和文本） */
          .memory-panel-container input,
          .memory-panel-container textarea,
          .memory-panel-container select,
          .memory-panel-container button,
          .memory-panel-container pre,
          .memory-panel-container code {
            max-width: 100% !important;
            word-wrap: break-word !important;
          }
          
          /* 移动端：字段标题区域 */
          .memory-panel-container .section-header {
            padding: 16px !important;
            font-size: 14px !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          
          .memory-panel-container .section-header h3 {
            font-size: 15px !important;
            margin-bottom: 0 !important;
          }
          
          /* 移动端：减少不必要的空白 */
          .memory-panel-container .empty-space,
          .memory-panel-container [style*="padding: 20px"],
          .memory-panel-container [style*="padding: 25px"] {
            padding: 12px !important;
          }
        }
      </style>
    `;
    $('head').append(responsiveCSS);
    console.log('📱 移动端响应式CSS已注入');
  }

  setTimeout(() => {
    console.log('浮动面板.ts setTimeout 回调执行');

    // 检查面板容器是否已存在
    const existingPanel = $('#memoryManagementPanel');

    if (existingPanel.length > 0) {
      console.log('mzrodyu猫猫的小破烂浮动面板已存在，强制删除并重新创建...');
      // 强制删除所有现有的面板
      existingPanel.remove();
      // 等待DOM更新
      setTimeout(() => {
        console.log('旧面板已删除，开始创建新面板...');
      }, 100);
    }

    console.log('🚀🚀🚀 开始创建面板容器 - 时间戳:', new Date().toISOString());

    // 创建面板容器 - 居中显示，固定高度（完整版：更大的面板）
    const panelContainer = $(`
      <div id="memoryManagementPanel" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 95vw;
        max-width: 1600px;
        height: 92vh;
        max-height: 92vh;
        background: #1a1a1a;
        border: 1px solid #3a3a3a;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      ">
      </div>
    `);

    // 添加到 body
    $('body').append(panelContainer);
    console.log('面板容器已添加到 body, 容器元素:', panelContainer[0]);

    // 创建新的 Vue 应用
    console.log('准备创建新的 Vue 应用，面板容器:', panelContainer[0]);

    const app = createApp(浮动面板).use(createPinia()).use(i18n);

    try {
      app.mount(panelContainer[0]);
      console.log('Vue 应用已成功挂载');
      console.log('Vue 实例:', (panelContainer[0] as any).__vue_app__);
    } catch (error) {
      console.error('Vue 应用挂载失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      console.error('错误堆栈:', (error as Error).stack);
    }

    console.log('mzrodyu猫猫的小破烂浮动面板已创建，面板元素:', panelContainer[0]);
  }, 200);
});

// 创建最小化图标
function createMinimizeIcon() {
  // 先移除已存在的图标
  $('#memoryPanelMinimizeIcon').remove();

  const isMobile = window.innerWidth <= 768;

  const icon = $(`
    <div id="memoryPanelMinimizeIcon" style="
      position: fixed;
      top: ${isMobile ? '15px' : '20px'};
      right: ${isMobile ? '15px' : '20px'};
      width: ${isMobile ? '50px' : '60px'};
      height: ${isMobile ? '50px' : '60px'};
      background: #2a2a2a;
      border: 2px solid #4a9eff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999998;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      transition: transform 0.2s, box-shadow 0.2s;
      font-size: ${isMobile ? '26px' : '32px'};
    ">
      🐱
    </div>
  `);

  // 悬停效果
  icon.hover(
    function () {
      $(this).css({
        transform: 'scale(1.1)',
        boxShadow: '0 4px 20px rgba(74, 158, 255, 0.5)',
      });
    },
    function () {
      $(this).css({
        transform: 'scale(1)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      });
    },
  );

  // 点击恢复面板
  icon.on('click', () => {
    const panel = $('#memoryManagementPanel');
    panel.fadeIn(200);
    icon.fadeOut(200, () => icon.remove());
  });

  // 使图标可以拖动
  icon.draggable({
    containment: 'window',
    scroll: false,
    start: function () {
      $(this).css('transition', 'none');
    },
    stop: function () {
      $(this).css('transition', '');
    },
  });

  $('body').append(icon);
  return icon;
}

// 最小化面板
export function minimizeMemoryPanel() {
  const panel = $('#memoryManagementPanel');
  if (panel.length === 0) return;

  panel.fadeOut(200, () => {
    createMinimizeIcon().hide().fadeIn(200);
  });
}

// 打开/关闭面板的函数
export function toggleMemoryPanel() {
  const panel = $('#memoryManagementPanel');
  if (panel.length === 0) return;

  if (panel.is(':visible')) {
    panel.fadeOut(200);
  } else {
    panel.fadeIn(200);
  }
}
