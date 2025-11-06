<template>
  <div
    class="greetings-tab"
    style="display: flex; flex-direction: column; height: 100%; background: #1a1a1a !important"
  >
    <!-- 标题区域 -->
    <div
      class="section-header"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px !important;
        border-bottom: 1px solid #3a3a3a;
      "
    >
      <h3
        style="
          margin: 0;
          color: #fff;
          font-size: 15px !important;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 8px;
        "
      >
        <i class="fa-solid fa-comments" style="color: #667eea"></i>
        开场白管理器
      </h3>
      <div class="header-actions" style="display: flex; align-items: center; gap: 10px">
        <span
          v-if="greetings.length > 0"
          class="count-badge"
          style="background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px"
        >
          {{ greetings.length }} 个开场白
        </span>
        <button
          v-if="greetings.length > 0"
          class="mini-button"
          style="
            padding: 6px 12px;
            background: #2a2a2a;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          "
          :style="{ color: showHelp ? '#667eea' : '#e0e0e0', borderColor: showHelp ? '#667eea' : '#3a3a3a' }"
          @click="showHelp = !showHelp"
        >
          <i class="fa-solid fa-circle-question"></i> {{ showHelp ? '隐藏帮助' : '显示帮助' }}
        </button>
        <button
          v-if="greetings.length > 0"
          class="mini-button"
          style="
            padding: 6px 12px;
            background: #dc2626;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          "
          @click="clearAllConfig"
          @mouseenter="($event.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.transform = 'translateY(0)'"
        >
          <i class="fa-solid fa-eraser"></i> 清空配置
        </button>
        <button
          v-if="greetings.length > 0"
          class="mini-button"
          style="
            padding: 6px 12px;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          "
          @click="showAiStyleDialog = true"
          @mouseenter="($event.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.transform = 'translateY(0)'"
        >
          <i class="fa-solid fa-wand-magic-sparkles"></i> AI生成界面样式
        </button>
        <button
          class="mini-button refresh-button"
          style="
            padding: 6px 12px;
            background: #2a2a2a;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            color: #e0e0e0;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
          "
          @click="loadConfig"
        >
          <i class="fa-solid fa-refresh"></i> 刷新
        </button>
      </div>
    </div>

    <!-- 主内容区域：左右两栏 -->
    <div style="flex: 1; display: flex; gap: 20px; padding: 20px; overflow: hidden">
      <!-- 左侧：配置区域 -->
      <div style="flex: 1; overflow-y: auto; padding-right: 10px">
        <!-- 空状态 / 使用说明 -->
        <div
          v-if="greetings.length === 0"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            color: #888;
          "
        >
          <i class="fa-solid fa-comment-dots" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3"></i>
          <div style="font-size: 18px; font-weight: 600; color: #e0e0e0; margin-bottom: 10px">暂无开场白</div>
          <div style="font-size: 14px; color: #888; max-width: 400px; line-height: 1.6">
            请在酒馆中选择一个有开场白的角色卡，或点击上方的刷新按钮
          </div>
        </div>

        <!-- 使用说明 -->
        <div
          v-else-if="showHelp"
          style="background: #2a2a2a; border: 1px solid #667eea; border-radius: 8px; padding: 20px; margin-bottom: 20px"
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <h4 style="color: #667eea; margin: 0; display: flex; align-items: center; gap: 8px">
              <i class="fa-solid fa-circle-info"></i>
              使用说明
            </h4>
            <button
              style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 18px; padding: 4px"
              @click="showHelp = false"
            >
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <ol style="color: #ccc; margin: 0; padding-left: 20px; line-height: 1.8">
            <li>工具会自动读取当前角色卡的所有开场白</li>
            <li>为每个开场白设置图标、标题和描述</li>
            <li>使用AI生成描述功能，根据开场白内容自动生成吸引人的描述</li>
            <li>点击"AI生成界面样式"按钮，描述你想要的风格（如：深蓝色背景、金色标题）</li>
            <li>AI会根据你的描述生成完整的HTML样式代码</li>
            <li>右侧实时预览生成的界面样式效果</li>
            <li>点击"生成前端选择界面代码"查看完整代码</li>
            <li>点击"下载为STScript JSON"导出配置文件</li>
            <li>在酒馆中导入JSON文件，输入 /【开场白】 使用</li>
          </ol>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #3a3a3a">
            <p style="color: #888; font-size: 13px; margin: 0">
              <i class="fa-solid fa-lightbulb" style="color: #ffc107"></i>
              <strong>提示：</strong>生成的序号对应角色卡中的开场白序号（0为默认开场白）
            </p>
          </div>
        </div>

        <!-- 开场白列表 -->
        <div v-else style="display: flex; flex-direction: column; gap: 15px">
          <div
            v-for="(greeting, index) in greetings"
            :key="index"
            class="greeting-item"
            style="
              background: #2a2a2a;
              border: 1px solid #3a3a3a;
              border-radius: 8px;
              padding: 15px;
              transition: all 0.3s ease;
            "
          >
            <!-- 顶部信息栏 -->
            <div
              style="
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
                padding-bottom: 10px;
                border-bottom: 1px solid #3a3a3a;
              "
            >
              <span
                style="
                  background: #667eea;
                  color: white;
                  padding: 4px 10px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: bold;
                  min-width: 35px;
                  text-align: center;
                "
              >
                #{{ index }}
              </span>
              <input
                v-model="greeting.icon"
                style="
                  width: 60px;
                  text-align: center;
                  font-size: 20px;
                  background: #1a1a1a;
                  border: 1px solid #3a3a3a;
                  border-radius: 6px;
                  padding: 6px;
                  color: #e0e0e0;
                "
                placeholder="图标"
                maxlength="4"
                @input="saveConfig"
              />
              <input
                v-model="greeting.title"
                style="
                  flex: 1;
                  background: #1a1a1a;
                  border: 1px solid #3a3a3a;
                  border-radius: 6px;
                  padding: 8px 12px;
                  color: #e0e0e0;
                  font-size: 14px;
                "
                :placeholder="index === 0 ? '默认开场白' : `开场白 ${index}`"
                @input="saveConfig"
              />
              <button
                style="
                  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                  border: none;
                  color: white;
                  padding: 8px 16px;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 13px;
                  font-weight: 600;
                  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
                "
                title="根据开场白内容自动生成描述"
                @click="generateDescription(index)"
                @mouseenter="
                  ($event.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  ($event.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.5)';
                "
                @mouseleave="
                  ($event.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  ($event.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.3)';
                "
              >
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>AI 生成描述</span>
              </button>
              <button
                v-if="greeting.description"
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                  border: none;
                  color: white;
                  padding: 8px 16px;
                  border-radius: 6px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 13px;
                  font-weight: 600;
                  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                "
                title="根据需求修改已有描述"
                @click="editDescription(index)"
                @mouseenter="
                  ($event.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  ($event.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
                "
                @mouseleave="
                  ($event.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  ($event.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                "
              >
                <i class="fa-solid fa-edit"></i>
                <span>AI 编辑描述</span>
              </button>
            </div>

            <!-- 描述输入框 -->
            <textarea
              v-model="greeting.description"
              style="
                width: 100%;
                background: #1a1a1a;
                border: 1px solid #3a3a3a;
                border-radius: 6px;
                padding: 10px;
                color: #e0e0e0;
                font-size: 13px;
                font-family: inherit;
                resize: vertical;
                min-height: 60px;
              "
              placeholder="输入简短描述..."
              @input="saveConfig"
            >
            </textarea>

            <!-- 查看原文按钮 -->
            <button
              style="
                width: 100%;
                padding: 10px;
                background: transparent;
                border: 1px solid #667eea;
                border-radius: 6px;
                color: #667eea;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                margin-top: 10px;
              "
              @click="viewOriginalGreeting(index)"
              @mouseenter="($event.currentTarget as HTMLElement).style.background = 'rgba(102, 126, 234, 0.1)'"
              @mouseleave="($event.currentTarget as HTMLElement).style.background = 'transparent'"
            >
              <i class="fa-solid fa-file-lines"></i>
              <span>查看角色卡中的开场白原文</span>
            </button>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div
          v-if="greetings.length > 0"
          style="
            position: sticky;
            bottom: 0;
            padding: 20px;
            background: linear-gradient(to top, #1a1a1a 80%, transparent);
            border-top: 1px solid #3a3a3a;
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
          "
        >
          <button
            style="
              padding: 15px 35px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              border-radius: 10px;
              color: white;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 10px;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            "
            @click="generateFrontendCode"
            @mouseenter="
              ($event.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              ($event.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            "
            @mouseleave="
              ($event.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              ($event.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            "
          >
            <i class="fa-solid fa-code" style="font-size: 16px"></i>
            生成HTML代码
          </button>
          <button
            style="
              padding: 15px 35px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border: none;
              border-radius: 10px;
              color: white;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 10px;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
            "
            @click="downloadAsJson"
            @mouseenter="
              ($event.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              ($event.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
            "
            @mouseleave="
              ($event.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              ($event.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
            "
          >
            <i class="fa-solid fa-download" style="font-size: 16px"></i>
            下载为STScript JSON
          </button>
        </div>
      </div>

      <!-- 右侧：实时预览 -->
      <div
        style="
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #3a3a3a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        "
      >
        <div
          style="
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-bottom: 1px solid #3a3a3a;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <h4
            style="
              margin: 0;
              color: white;
              font-size: 14px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
            "
          >
            <i class="fa-solid fa-eye"></i>
            实时预览
          </h4>
          <button
            v-if="previewHtml"
            title="新窗口打开"
            style="
              width: 32px;
              height: 32px;
              background: rgba(255, 255, 255, 0.2);
              border: none;
              border-radius: 6px;
              color: white;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
            "
            @click="openPreviewInNewWindow"
          >
            <i class="fa-solid fa-external-link-alt"></i>
          </button>
        </div>
        <div style="flex: 1; position: relative; overflow: hidden; background: #1e1e1e">
          <iframe
            v-if="previewHtml"
            :srcdoc="previewHtml"
            sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
            style="width: 100%; height: 100%; border: none; background: white"
          ></iframe>
          <div
            v-else
            style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #666;
              font-size: 14px;
              padding: 20px;
              text-align: center;
              line-height: 1.8;
            "
          >
            <div>
              <i class="fa-solid fa-eye-slash" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3"></i>
              <p style="margin: 0">配置开场白后将显示预览</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI生成对话框 -->
    <AIGenerateDialog
      :show="showAiGenerateDialog"
      :is-generating="isGeneratingAi"
      title="AI 生成简短描述"
      description="AI 正在根据开场白的实际内容自动生成吸引人的简短描述（20-50字）..."
      :show-input="false"
      @close="closeAiGenerateDialog"
      @confirm="() => {}"
    />

    <!-- AI编辑对话框 -->
    <AIModifyDialog
      :show="showAiEditDialog"
      :is-modifying="isEditingAi"
      title="AI 编辑简短描述"
      description="描述你想要修改的地方，AI 会在当前描述的基础上进行调整。注意：仅修改描述，不会改变开场白内容本身。"
      :examples="['更简洁一些', '更文艺一些', '更活泼一些', '添加情感色彩']"
      @close="showAiEditDialog = false"
      @confirm="confirmEditDescription"
    />

    <!-- AI生成界面样式对话框 -->
    <AIModifyDialog
      :show="showAiStyleDialog"
      :is-modifying="isGeneratingStyle"
      title="AI 生成开场白界面样式"
      description="描述你想要的界面风格，AI 会生成完整的HTML样式代码。例如：深蓝色背景、金色标题、圆角卡片等。"
      :examples="[
        '深蓝色渐变背景，白色圆角卡片，金色标题',
        '粉色可爱风格，带阴影的卡片',
        '深色科技风格，霓虹灯效果',
        '典雅金色风格，高贵大气',
        '游戏像素风格，方形卡片',
      ]"
      @close="showAiStyleDialog = false"
      @confirm="generateStyleWithAI"
    />

    <!-- 查看开场白原文对话框 -->
    <div
      v-if="showOriginalDialog"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      "
      @click.self="showOriginalDialog = false"
    >
      <div
        style="
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          border-radius: 12px;
          padding: 24px;
          max-width: 700px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        "
        @click.stop
      >
        <!-- 标题栏 -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
          <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 8px">
            <i class="fa-solid fa-file-lines"></i>
            <span>开场白原文</span>
          </h3>
          <button
            style="
              background: transparent;
              border: none;
              color: rgba(255, 255, 255, 0.7);
              cursor: pointer;
              font-size: 20px;
              padding: 4px 8px;
              transition: all 0.2s;
            "
            @click="showOriginalDialog = false"
            @mouseenter="($event.currentTarget as HTMLElement).style.color = 'white'"
            @mouseleave="($event.currentTarget as HTMLElement).style.color = 'rgba(255, 255, 255, 0.7)'"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <!-- 内容区域 -->
        <div
          style="
            background: #1a1a1a;
            border-radius: 8px;
            padding: 16px;
            color: #e0e0e0;
            font-size: 14px;
            line-height: 1.6;
            overflow-y: auto;
            flex: 1;
            white-space: pre-wrap;
            word-wrap: break-word;
          "
        >
          {{ originalGreetingContent }}
        </div>

        <!-- 底部按钮 -->
        <div style="display: flex; justify-content: flex-end; margin-top: 16px">
          <button
            style="
              padding: 10px 24px;
              background: white;
              border: none;
              border-radius: 6px;
              color: #1e3a8a;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            "
            @click="showOriginalDialog = false"
            @mouseenter="($event.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'"
            @mouseleave="($event.currentTarget as HTMLElement).style.transform = 'translateY(0)'"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 生成代码对话框 -->
    <div
      v-if="showCodeDialog"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
      "
      @click="closeCodeDialog"
    >
      <div
        style="
          background: #2a2a2a;
          border-radius: 15px;
          max-width: 800px;
          width: 90%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        "
        @click.stop
      >
        <div
          style="
            padding: 20px;
            border-bottom: 1px solid #3a3a3a;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <h3 style="color: #e0e0e0; font-size: 18px; margin: 0; display: flex; align-items: center; gap: 10px">
            <i class="fa-solid fa-code"></i>
            生成的前端代码
          </h3>
          <button
            style="
              background: transparent;
              border: none;
              color: #888;
              font-size: 20px;
              cursor: pointer;
              padding: 5px 10px;
              transition: color 0.2s ease;
            "
            @click="closeCodeDialog"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div style="padding: 20px; overflow-y: auto; flex: 1">
          <div
            style="
              background: #1a1a1a;
              border: 1px solid #3a3a3a;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 20px;
              color: #e0e0e0;
            "
          >
            <p style="margin-bottom: 10px; font-weight: 600"><strong>使用方法：</strong></p>
            <ol style="margin-left: 20px; color: #aaa; line-height: 1.8">
              <li>复制下面的代码</li>
              <li>
                在消息中输入占位符（如
                <code style="background: #2a2a2a; padding: 2px 6px; border-radius: 4px; color: #667eea">【开场白】</code
                >）
              </li>
              <li>创建正则脚本，将占位符替换为此代码</li>
            </ol>
          </div>
          <div
            style="
              background: #1a1a1a;
              border: 1px solid #3a3a3a;
              border-radius: 8px;
              padding: 15px;
              max-height: 400px;
              overflow-y: auto;
              margin-bottom: 15px;
            "
          >
            <pre
              style="margin: 0; white-space: pre-wrap; word-wrap: break-word"
            ><code style="color: #e0e0e0; font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; line-height: 1.6">{{ generatedCode }}</code></pre>
          </div>
          <button
            style="
              width: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            "
            @click="copyCode"
          >
            <i class="fa-solid fa-copy"></i>
            {{ copyButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { klona } from 'klona';
import { storeToRefs } from 'pinia';
import toastr from 'toastr';
import { onMounted, ref } from 'vue';
import { z } from 'zod';
import { useSettingsStore } from '../settings';
import { copyToClipboard } from '../utils';
import { normalizeApiEndpoint } from '../utils/api';
import AIGenerateDialog from './AIGenerateDialog.vue';
import AIModifyDialog from './AIModifyDialog.vue';

// 数据结构定义
const GreetingConfig = z.object({
  icon: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
});

type GreetingConfig = z.infer<typeof GreetingConfig>;

// UI配置（保存生成的HTML代码）
const UIConfig = z.object({
  customHtml: z.string().default(''), // AI生成的完整HTML代码
});

type UIConfig = z.infer<typeof UIConfig>;

// 获取settings store
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

// 响应式数据
const greetings = ref<GreetingConfig[]>([]);
const uiConfig = ref<UIConfig>(UIConfig.parse({})); // UI配置
const showCodeDialog = ref(false);
const generatedCode = ref('');
const copyButtonText = ref('复制代码');
const showAiGenerateDialog = ref(false);
const showAiEditDialog = ref(false);
const isGeneratingAi = ref(false);
const isEditingAi = ref(false);
const currentEditingIndex = ref(-1);
const showHelp = ref(false); // 默认折叠帮助信息
const previewHtml = ref('');
const currentCharacter = ref<any>(null);
const showOriginalDialog = ref(false);
const originalGreetingContent = ref('');
const showAiStyleDialog = ref(false); // 显示AI生成样式对话框
const isGeneratingStyle = ref(false); // 正在生成样式

// 获取当前角色卡
function getCurrentCharacter() {
  try {
    const char = getCharData('current');
    if (char) {
      console.log('找到角色卡:', char.name);
    } else {
      console.log('未找到角色卡');
    }
    return char;
  } catch (error) {
    console.error('获取角色卡失败:', error);
    return null;
  }
}

// 加载配置
async function loadConfig() {
  try {
    const character = getCurrentCharacter();
    if (!character) {
      greetings.value = [];
      console.log('未找到角色卡');
      return;
    }

    console.log('当前角色卡:', character.name);

    // 获取角色卡的所有开场白
    const allGreetings = [character.first_mes, ...(character.data?.alternate_greetings || [])];
    console.log('找到', allGreetings.length, '个开场白');

    // 从角色卡变量加载配置
    const savedConfig = getVariables({ type: 'character' });
    const configs = savedConfig?.greetings_config || [];
    const savedUIConfig = savedConfig?.ui_config;

    // 初始化开场白配置
    greetings.value = allGreetings.map((_, index) => {
      const saved = configs[index];
      return GreetingConfig.parse(saved || {});
    });

    // 初始化UI配置
    uiConfig.value = UIConfig.parse(savedUIConfig || {});

    console.log('开场白配置已加载:', greetings.value.length, '个');
    console.log('UI配置已加载, 自定义HTML长度:', uiConfig.value.customHtml.length);
    currentCharacter.value = character;
    updatePreview();
  } catch (error) {
    console.error('加载配置失败:', error);
    toastr.error('加载配置失败: ' + (error as Error).message);
  }
}

// 保存配置
function saveConfig() {
  try {
    replaceVariables(
      {
        greetings_config: klona(greetings.value),
        ui_config: klona(uiConfig.value),
      },
      { type: 'character' },
    );
    updatePreview(); // 保存后更新预览
  } catch (error) {
    console.error('保存配置失败:', error);
  }
}

// 清空所有开场白配置（不影响角色卡原文）
function clearAllConfig() {
  if (!confirm(`确定要清空所有开场白的配置吗？\n\n当前共有 ${greetings.value.length} 个开场白，清空后所有图标、标题、描述都将恢复默认。\n\n⚠️ 此操作不会删除角色卡的开场白原文，只清空显示配置！`)) {
    return;
  }

  try {
    // 重置所有开场白配置为默认值
    greetings.value = greetings.value.map(() => {
      return GreetingConfig.parse({
        icon: '',
        title: '',
        description: '',
      });
    });

    // 清空UI配置
    uiConfig.value.customHtml = '';

    // 保存配置
    saveConfig();
    
    // 强制更新预览（切换到默认样式）
    updatePreview();
    
    toastr.success('已清空所有开场白配置，预览已恢复默认样式');
  } catch (error) {
    console.error('清空配置失败:', error);
    toastr.error('清空失败: ' + (error as Error).message);
  }
}

// 查看开场白原文
function viewOriginalGreeting(index: number) {
  try {
    const character = getCurrentCharacter();
    if (!character) {
      toastr.error('未找到角色卡');
      return;
    }

    const allGreetings = [character.first_mes, ...(character.data?.alternate_greetings || [])];
    const greetingContent = allGreetings[index] || '';

    if (!greetingContent.trim()) {
      toastr.warning('该开场白内容为空');
      return;
    }

    originalGreetingContent.value = greetingContent;
    showOriginalDialog.value = true;
  } catch (error) {
    console.error('查看开场白失败:', error);
    toastr.error('查看开场白失败: ' + (error as Error).message);
  }
}

// 关闭AI生成对话框
function closeAiGenerateDialog() {
  if (!isGeneratingAi.value) {
    showAiGenerateDialog.value = false;
  }
}

// AI生成描述
async function generateDescription(index: number) {
  currentEditingIndex.value = index;

  // 显示进度对话框并开始生成
  showAiGenerateDialog.value = true;
  isGeneratingAi.value = true;

  const idx = index;
  if (idx < 0 || idx >= greetings.value.length) {
    isGeneratingAi.value = false;
    showAiGenerateDialog.value = false;
    return;
  }

  try {
    // 检查 API 配置
    if (!settings.value.api_endpoint || !settings.value.api_key) {
      toastr.error('请先在设置页面配置 API 端点和 API Key');
      showAiGenerateDialog.value = false;
      isGeneratingAi.value = false;
      return;
    }

    // 获取开场白内容
    const character = getCurrentCharacter();
    if (!character) {
      toastr.error('未找到角色卡');
      showAiGenerateDialog.value = false;
      isGeneratingAi.value = false;
      return;
    }

    const allGreetings = [character.first_mes, ...(character.data?.alternate_greetings || [])];
    const greetingContent = allGreetings[idx] || '';

    if (!greetingContent.trim()) {
      toastr.warning('该开场白内容为空');
      showAiGenerateDialog.value = false;
      isGeneratingAi.value = false;
      return;
    }

    // 构建提示词
    const systemPrompt = `你是一个专业的文案编辑助手，擅长为小说、游戏等创作简洁吸引人的开场白描述。

要求：
1. 描述要简洁有力，控制在 20-50 字以内
2. 突出开场白的核心场景、情感或冲突点
3. 使用吸引人的语言，让读者产生阅读兴趣
4. 不要使用"这是一个..."、"在这个开场白中..."等冗余表述
5. 直接输出描述文本，不要添加引号或其他标记`;

    const userPrompt = `请为以下开场白内容生成一个简洁吸引人的描述：

${greetingContent}

直接输出描述文本：`;

    console.log('开始 AI 生成描述...');

    // 规范化 API 端点
    const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint, '/chat/completions');
    console.log('🔗 规范化后的端点:', apiUrl);

    // 调用 AI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.value.api_key}`,
      },
      body: JSON.stringify({
        model: settings.value.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: settings.value.temperature,
        max_tokens: settings.value.max_tokens,
        top_p: settings.value.top_p,
        presence_penalty: settings.value.presence_penalty,
        frequency_penalty: settings.value.frequency_penalty,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();

    console.log('✅ [生成] API 完整响应:', result);

    let aiDescription = result.choices?.[0]?.message?.content?.trim() || '';

    console.log('📝 [生成] AI 原始返回:', aiDescription);

    if (!aiDescription) {
      console.error('❌ [生成] AI 响应为空');
      console.error('完整响应:', JSON.stringify(result, null, 2));

      // 检查是否有错误信息
      if (result.error) {
        throw new Error(`API 错误: ${result.error.message || JSON.stringify(result.error)}`);
      }

      // 检查响应格式
      if (!result.choices || result.choices.length === 0) {
        throw new Error('API 返回格式错误：没有 choices 字段，请检查 API 端点和模型');
      }

      throw new Error('AI 未返回有效内容，请检查：\n1. API Key 是否有效\n2. 模型是否可用\n3. 账户余额');
    }

    // 清理AI返回的内容
    // 移除可能的引号包裹
    aiDescription = aiDescription.replace(/^["']|["']$/g, '');
    // 移除可能的markdown代码块标记
    aiDescription = aiDescription.replace(/^```.*?\n?|```$/g, '').trim();

    if (!aiDescription) {
      throw new Error('AI 返回内容清理后为空');
    }

    console.log('✨ [生成] AI 清理后的描述:', aiDescription);

    // 更新描述
    greetings.value[idx].description = aiDescription;
    saveConfig();

    toastr.success('描述生成成功');
    showAiGenerateDialog.value = false;
  } catch (error) {
    console.error('❌ [生成] AI 生成失败:', error);
    const errorMsg = '生成失败: ' + (error as Error).message;
    toastr.error(errorMsg);
    // 延长显示时间
    setTimeout(() => {}, 5000);
  } finally {
    isGeneratingAi.value = false;
  }
}

// AI编辑描述
function editDescription(index: number) {
  currentEditingIndex.value = index;
  showAiEditDialog.value = true;
}

// 确认AI编辑描述
async function confirmEditDescription(requirement: string) {
  const index = currentEditingIndex.value;
  if (index < 0 || index >= greetings.value.length) return;

  isEditingAi.value = true;

  try {
    // 检查 API 配置
    if (!settings.value.api_endpoint || !settings.value.api_key) {
      toastr.error('请先在设置页面配置 API 端点和 API Key');
      showAiEditDialog.value = false;
      isEditingAi.value = false;
      return;
    }

    const currentDesc = greetings.value[index].description;

    if (!currentDesc.trim()) {
      toastr.warning('当前描述为空，请先使用 AI 生成');
      showAiEditDialog.value = false;
      isEditingAi.value = false;
      return;
    }

    // 构建提示词
    const systemPrompt = `你是一个专业的文案编辑助手，擅长根据用户需求修改文案。

要求：
1. 根据用户的修改需求调整描述
2. 保持描述简洁有力，控制在 20-50 字以内
3. 保留原描述的核心信息，只进行必要的调整
4. 直接输出修改后的描述文本，不要添加引号或其他标记`;

    const userPrompt = `当前描述：
${currentDesc}

修改需求：
${requirement}

请输出修改后的描述：`;

    console.log('开始 AI 编辑描述...');

    // 规范化 API 端点
    const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint, '/chat/completions');
    console.log('🔗 规范化后的端点:', apiUrl);

    // 调用 AI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.value.api_key}`,
      },
      body: JSON.stringify({
        model: settings.value.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: settings.value.temperature,
        max_tokens: settings.value.max_tokens,
        top_p: settings.value.top_p,
        presence_penalty: settings.value.presence_penalty,
        frequency_penalty: settings.value.frequency_penalty,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();

    console.log('✅ [编辑] API 完整响应:', result);

    let aiDescription = result.choices?.[0]?.message?.content?.trim() || '';

    console.log('📝 [编辑] AI 原始返回:', aiDescription);

    if (!aiDescription) {
      console.error('❌ [编辑] AI 响应为空');
      console.error('完整响应:', JSON.stringify(result, null, 2));

      // 检查是否有错误信息
      if (result.error) {
        throw new Error(`API 错误: ${result.error.message || JSON.stringify(result.error)}`);
      }

      // 检查响应格式
      if (!result.choices || result.choices.length === 0) {
        throw new Error('API 返回格式错误：没有 choices 字段，请检查 API 端点和模型');
      }

      throw new Error('AI 未返回有效内容，请检查：\n1. API Key 是否有效\n2. 模型是否可用\n3. 账户余额');
    }

    // 清理AI返回的内容
    // 移除可能的引号包裹
    aiDescription = aiDescription.replace(/^["']|["']$/g, '');
    // 移除可能的markdown代码块标记
    aiDescription = aiDescription.replace(/^```.*?\n?|```$/g, '').trim();

    if (!aiDescription) {
      throw new Error('AI 返回内容清理后为空');
    }

    console.log('✨ [编辑] AI 清理后的描述:', aiDescription);

    // 更新描述
    greetings.value[index].description = aiDescription;
    saveConfig();

    toastr.success('描述修改成功');
    showAiEditDialog.value = false;
  } catch (error) {
    console.error('❌ [编辑] AI 编辑失败:', error);
    const errorMsg = '编辑失败: ' + (error as Error).message;
    toastr.error(errorMsg);
  } finally {
    isEditingAi.value = false;
  }
}

// AI生成界面样式
async function generateStyleWithAI(styleDescription: string) {
  if (!styleDescription.trim()) {
    toastr.warning('请输入界面风格描述');
    return;
  }

  // 检查 API 配置
  if (!settings.value.api_endpoint || !settings.value.api_key) {
    toastr.error('请先在设置页面配置 API 端点和 API Key');
    showAiStyleDialog.value = false;
    return;
  }

  isGeneratingStyle.value = true;

  try {
    // 生成卡片列表HTML
    const cards = greetings.value
      .map((g, index) => {
        const icon = g.icon || '💬';
        const title = g.title || (index === 0 ? '默认开场白' : `开场白 ${index}`);
        const desc = g.description || '点击开始对话';
        const badge = index === 0 ? '默认' : String(index).padStart(2, '0');
        return '      <' + 'div class="scene-card" onclick="switchGreeting(' + index + ')">' +
          '<' + 'div class="card-badge">' + badge + '<' + '/div>' +
          '<' + 'div class="card-icon">' + icon + '<' + '/div>' +
          '<' + 'div class="card-title">' + title + '<' + '/div>' +
          '<' + 'div class="card-desc">' + desc + '<' + '/div>' +
          '<' + '/div>';
      })
      .join('\n');

    const systemPrompt = `你是一个专业的前端开发专家，擅长创建美观的HTML/CSS界面。

任务：根据用户的风格描述，生成一个完整的HTML页面代码，用于展示开场白选择界面。

要求：
1. 包含完整的 HTML 结构（` + '<' + `html>、` + '<' + `head>、` + '<' + `body>）
2. 在 ` + '<' + `head> 中包含 Font Awesome 图标库：` + '<' + `link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
3. 所有样式写在 ` + '<' + `style> 标签内，不要使用外部 CSS 文件
4. 必须包含以下HTML结构（保持类名不变）：
   - body（页面背景）
   - .container（主容器）
   - .header（标题区域）
     - h1（主标题）
     - p（副标题）
   - .scene-grid（卡片网格容器）
   - .scene-card（单个卡片，需要 onclick 属性）
   - .card-badge（序号徽章）
   - .card-icon（图标）
   - .card-title（卡片标题）
   - .card-desc（卡片描述）
   - .loading（加载提示）
5. 必须包含 switchGreeting(id) 函数的完整 JavaScript 代码
6. 根据用户的风格描述设计颜色、字体、布局、动画等样式
7. 确保响应式设计，在不同屏幕尺寸下都好看
8. 直接输出完整的HTML代码，不要添加任何解释文字或markdown标记`;

    // 提供完整的 switchGreeting 函数代码
    const switchGreetingCode = `async function switchGreeting(id) {
      try {
        const loading = document.getElementById("loading");
        const mainContainer = document.getElementById("mainContainer");
        if (loading) loading.classList.add("active");
        if (mainContainer) mainContainer.style.display = "none";
        
        if (typeof window.getChatMessages !== "function") {
          alert("请在酒馆环境中使用此功能");
          if (loading) loading.classList.remove("active");
          if (mainContainer) mainContainer.style.display = "block";
          return;
        }
        
        const messages = await window.getChatMessages(0, { include_swipe: true });
        if (!messages || messages.length === 0) {
          alert("未找到消息");
          if (loading) loading.classList.remove("active");
          if (mainContainer) mainContainer.style.display = "block";
          return;
        }
        
        const content = messages[0].swipes[id];
        if (!content) {
          alert("该开场白暂无内容");
          if (loading) loading.classList.remove("active");
          if (mainContainer) mainContainer.style.display = "block";
          return;
        }
        
        await window.setChatMessage(content, 0, { swipe_id: id, refresh: "display_and_render_current" });
        
        setTimeout(() => {
          if (loading) loading.classList.remove("active");
          if (mainContainer) mainContainer.style.display = "block";
        }, 500);
      } catch (err) {
        console.error("切换失败:", err);
        alert("切换失败: " + err.message);
        const loading = document.getElementById("loading");
        const mainContainer = document.getElementById("mainContainer");
        if (loading) loading.classList.remove("active");
        if (mainContainer) mainContainer.style.display = "block";
      }
    }`;

    const userPrompt = `风格描述：${styleDescription}

以下是需要展示的开场白卡片（每个卡片需要有 onclick="switchGreeting(序号)" 属性）：
${cards}

【重要】必须在 ` + '<' + `/body> 前添加以下 JavaScript 代码：
` + '<' + `script>
${switchGreetingCode}
` + '<' + `/script>

【重要】每个 .scene-card 必须添加 onclick="switchGreeting(序号)" 属性，例如：
` + '<' + `div class="scene-card" onclick="switchGreeting(0)">

【重要】必须包含一个 loading 提示元素：
` + '<' + `div class="loading" id="loading" style="display: none; text-align: center; padding: 40px;">
  ` + '<' + `p style="color: #888; font-size: 18px;">切换中...` + '<' + `/p>
` + '<' + `/div>

请生成完整的HTML代码，确保包含以上所有要求：`;

    console.log('开始 AI 生成界面样式...');

    // 规范化 API 端点
    const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint, '/chat/completions');
    console.log('🔗 规范化后的端点:', apiUrl);

    // 调用 AI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.value.api_key}`,
      },
      body: JSON.stringify({
        model: settings.value.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: settings.value.temperature,
        max_tokens: settings.value.max_tokens,
        top_p: settings.value.top_p,
        presence_penalty: settings.value.presence_penalty,
        frequency_penalty: settings.value.frequency_penalty,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();

    console.log('✅ [样式生成] API 完整响应:', result);

    let generatedHtml = result.choices?.[0]?.message?.content?.trim() || '';

    console.log('📝 [样式生成] AI 原始返回:', generatedHtml ? generatedHtml.substring(0, 500) : '(空)');

    if (!generatedHtml) {
      console.error('❌ [样式生成] AI 响应为空');
      console.error('完整响应:', JSON.stringify(result, null, 2));

      // 检查是否有错误信息
      if (result.error) {
        throw new Error(`API 错误: ${result.error.message || JSON.stringify(result.error)}`);
      }

      throw new Error('AI 未返回有效内容，请检查 API 配置和模型是否支持该任务');
    }

    // 清理AI返回的内容
    // 移除可能的markdown代码块标记
    generatedHtml = generatedHtml.replace(/^```html\n?|^```\n?|```$/gm, '').trim();

    if (!generatedHtml) {
      throw new Error('AI 返回内容清理后为空');
    }

    console.log('✨ [样式生成] AI 清理后的HTML长度:', generatedHtml.length);

    // 保存生成的HTML
    uiConfig.value.customHtml = generatedHtml;
    saveConfig();

    toastr.success('界面样式生成成功！请查看右侧预览');
    showAiStyleDialog.value = false;

    // 更新预览
    updatePreview();
  } catch (error) {
    console.error('❌ [样式生成] AI 生成失败:', error);
    toastr.error('生成失败: ' + (error as Error).message, '', { timeOut: 5000 });
  } finally {
    isGeneratingStyle.value = false;
  }
}

// 生成前端代码
async function generateFrontendCode() {
  const character = getCurrentCharacter();
  if (!character) {
    toastr.warning('未找到角色卡');
    return;
  }

  // 如果有AI生成的自定义HTML，直接使用
  if (uiConfig.value.customHtml && uiConfig.value.customHtml.trim()) {
    generatedCode.value = uiConfig.value.customHtml;
    showCodeDialog.value = true;
    return;
  }

  // 否则使用默认模板生成
  // 生成卡片列表
  const cards = greetings.value
    .map((g, index) => {
      const icon = g.icon || '<' + 'i class="fa-solid fa-comment"><' + '/i>';
      const title = g.title || (index === 0 ? '默认开场白' : `开场白 ${index}`);
      const desc = g.description || '点击开始对话';
      const badge = index === 0 ? '默认' : String(index).padStart(2, '0');

      return '        <' + 'div class="scene-card" onclick="switchGreeting(' + index + ')">' +
        '<' + 'div class="card-badge">' + badge + '<' + '/div>' +
        '<' + 'div class="card-icon">' + icon + '<' + '/div>' +
        '<' + 'div class="card-title">' + title + '<' + '/div>' +
        '<' + 'div class="card-desc">' + desc + '<' + '/div>' +
        '<' + '/div>';
    })
    .join('\n\n');

  // 生成默认样式的HTML
  const htmlCode = [
    '<' + 'html>',
    '<' + 'head>',
    '  <' + 'meta charset="UTF-8">',
    '  <' + 'link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">',
    '  <' + 'style>',
    '    * { margin: 0; padding: 0; box-sizing: border-box; }',
    '    body {',
    '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
    '      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
    '      padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center;',
    '    }',
    '    .container { max-width: 900px; width: 100%; background: rgba(255, 255, 255, 0.95);',
    '      border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }',
    '    .header { text-align: center; margin-bottom: 40px; }',
    '    .header h1 { font-size: 32px; color: #333; margin-bottom: 10px; }',
    '    .header p { color: #666; font-size: 16px; }',
    '    .scene-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }',
    '    .scene-card { background: white; border: 2px solid #e0e0e0; border-radius: 15px;',
    '      padding: 25px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; }',
    '    .scene-card:hover { transform: translateY(-5px); border-color: #667eea;',
    '      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }',
    '    .card-badge { position: absolute; top: 10px; right: 10px; background: #667eea;',
    '      color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }',
    '    .card-icon { font-size: 48px; margin-bottom: 15px; text-align: center; }',
    '    .card-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 10px; }',
    '    .card-desc { font-size: 14px; color: #666; line-height: 1.5; }',
    '    .loading { display: none; text-align: center; padding: 40px; }',
    '    .loading.active { display: block; }',
    '  <' + '/style>',
    '<' + '/head>',
    '<' + 'body>',
    '  <' + 'div class="container" id="mainContainer">',
    '    <' + 'div class="header">',
    '      <' + 'h1>开场白选择<' + '/h1>',
    '      <' + 'p>选择一个场景开始你的故事<' + '/p>',
    '    <' + '/div>',
    '    <' + 'div class="scene-grid" id="sceneGrid">',
    cards,
      '    <' + '/div>',
      '  <' + '/div>',
      '  <' + 'div class="loading" id="loading"><' + 'p>切换中...<' + '/p><' + '/div>',
      '  <' + 'script>',
    '    async function switchGreeting(id) {',
    '      try {',
    '        const loading = document.getElementById("loading");',
    '        const mainContainer = document.getElementById("mainContainer");',
    '        loading.classList.add("active"); mainContainer.style.display = "none";',
    '        const messages = await getChatMessages(0, { include_swipe: true });',
    '        if (!messages || messages.length === 0) { alert("未找到消息"); return; }',
    '        const content = messages[0].swipes[id];',
    '        if (!content) { alert("该开场白暂无内容"); return; }',
    '        await setChatMessage(content, 0, { swipe_id: id, refresh: "display_and_render_current" });',
    '        setTimeout(() => { loading.classList.remove("active"); mainContainer.style.display = "block"; }, 500);',
    '      } catch (err) { console.error("切换失败:", err); alert("切换失败: " + err.message); }',
    '    }',
    '  </' + 'script>',
    '<' + '/body>',
    '<' + '/html>',
  ].join('\n');

  // 修改生成的代码，添加API检查
  const fixedHtmlCode = htmlCode
    .replace(
      'const messages = await getChatMessages',
      'if (typeof window.getChatMessages !== "function") { alert("请在酒馆环境中使用"); loading.classList.remove("active"); mainContainer.style.display = "block"; return; }\n        const messages = await window.getChatMessages',
    )
    .replace('await setChatMessage', 'await window.setChatMessage')
    .replace(
      'alert("未找到消息"); return;',
      'alert("未找到消息"); loading.classList.remove("active"); mainContainer.style.display = "block"; return;',
    )
    .replace(
      'alert("该开场白暂无内容"); return;',
      'alert("该开场白暂无内容"); loading.classList.remove("active"); mainContainer.style.display = "block"; return;',
    );

  generatedCode.value = fixedHtmlCode;

  showCodeDialog.value = true;
  copyButtonText.value = '复制代码';
}

// 复制代码
async function copyCode() {
  const success = await copyToClipboard(generatedCode.value, '✅ 代码已复制到剪贴板');
  if (success) {
    copyButtonText.value = '✓ 已复制';
    setTimeout(() => {
      copyButtonText.value = '复制代码';
    }, 2000);
  }
}

// 关闭代码对话框
function closeCodeDialog() {
  showCodeDialog.value = false;
}

// 更新预览（仅展示样式，不调用API）
function updatePreview() {
  if (greetings.value.length === 0) {
    previewHtml.value = '';
    return;
  }

  const character = getCurrentCharacter();
  const characterName = character?.name || '角色';

  // 如果有AI生成的自定义HTML，使用它
  if (uiConfig.value.customHtml && uiConfig.value.customHtml.trim()) {
    console.log('🎨 使用AI生成的自定义HTML预览');
    
    try {
      // 生成卡片HTML
      const cardsHtml = greetings.value
        .map((g, index) => {
          const icon = g.icon || '💬';
          const title = g.title || (index === 0 ? '默认开场白' : `开场白 ${index}`);
          const desc = g.description || '点击开始对话';
          const badge = index === 0 ? '默认' : String(index).padStart(2, '0');
          
          return `
        <div class="scene-card">
          <div class="card-badge">${badge}</div>
          <div class="card-icon">${icon}</div>
          <div class="card-title">${title}</div>
          <div class="card-desc">${desc}</div>
        </div>`;
        })
        .join('\n');
      
      // 查找 scene-grid 容器并替换内容
      let customHtml = uiConfig.value.customHtml;
      
      // 尝试查找并替换 scene-grid 的内容
      const sceneGridPattern = /(<div[^>]*class="scene-grid"[^>]*>)([\s\S]*?)(<\/div>)/i;
      const match = customHtml.match(sceneGridPattern);
      
      if (match) {
        // 替换 scene-grid 内的内容
        customHtml = customHtml.replace(sceneGridPattern, `$1\n${cardsHtml}\n      $3`);
        previewHtml.value = customHtml;
        console.log('✅ 自定义HTML预览更新成功（字符串替换）');
        return;
      } else {
        console.warn('⚠️ 自定义HTML中未找到 .scene-grid 容器，使用原始HTML');
        previewHtml.value = uiConfig.value.customHtml;
        return;
      }
    } catch (error) {
      console.error('❌ 解析自定义HTML失败:', error);
      toastr.warning('自定义HTML解析失败，使用默认样式');
      // 继续使用默认样式
    }
  }

  console.log('📝 使用默认样式预览');

  // 生成卡片列表 - 预览模式只展示样式
  const cards = greetings.value
    .map((g, index) => {
      const icon = g.icon || '<' + 'i class="fa-solid fa-comment"><' + '/i>';
      const title = g.title || (index === 0 ? '默认开场白' : `开场白 ${index}`);
      const desc = g.description || '点击开始对话';
      const badge = index === 0 ? '默认' : String(index).padStart(2, '0');

      return '        <' + 'div class="scene-card">' +
        '<' + 'div class="card-badge">' + badge + '<' + '/div>' +
        '<' + 'div class="card-icon">' + icon + '<' + '/div>' +
        '<' + 'div class="card-title">' + title + '<' + '/div>' +
        '<' + 'div class="card-desc">' + desc + '<' + '/div>' +
        '<' + '/div>';
    })
    .join('\n\n');

  // 生成预览HTML（纯样式展示，无功能）
  const htmlCode = [
    '<' + 'html>',
    '<' + 'head>',
    '  <' + 'meta charset="UTF-8">',
    '  <' + 'link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">',
    '  <' + 'style>',
    '    * { margin: 0; padding: 0; box-sizing: border-box; }',
    '    body {',
    '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
    '      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
    '      padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center;',
    '    }',
    '    .container { max-width: 900px; width: 100%; background: rgba(255, 255, 255, 0.95);',
    '      border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }',
    '    .header { text-align: center; margin-bottom: 40px; }',
    '    .header h1 { font-size: 32px; color: #333; margin-bottom: 10px; }',
    '    .header p { color: #666; font-size: 16px; }',
    '    .scene-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }',
    '    .scene-card { background: white; border: 2px solid #e0e0e0; border-radius: 15px;',
    '      padding: 25px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden; }',
    '    .scene-card:hover { transform: translateY(-5px); border-color: #667eea;',
    '      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); }',
    '    .scene-card:active { transform: translateY(-2px); }',
    '    .card-badge { position: absolute; top: 10px; right: 10px; background: #667eea;',
    '      color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }',
    '    .card-icon { font-size: 48px; margin-bottom: 15px; text-align: center; }',
    '    .card-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 10px; }',
    '    .card-desc { font-size: 14px; color: #666; line-height: 1.5; }',
    '  <' + '/style>',
    '<' + '/head>',
    '<' + 'body>',
    '  <' + 'div class="container">',
    '    <' + 'div class="header">',
    `      <` + `h1>${characterName} 的开场白<` + '/h1>',
    '      <' + 'p>选择一个场景开始你的故事<' + '/p>',
    '    <' + '/div>',
    '    <' + 'div class="scene-grid">',
    cards,
    '    <' + '/div>',
    '  <' + '/div>',
    '<' + '/body>',
    '<' + '/html>',
  ].join('\n');

  previewHtml.value = htmlCode;
}

// 在新窗口打开预览
function openPreviewInNewWindow() {
  if (!previewHtml.value) {
    toastr.error('没有可预览的内容');
    return;
  }

  const character = getCurrentCharacter();
  const windowTitle = character ? `${character.name} - 开场白选择` : '开场白预览';

  // 打开新窗口
  const newWindow = window.open('', '_blank', 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
  if (newWindow) {
    newWindow.document.write(previewHtml.value);
    newWindow.document.close();
    newWindow.document.title = windowTitle;
    toastr.success('已在新窗口打开预览');
  } else {
    toastr.error('无法打开新窗口，请检查浏览器弹窗设置');
  }
}

// 下载为STScript JSON
async function downloadAsJson() {
  try {
    await generateFrontendCode();

    if (!generatedCode.value) {
      toastr.error('请先生成代码');
      return;
    }

    const character = getCurrentCharacter();
    const characterName = character?.name || '角色';

    // 生成UUID
    const uuid = crypto.randomUUID();

    // 创建STScript JSON对象
    const stscriptJson = {
      id: uuid,
      scriptName: `${characterName}-开场白前端`,
      disabled: false,
      runOnEdit: true,
      findRegex: '/【开场白】/g',
      replaceString: '```html\n' + generatedCode.value + '\n```',
      trimStrings: [],
      placement: [1, 2],
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
      markdownOnly: true,
      promptOnly: false,
    };

    // 转换为JSON字符串
    const jsonString = JSON.stringify(stscriptJson, null, 4);

    // 创建Blob
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${characterName}-开场白前端.json`;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toastr.success('已生成并下载JSON文件');
  } catch (error) {
    console.error('下载失败:', error);
    toastr.error('下载失败: ' + (error as Error).message);
  }
}

// 组件挂载时加载配置
onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
