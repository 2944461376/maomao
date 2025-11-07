<template>
  <div class="help-tab" style="padding: 25px !important; background: #1a1a1a !important">
    <!-- 版本信息 -->
    <div
      style="
        padding: 20px 28px;
        background: linear-gradient(
          135deg,
          rgba(30, 30, 30, 0.95) 0%,
          rgba(38, 38, 38, 0.9) 50%,
          rgba(30, 30, 30, 0.95) 100%
        );
        backdrop-filter: blur(12px);
        border-radius: 14px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow:
          0 3px 12px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        text-align: center;
      "
    >
      <div style="font-size: 48px; margin-bottom: 10px">🐱</div>
      <h2 style="margin: 0 0 10px 0; color: #4a9eff; font-size: 24px; font-weight: 600">mzrodyu猫猫的小破烂</h2>
      <div style="color: #888; font-size: 14px; margin-bottom: 15px">版本 v1.34</div>

      <!-- 按钮组 -->
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
        <button
          @click="checkUpdate"
          style="
            padding: 8px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 20px;
            color: white;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          "
          @mouseenter="
            $event.target.style.transform = 'translateY(-2px)';
            $event.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          "
          @mouseleave="
            $event.target.style.transform = 'translateY(0)';
            $event.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
          "
        >
          <i class="fa-solid fa-rotate" style="margin-right: 6px"></i>
          检查更新
        </button>

        <button
          @click="downloadLatest"
          style="
            padding: 8px 20px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border: none;
            border-radius: 20px;
            color: white;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
          "
          @mouseenter="
            $event.target.style.transform = 'translateY(-2px)';
            $event.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
          "
          @mouseleave="
            $event.target.style.transform = 'translateY(0)';
            $event.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
          "
        >
          <i class="fa-solid fa-download" style="margin-right: 6px"></i>
          下载最新版本
        </button>
      </div>

      <!-- 版权声明 -->
      <div
        style="
          margin-top: 20px;
          padding: 15px 20px;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 8px;
          text-align: left;
        "
      >
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px">
          <i class="fa-solid fa-shield-halved" style="color: #dc3545; font-size: 16px"></i>
          <span style="color: #dc3545; font-weight: 600; font-size: 14px">版权声明</span>
        </div>
        <div style="color: #e0e0e0; font-size: 13px; line-height: 1.6">
          <div style="margin-bottom: 5px">📌 本脚本仅发布在<strong style="color: #ffc107">类脑/旅程</strong></div>
          <div style="margin-bottom: 5px">🚫 <strong style="color: #dc3545">禁止二传</strong></div>
          <div style="margin-bottom: 5px">⚠️ 二改需要获得作者允许</div>
          <div>❌ <strong style="color: #dc3545">商业化绝对禁止</strong></div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div
      style="
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 28px;
        background: linear-gradient(
          135deg,
          rgba(30, 30, 30, 0.95) 0%,
          rgba(38, 38, 38, 0.9) 50%,
          rgba(30, 30, 30, 0.95) 100%
        );
        backdrop-filter: blur(12px);
        border-radius: 14px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow:
          0 3px 12px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      "
      @click="expandedSections.usage = !expandedSections.usage"
      @mouseenter="
        ($event.currentTarget as HTMLElement).style.background =
          'linear-gradient(135deg, rgba(42, 42, 42, 0.98) 0%, rgba(50, 50, 50, 0.95) 50%, rgba(42, 42, 42, 0.98) 100%)';
        ($event.currentTarget as HTMLElement).style.transform = 'translateX(4px) scale(1.005)';
        ($event.currentTarget as HTMLElement).style.borderLeft = '3px solid rgba(255, 193, 7, 0.6)';
      "
      @mouseleave="
        ($event.currentTarget as HTMLElement).style.background =
          'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(38, 38, 38, 0.9) 50%, rgba(30, 30, 30, 0.95) 100%)';
        ($event.currentTarget as HTMLElement).style.transform = 'none';
        ($event.currentTarget as HTMLElement).style.borderLeft = '1px solid rgba(255, 255, 255, 0.06)';
      "
    >
      <h3
        style="
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        "
      >
        <i class="fa-solid fa-book-open" style="color: #4a9eff; font-size: 18px"></i>
        使用说明
      </h3>
      <i
        :class="expandedSections.usage ? 'fa-chevron-up' : 'fa-chevron-down'"
        class="fa-solid"
        style="color: rgba(255, 255, 255, 0.6); font-size: 14px; transition: transform 0.3s"
      ></i>
    </div>

    <div v-show="expandedSections.usage" style="padding: 0 10px 20px 10px">
      <div
        style="
          background: #2a2a2a;
          border: 1px solid #3a3a3a;
          border-radius: 8px;
          padding: 20px;
          color: #e0e0e0;
          line-height: 1.8;
        "
      >
        <h4 style="color: #4a9eff; margin-top: 0; margin-bottom: 15px; font-size: 16px">📋 功能简介</h4>
        <ul style="margin: 5px 0; padding-left: 20px">
          <li><strong>总结：</strong>自动/手动总结对话，存入世界书</li>
          <li><strong>写卡辅助：</strong>生成角色卡、世界书条目，支持流式传输和 AI 修改</li>
          <li><strong>状态栏生成：</strong>可视化配置状态栏，生成正则 JSON 和世界书条目</li>
          <li><strong>MVU Beta：</strong>生成变量结构、提示词模板、$meta 配置</li>
          <li><strong>其他：</strong>去八股、正则界面生成、前端项目管理、表格生成</li>
        </ul>

        <h4 style="color: #4a9eff; margin-top: 25px; margin-bottom: 15px; font-size: 16px">💡 使用方法</h4>
        <div
          style="
            margin-bottom: 15px;
            padding: 12px 15px;
            background: rgba(220, 53, 69, 0.1);
            border-left: 3px solid #dc3545;
            border-radius: 4px;
          "
        >
          <div style="color: #dc3545; font-weight: 600; margin-bottom: 8px">⚠️ API 配置</div>
          <div style="font-size: 13px; color: #e0e0e0; line-height: 1.6">
            <div style="margin-bottom: 8px">
              <strong>支持的格式：</strong>
              <ul style="margin: 5px 0; padding-left: 20px">
                <li><code>https://api.openai.com</code> → 自动补全为 <code>/v1</code></li>
                <li><code>https://api.openai.com/v1</code> → 直接使用</li>
                <li><code>https://your-proxy.com/v1/chat/completions</code> → 直接使用</li>
              </ul>
            </div>
            <div style="margin-bottom: 5px">
              <strong>OpenAI 官方示例：</strong
              ><code style="background: rgba(220, 53, 69, 0.2); padding: 2px 6px; border-radius: 4px"
                >https://api.openai.com</code
              >
            </div>
            <div>
              <strong>Gemini AI Studio：</strong
              ><code style="background: rgba(220, 53, 69, 0.2); padding: 2px 6px; border-radius: 4px"
                >https://generativelanguage.googleapis.com/v1beta/openai/</code
              >
            </div>
          </div>
        </div>
        <ul style="margin: 5px 0; padding-left: 20px">
          <li><strong>导入：</strong>酒馆助手 → 脚本库 → 导入 → 全局脚本</li>
          <li><strong>首次使用：</strong>先去"设置"页配置 API</li>
          <li><strong>自动总结：</strong>建议开启，每 20-30 楼自动生成一次</li>
        </ul>
      </div>
    </div>

    <!-- 更新日志 -->
    <div
      style="
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 28px;
        background: linear-gradient(
          135deg,
          rgba(30, 30, 30, 0.95) 0%,
          rgba(38, 38, 38, 0.9) 50%,
          rgba(30, 30, 30, 0.95) 100%
        );
        backdrop-filter: blur(12px);
        border-radius: 14px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow:
          0 3px 12px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.04),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      "
      @click="expandedSections.changelog = !expandedSections.changelog"
      @mouseenter="
        ($event.currentTarget as HTMLElement).style.background =
          'linear-gradient(135deg, rgba(42, 42, 42, 0.98) 0%, rgba(50, 50, 50, 0.95) 50%, rgba(42, 42, 42, 0.98) 100%)';
        ($event.currentTarget as HTMLElement).style.transform = 'translateX(4px) scale(1.005)';
        ($event.currentTarget as HTMLElement).style.borderLeft = '3px solid rgba(255, 193, 7, 0.6)';
      "
      @mouseleave="
        ($event.currentTarget as HTMLElement).style.background =
          'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(38, 38, 38, 0.9) 50%, rgba(30, 30, 30, 0.95) 100%)';
        ($event.currentTarget as HTMLElement).style.transform = 'none';
        ($event.currentTarget as HTMLElement).style.borderLeft = '1px solid rgba(255, 255, 255, 0.06)';
      "
    >
      <h3
        style="
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        "
      >
        <i class="fa-solid fa-clock-rotate-left" style="color: #28a745; font-size: 18px"></i>
        更新日志
      </h3>
      <i
        :class="expandedSections.changelog ? 'fa-chevron-up' : 'fa-chevron-down'"
        class="fa-solid"
        style="color: rgba(255, 255, 255, 0.6); font-size: 14px; transition: transform 0.3s"
      ></i>
    </div>

    <div v-show="expandedSections.changelog" style="padding: 0 10px 20px 10px">
      <div
        style="
          background: #2a2a2a;
          border: 1px solid #3a3a3a;
          border-radius: 8px;
          padding: 20px;
          color: #e0e0e0;
          line-height: 1.8;
        "
      >
        <!-- v1.34 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.34</span
            >
            <span style="color: #888; font-size: 13px">2025-11-07</span>
          </div>
          <ul class="update-list">
            <li class="update-item">🌐 新增：多语言支持（中文/英文切换）</li>
            <li class="update-item">🐛 修复：vue-i18n 初始化错误</li>
            <li class="update-item">📱 优化：移动端完整响应式适配</li>
            <li class="update-item">🔧 优化：使用 testingcf.jsdelivr.net 加速访问</li>
          </ul>
        </div>

        <!-- v1.33 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.33</span
            >
            <span style="color: #888; font-size: 13px">2025-11-06</span>
          </div>
          <ul class="update-list">
            <li class="update-item">新增：开场白美化选择器工具</li>
            <li class="update-item">自动读取角色卡的所有开场白</li>
            <li class="update-item">为每个开场白配置美化样式（图标、标题、描述）</li>
            <li class="update-item">AI 生成描述：根据开场白原文内容自动生成吸引人的描述</li>
            <li class="update-item">AI 编辑描述：根据需求快速修改描述</li>
            <li class="update-item">⭐ AI 生成界面样式：直接告诉AI你想要什么风格，自动生成完整HTML界面</li>
            <li class="update-item">实时预览生成的美化界面样式效果</li>
            <li class="update-item">一键导出为 STScript JSON 格式</li>
            <li class="update-item">配置自动保存到角色卡变量</li>
          </ul>
        </div>

        <!-- v1.32 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.32</span
            >
            <span style="color: #888; font-size: 13px">2025-11-06</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #6366f1; font-weight: 600; margin-bottom: 8px">🔧 优化</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>最小化图标支持拖动，可随意调整位置</li>
            </ul>
          </div>
        </div>

        <!-- v1.31 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.31</span
            >
            <span style="color: #888; font-size: 13px">2025-11-05</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">✨ 新功能</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>同层对话：AI 回复直接显示在面板内，支持流式传输和正则过滤</li>
              <li>状态栏生成器新增 AI 解析 XML 和自然语言生成字段功能</li>
            </ul>
          </div>
          <div style="margin-bottom: 15px">
            <div style="color: #6366f1; font-weight: 600; margin-bottom: 8px">🔧 优化</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>完整的移动端适配：响应式布局、标签栏滚动、滑动切换</li>
              <li>所有 AI 功能统一使用设置页的 API 配置</li>
            </ul>
          </div>
        </div>

        <!-- v1.27 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.27</span
            >
            <span style="color: #888; font-size: 13px">2025-11-05</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">✨ 新功能</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>新增 MVU Beta 标签页：变量结构、提示词模板、$meta 配置生成</li>
              <li>新增状态栏生成器：可视化配置状态栏，生成正则 JSON 和世界书条目</li>
              <li>状态栏生成器支持 ABO 模板快速加载</li>
            </ul>
          </div>
          <div style="margin-bottom: 15px">
            <div style="color: #6366f1; font-weight: 600; margin-bottom: 8px">🔧 优化</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>所有 AI 工具统一从设置页读取 max_tokens 和 temperature</li>
              <li>MVU Beta 和状态栏生成器支持数据持久化</li>
            </ul>
          </div>
        </div>

        <!-- v1.26 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #64748b 0%, #475569 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.26</span
            >
            <span style="color: #888; font-size: 13px">2025-11-02</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">✨ 新功能</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>新增状态栏生成器</li>
            </ul>
          </div>
        </div>

        <!-- v1.23 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.23</span
            >
            <span style="color: #888; font-size: 13px">2025-11-02</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">🎉 重大更新</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>前端项目管理器 AI 预览功能：生成代码后先预览对比，确认后再应用</li>
              <li>修改历史记录和版本回滚：最多保留 50 条历史，可恢复到任意版本</li>
              <li>反八股工具优化：适度清理，保持原文信息量和长度</li>
            </ul>
          </div>
        </div>

        <!-- v1.15 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.15</span
            >
            <span style="color: #888; font-size: 13px">2025-10-31</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px">✨ 新功能</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>流式传输支持：所有 AI 生成工具支持实时查看生成进度</li>
              <li>正则界面生成器：用自然语言生成酒馆前端界面代码</li>
              <li>世界书条目查看器和 AI 修改功能</li>
            </ul>
          </div>
        </div>

        <!-- v1.2 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.2</span
            >
            <span style="color: #888; font-size: 13px">2025-10-30</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px">✨ 新功能</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>前端项目管理器：完整前端系统编写，支持多文件、多模块、AI 续写</li>
              <li>实时预览、项目模板、项目持久化</li>
            </ul>
          </div>
        </div>

        <!-- v1.05 -->
        <div style="margin-bottom: 25px">
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: #4a9eff;
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.05</span
            >
            <span style="color: #888; font-size: 13px">2025-10-30</span>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px">✨ 新功能</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li>批量修改世界书条目、反八股历史记录、帮助页面</li>
            </ul>
          </div>
        </div>

        <!-- v1.00 -->
        <div>
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #3a3a3a;
            "
          >
            <span
              style="
                background: #888;
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
              "
              >v1.00</span
            >
            <span style="color: #888; font-size: 13px">2025-10-29</span>
          </div>

          <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
            <li>🎉 初始版本发布</li>
            <li>支持自动/手动总结、表格生成、反八股、世界书条目管理、楼层隐藏/显示</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 关于 -->
    <div
      style="
        padding: 15px 20px;
        background: rgba(30, 30, 30, 0.5);
        border: 1px solid #3a3a3a;
        border-radius: 8px;
        text-align: center;
        color: #888;
        font-size: 13px;
      "
    >
      <div style="margin-bottom: 8px">Made with <span style="color: #dc3545">❤️</span> by mzrodyu</div>
      <div style="font-size: 12px">
        基于
        <a
          href="https://github.com/SillyTavern/SillyTavern"
          target="_blank"
          style="color: #4a9eff; text-decoration: none"
          >SillyTavern</a
        >
        和
        <a
          href="https://n0vi028.github.io/JS-Slash-Runner-Doc/"
          target="_blank"
          style="color: #4a9eff; text-decoration: none"
          >Tavern Helper</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { checkForUpdates } from '../version-checker';

// 折叠展开状态
const expandedSections = ref({
  usage: false,
  changelog: false,
});

// 检查更新
const checkUpdate = () => {
  checkForUpdates(true);
};

// 下载最新版本
const downloadLatest = async () => {
  try {
    window.toastr.info('正在获取最新版本信息...', '下载中', { timeOut: 2000 });

    // 1. 获取最新版本号
    const timestamp = Date.now();
    const versionResponse = await fetch(
      `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao/dist/记忆_with_worldbook/version.json?_=${timestamp}`,
    );

    if (!versionResponse.ok) {
      throw new Error('无法获取版本信息');
    }

    const versionInfo = await versionResponse.json();
    const version = versionInfo.version;

    window.toastr.info(`正在下载 v${version}...`, '下载中', { timeOut: 2000 });

    // 2. 下载对应版本的 JSON 文件
    const jsonUrl = `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao/dist/记忆_with_worldbook/猫猫的写卡小工具 v${version}.json?_=${timestamp}`;
    const jsonResponse = await fetch(jsonUrl);

    if (!jsonResponse.ok) {
      throw new Error(`下载失败: HTTP ${jsonResponse.status}`);
    }

    const jsonContent = await jsonResponse.text();

    // 3. 创建下载链接
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `猫猫的写卡小工具 v${version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.toastr.success(`v${version} 已下载完成，请在酒馆脚本库重新导入该文件`, '下载成功', { timeOut: 8000 });
  } catch (error: any) {
    console.error('下载失败:', error);
    window.toastr.error('下载失败: ' + error.message, '错误', { timeOut: 5000 });
  }
};
</script>

<style scoped>
.help-tab ::-webkit-scrollbar {
  width: 8px;
}

.help-tab ::-webkit-scrollbar-track {
  background: #2a2a2a;
  border-radius: 4px;
}

.help-tab ::-webkit-scrollbar-thumb {
  background: #4a9eff;
  border-radius: 4px;
}

.help-tab ::-webkit-scrollbar-thumb:hover {
  background: #3a8edf;
}

.help-tab ul {
  list-style-type: none;
  position: relative;
}

.help-tab ul li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
}

.help-tab ul li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #4a9eff;
  font-weight: bold;
}

.help-tab a {
  transition: color 0.2s;
}

.help-tab a:hover {
  color: #3a8edf !important;
}
</style>
