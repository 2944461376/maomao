<template>
  <div class="tools-tab" style="padding: 25px !important; background: #1a1a1a !important">
    <!-- 反八股工具 -->
    <div class="tool-section">
      <div
        class="section-header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(
            135deg,
            rgba(30, 30, 30, 0.95) 0%,
            rgba(38, 38, 38, 0.9) 50%,
            rgba(30, 30, 30, 0.95) 100%
          );
          backdrop-filter: blur(12px);
          border-radius: 12px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        "
        @click="toggleToolExpanded('antiCliche')"
        @mouseenter="(e: any) => (e.currentTarget.style.transform = 'translateY(-1px)')"
        @mouseleave="(e: any) => (e.currentTarget.style.transform = 'translateY(0)')"
      >
        <h4
          style="
            margin: 0;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          "
        >
          <i class="fa-solid fa-broom" style="color: #ff6b6b; font-size: 18px"></i>
          反八股工具
        </h4>
        <i
          :class="isToolExpanded('antiCliche') ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
          style="color: #ccc; transition: transform 0.3s ease; font-size: 14px"
        ></i>
      </div>

      <div v-if="isToolExpanded('antiCliche')" class="tool-content">
        <div class="tool-instructions">
          <p style="margin: 0 0 8px 0; color: #ccc; font-size: 12px">
            <i class="fa-solid fa-info-circle" style="margin-right: 6px; color: #17a2b8"></i>
            角色卡/世界书/开场白八股清理工具，<strong style="color: #10b981">适度清理</strong>明显八股，保持原文信息量。
          </p>
          <p
            style="
              margin: 0 0 8px 0;
              color: #ffa500;
              font-size: 11px;
              background: #1a1a1a;
              padding: 6px;
              border-radius: 4px;
              border-left: 3px solid #ffa500;
            "
          >
            🎯
            <strong>清理重点</strong
            >：模糊词（一丝、似乎）、动物化比喻（像小兽）、否定句式（不是而是）、极端情绪、夸张修辞
          </p>
          <p
            style="
              margin: 0;
              color: #10b981;
              font-size: 11px;
              background: #1a1a1a;
              padding: 6px;
              border-radius: 4px;
              border-left: 3px solid #10b981;
            "
          >
            ✅ <strong>保持内容</strong>：核心设定、对话内容、具体动作、重要信息 - 输入几段输出几段！
          </p>
        </div>

        <div class="form-group" style="margin: 15px 0">
          <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 13px; font-weight: 500">
            输入文本：
          </label>
          <textarea
            v-model="antiClicheInput"
            placeholder="请输入需要清理的文本..."
            style="
              width: 100%;
              height: 120px;
              padding: 12px;
              background: #2a2a2a;
              border: 1px solid #3a3a3a;
              border-radius: 6px;
              color: #e0e0e0;
              font-size: 13px;
              resize: vertical;
              font-family: inherit;
            "
          ></textarea>
        </div>

        <!-- 流式传输开关 -->
        <div class="form-group" style="margin: 15px 0">
          <label style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 13px; cursor: pointer">
            <input v-model="enableAntiClicheStreaming" type="checkbox" style="cursor: pointer" />
            启用流式传输（可查看清理进度）
          </label>
        </div>

        <!-- 进度条 -->
        <div
          v-if="isProcessingAntiCliche && antiClicheProgressPercent > 0"
          class="progress-bar-container"
          style="margin: 15px 0"
        >
          <div
            class="progress-bar"
            style="
              width: 100%;
              height: 8px;
              background: #2a2a2a;
              border-radius: 4px;
              overflow: hidden;
              position: relative;
            "
          >
            <div
              class="progress-fill"
              :style="{
                width: antiClicheProgressPercent + '%',
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                backgroundSize: '200% 100%',
                animation: enableAntiClicheStreaming ? 'progress-slide 2s linear infinite' : 'none',
                transition: 'width 0.3s ease',
              }"
            ></div>
          </div>
          <div style="text-align: center; margin-top: 8px; color: #667eea; font-size: 12px; font-weight: 500">
            清理中... {{ antiClicheProgressPercent.toFixed(0) }}%
          </div>
        </div>

        <div class="button-group" style="display: flex; gap: 12px; margin-bottom: 20px">
          <button
            class="process-button"
            :disabled="isProcessingAntiCliche || !antiClicheInput.trim()"
            style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);
              position: relative;
              overflow: hidden;
            "
            @click="handleAntiClicheProcess"
          >
            <div
              style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              "
              class="shimmer-effect"
            ></div>
            <i class="fa-solid fa-magic" style="font-size: 14px; margin-right: 6px"></i>
            {{ isProcessingAntiCliche ? '处理中...' : '开始清理' }}
          </button>

          <button
            class="clear-button"
            style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 3px 12px rgba(255, 107, 107, 0.3);
              position: relative;
              overflow: hidden;
            "
            @click="clearAntiClicheForm"
          >
            <div
              style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              "
              class="shimmer-effect"
            ></div>
            <i class="fa-solid fa-trash" style="font-size: 14px; margin-right: 6px"></i>
            清空
          </button>
        </div>

        <!-- 输出区域 -->
        <div v-if="antiClicheOutput" class="output-section">
          <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
            <i class="fa-solid fa-check-circle" style="margin-right: 6px; color: #28a745"></i>
            清理结果：
          </h5>
          <div
            class="output-content"
            style="
              background: #1e1e1e;
              border: 1px solid #3a3a3a;
              border-radius: 6px;
              padding: 15px;
              color: #e0e0e0;
              font-size: 13px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-wrap: break-word;
              max-height: 300px;
              overflow-y: auto;
            "
          >
            {{ antiClicheOutput }}
          </div>

          <div class="output-actions" style="margin-top: 12px; display: flex; gap: 12px">
            <button
              class="copy-button"
              style="
                padding: 10px 20px;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                border: none;
                border-radius: 6px;
                color: white;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 3px 12px rgba(40, 167, 69, 0.3);
                position: relative;
                overflow: hidden;
              "
              @click="copyAntiClicheResult"
            >
              <div
                style="
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                  transition: left 0.5s;
                "
                class="shimmer-effect"
              ></div>
              <i class="fa-solid fa-copy" style="font-size: 14px"></i> 复制结果
            </button>
          </div>

          <!-- 修改功能 -->
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #3a3a3a">
            <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
              <i class="fa-solid fa-wand-magic-sparkles" style="margin-right: 6px; color: #ffc107"></i>
              AI 修改清理结果
            </h5>
            <div class="form-group" style="margin-bottom: 12px">
              <textarea
                v-model="antiClicheModifyRequest"
                placeholder="描述你想要的修改，例如：把这段话改得更简洁一些..."
                style="
                  width: 100%;
                  height: 80px;
                  padding: 12px;
                  background: #2a2a2a;
                  border: 1px solid #3a3a3a;
                  border-radius: 6px;
                  color: #e0e0e0;
                  font-size: 13px;
                  resize: vertical;
                  font-family: inherit;
                "
              ></textarea>
            </div>

            <div style="display: flex; gap: 10px">
              <button
                :disabled="isModifyingAntiCliche || !antiClicheModifyRequest.trim()"
                style="
                  flex: 1;
                  padding: 10px 20px;
                  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
                  border: none;
                  border-radius: 6px;
                  color: #1a1a1a;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 3px 12px rgba(255, 193, 7, 0.3);
                  opacity: 1;
                "
                :style="{
                  opacity: isModifyingAntiCliche || !antiClicheModifyRequest.trim() ? 0.5 : 1,
                  cursor: isModifyingAntiCliche || !antiClicheModifyRequest.trim() ? 'not-allowed' : 'pointer',
                }"
                @click="handleModifyAntiCliche"
              >
                <i class="fa-solid fa-wand-magic-sparkles" style="margin-right: 6px"></i>
                {{ isModifyingAntiCliche ? '修改中...' : 'AI 修改' }}
              </button>
              <button
                :disabled="!antiClicheModifyRequest.trim()"
                style="
                  padding: 10px 20px;
                  background: #dc3545;
                  border: none;
                  border-radius: 6px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                "
                :style="{
                  opacity: !antiClicheModifyRequest.trim() ? 0.5 : 1,
                  cursor: !antiClicheModifyRequest.trim() ? 'not-allowed' : 'pointer',
                }"
                @click="clearAntiClicheModifyRequest"
              >
                <i class="fa-solid fa-eraser" style="margin-right: 6px"></i>
                清空修改需求
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 世界书条目生成工具 -->
    <div class="tool-section">
      <div
        class="section-header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(
            135deg,
            rgba(30, 30, 30, 0.95) 0%,
            rgba(38, 38, 38, 0.9) 50%,
            rgba(30, 30, 30, 0.95) 100%
          );
          backdrop-filter: blur(12px);
          border-radius: 12px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        "
        @click="toggleToolExpanded('worldbookEntry')"
        @mouseenter="(e: any) => (e.currentTarget.style.transform = 'translateY(-1px)')"
        @mouseleave="(e: any) => (e.currentTarget.style.transform = 'translateY(0)')"
      >
        <h4
          style="
            margin: 0;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          "
        >
          <i class="fa-solid fa-book-atlas" style="color: #ffc107; font-size: 18px"></i>
          世界书条目生成工具
        </h4>
        <i
          :class="isToolExpanded('worldbookEntry') ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
          style="color: #ccc; transition: transform 0.3s ease; font-size: 14px"
        ></i>
      </div>

      <div v-if="isToolExpanded('worldbookEntry')" class="tool-content">
        <div class="tool-instructions">
          <p style="margin: 0 0 8px 0; color: #ccc; font-size: 12px">
            <i class="fa-solid fa-info-circle" style="margin-right: 6px; color: #ffc107"></i>
            输入你想要的世界书条目描述，AI 将自动生成符合格式的条目，并可插入到指定世界书中。
          </p>
          <p
            style="
              margin: 0;
              color: #4a9eff;
              font-size: 11px;
              background: #1a1a1a;
              padding: 6px;
              border-radius: 4px;
              border-left: 3px solid #ffc107;
            "
          >
            💡 示例：「生成一个关于魔法学院的条目，包含学院历史和规则」、「创建角色"艾莉丝"的背景条目」
          </p>
        </div>

        <div class="form-group" style="margin: 15px 0">
          <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 13px; font-weight: 500">
            条目描述：
          </label>
          <textarea
            v-model="worldbookDescription"
            placeholder="请描述你想要生成的世界书条目内容..."
            style="
              width: 100%;
              height: 120px;
              padding: 12px;
              background: #2a2a2a;
              border: 1px solid #3a3a3a;
              border-radius: 6px;
              color: #e0e0e0;
              font-size: 13px;
              resize: vertical;
              font-family: inherit;
            "
          ></textarea>
        </div>

        <!-- 流式传输开关 -->
        <div class="form-group" style="margin: 15px 0">
          <label style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 13px; cursor: pointer">
            <input v-model="enableWorldbookStreaming" type="checkbox" style="cursor: pointer" />
            启用流式传输（可查看生成进度）
          </label>
        </div>

        <!-- 进度条 -->
        <div
          v-if="isGeneratingWorldbook && worldbookProgressPercent > 0"
          class="progress-bar-container"
          style="margin: 15px 0"
        >
          <div
            class="progress-bar"
            style="
              width: 100%;
              height: 8px;
              background: #2a2a2a;
              border-radius: 4px;
              overflow: hidden;
              position: relative;
            "
          >
            <div
              class="progress-fill"
              :style="{
                width: worldbookProgressPercent + '%',
                height: '100%',
                background: 'linear-gradient(90deg, #ffc107 0%, #ff9800 50%, #ffc107 100%)',
                backgroundSize: '200% 100%',
                animation: enableWorldbookStreaming ? 'progress-slide 2s linear infinite' : 'none',
                transition: 'width 0.3s ease',
              }"
            ></div>
          </div>
          <div style="text-align: center; margin-top: 8px; color: #ffc107; font-size: 12px; font-weight: 500">
            生成中... {{ worldbookProgressPercent.toFixed(0) }}%
          </div>
        </div>

        <div class="button-group" style="display: flex; gap: 12px; margin-bottom: 20px">
          <button
            class="generate-button"
            :disabled="isGeneratingWorldbook || !worldbookDescription.trim()"
            style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 3px 12px rgba(255, 193, 7, 0.3);
              position: relative;
              overflow: hidden;
            "
            @click="handleGenerateWorldbookEntry"
          >
            <div
              style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              "
              class="shimmer-effect"
            ></div>
            <i class="fa-solid fa-magic" style="font-size: 14px; margin-right: 6px"></i>
            {{ isGeneratingWorldbook ? '生成中...' : '生成条目' }}
          </button>

          <button
            class="clear-button"
            style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 3px 12px rgba(255, 107, 107, 0.3);
              position: relative;
              overflow: hidden;
            "
            @click="clearWorldbookForm"
          >
            <div
              style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              "
              class="shimmer-effect"
            ></div>
            <i class="fa-solid fa-trash" style="font-size: 14px; margin-right: 6px"></i>
            清空
          </button>
        </div>

        <!-- 输出区域 -->
        <div v-if="worldbookEntryOutput" class="output-section">
          <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
            <i class="fa-solid fa-check-circle" style="margin-right: 6px; color: #28a745"></i>
            生成的条目：
          </h5>

          <!-- 条目预览 -->
          <div
            class="entry-preview"
            style="
              background: #1e1e1e;
              border: 1px solid #3a3a3a;
              border-radius: 6px;
              padding: 15px;
              margin-bottom: 15px;
            "
          >
            <div class="entry-field" style="margin-bottom: 10px">
              <label style="color: #ffc107; font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px"
                >条目名称：</label
              >
              <div style="color: #e0e0e0; font-size: 13px">{{ worldbookEntryOutput.name || '未命名' }}</div>
            </div>

            <div class="entry-field" style="margin-bottom: 10px">
              <label style="color: #ffc107; font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px"
                >主要关键字：</label
              >
              <div style="color: #e0e0e0; font-size: 13px">
                {{ worldbookEntryOutput.strategy?.keys?.join(', ') || '无' }}
              </div>
            </div>

            <div class="entry-field" style="margin-bottom: 10px">
              <label style="color: #ffc107; font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px"
                >条目内容：</label
              >
              <div
                style="
                  color: #e0e0e0;
                  font-size: 13px;
                  line-height: 1.6;
                  white-space: pre-wrap;
                  max-height: 200px;
                  overflow-y: auto;
                "
              >
                {{ worldbookEntryOutput.content }}
              </div>
            </div>

            <div class="entry-field">
              <label style="color: #ffc107; font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px"
                >激活策略：</label
              >
              <div style="color: #e0e0e0; font-size: 13px">
                {{
                  worldbookEntryOutput.strategy?.type === 'constant'
                    ? '🔵 常量 (蓝灯)'
                    : worldbookEntryOutput.strategy?.type === 'selective'
                      ? '🟢 可选项 (绿灯)'
                      : '🔗 向量化'
                }}
              </div>
            </div>
          </div>

          <!-- 条目修改区域 -->
          <div class="modify-section" style="margin-top: 25px; border-top: 2px dashed #3a3a3a; padding-top: 20px">
            <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
              <i class="fa-solid fa-edit" style="margin-right: 6px; color: #ffa500"></i>
              修改条目
            </h5>
            <div
              class="modify-instructions"
              style="
                background: #1a1a1a;
                border: 1px solid #3a3a3a;
                border-radius: 6px;
                padding: 10px;
                margin-bottom: 15px;
              "
            >
              <p style="margin: 0 0 6px 0; color: #ccc; font-size: 12px">
                <i class="fa-solid fa-lightbulb" style="margin-right: 6px; color: #ffa500"></i>
                描述你想要修改的内容，AI会根据你的需求调整条目。例如："增加更多细节"、"改为女性角色"、"添加技能说明"等。
              </p>
              <p style="margin: 0; color: #ffa500; font-size: 11px">⚠️ 修改后会保持 JSON 格式。</p>
            </div>

            <div class="form-group" style="margin: 15px 0">
              <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 13px; font-weight: 500">
                修改需求：
              </label>
              <textarea
                v-model="worldbookModifyRequest"
                placeholder="请描述你想要修改的内容..."
                style="
                  width: 100%;
                  height: 80px;
                  padding: 12px;
                  background: #2a2a2a;
                  border: 1px solid #3a3a3a;
                  border-radius: 6px;
                  color: #e0e0e0;
                  font-size: 13px;
                  resize: vertical;
                  font-family: inherit;
                "
              ></textarea>
            </div>

            <!-- 修改进度条 -->
            <div
              v-if="isModifyingWorldbook && worldbookProgressPercent > 0"
              class="progress-bar-container"
              style="margin: 12px 0"
            >
              <div
                class="progress-bar"
                style="
                  width: 100%;
                  height: 8px;
                  background: #2a2a2a;
                  border-radius: 4px;
                  overflow: hidden;
                  position: relative;
                "
              >
                <div
                  class="progress-fill"
                  :style="{
                    width: worldbookProgressPercent + '%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffa500 0%, #ff8c00 50%, #ffa500 100%)',
                    backgroundSize: '200% 100%',
                    animation: enableWorldbookStreaming ? 'progress-slide 2s linear infinite' : 'none',
                    transition: 'width 0.3s ease',
                  }"
                ></div>
              </div>
              <div style="text-align: center; margin-top: 8px; color: #ffa500; font-size: 12px; font-weight: 500">
                修改中... {{ worldbookProgressPercent.toFixed(0) }}%
              </div>
            </div>

            <div class="button-group" style="display: flex; gap: 12px; margin-bottom: 15px">
              <button
                class="modify-button"
                :disabled="isModifyingWorldbook || !worldbookModifyRequest.trim()"
                style="
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
                  border: none;
                  border-radius: 8px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 3px 12px rgba(255, 165, 0, 0.3);
                  position: relative;
                  overflow: hidden;
                "
                @click="handleModifyWorldbookEntry"
              >
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                  "
                  class="shimmer-effect"
                ></div>
                <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 14px; margin-right: 6px"></i>
                {{ isModifyingWorldbook ? '修改中...' : 'AI修改' }}
              </button>

              <button
                class="clear-modify-button"
                style="
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
                  border: none;
                  border-radius: 8px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 3px 12px rgba(108, 117, 125, 0.3);
                  position: relative;
                  overflow: hidden;
                "
                @click="clearWorldbookModifyRequest"
              >
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                  "
                  class="shimmer-effect"
                ></div>
                <i class="fa-solid fa-eraser" style="font-size: 14px; margin-right: 6px"></i>
                清空修改需求
              </button>
            </div>
          </div>

          <!-- 世界书选择和插入 -->
          <div class="insert-section" style="background: #1a1a1a; padding: 15px; border-radius: 6px; margin-top: 20px">
            <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
              <i class="fa-solid fa-file-import" style="margin-right: 6px; color: #17a2b8"></i>
              插入到世界书
            </h5>

            <div class="form-group" style="margin-bottom: 12px">
              <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 13px; font-weight: 500">
                选择世界书：
              </label>
              <select
                v-model="selectedWorldbook"
                style="
                  width: 100%;
                  padding: 10px;
                  background: #2a2a2a;
                  border: 1px solid #3a3a3a;
                  border-radius: 6px;
                  color: #e0e0e0;
                  font-size: 13px;
                "
              >
                <option value="" disabled>请选择世界书</option>
                <option v-for="wb in availableWorldbooks" :key="wb" :value="wb">{{ wb }}</option>
              </select>
            </div>

            <div class="output-actions" style="display: flex; gap: 12px">
              <button
                class="insert-button"
                :disabled="!selectedWorldbook || isInsertingEntry"
                style="
                  padding: 10px 20px;
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  border: none;
                  border-radius: 6px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  box-shadow: 0 3px 12px rgba(40, 167, 69, 0.3);
                  position: relative;
                  overflow: hidden;
                "
                @click="handleInsertEntry"
              >
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                  "
                  class="shimmer-effect"
                ></div>
                <i class="fa-solid fa-plus-circle" style="font-size: 14px"></i>
                {{ isInsertingEntry ? '插入中...' : '插入条目' }}
              </button>

              <button
                class="copy-button"
                style="
                  padding: 10px 20px;
                  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                  border: none;
                  border-radius: 6px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  box-shadow: 0 3px 12px rgba(23, 162, 184, 0.3);
                  position: relative;
                  overflow: hidden;
                "
                @click="copyWorldbookEntry"
              >
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                  "
                  class="shimmer-effect"
                ></div>
                <i class="fa-solid fa-copy" style="font-size: 14px"></i> 复制 JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 世界书条目查看器 -->
    <div class="tool-section">
      <div
        class="section-header viewer-header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(
            135deg,
            rgba(30, 30, 30, 0.95) 0%,
            rgba(38, 38, 38, 0.9) 50%,
            rgba(30, 30, 30, 0.95) 100%
          );
          backdrop-filter: blur(12px);
          border-radius: 12px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        "
        @click="toggleToolExpanded('worldbookViewer')"
        @mouseenter="(e: any) => (e.currentTarget.style.transform = 'translateY(-1px)')"
        @mouseleave="(e: any) => (e.currentTarget.style.transform = 'translateY(0)')"
      >
        <h4
          style="
            margin: 0;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          "
        >
          <i class="fa-solid fa-list" style="color: #20c997; font-size: 18px"></i>
          世界书条目查看器
        </h4>
        <i
          :class="isToolExpanded('worldbookViewer') ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
          style="color: #888; font-size: 14px; transition: transform 0.3s ease"
        ></i>
      </div>

      <div v-if="isToolExpanded('worldbookViewer')" class="tool-content">
        <div
          class="tool-instructions"
          style="
            background: rgba(32, 201, 151, 0.1);
            border-left: 3px solid #20c997;
            padding: 12px 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          "
        >
          <p style="margin: 0; color: #a0f0e0; font-size: 13px; display: flex; align-items: center; gap: 8px">
            <i class="fa-solid fa-info-circle" style="color: #20c997"></i>
            选择一个世界书，查看其中所有条目的详细信息，支持搜索和筛选。
          </p>
        </div>

        <!-- 选择世界书 -->
        <div class="form-group" style="margin-bottom: 20px">
          <label
            style="
              display: block;
              margin-bottom: 10px;
              color: #e0e0e0;
              font-size: 14px;
              font-weight: 500;
              letter-spacing: 0.3px;
            "
          >
            选择世界书：
          </label>
          <select
            v-model="selectedViewerWorldbook"
            style="
              width: 100%;
              padding: 12px 15px;
              background: #2a2a2a;
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              color: #e0e0e0;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            "
            @change="loadWorldbookEntries"
            @focus="(e: any) => (e.target.style.borderColor = '#20c997')"
            @blur="(e: any) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')"
          >
            <option value="">请选择世界书</option>
            <option v-for="wb in availableWorldbooks" :key="wb" :value="wb">
              {{ wb }}
            </option>
          </select>
        </div>

        <!-- 搜索条目 -->
        <div v-if="selectedViewerWorldbook" class="form-group" style="margin-bottom: 20px">
          <label
            style="
              display: block;
              margin-bottom: 10px;
              color: #e0e0e0;
              font-size: 14px;
              font-weight: 500;
              letter-spacing: 0.3px;
            "
          >
            搜索条目：
          </label>
          <input
            v-model="viewerSearchQuery"
            type="text"
            placeholder="搜索条目名称、关键字或内容..."
            style="
              width: 100%;
              padding: 12px 15px;
              background: #2a2a2a;
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 8px;
              color: #e0e0e0;
              font-size: 14px;
              transition: all 0.3s ease;
              box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
            "
            @focus="(e: any) => (e.target.style.borderColor = '#20c997')"
            @blur="(e: any) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')"
          />
        </div>

        <!-- 排序 -->
        <div
          v-if="selectedViewerWorldbook && worldbookEntries.length > 0"
          style="display: flex; gap: 10px; margin-bottom: 15px"
        >
          <button
            :style="{
              padding: '8px 16px',
              background: viewerSortBy === 'original' ? '#20c997' : '#444',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }"
            @click="viewerSortBy = 'original'"
          >
            原始顺序
          </button>
          <button
            :style="{
              padding: '8px 16px',
              background: viewerSortBy === 'enabled' ? '#28a745' : '#444',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }"
            @click="viewerSortBy = 'enabled'"
          >
            ✓ 全选
          </button>
          <button
            :style="{
              padding: '8px 16px',
              background: viewerSortBy === 'disabled' ? '#dc3545' : '#444',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }"
            @click="viewerSortBy = 'disabled'"
          >
            ✕ 取消全选
          </button>
        </div>

        <!-- 找到的条目统计 -->
        <div v-if="selectedViewerWorldbook" style="margin-bottom: 15px; color: #888; font-size: 12px">
          <span v-if="filteredWorldbookEntries.length > 0"> 共找到 {{ filteredWorldbookEntries.length }} 个条目 </span>
          <span v-else style="color: #ff6b6b">未找到条目</span>
        </div>

        <!-- 条目列表 -->
        <div v-if="filteredWorldbookEntries.length > 0" style="display: flex; flex-direction: column; gap: 12px">
          <div
            v-for="(entry, index) in filteredWorldbookEntries"
            :key="index"
            style="
              background: #2a2a2a;
              border: 1px solid #3a3a3a;
              border-radius: 8px;
              padding: 15px;
              transition: all 0.3s ease;
            "
          >
            <!-- 条目头部 -->
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                cursor: pointer;
                user-select: none;
              "
              @click="toggleEntryExpanded(index)"
            >
              <!-- 三行格式显示 -->
              <div style="flex: 1; line-height: 1.6">
                <!-- 第一行：状态灯 + 条目名称 -->
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px">
                  <span v-if="entry.strategy?.type === 'constant'" style="font-size: 14px">🔵</span>
                  <span v-else-if="entry.strategy?.type === 'selective'" style="font-size: 14px">🟢</span>
                  <span v-else style="font-size: 14px">⚪</span>
                  <span style="color: #fff; font-weight: 600; font-size: 14px">
                    {{ entry.name || '(无名称)' }}
                  </span>
                </div>

                <!-- 第二行：关键词 | 位置 | 深度 -->
                <div style="padding-left: 20px; margin-bottom: 6px; font-size: 12px; color: #ccc">
                  <span v-if="entry.strategy?.keys && entry.strategy.keys.length > 0">
                    关键词:
                    {{ entry.strategy.keys.map((k: any) => (typeof k === 'string' ? k : String(k))).join(', ') }}
                  </span>
                  <span v-else>关键词: (无)</span>

                  <span v-if="entry.position?.order && entry.position.order !== 0">
                    <span style="color: #666"> | </span>
                    顺序: {{ entry.position.order }}
                  </span>

                  <span
                    v-if="entry.position?.type === 'at_depth' && entry.position.depth && entry.position.depth !== 0"
                  >
                    <span style="color: #666"> | </span>
                    深度: {{ entry.position.depth }}
                  </span>
                </div>

                <!-- 第三行：内容预览 -->
                <div style="padding-left: 20px; font-size: 12px; color: #999; font-style: italic">
                  {{
                    entry.content
                      ? entry.content.length > 50
                        ? entry.content.substring(0, 50) + '...'
                        : entry.content
                      : '(无内容)'
                  }}
                </div>
              </div>

              <i
                :class="isEntryExpanded(index) ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
                style="color: #888; font-size: 12px; margin-top: 2px"
              ></i>
            </div>

            <!-- 条目内容（展开时显示） -->
            <div
              v-if="isEntryExpanded(index)"
              style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #3a3a3a"
            >
              <!-- 触发策略信息 -->
              <div style="margin-bottom: 12px">
                <span style="color: #888; font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px">
                  ⚙️ 触发策略：
                </span>
                <div style="display: flex; align-items: center; gap: 8px">
                  <span
                    v-if="entry.strategy?.type === 'constant'"
                    style="
                      padding: 4px 10px;
                      background: #4a9eff;
                      color: white;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: bold;
                    "
                  >
                    🔵 蓝灯（常量）- 无需关键字匹配
                  </span>
                  <span
                    v-else-if="entry.strategy?.type === 'selective'"
                    style="
                      padding: 4px 10px;
                      background: #28a745;
                      color: white;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: bold;
                    "
                  >
                    🟢 绿灯（可选项）- 需要关键字匹配
                  </span>
                  <span
                    v-else
                    style="
                      padding: 4px 10px;
                      background: #888;
                      color: white;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: bold;
                    "
                  >
                    ⚪ 未知类型
                  </span>
                </div>
              </div>

              <!-- 关键字 -->
              <div style="margin-bottom: 12px">
                <span style="color: #888; font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px">
                  🔑 关键字：
                  <span
                    v-if="entry.strategy?.type === 'constant'"
                    style="color: #ffa500; font-size: 10px; margin-left: 6px"
                  >
                    (蓝灯条目通常不需要关键字)
                  </span>
                </span>
                <div style="display: flex; flex-wrap: wrap; gap: 6px">
                  <span
                    v-for="(key, ki) in entry.strategy?.keys || []"
                    :key="ki"
                    style="padding: 4px 10px; background: #667eea; color: white; border-radius: 12px; font-size: 11px"
                  >
                    {{ typeof key === 'string' ? key : String(key) }}
                  </span>
                  <span
                    v-if="!entry.strategy?.keys || entry.strategy.keys.length === 0"
                    style="color: #888; font-size: 11px"
                  >
                    {{ entry.strategy?.type === 'constant' ? '(蓝灯条目无需关键字)' : '(无关键字)' }}
                  </span>
                </div>
              </div>

              <!-- 条目内容 -->
              <div style="margin-bottom: 12px">
                <span style="color: #888; font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px">
                  📄 条目内容：
                </span>
                <div
                  style="
                    padding: 12px;
                    background: #1a1a1a;
                    border: 1px solid #3a3a3a;
                    border-radius: 6px;
                    color: #ccc;
                    font-size: 12px;
                    line-height: 1.6;
                    max-height: 200px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                  "
                >
                  {{ entry.content || '(无内容)' }}
                </div>
              </div>

              <!-- 操作按钮 -->
              <div style="display: flex; gap: 10px; margin-top: 12px">
                <button
                  style="
                    padding: 8px 16px;
                    background: #4a9eff;
                    border: none;
                    border-radius: 6px;
                    color: white;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                  "
                  @click="editWorldbookEntry(entry)"
                >
                  <i class="fa-solid fa-edit"></i> 编辑
                </button>
                <button
                  style="
                    padding: 8px 16px;
                    background: #ff6b6b;
                    border: none;
                    border-radius: 6px;
                    color: white;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                  "
                  @click="deleteWorldbookEntry(entry)"
                >
                  <i class="fa-solid fa-trash"></i> 删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 世界书条目编辑对话框 -->
    <div
      v-if="showEditDialog"
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
        backdrop-filter: blur(4px);
      "
      @click.self="showEditDialog = false"
    >
      <div
        style="
          background: #2a2a2a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 25px;
          max-width: 700px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
          <h3 style="margin: 0; color: #fff; font-size: 18px; font-weight: 600">
            <i class="fa-solid fa-edit" style="margin-right: 8px; color: #4a9eff"></i>
            编辑世界书条目
          </h3>
          <button
            style="
              background: transparent;
              border: none;
              color: #888;
              font-size: 20px;
              cursor: pointer;
              padding: 5px 10px;
              transition: color 0.2s;
            "
            @click="showEditDialog = false"
            @mouseenter="(e: any) => (e.target.style.color = '#fff')"
            @mouseleave="(e: any) => (e.target.style.color = '#888')"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 15px">
          <!-- 条目名称 -->
          <div>
            <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
              条目名称：
            </label>
            <input
              v-model="editingEntry.name"
              type="text"
              style="
                width: 100%;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 14px;
              "
            />
          </div>

          <!-- 启用状态 -->
          <div style="display: flex; align-items: center; gap: 10px">
            <input
              id="entry-enabled"
              v-model="editingEntry.enabled"
              type="checkbox"
              style="width: 18px; height: 18px; cursor: pointer"
            />
            <label for="entry-enabled" style="color: #e0e0e0; font-size: 14px; cursor: pointer"> 启用此条目 </label>
          </div>

          <!-- 主要关键字 -->
          <div>
            <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
              主要关键字：
            </label>
            <input
              :value="
                (editingEntry.strategy?.keys || []).map((k: any) => (typeof k === 'string' ? k : String(k))).join(',')
              "
              type="text"
              placeholder="用逗号分隔，如：艾莉娅,Aria,精灵,{{char}}"
              style="
                width: 100%;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 14px;
              "
              @input="
                (e: any) => {
                  const keys = e.target.value
                    .split(',')
                    .filter((k: string) => k.trim())
                    .map((k: string) => k.trim());
                  editingEntry.strategy = {
                    ...editingEntry.strategy,
                    keys: keys,
                    keys_secondary: editingEntry.strategy?.keys_secondary || { logic: 'and_any', keys: [] },
                    scan_depth: editingEntry.strategy?.scan_depth || 'same_as_global',
                    type: editingEntry.strategy?.type || 'selective',
                  };
                }
              "
            />
          </div>

          <!-- 触发类型 -->
          <div>
            <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
              触发类型：
            </label>
            <select
              :value="editingEntry.strategy?.type || 'selective'"
              style="
                width: 100%;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 14px;
                cursor: pointer;
              "
              @change="
                (e: any) =>
                  (editingEntry.strategy = {
                    ...editingEntry.strategy,
                    type: e.target.value,
                    keys: editingEntry.strategy?.keys || [],
                    keys_secondary: editingEntry.strategy?.keys_secondary || { logic: 'and_any', keys: [] },
                    scan_depth: editingEntry.strategy?.scan_depth || 'same_as_global',
                  })
              "
            >
              <option value="selective">绿灯 (可选项)</option>
              <option value="constant">蓝灯 (常量)</option>
            </select>
          </div>

          <!-- 插入位置 -->
          <div>
            <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
              插入位置：
            </label>
            <select
              :value="editingEntry.position?.type || 'before_character_definition'"
              style="
                width: 100%;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 14px;
                cursor: pointer;
              "
              @change="
                (e: any) =>
                  (editingEntry.position = {
                    ...editingEntry.position,
                    type: e.target.value,
                    role: editingEntry.position?.role || 'system',
                    depth: editingEntry.position?.depth || 0,
                    order: editingEntry.position?.order || 0,
                  })
              "
            >
              <option value="before_character_definition">角色定义之前</option>
              <option value="after_character_definition">角色定义之后</option>
              <option value="before_example_messages">示例消息之前</option>
              <option value="after_example_messages">示例消息之后</option>
              <option value="before_author_note">作者注释之前</option>
              <option value="after_author_note">作者注释之后</option>
              <option value="at_depth">插入到指定深度</option>
            </select>
          </div>

          <!-- 深度和顺序 -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
            <div>
              <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
                深度：
              </label>
              <input
                :value="editingEntry.position?.depth || 0"
                type="number"
                style="
                  width: 100%;
                  padding: 12px;
                  background: #1a1a1a;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 8px;
                  color: #e0e0e0;
                  font-size: 14px;
                "
                @input="
                  (e: any) =>
                    (editingEntry.position = {
                      ...editingEntry.position,
                      depth: Number(e.target.value) || 0,
                      role: editingEntry.position?.role || 'system',
                      order: editingEntry.position?.order || 0,
                      type: editingEntry.position?.type || 'before_character_definition',
                    })
                "
              />
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
                顺序：
              </label>
              <input
                :value="editingEntry.position?.order || 0"
                type="number"
                style="
                  width: 100%;
                  padding: 12px;
                  background: #1a1a1a;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 8px;
                  color: #e0e0e0;
                  font-size: 14px;
                "
                @input="
                  (e: any) =>
                    (editingEntry.position = {
                      ...editingEntry.position,
                      order: Number(e.target.value) || 0,
                      type: editingEntry.position?.type || 'before_character_definition',
                      role: editingEntry.position?.role || 'system',
                      depth: editingEntry.position?.depth || 0,
                    })
                "
              />
            </div>
          </div>

          <!-- 递归设置 -->
          <div
            style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1)"
          >
            <label style="display: block; margin-bottom: 12px; color: #e0e0e0; font-size: 14px; font-weight: 600">
              递归设置：
            </label>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <label
                style="color: #ccc; font-size: 13px; display: flex; align-items: center; gap: 10px; cursor: pointer"
              >
                <input
                  type="checkbox"
                  :checked="editingEntry.recursion?.prevent_incoming || false"
                  @change="
                    (e: any) =>
                      (editingEntry.recursion = {
                        ...editingEntry.recursion,
                        prevent_incoming: e.target.checked,
                        prevent_outgoing: editingEntry.recursion?.prevent_outgoing || false,
                        delay_until: editingEntry.recursion?.delay_until || null,
                      })
                  "
                />
                禁止其他条目递归激活本条目
              </label>
              <label
                style="color: #ccc; font-size: 13px; display: flex; align-items: center; gap: 10px; cursor: pointer"
              >
                <input
                  type="checkbox"
                  :checked="editingEntry.recursion?.prevent_outgoing || false"
                  @change="
                    (e: any) =>
                      (editingEntry.recursion = {
                        ...editingEntry.recursion,
                        prevent_outgoing: e.target.checked,
                        prevent_incoming: editingEntry.recursion?.prevent_incoming || false,
                        delay_until: editingEntry.recursion?.delay_until || null,
                      })
                  "
                />
                禁止本条目递归激活其他条目
              </label>
              <div>
                <label style="color: #ccc; font-size: 13px; display: block; margin-bottom: 5px">
                  延迟到第 n 级递归：
                </label>
                <input
                  :value="editingEntry.recursion?.delay_until || ''"
                  type="number"
                  placeholder="留空表示不延迟"
                  style="
                    width: 100%;
                    padding: 8px;
                    background: #2a2a2a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    color: #e0e0e0;
                    font-size: 13px;
                  "
                  @input="
                    (e: any) =>
                      (editingEntry.recursion = {
                        ...editingEntry.recursion,
                        delay_until: e.target.value === '' ? null : Number(e.target.value),
                        prevent_incoming: editingEntry.recursion?.prevent_incoming || false,
                        prevent_outgoing: editingEntry.recursion?.prevent_outgoing || false,
                      })
                  "
                />
              </div>
            </div>
          </div>

          <!-- 条目内容 -->
          <div>
            <label style="display: block; margin-bottom: 8px; color: #e0e0e0; font-size: 14px; font-weight: 500">
              条目内容：
            </label>
            <textarea
              v-model="editingEntry.content"
              style="
                width: 100%;
                min-height: 200px;
                padding: 12px;
                background: #1a1a1a;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: #e0e0e0;
                font-size: 14px;
                resize: vertical;
                font-family: inherit;
              "
            ></textarea>
          </div>
        </div>

        <!-- 对话框按钮 -->
        <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end">
          <button
            style="
              padding: 10px 20px;
              background: #444;
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
            "
            @click="showEditDialog = false"
            @mouseenter="(e: any) => (e.target.style.background = '#555')"
            @mouseleave="(e: any) => (e.target.style.background = '#444')"
          >
            取消
          </button>
          <button
            style="
              padding: 10px 20px;
              background: #4a9eff;
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            "
            @click="saveEditedEntry"
            @mouseenter="(e: any) => (e.target.style.background = '#5ba8ff')"
            @mouseleave="(e: any) => (e.target.style.background = '#4a9eff')"
          >
            <i class="fa-solid fa-save" style="margin-right: 6px"></i>
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 角色卡生成工具 -->
    <div class="tool-section">
      <div
        class="section-header"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(
            135deg,
            rgba(30, 30, 30, 0.95) 0%,
            rgba(38, 38, 38, 0.9) 50%,
            rgba(30, 30, 30, 0.95) 100%
          );
          backdrop-filter: blur(12px);
          border-radius: 12px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        "
        @click="toggleToolExpanded('characterCard')"
        @mouseenter="(e: any) => (e.currentTarget.style.transform = 'translateY(-1px)')"
        @mouseleave="(e: any) => (e.currentTarget.style.transform = 'translateY(0)')"
      >
        <h4
          style="
            margin: 0;
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          "
        >
          <i class="fa-solid fa-user-plus" style="color: #17a2b8; font-size: 18px"></i>
          角色卡生成工具
        </h4>
        <i
          :class="isToolExpanded('characterCard') ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
          style="color: #ccc; transition: transform 0.3s ease; font-size: 14px"
        ></i>
      </div>

      <div v-if="isToolExpanded('characterCard')" class="tool-content">
        <div class="tool-instructions">
          <p style="margin: 0 0 8px 0; color: #ccc; font-size: 12px">
            <i class="fa-solid fa-info-circle" style="margin-right: 6px; color: #17a2b8"></i>
            输入角色描述，AI将自动生成角色卡（YAML 格式，纯中文）。
          </p>
          <p
            style="
              margin: 0 0 6px 0;
              color: #4a9eff;
              font-size: 11px;
              background: #1a1a1a;
              padding: 6px;
              border-radius: 4px;
              border-left: 3px solid #17a2b8;
            "
          >
            💡 包含内容：基础信息、外貌身材、核心性格、对话风格、背景经历、人际关系、演绎指导
          </p>
          <p
            style="
              margin: 0 0 6px 0;
              color: #ffa500;
              font-size: 11px;
              background: #1a1a1a;
              padding: 6px;
              border-radius: 4px;
              border-left: 3px solid #ffa500;
            "
          >
            ⚠️ 注意：身高体重使用文字描述（如"高大匀称"），避免AI刻板化，有性格对立面和修复机制
          </p>
        </div>

        <div class="form-group" style="margin: 15px 0">
          <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 13px; font-weight: 500">
            角色描述：
          </label>
          <textarea
            v-model="characterDescription"
            placeholder="请描述角色的基本信息，如外观、性格、背景等..."
            style="
              width: 100%;
              height: 120px;
              padding: 12px;
              background: #2a2a2a;
              border: 1px solid #3a3a3a;
              border-radius: 6px;
              color: #e0e0e0;
              font-size: 13px;
              resize: vertical;
              font-family: inherit;
            "
          ></textarea>
        </div>

        <!-- 流式传输开关 -->
        <div class="form-group" style="margin: 15px 0">
          <label style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 13px; cursor: pointer">
            <input v-model="enableCharacterStreaming" type="checkbox" style="cursor: pointer" />
            启用流式传输（可查看生成进度）
          </label>
        </div>

        <!-- 进度条 -->
        <div
          v-if="isGeneratingCharacter && characterProgressPercent > 0"
          class="progress-bar-container"
          style="margin: 15px 0"
        >
          <div
            class="progress-bar"
            style="
              width: 100%;
              height: 8px;
              background: #2a2a2a;
              border-radius: 4px;
              overflow: hidden;
              position: relative;
            "
          >
            <div
              class="progress-fill"
              :style="{
                width: characterProgressPercent + '%',
                height: '100%',
                background: 'linear-gradient(90deg, #17a2b8 0%, #138496 50%, #17a2b8 100%)',
                backgroundSize: '200% 100%',
                animation: enableCharacterStreaming ? 'progress-slide 2s linear infinite' : 'none',
                transition: 'width 0.3s ease',
              }"
            ></div>
          </div>
          <div style="text-align: center; margin-top: 8px; color: #17a2b8; font-size: 12px; font-weight: 500">
            生成中... {{ characterProgressPercent.toFixed(0) }}%
          </div>
        </div>

        <div class="button-group" style="display: flex; gap: 12px; margin-bottom: 20px">
          <button
            class="generate-button"
            :disabled="isGeneratingCharacter || !characterDescription.trim()"
            style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 3px 12px rgba(23, 162, 184, 0.3);
              position: relative;
              overflow: hidden;
            "
            @click="handleGenerateCharacterCard"
          >
            <div
              style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              "
              class="shimmer-effect"
            ></div>
            <i class="fa-solid fa-magic" style="font-size: 14px; margin-right: 6px"></i>
            {{ isGeneratingCharacter ? '生成中...' : '生成角色卡' }}
          </button>

          <button
            class="clear-button"
            style="
              padding: 12px 24px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 3px 12px rgba(255, 107, 107, 0.3);
              position: relative;
              overflow: hidden;
            "
            @click="clearCharacterForm"
          >
            <div
              style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              "
              class="shimmer-effect"
            ></div>
            <i class="fa-solid fa-trash" style="font-size: 14px; margin-right: 6px"></i>
            清空
          </button>
        </div>

        <!-- 输出区域 -->
        <div v-if="characterCardOutput" class="output-section">
          <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
            <i class="fa-solid fa-check-circle" style="margin-right: 6px; color: #28a745"></i>
            生成的角色卡：
          </h5>
          <div
            class="output-content"
            style="
              background: #1e1e1e;
              border: 1px solid #3a3a3a;
              border-radius: 6px;
              padding: 15px;
              color: #e0e0e0;
              font-size: 13px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-wrap: break-word;
              max-height: 300px;
              overflow-y: auto;
            "
          >
            {{ characterCardOutput }}
          </div>

          <div class="output-actions" style="margin-top: 12px; display: flex; gap: 12px">
            <button
              class="copy-button"
              style="
                padding: 10px 20px;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                border: none;
                border-radius: 6px;
                color: white;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 3px 12px rgba(40, 167, 69, 0.3);
                position: relative;
                overflow: hidden;
              "
              @click="copyCharacterCard"
            >
              <div
                style="
                  position: absolute;
                  top: 0;
                  left: -100%;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                  transition: left 0.5s;
                "
                class="shimmer-effect"
              ></div>
              <i class="fa-solid fa-copy" style="font-size: 14px"></i> 复制角色卡
            </button>
          </div>

          <!-- 角色卡修改区域 -->
          <div class="modify-section" style="margin-top: 25px; border-top: 2px dashed #3a3a3a; padding-top: 20px">
            <h5 style="margin: 0 0 12px 0; color: #fff; font-size: 14px; font-weight: 600">
              <i class="fa-solid fa-edit" style="margin-right: 6px; color: #ffa500"></i>
              修改角色卡
            </h5>
            <div
              class="modify-instructions"
              style="
                background: #1a1a1a;
                border: 1px solid #3a3a3a;
                border-radius: 6px;
                padding: 10px;
                margin-bottom: 15px;
              "
            >
              <p style="margin: 0 0 6px 0; color: #ccc; font-size: 12px">
                <i class="fa-solid fa-lightbulb" style="margin-right: 6px; color: #ffa500"></i>
                描述你想要修改的内容，AI会根据你的需求调整角色卡。例如："让角色更活泼一些"、"增加魔法技能"、"改为女性角色"等。
              </p>
              <p style="margin: 0; color: #ffa500; font-size: 11px">⚠️ 修改后会保持 YAML 格式和中文字段。</p>
            </div>

            <div class="form-group" style="margin: 15px 0">
              <label style="display: block; margin-bottom: 8px; color: #ccc; font-size: 13px; font-weight: 500">
                修改需求：
              </label>
              <textarea
                v-model="modifyRequest"
                placeholder="请描述你想要修改的内容..."
                style="
                  width: 100%;
                  height: 80px;
                  padding: 12px;
                  background: #2a2a2a;
                  border: 1px solid #3a3a3a;
                  border-radius: 6px;
                  color: #e0e0e0;
                  font-size: 13px;
                  resize: vertical;
                  font-family: inherit;
                "
              ></textarea>
            </div>

            <!-- 修改进度条 -->
            <div
              v-if="isModifyingCharacter && characterProgressPercent > 0"
              class="progress-bar-container"
              style="margin: 15px 0"
            >
              <div
                class="progress-bar"
                style="
                  width: 100%;
                  height: 8px;
                  background: #2a2a2a;
                  border-radius: 4px;
                  overflow: hidden;
                  position: relative;
                "
              >
                <div
                  class="progress-fill"
                  :style="{
                    width: characterProgressPercent + '%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #17a2b8 0%, #138496 50%, #17a2b8 100%)',
                    backgroundSize: '200% 100%',
                    animation: enableCharacterStreaming ? 'progress-slide 2s linear infinite' : 'none',
                    transition: 'width 0.3s ease',
                  }"
                ></div>
              </div>
              <div style="text-align: center; margin-top: 8px; color: #17a2b8; font-size: 12px; font-weight: 500">
                修改中... {{ characterProgressPercent.toFixed(0) }}%
              </div>
            </div>

            <div class="button-group" style="display: flex; gap: 12px; margin-bottom: 15px">
              <button
                class="modify-button"
                :disabled="isModifyingCharacter || !modifyRequest.trim()"
                style="
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #ffa500 0%, #ff8c00 100%);
                  border: none;
                  border-radius: 8px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 3px 12px rgba(255, 165, 0, 0.3);
                  position: relative;
                  overflow: hidden;
                "
                @click="handleModifyCharacterCard"
              >
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                  "
                  class="shimmer-effect"
                ></div>
                <i class="fa-solid fa-wand-magic-sparkles" style="font-size: 14px; margin-right: 6px"></i>
                {{ isModifyingCharacter ? '修改中...' : 'AI修改' }}
              </button>

              <button
                class="clear-modify-button"
                style="
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
                  border: none;
                  border-radius: 8px;
                  color: white;
                  font-size: 13px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                  box-shadow: 0 3px 12px rgba(108, 117, 125, 0.3);
                  position: relative;
                  overflow: hidden;
                "
                @click="clearModifyRequest"
              >
                <div
                  style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                  "
                  class="shimmer-effect"
                ></div>
                <i class="fa-solid fa-eraser" style="font-size: 14px; margin-right: 6px"></i>
                清空修改需求
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref, Ref, watch } from 'vue';
import { normalizeApiEndpoint, useSettingsStore } from '../settings';
import { copyToClipboard, getScriptIdSafe } from '../utils';

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

// 响应式数据
const toolExpandedState = ref(new Map<string, boolean>());
const antiClicheInput = ref('');
const antiClicheOutput = ref('');
const isProcessingAntiCliche = ref(false);
const enableAntiClicheStreaming = ref(false); // 反八股是否启用流式传输
const antiClicheProgressPercent = ref(0); // 反八股处理进度
const antiClicheModifyRequest = ref(''); // 反八股修改需求
const isModifyingAntiCliche = ref(false); // 是否正在修改
const characterDescription = ref('');
const characterCardOutput = ref('');
const isGeneratingCharacter = ref(false);
const modifyRequest = ref('');
const isModifyingCharacter = ref(false);
const enableCharacterStreaming = ref(false); // 角色卡生成是否启用流式传输
const characterProgressPercent = ref(0); // 角色卡生成进度

// 世界书条目生成工具相关
const worldbookDescription = ref('');
const worldbookEntryOutput = ref<Partial<WorldbookEntry> | null>(null);
const isGeneratingWorldbook = ref(false);
const availableWorldbooks = ref<string[]>([]);
const selectedWorldbook = ref('');
const isInsertingEntry = ref(false);
const worldbookModifyRequest = ref('');
const isModifyingWorldbook = ref(false);
const enableWorldbookStreaming = ref(false); // 世界书条目生成是否启用流式传输
const worldbookProgressPercent = ref(0); // 世界书条目生成进度

// 世界书查看器相关
const selectedViewerWorldbook = ref('');
const worldbookEntries = ref<WorldbookEntry[]>([]);
const viewerSearchQuery = ref('');
const viewerSortBy = ref<'original' | 'enabled' | 'disabled'>('original');
const entryExpandedState = ref(new Map<number, boolean>());

// 编辑对话框相关
const showEditDialog = ref(false);
const editingEntry = ref<Partial<WorldbookEntry>>({});
const editingEntryUid = ref<number | null>(null);

// 标志位：是否已完成初始加载（避免加载时触发保存）
const isDataLoaded = ref(false);

// 加载可用的世界书列表
const loadAvailableWorldbooks = () => {
  try {
    availableWorldbooks.value = getWorldbookNames();
    console.log('✅ 已加载世界书列表:', availableWorldbooks.value);
  } catch (error) {
    console.error('❌ 加载世界书列表失败:', error);
    window.toastr.error('加载世界书列表失败：' + (error as Error).message);
  }
};

// 从酒馆变量加载工具数据
const loadToolsData = () => {
  try {
    isDataLoaded.value = false; // 加载期间暂停自动保存
    const script_id = getScriptIdSafe();
    if (!script_id) {
      console.warn('⚠️ script_id 为空，无法加载数据');
      isDataLoaded.value = true;
      return;
    }
    const savedData = getVariables({ type: 'script', script_id });

    console.log('📥 加载工具数据:', savedData);

    // 加载反八股数据
    if (savedData.tools_antiCliche) {
      antiClicheInput.value = savedData.tools_antiCliche.input || '';
      antiClicheOutput.value = savedData.tools_antiCliche.output || '';
      enableAntiClicheStreaming.value = savedData.tools_antiCliche.enableStreaming || false;
      antiClicheModifyRequest.value = savedData.tools_antiCliche.modifyRequest || '';
      console.log('✅ 已恢复反八股数据:', {
        input: antiClicheInput.value.substring(0, 50),
        output: antiClicheOutput.value.substring(0, 50),
        enableStreaming: enableAntiClicheStreaming.value,
        modifyRequest: antiClicheModifyRequest.value.substring(0, 30),
      });
    }

    // 加载角色卡数据
    if (savedData.tools_characterCard) {
      characterDescription.value = savedData.tools_characterCard.description || '';
      characterCardOutput.value = savedData.tools_characterCard.output || '';
      modifyRequest.value = savedData.tools_characterCard.modifyRequest || '';
      enableCharacterStreaming.value = savedData.tools_characterCard.enableStreaming || false;
      console.log('✅ 已恢复角色卡数据:', {
        description: characterDescription.value.substring(0, 50),
        output: characterCardOutput.value.substring(0, 50),
        modifyRequest: modifyRequest.value.substring(0, 50),
        enableStreaming: enableCharacterStreaming.value,
      });
    }

    // 加载世界书条目数据
    if (savedData.tools_worldbookEntry) {
      worldbookDescription.value = savedData.tools_worldbookEntry.description || '';
      worldbookEntryOutput.value = savedData.tools_worldbookEntry.output || null;
      selectedWorldbook.value = savedData.tools_worldbookEntry.selectedWorldbook || '';
      worldbookModifyRequest.value = savedData.tools_worldbookEntry.modifyRequest || '';
      enableWorldbookStreaming.value = savedData.tools_worldbookEntry.enableStreaming || false;
      console.log('✅ 已恢复世界书条目数据:', {
        description: worldbookDescription.value.substring(0, 50),
        output: worldbookEntryOutput.value ? '有输出' : '无输出',
        selectedWorldbook: selectedWorldbook.value,
        modifyRequest: worldbookModifyRequest.value.substring(0, 50),
        enableStreaming: enableWorldbookStreaming.value,
      });
    }

    // 加载展开状态
    if (savedData.tools_expandedState) {
      toolExpandedState.value = new Map(Object.entries(savedData.tools_expandedState));
      console.log('✅ 已恢复展开状态:', Object.fromEntries(toolExpandedState.value));
    }

    // 加载世界书查看器数据
    if (savedData.tools_worldbookViewer) {
      selectedViewerWorldbook.value = savedData.tools_worldbookViewer.selectedWorldbook || '';
      viewerSearchQuery.value = savedData.tools_worldbookViewer.searchQuery || '';
      viewerSortBy.value = savedData.tools_worldbookViewer.sortBy || 'original';
      console.log('✅ 已恢复世界书查看器数据:', {
        selectedWorldbook: selectedViewerWorldbook.value,
        searchQuery: viewerSearchQuery.value,
        sortBy: viewerSortBy.value,
      });

      // 如果已选择世界书，自动加载条目
      if (selectedViewerWorldbook.value) {
        console.log('🔄 自动加载已选择的世界书条目...');
        setTimeout(() => {
          loadWorldbookEntries();
        }, 200);
      }
    }

    // 延迟启用自动保存，避免加载时触发
    setTimeout(() => {
      isDataLoaded.value = true;
      console.log('✅ 数据加载完成，启用自动保存');
    }, 100);
  } catch (error) {
    console.error('❌ 加载工具数据失败:', error);
    isDataLoaded.value = true;
  }
};

// 保存工具数据到酒馆变量
const saveToolsDataImmediate = () => {
  // 只有在数据加载完成后才保存
  if (!isDataLoaded.value) {
    console.log('⏸️ 跳过保存：数据尚未加载完成');
    return;
  }

  try {
    const script_id = getScriptIdSafe();
    if (!script_id) {
      console.warn('⚠️ script_id 为空，无法保存数据');
      return;
    }

    const dataToSave = {
      tools_antiCliche: {
        input: antiClicheInput.value,
        output: antiClicheOutput.value,
        enableStreaming: enableAntiClicheStreaming.value,
        modifyRequest: antiClicheModifyRequest.value,
      },
      tools_characterCard: {
        description: characterDescription.value,
        output: characterCardOutput.value,
        modifyRequest: modifyRequest.value,
        enableStreaming: enableCharacterStreaming.value,
      },
      tools_worldbookEntry: {
        description: worldbookDescription.value,
        output: worldbookEntryOutput.value,
        selectedWorldbook: selectedWorldbook.value,
        modifyRequest: worldbookModifyRequest.value,
        enableStreaming: enableWorldbookStreaming.value,
      },
      tools_worldbookViewer: {
        selectedWorldbook: selectedViewerWorldbook.value,
        searchQuery: viewerSearchQuery.value,
        sortBy: viewerSortBy.value,
      },
      tools_expandedState: Object.fromEntries(toolExpandedState.value),
    };

    insertOrAssignVariables(klona(dataToSave), { type: 'script', script_id });
    console.log('💾 工具数据已保存:', {
      antiCliche_input_length: antiClicheInput.value.length,
      antiCliche_output_length: antiClicheOutput.value.length,
      character_desc_length: characterDescription.value.length,
      character_output_length: characterCardOutput.value.length,
    });
  } catch (error) {
    console.error('❌ 保存工具数据失败:', error);
  }
};

// 使用防抖来避免频繁保存（减少到300ms，更快响应）
const saveToolsData = debounce(saveToolsDataImmediate, 300);

// 监听数据变化并自动保存
watch(
  [
    antiClicheInput,
    antiClicheOutput,
    enableAntiClicheStreaming,
    antiClicheModifyRequest,
    characterDescription,
    characterCardOutput,
    modifyRequest,
    enableCharacterStreaming,
    worldbookDescription,
    worldbookEntryOutput,
    selectedWorldbook,
    worldbookModifyRequest,
    enableWorldbookStreaming,
    selectedViewerWorldbook,
    viewerSearchQuery,
    viewerSortBy,
    toolExpandedState,
  ],
  () => {
    if (isDataLoaded.value) {
      console.log('📝 数据变化，触发保存...');
      saveToolsData();
    }
  },
  { deep: true },
);

// 组件挂载时加载数据
onMounted(() => {
  console.log('🔧 ToolsTab 组件已挂载，加载数据...');
  loadToolsData();
  loadAvailableWorldbooks();
});

// 组件卸载前保存数据
onBeforeUnmount(() => {
  console.log('🔄 ToolsTab 组件即将卸载，保存数据...');
  // 取消防抖，立即保存
  saveToolsData.cancel();
  saveToolsDataImmediate();
});

// 切换工具展开状态
const toggleToolExpanded = (toolName: string) => {
  console.log('toggleToolExpanded 被调用，工具名称:', toolName);
  const current = toolExpandedState.value.get(toolName) || false;
  console.log('当前展开状态:', current);
  toolExpandedState.value.set(toolName, !current);
  console.log('新的展开状态:', !current);
};

// 检查工具是否展开
const isToolExpanded = (toolName: string) => {
  return toolExpandedState.value.get(toolName) || false;
};

// copyToClipboard 函数已从 utils.ts 导入

// 反八股工具处理函数
const handleAntiClicheProcess = async () => {
  if (!antiClicheInput.value.trim()) {
    window.toastr.warning('请输入需要清理的文本');
    return;
  }

  try {
    isProcessingAntiCliche.value = true;
    antiClicheProgressPercent.value = 0;
    window.toastr.info('AI正在分析文本...', '反八股清理', { timeOut: 15000 });

    const requestPayload = {
      model: settings.value.model,
      max_tokens: settings.value.max_tokens || 8000,
      temperature: 0.7,
      stream: enableAntiClicheStreaming.value,
      messages: [
        {
          role: 'system',
          content: `你是一个文本编辑助手，负责清理角色卡、世界书和开场白中的**明显八股表述**。

## 🎯 核心原则（最重要！）

⚠️ **保持信息完整度：清理八股的同时，必须保留原文的核心信息和内容量**
⚠️ **适度清理：只删除最明显的八股，不要过度删减**
⚠️ **保持长度：输出长度应该接近输入长度，不要大幅缩短**
⚠️ **删除精确数字：身高、体重、罩杯等精确数字要删除或改为模糊描述（"高"、"瘦"、"丰满"）**

## 清理重点（按优先级排序）

### 🔴 反八股核心规则（必须严格遵守）

#### 1. 禁止的词汇和句式
- **模糊词**：一丝、一抹、一些、一种、似乎、几乎、近乎、仿佛、可能、大概
- **比喻词**：如同、宛如、恰似、像是、好像、像、就像、若有若无
- **对比句**："不是...而是..."、"与其...不如"、"形成了鲜明的对比"
- **强调词**："猛地"、"重重地"、"狂野"、"激烈地"、"恨不得"、"狂喜"、"不容置疑"
- **修饰词**："不易察觉"、"难以察觉"、"带着xx意味"、"带着一种"、"充满了某种"、"并没有立刻"
- **动作词**："揉进身体"、"指甲掐进"、"弓起"、"吞噬"
- **"一"+量词句式**：一抹微笑、一丝不安、一种感觉（全部删除）
- **精确数字**：身高168cm/一米六八、体重50kg、罩杯C（改为"高"、"瘦"、"丰满"或直接删除）

#### 2. 禁止的描写内容
- ❌ **眼神/视线/嘴角**：不描写"眼里闪过xxx"、"嘴角上扬"、"视线交汇"
- ❌ **心理状态**：不描写"她感到害怕"、"他内心矛盾"（改用对白或行为呈现）
- ❌ **气氛**：不描写"气氛凝重"、"空气凝固"
- ❌ **动物比喻**：不用"像小兽"、"像猫咪"、"野兽般的低吼"
- ❌ **声音描述**：不描写"声音沙哑"、"声音里带着..."、"嗓音听起来..."、音量/音高/音质/速度
- ❌ **对白补充**：不描述对白的语气、意图、功能，只呈现对白本身

#### 3. 所有格主语规则
- ❌ 禁止："她的声音"、"他的眼神"、"我的心情"
- ✅ 改为：直接用名词或代词作主语，或直接删除

#### 4. 动作描写规则
- ✅ **只呈现动作结果**：不总结、不评价、不解释意图
- ❌ 错误："他愤怒地砸了杯子"（评价）
- ✅ 正确："他砸了杯子"（只呈现动作）

#### 5. 情绪/感受呈现规则
- ✅ **用对白或行为呈现**，不直述
- ❌ 错误："她感到害怕"
- ✅ 正确："别过来！"（对白）或"她往后退了一步"（行为）

#### 6. 对白规则
- ✅ 只用""包裹的台词和拟声词
- ✅ 要有日常感和生活感，避免翻译腔
- ❌ 不术语、不数据、不报告、不分析

#### 7. 数据化描述规则
- ❌ 禁止精确数字：身高（168cm、一米六八）、体重（50kg）、罩杯（C罩杯）
- ❌ 禁止术语化：术语、专业名词、分析性描述
- ✅ 改为模糊描述：高、矮、瘦、胖、丰满等口语化词汇
- ✅ 或者直接删除：如果数字不重要就删掉

### 🟢 优先级3：可以保留的内容
1. **具体动作描述**：走、坐、站、拿、放等基本动作
2. **简单情绪词**：开心、难过、生气（不要删除）
3. **对话内容**：完整保留所有对话
4. **设定信息**：人物背景、关系、场景等核心设定

## ⚠️ 严禁过度删减

**不要做的事情：**
❌ 不要删除整个句子，只删除八股词汇
❌ 不要把五段话压缩成三句话
❌ 不要删除核心设定和重要信息
❌ 不要把详细描述变成简略概括
❌ 不要删除对话内容

**应该做的事情：**
✅ 只删除/替换明显的八股词汇
✅ **重写模板化比喻**：用口语化、自然的表达替换套话
✅ **说人话**：不要简单删除，而是用更自然的表达方式替换
✅ **去掉对仗式结构**：把"既...又..."改为口语化的并列
✅ 保持原文的信息量和结构
✅ 保留所有对话和核心设定
✅ 输出应该和输入长度相近，信息量不能少

## 📖 文笔提升指南

**核心原则：用人话说话，别文学腔，但保持信息量**

### ✍️ 好文笔的特征
1. **口语化、日常化**：
   - ❌ 文学腔："醇厚的香气扑面而来"
   - ✅ 口语化："闻到酒味了"、"有股酒香"

2. **简洁直接**：
   - ❌ 堆砌："她那双如同黑曜石般璀璨夺目、深邃无比、宛如深渊的眼眸"
   - ✅ 简洁："她黑色的眼睛很深"、"黑眼睛，看不出在想什么"

3. **真实的人话**：
   - ❌ 刻意："心中涌起一股既矛盾又复杂的情绪，仿佛是恐惧与期待的混合体"
   - ✅ 人话："又怕又期待"、"心里矛盾得很"

4. **动作要具体**：
   - ❌ 抽象："她的声音如同野兽般的低吼"、"她的声音带着压迫感"
   - ✅ 具体："她压低了声音"、"声音很低"、"声音哑了"

5. **感官描写别夸张**：
   - ❌ 夸张："一股诱人的香气"、"致命的吸引力"
   - ✅ 自然："好闻"、"让人想多闻两下"、"香味很浓"

### 🎨 参考风格
- **海明威**：短句、有力、克制、感官细节准确
- **村上春树**：具体意象、日常化比喻、轻松叙述
- **优质网文**：流畅、有节奏感、不卖弄、读起来舒服

### 💡 实战技巧
1. **去掉文学腔**：把"致命的诱惑"改成"忍不住想靠近"，把"醇厚的香气"改成"酒香很浓"
2. **去掉对仗**：把"既...又..."改成口语化的并列："又怕又期待"、"香味混在一起"
3. **去掉比喻**：把"如同野兽般的低吼"直接删掉，或者改成"声音很低"
4. **用人话说话**：把"矛盾而极具吸引力"改成"说不上来，但就是想看"
5. **别太文艺**：把"冷暖交织的气息"改成"冷香和酒味混在一起"

## 📋 反八股示例对比

### 示例1：基础去八股

**输入（包含基础八股）：**
角色A似乎有些困惑，眼里闪过一丝不易察觉的疑惑，她用不容置疑的语气说："你是谁？"她的声音低沉而富有磁性，如同野兽般的低吼。

角色A出生于贵族家庭，她有着一头如同黑曜石般的长发，双眸宛如深邃的湖泊，身高168cm，罩杯C。

她的性格并不是温柔的，而是傲慢且狂热的。她喜欢阅读，经常一个人待在图书馆里。

她对魔法有着近乎狂热的追求，仿佛那是她生命的全部意义。她的内心深处隐藏着巨大的恐惧。

语料："哼，你这种凡人怎么会理解我的想法。"（带着不屑的口吻）

**❌ 错误输出（过度删减）：**
角色A问："你是谁？"
角色A出生于贵族家庭，有黑色长发。
语料："你不会理解我的想法。"

**✅ 正确输出（应用反八股规则）：**
角色A停了停。"你是谁？"

角色A出生于贵族家庭，黑色长发，黑眼睛，个子高，胸部丰满。

角色A傲慢，对很多事都很热情。喜欢阅读，经常一个人待在图书馆。

角色A对魔法很痴迷，投入了很多时间研究。她怕一些东西。

语料："哼，你这种凡人怎么会理解我的想法。"

**改进说明：**
1. "似乎有些困惑" → "停了停"（用行为代替心理）
2. "眼里闪过一丝不易察觉的疑惑" → 删除（禁止眼神描写）
3. "她的声音低沉而富有磁性，如同野兽般的低吼" → 删除（禁止声音描写和动物比喻）
4. "如同黑曜石般"、"宛如深邃的湖泊" → 删除（禁止明喻）
5. "她的性格并不是...而是..." → "角色A傲慢"（删除所有格主语和对比句）
6. "近乎"、"仿佛" → 删除（禁止模糊词）
7. "身高168cm"、"罩杯C" → "个子高"（删除精确数字）
8. "（带着不屑的口吻）" → 删除（禁止对白补充）

### 示例2：信息素描写去八股

**输入（包含大量八股）：**
一阵既冷冽又醇厚的香气飘来，混合着冬日雪松与温热白兰地的味道，矛盾而极具吸引力。浓郁而滚烫的信息素正从他身上源源不断地散发出来，那冰冷的雪杉气息已经被醇厚的白兰地酒香彻底包裹，充满了毫无防备的、致命的诱惑。

**✅ 正确输出（应用反八股规则）：**
闻到香味，雪松和白兰地混在一起。滚烫的信息素从他身上散出来，雪杉味被酒香盖过了。

**改进说明：**
1. "既...又..." → 删除（禁止对比句式）
2. "矛盾而极具吸引力" → 删除（禁止抽象描述）
3. "浓郁而滚烫" → "滚烫"（删除冗余形容词）
4. "醇厚"、"冰冷" → 删除（删除非必要形容词）
5. "充满了毫无防备的、致命的诱惑" → 删除（禁止抽象描述）
6. "一阵" → "闻到"（删除"一"+量词句式）


## 🎯 输出要求

1. **保持段落数量**：输入有几段，输出也应该有几段
2. **保持信息量**：所有重要信息都要保留，不要过度删减
3. **严格应用反八股规则**：
   - 删除所有禁止的词汇（模糊词、比喻词、强调词等）
   - 删除所有禁止的描写（眼神、声音、心理、气氛等）
   - 删除所有格主语（"她的"、"他的"）
   - 用行为或对白代替心理描写
   - 对白不加任何补充说明
4. **保持自然**：删除后的文本应该读起来自然流畅，不生硬
5. **只删八股词**：只针对性地删除上述禁用词，不要大范围删减
6. **直接输出**：不要添加任何解释或说明

请按照以上标准清理文本，**特别注意不要过度删减内容**。`,
        },
        {
          role: 'user',
          content: antiClicheInput.value,
        },
      ],
    };

    let generatedText: string;

    if (enableAntiClicheStreaming.value) {
      // 流式生成
      generatedText = await generateWithStreaming(requestPayload, antiClicheProgressPercent);
    } else {
      // 非流式生成
      const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.value.api_key}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      generatedText = data.choices[0].message.content.trim();
      antiClicheProgressPercent.value = 100;
    }

    antiClicheOutput.value = generatedText;
    saveToolsDataImmediate(); // 立即保存结果

    window.toastr.success('文本清理完成！');
  } catch (error) {
    console.error('反八股清理失败:', error);
    window.toastr.error('清理失败：' + (error as Error).message);
  } finally {
    isProcessingAntiCliche.value = false;
    antiClicheProgressPercent.value = 0;
  }
};

const copyAntiClicheResult = () => {
  if (!antiClicheOutput.value) {
    window.toastr.warning('没有可复制的内容');
    return;
  }

  // 使用统一的复制函数
  copyToClipboard(antiClicheOutput.value, '清理结果已复制到剪贴板');
};

// 反八股修改处理函数
const handleModifyAntiCliche = async () => {
  if (!antiClicheModifyRequest.value.trim()) {
    window.toastr.warning('请输入修改需求');
    return;
  }

  if (!antiClicheOutput.value) {
    window.toastr.warning('没有可修改的内容');
    return;
  }

  try {
    isModifyingAntiCliche.value = true;
    antiClicheProgressPercent.value = 0;
    window.toastr.info('AI正在修改...', '反八股修改', { timeOut: 15000 });

    const requestPayload = {
      model: settings.value.model,
      max_tokens: settings.value.max_tokens || 8000,
      temperature: 0.7,
      stream: enableAntiClicheStreaming.value,
      messages: [
        {
          role: 'system',
          content:
            '你是一个文本编辑助手。根据用户的修改需求，对提供的文本进行修改。直接输出修改后的结果，不要添加任何解释或说明。',
        },
        {
          role: 'user',
          content: `当前文本：\n${antiClicheOutput.value}\n\n修改需求：${antiClicheModifyRequest.value}`,
        },
      ],
    };

    let modifiedText: string;

    if (enableAntiClicheStreaming.value) {
      // 流式生成
      modifiedText = await generateWithStreaming(requestPayload, antiClicheProgressPercent);
    } else {
      // 非流式生成
      const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.value.api_key}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      modifiedText = data.choices[0].message.content.trim();
      antiClicheProgressPercent.value = 100;
    }

    antiClicheOutput.value = modifiedText;
    saveToolsDataImmediate(); // 立即保存结果

    window.toastr.success('修改完成！');
  } catch (error) {
    console.error('反八股修改失败:', error);
    window.toastr.error('修改失败：' + (error as Error).message);
  } finally {
    isModifyingAntiCliche.value = false;
    antiClicheProgressPercent.value = 0;
  }
};

// 清空反八股修改需求
const clearAntiClicheModifyRequest = () => {
  antiClicheModifyRequest.value = '';
  saveToolsDataImmediate();
  window.toastr.success('修改需求已清空');
};

// 角色卡生成工具相关函数
const handleGenerateCharacterCard = async () => {
  if (!characterDescription.value.trim()) {
    window.toastr.warning('请输入角色描述');
    return;
  }

  try {
    isGeneratingCharacter.value = true;
    characterProgressPercent.value = 0;
    window.toastr.info('AI正在生成角色卡，请稍候...');

    const requestPayload = {
      model: settings.value.model || 'gpt-3.5-turbo',
      max_tokens: settings.value.max_tokens || 16000,
      temperature: 0.8,
      stream: enableCharacterStreaming.value,
      messages: [
        {
          role: 'system',
          content: `你是一个角色卡生成助手。请系统性地创建一个完整的角色卡。

**输出格式要求**：
- 必须使用 YAML 格式，所有字段名和内容都用中文
- 确保输出完整，不要截断
- 避免AI刻板化，要有多样性和真实感
- 严格避免任何AI指令式语言

**角色卡结构模板**：
\`\`\`yaml
基础信息:
  姓名: "全名"
  年龄: 具体年龄
  出生年月: "YYYY年MM月"
  性别: "男/女/其他"
  第二性别: "Alpha/Beta/Omega/无"
  身高体重: "身高用文字描述（高大/中等/娇小等），体重用文字描述（匀称/纤瘦/丰满等）"
  信息素: "描述气味特征和变化规律（如适用）"
  性取向: "异性恋/同性恋/双性恋等"
  恋爱经验: "详细描述"
  身份职业: "具体职业和社会地位"
  标志性特征:
    微信昵称: "昵称"
    头像: "描述"
    其他: "其他标志性特征"

外貌与身材:
  整体身形: "高矮胖瘦、肌肉类型的详细描述"
  面容特征:
    发型: "发型、发色、发质"
    肤色: "肤色描述"
    眼睛: "眼睛颜色和特征"
    五官: "五官特点"
  穿搭风格: "日常穿搭偏好和风格"
  声音特征: "音色、音调、说话节奏"
  习惯性动作: "常见的姿态和小动作"

性格与心理:
  主要性格特征:
    - 特质1: "具体表现和行为模式"
    - 特质2: "具体表现和行为模式"
    - 特质3: "具体表现和行为模式"
  性格的两面性: "在不同情况下展现的不同侧面（例如：平时温和但触及底线时强硬）"
  情绪模式:
    常见情绪: "日常主要情绪状态"
    情绪触发点: "什么容易引发情绪波动"
    情绪表达方式: "如何表现和处理情绪"
  应对压力: "面对压力和困境时的反应和处理方式"

对话风格:
  日常语气: "用词习惯和说话特点"
  对不同对象:
    亲近的人: "说话方式"
    陌生人: "说话方式"
    工作场合: "说话方式"
  情绪变化时: "情绪激动/低落时的语言变化"
  口头禅: ["口头禅1", "口头禅2"]

背景经历:
  家庭背景: "详细的家庭环境和成长背景"
  教育经历: "学习经历"
  重要人生事件: ["事件1", "事件2", "事件3"]
  关键转折点: "改变TA的重要事件"
  当前状况: "现在的生活状态"
  人生目标: "TA想要达成的目标"

人际关系:
  对主要角色的态度: "与{{user}}或其他重要角色的互动模式"
  社交偏好: "喜欢的社交方式和边界"
  群体角色: "在团队中的定位（领导者/协调者/观察者等）"
  冲突处理: "如何处理矛盾和冲突"

行为模式与动机:
  典型行为:
    主动倾向: "TA倾向于主动做什么事情"
    回避倾向: "TA会避免或拒绝做什么"
    习惯反应: "在特定情况下的典型反应"
  底线与原则: "TA坚守的原则和不可触碰的底线"
  内在动机:
    行动驱动: "推动TA行动的内在原因"
    深层需求: "TA内心真正渴望的是什么"
    隐藏想法: "TA不轻易表露的真实想法"
  情绪管理:
    失控边界: "什么情况下会情绪失控"
    恢复方式: "如何平复情绪和自我调节"
\`\`\`

请基于用户的描述，生成一个完整、立体、真实的角色。注意：
1. 身高体重必须用文字描述，不要用数字和单位
2. 性格要展现多面性和复杂性，避免单一化和刻板印象
3. 行为模式要从角色视角出发，描述TA会如何思考和行动
4. 所有内容要详细丰富，有具体例子和场景`,
        },
        {
          role: 'user',
          content: characterDescription.value,
        },
      ],
    };

    let generatedText: string;

    if (enableCharacterStreaming.value) {
      // 流式生成
      generatedText = await generateWithStreaming(requestPayload, characterProgressPercent);
    } else {
      // 非流式生成
      const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.value.api_key}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      generatedText = data.choices[0].message.content.trim();
      characterProgressPercent.value = 100;
    }

    characterCardOutput.value = generatedText;
    saveToolsDataImmediate(); // 立即保存结果

    window.toastr.success('角色卡生成完成！');
  } catch (error) {
    console.error('角色卡生成失败:', error);
    window.toastr.error('生成失败：' + (error as Error).message);
  } finally {
    isGeneratingCharacter.value = false;
    characterProgressPercent.value = 0;
  }
};

const clearCharacterForm = () => {
  characterDescription.value = '';
  characterCardOutput.value = '';
  modifyRequest.value = '';
  saveToolsDataImmediate(); // 立即保存
  window.toastr.success('内容已清空');
};

const copyCharacterCard = () => {
  if (!characterCardOutput.value) {
    window.toastr.warning('没有可复制的内容');
    return;
  }

  // 使用统一的复制函数
  copyToClipboard(characterCardOutput.value, '角色卡已复制到剪贴板');
};

// 清空反八股表单
const clearAntiClicheForm = () => {
  antiClicheInput.value = '';
  antiClicheOutput.value = '';
  saveToolsDataImmediate(); // 立即保存
  window.toastr.success('内容已清空');
};

// 修改角色卡
const handleModifyCharacterCard = async () => {
  if (!modifyRequest.value.trim()) {
    window.toastr.warning('请输入修改需求');
    return;
  }

  if (!characterCardOutput.value) {
    window.toastr.warning('没有可修改的角色卡，请先生成角色卡');
    return;
  }

  try {
    isModifyingCharacter.value = true;
    characterProgressPercent.value = 0;
    window.toastr.info('AI正在根据你的需求修改角色卡，请稍候...');

    const requestPayload = {
      model: settings.value.model || 'gpt-3.5-turbo',
      max_tokens: settings.value.max_tokens || 16000,
      temperature: 0.8,
      stream: enableCharacterStreaming.value,
      messages: [
        {
          role: 'system',
          content: `你是一个角色卡编辑助手。用户会提供一个现有的 YAML 格式角色卡和修改需求，请根据修改需求调整角色卡内容。

**修改原则**：
1. 必须保持 YAML 格式，所有字段名和内容都使用中文
2. 只修改用户明确要求修改的部分
3. 确保修改后的内容与原有角色卡风格一致
4. 如果用户的要求与原有设定冲突，以用户的要求为准
5. 输出完整的修改后的角色卡，不要截断
6. 保持原有的字段结构，除非用户要求添加或删除字段

**重要注意事项**：
- 身高体重必须用文字描述（高大/中等/娇小/匀称/纤瘦等），不要用数字和单位
- 保持性格的多面性和复杂性，避免单一化
- 行为模式要从角色视角出发，描述角色会如何思考和行动
- 避免AI刻板化，保持角色的真实感和多样性

请输出完整的 YAML 格式角色卡。`,
        },
        {
          role: 'user',
          content: `以下是现有的角色卡：

${characterCardOutput.value}

---

请根据以下修改需求调整角色卡：
${modifyRequest.value}`,
        },
      ],
    };

    let modifiedCard: string;

    if (enableCharacterStreaming.value) {
      // 流式生成
      modifiedCard = await generateWithStreaming(requestPayload, characterProgressPercent);
    } else {
      // 非流式生成
      const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.value.api_key}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      modifiedCard = data.choices[0].message.content.trim();
      characterProgressPercent.value = 100;
    }

    characterCardOutput.value = modifiedCard;
    modifyRequest.value = ''; // 清空修改需求
    saveToolsDataImmediate(); // 立即保存结果

    window.toastr.success('角色卡修改完成！');
  } catch (error) {
    console.error('角色卡修改失败:', error);
    window.toastr.error('修改失败：' + (error as Error).message);
  } finally {
    isModifyingCharacter.value = false;
    characterProgressPercent.value = 0;
  }
};

// 清空修改需求
const clearModifyRequest = () => {
  modifyRequest.value = '';
  saveToolsDataImmediate(); // 立即保存
  window.toastr.success('修改需求已清空');
};

// ==================== 通用流式生成辅助函数 ====================

// 从流式响应中提取内容
const extractStreamContent = (chunk: any): string | null => {
  // OpenAI 格式
  if (chunk.choices?.[0]?.delta?.content) {
    return chunk.choices[0].delta.content;
  }
  // Claude 格式
  if (chunk.delta?.text) {
    return chunk.delta.text;
  }
  // 直接内容格式
  if (typeof chunk.content === 'string') {
    return chunk.content;
  }
  if (typeof chunk.text === 'string') {
    return chunk.text;
  }
  if (typeof chunk.response === 'string') {
    return chunk.response;
  }
  return null;
};

// 通用流式生成函数
const generateWithStreaming = async (
  requestPayload: Record<string, any>,
  progressRef: Ref<number>,
): Promise<string> => {
  const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.value.api_key}`,
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`流式请求失败：${response.status} ${response.statusText}\n${errorText.slice(0, 400)}`);
  }

  if (!response.body) {
    throw new Error('该 API 未返回可读流，请关闭流式模式或检查端点支持情况');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let done = false;
  let result = '';

  progressRef.value = 0;

  const processLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed) {
      return false;
    }

    if (trimmed === 'data: [DONE]' || trimmed === '[DONE]') {
      return true;
    }

    const payloadText = trimmed.startsWith('data:') ? trimmed.slice(5).trim() : trimmed;
    if (!payloadText || payloadText === '[DONE]') {
      return false;
    }

    try {
      const payloadJson = JSON.parse(payloadText);
      const deltaText = extractStreamContent(payloadJson);
      if (deltaText) {
        result += deltaText;
        progressRef.value = Math.min(progressRef.value + 2, 98);
      }
    } catch (parseError) {
      console.warn('无法解析流式数据块:', payloadText.slice(0, 100), parseError);
    }

    return false;
  };

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (processLine(line)) {
          done = true;
          break;
        }
      }
    }

    if (readerDone) {
      done = true;
    }
  }

  if (buffer && !done) {
    processLine(buffer);
  }

  progressRef.value = 100;
  return result;
};

// ==================== 世界书条目生成工具 ====================

// 生成世界书条目
const handleGenerateWorldbookEntry = async () => {
  if (!worldbookDescription.value.trim()) {
    window.toastr.warning('请输入条目描述');
    return;
  }

  try {
    isGeneratingWorldbook.value = true;
    worldbookProgressPercent.value = 0;
    window.toastr.info('AI正在生成世界书条目，请稍候...', '', { timeOut: 15000 });

    const requestPayload = {
      model: settings.value.model || 'gpt-3.5-turbo',
      max_tokens: settings.value.max_tokens || 4000,
      temperature: 0.7,
      stream: enableWorldbookStreaming.value,
      messages: [
        {
          role: 'system',
          content: `你是一个世界书条目生成助手。用户会描述他们想要的世界书条目内容，你需要生成符合 SillyTavern 世界书格式的 JSON 数据。

**世界书条目的结构**：
\`\`\`typescript
{
  "name": "条目名称",
  "enabled": true,
  "strategy": {
    "type": "selective",  // "constant"(蓝灯-常量) 或 "selective"(绿灯-可选项)
    "keys": ["关键字1", "关键字2"],  // 主要关键字数组
    "keys_secondary": {
      "logic": "and_any",  // "and_any" | "and_all" | "not_all" | "not_any"
      "keys": []  // 次要关键字数组，通常留空
    },
    "scan_depth": "same_as_global"  // 或者具体数字如 10
  },
  "position": {
    "type": "after_character_definition",  // 常见: "after_character_definition" | "at_depth"
    "role": "system",  // "system" | "assistant" | "user"
    "depth": 4,
    "order": 100
  },
  "content": "条目的实际内容文本",
  "probability": 100,  // 激活概率，通常是 100
  "recursion": {
    "prevent_incoming": false,
    "prevent_outgoing": false,
    "delay_until": null
  },
  "effect": {
    "sticky": null,
    "cooldown": null,
    "delay": null
  }
}
\`\`\`

**生成原则**：
1. **名称 (name)**：简洁明确，反映条目主题（如角色名、地点名、物品名）
2. **激活策略 (strategy.type)**：
   - 如果是需要根据关键字激活的内容（如角色、地点、物品），使用 "selective" (绿灯)
   - 如果是应该始终生效的设定（如世界观规则、基础设定），使用 "constant" (蓝灯)
3. **关键字 (strategy.keys)**：
   - 提取与内容相关的核心关键字
   - 包含名称、别名、相关概念
   - 通常 3-6 个关键字
4. **内容 (content)**：
   - **务必包含用户提供的所有详细信息**
   - 结构化、简洁、信息密度高
   - 使用陈述式肯定语句，避免八股修辞
   - 如果用户提供了具体设定（年龄、性别、职业、家庭背景等），**必须全部体现在 content 中**
   - 可以适当补充合理的细节，但**不能遗漏用户明确提供的信息**
5. **位置 (position.type)**：
   - 通常使用 "after_character_definition"（在角色定义之后）
   - 特殊情况可使用 "at_depth" 指定深度
6. **其他字段保持默认值即可**

**示例 1：角色条目**
用户描述："创建角色【林潜】的条目，16岁，男，高中生，普通家庭"
输出：
\`\`\`json
{
  "name": "林潜",
  "enabled": true,
  "strategy": {
    "type": "selective",
    "keys": ["林潜", "林", "潜"],
    "keys_secondary": { "logic": "and_any", "keys": [] },
    "scan_depth": "same_as_global"
  },
  "position": {
    "type": "after_character_definition",
    "role": "system",
    "depth": 4,
    "order": 100
  },
  "content": "林潜，男性，16岁，目前就读高中。出身于普通家庭，家庭经济状况中等。性格较为内向，在学校成绩中等偏上。平时喜欢独自思考，不太擅长与人交际。",
  "probability": 100,
  "recursion": {
    "prevent_incoming": false,
    "prevent_outgoing": false,
    "delay_until": null
  },
  "effect": {
    "sticky": null,
    "cooldown": null,
    "delay": null
  }
}
\`\`\`

**示例 2：地点条目**
用户描述："创建一个关于魔法学院的条目，包含学院历史和规则"
输出：
\`\`\`json
{
  "name": "星辉魔法学院",
  "enabled": true,
  "strategy": {
    "type": "selective",
    "keys": ["星辉魔法学院", "魔法学院", "学院", "星辉"],
    "keys_secondary": { "logic": "and_any", "keys": [] },
    "scan_depth": "same_as_global"
  },
  "position": {
    "type": "after_character_definition",
    "role": "system",
    "depth": 4,
    "order": 100
  },
  "content": "星辉魔法学院是一所历史悠久的魔法教育机构，建立于三百年前。学院坐落在浮空岛上，共有七座高塔，分别对应七大魔法流派：元素、心灵、转化、召唤、预言、防护、幻术。学院实行学分制，学生需要完成基础课程和专精课程才能毕业。学院规则严格：禁止在教学区域施展未经许可的魔法，禁止擅自进入禁书区，禁止私下决斗。",
  "probability": 100,
  "recursion": {
    "prevent_incoming": false,
    "prevent_outgoing": false,
    "delay_until": null
  },
  "effect": {
    "sticky": null,
    "cooldown": null,
    "delay": null
  }
}
\`\`\`

**重要**：
- 只输出 JSON 数据，不要添加任何解释
- 确保 JSON 格式正确，可以被解析
- **content 字段必须包含用户提供的所有详细信息，不能遗漏**
- 如果用户给出了多个属性（年龄、性别、职业等），每个都要在 content 中明确体现
- 根据用户描述的内容类型，智能选择 strategy.type`,
        },
        {
          role: 'user',
          content: worldbookDescription.value,
        },
      ],
    };

    let generatedText: string;

    if (enableWorldbookStreaming.value) {
      // 流式生成
      generatedText = await generateWithStreaming(requestPayload, worldbookProgressPercent);
    } else {
      // 非流式生成
      const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.value.api_key}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      generatedText = data.choices[0].message.content.trim();
      worldbookProgressPercent.value = 100;
    }

    // 尝试解析 JSON
    try {
      // 提取 JSON 部分（如果有代码块包裹）
      const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, generatedText];
      const jsonText = jsonMatch[1] || generatedText;

      const parsedEntry = JSON.parse(jsonText);
      worldbookEntryOutput.value = parsedEntry;
      saveToolsDataImmediate(); // 立即保存结果

      window.toastr.success('世界书条目生成完成！');
    } catch (parseError) {
      console.error('JSON 解析失败:', parseError);
      console.log('原始响应:', generatedText);
      window.toastr.error('生成的内容格式错误，请重试');
    }
  } catch (error) {
    console.error('世界书条目生成失败:', error);
    window.toastr.error('生成失败：' + (error as Error).message);
  } finally {
    isGeneratingWorldbook.value = false;
    worldbookProgressPercent.value = 0;
  }
};

// 清空世界书表单
const clearWorldbookForm = () => {
  worldbookDescription.value = '';
  worldbookEntryOutput.value = null;
  selectedWorldbook.value = '';
  worldbookModifyRequest.value = '';
  saveToolsDataImmediate(); // 立即保存
  window.toastr.success('内容已清空');
};

// 插入条目到世界书
const handleInsertEntry = async () => {
  if (!selectedWorldbook.value) {
    window.toastr.warning('请选择目标世界书');
    return;
  }

  if (!worldbookEntryOutput.value) {
    window.toastr.warning('没有可插入的条目');
    return;
  }

  try {
    isInsertingEntry.value = true;
    window.toastr.info(`正在插入条目到「${selectedWorldbook.value}」...`);

    // 使用 createWorldbookEntries 插入条目
    await createWorldbookEntries(selectedWorldbook.value, [worldbookEntryOutput.value], { render: 'immediate' });

    window.toastr.success(`✅ 条目已成功插入到「${selectedWorldbook.value}」`);
  } catch (error) {
    console.error('插入条目失败:', error);
    window.toastr.error('插入失败：' + (error as Error).message);
  } finally {
    isInsertingEntry.value = false;
  }
};

// 复制世界书条目 JSON
const copyWorldbookEntry = () => {
  if (!worldbookEntryOutput.value) {
    window.toastr.warning('没有可复制的内容');
    return;
  }

  const jsonText = JSON.stringify(worldbookEntryOutput.value, null, 2);
  copyToClipboard(jsonText, '世界书条目 JSON 已复制到剪贴板');
};

// 修改世界书条目
const handleModifyWorldbookEntry = async () => {
  if (!worldbookModifyRequest.value.trim()) {
    window.toastr.warning('请输入修改需求');
    return;
  }

  if (!worldbookEntryOutput.value) {
    window.toastr.warning('没有可修改的条目，请先生成条目');
    return;
  }

  try {
    isModifyingWorldbook.value = true;
    worldbookProgressPercent.value = 0;
    window.toastr.info('AI正在根据你的需求修改世界书条目，请稍候...');

    const requestPayload = {
      model: settings.value.model || 'gpt-3.5-turbo',
      max_tokens: settings.value.max_tokens || 4000,
      temperature: 0.7,
      stream: enableWorldbookStreaming.value,
      messages: [
        {
          role: 'system',
          content: `你是一个世界书条目编辑助手。用户会提供一个现有的世界书条目 JSON 和修改需求，请根据修改需求调整条目内容。

**修改原则**：
1. 必须保持 JSON 格式正确
2. 只修改用户明确要求修改的部分
3. 确保修改后的内容与原有条目风格一致
4. 如果用户的要求与原有设定冲突，以用户的要求为准
5. 输出完整的修改后的 JSON，不要截断
6. 保持原有的字段结构，除非用户要求添加或删除字段

**重要注意事项**：
- 如果修改内容 (content)，务必包含用户要求的所有信息
- 如果修改关键字 (keys)，要确保关键字与内容匹配
- 保持激活策略 (strategy.type) 的合理性
- 只输出 JSON 数据，不要添加任何解释

请输出完整的 JSON 格式世界书条目。`,
        },
        {
          role: 'user',
          content: `以下是现有的世界书条目：

${JSON.stringify(worldbookEntryOutput.value, null, 2)}

---

请根据以下修改需求调整条目：
${worldbookModifyRequest.value}`,
        },
      ],
    };

    let generatedText: string;

    if (enableWorldbookStreaming.value) {
      // 流式生成
      generatedText = await generateWithStreaming(requestPayload, worldbookProgressPercent);
    } else {
      // 非流式生成
      const apiUrl = normalizeApiEndpoint(settings.value.api_endpoint);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.value.api_key}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      generatedText = data.choices[0].message.content.trim();
      worldbookProgressPercent.value = 100;
    }

    // 尝试解析 JSON
    try {
      // 提取 JSON 部分（如果有代码块包裹）
      const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, generatedText];
      const jsonText = jsonMatch[1] || generatedText;

      const parsedEntry = JSON.parse(jsonText);
      worldbookEntryOutput.value = parsedEntry;
      worldbookModifyRequest.value = ''; // 清空修改需求
      saveToolsDataImmediate(); // 立即保存结果

      window.toastr.success('世界书条目修改完成！');
    } catch (parseError) {
      console.error('JSON 解析失败:', parseError);
      console.log('原始响应:', generatedText);
      window.toastr.error('修改的内容格式错误，请重试');
    }
  } catch (error) {
    console.error('世界书条目修改失败:', error);
    window.toastr.error('修改失败：' + (error as Error).message);
  } finally {
    isModifyingWorldbook.value = false;
    worldbookProgressPercent.value = 0;
  }
};

// 清空修改需求
const clearWorldbookModifyRequest = () => {
  worldbookModifyRequest.value = '';
  saveToolsDataImmediate(); // 立即保存
  window.toastr.success('修改需求已清空');
};

// ==================== 世界书查看器相关函数 ====================

// 加载世界书条目
const loadWorldbookEntries = async () => {
  if (!selectedViewerWorldbook.value) {
    worldbookEntries.value = [];
    return;
  }

  try {
    const worldbook = await getWorldbook(selectedViewerWorldbook.value);
    if (worldbook && Array.isArray(worldbook) && worldbook.length > 0) {
      worldbookEntries.value = worldbook;
      console.log(`✅ 已加载世界书 "${selectedViewerWorldbook.value}" 的 ${worldbookEntries.value.length} 个条目`);
      window.toastr.success(`已加载 ${worldbookEntries.value.length} 个条目`);
    } else {
      worldbookEntries.value = [];
      window.toastr.info('该世界书没有条目');
    }
  } catch (error) {
    console.error('❌ 加载世界书条目失败:', error);
    window.toastr.error('加载失败：' + (error as Error).message);
    worldbookEntries.value = [];
  }
};

// 计算过滤后的条目
const filteredWorldbookEntries = computed(() => {
  let entries = [...worldbookEntries.value];

  // 搜索过滤
  if (viewerSearchQuery.value.trim()) {
    const query = viewerSearchQuery.value.toLowerCase();
    entries = entries.filter(entry => {
      const nameMatch = entry.name?.toLowerCase().includes(query);
      const contentMatch = entry.content?.toLowerCase().includes(query);
      const keysMatch = entry.strategy?.keys?.some(key => {
        if (typeof key === 'string') {
          return key.toLowerCase().includes(query);
        } else if (key instanceof RegExp) {
          return key.toString().toLowerCase().includes(query);
        }
        return false;
      });
      return nameMatch || contentMatch || keysMatch;
    });
  }

  // 排序过滤
  if (viewerSortBy.value === 'enabled') {
    entries = entries.filter(entry => entry.enabled);
  } else if (viewerSortBy.value === 'disabled') {
    entries = entries.filter(entry => !entry.enabled);
  }

  return entries;
});

// 切换条目展开状态
const toggleEntryExpanded = (index: number) => {
  const current = entryExpandedState.value.get(index) || false;
  entryExpandedState.value.set(index, !current);
};

// 检查条目是否展开
const isEntryExpanded = (index: number) => {
  return entryExpandedState.value.get(index) || false;
};

// 编辑世界书条目
const editWorldbookEntry = (entry: WorldbookEntry) => {
  try {
    // 深拷贝条目数据，避免直接修改原数据
    editingEntry.value = {
      uid: entry.uid,
      name: entry.name || '',
      enabled: entry.enabled ?? true,
      content: entry.content || '',
      strategy: {
        type: entry.strategy?.type || 'selective',
        keys: [...(entry.strategy?.keys || [])],
        keys_secondary: {
          logic: entry.strategy?.keys_secondary?.logic || 'and_any',
          keys: [...(entry.strategy?.keys_secondary?.keys || [])],
        },
        scan_depth: entry.strategy?.scan_depth || 'same_as_global',
      },
      position: entry.position
        ? {
            type: entry.position.type || 'before_character_definition',
            role: entry.position.role || 'system',
            depth: entry.position.depth ?? 0,
            order: entry.position.order ?? 0,
          }
        : {
            type: 'before_character_definition',
            role: 'system',
            depth: 0,
            order: 0,
          },
      probability: entry.probability ?? 100,
      recursion: entry.recursion
        ? {
            prevent_incoming: entry.recursion.prevent_incoming ?? false,
            prevent_outgoing: entry.recursion.prevent_outgoing ?? false,
            delay_until: entry.recursion.delay_until ?? null,
          }
        : {
            prevent_incoming: false,
            prevent_outgoing: false,
            delay_until: null,
          },
      effect: entry.effect
        ? {
            sticky: entry.effect.sticky ?? null,
            cooldown: entry.effect.cooldown ?? null,
            delay: entry.effect.delay ?? null,
          }
        : {
            sticky: null,
            cooldown: null,
            delay: null,
          },
    };
    editingEntryUid.value = entry.uid;
    showEditDialog.value = true;
  } catch (error) {
    console.error('打开编辑界面失败:', error);
    window.toastr.error('打开编辑界面失败：' + (error as Error).message);
  }
};

// 保存编辑的条目
const saveEditedEntry = async () => {
  if (!editingEntry.value.name?.trim()) {
    window.toastr.warning('条目名称不能为空');
    return;
  }

  if (!editingEntryUid.value) {
    window.toastr.error('条目ID不存在');
    return;
  }

  try {
    // 使用 updateWorldbookWith API 更新条目
    const updatedWorldbook = await updateWorldbookWith(selectedViewerWorldbook.value, worldbook => {
      const entryIndex = worldbook.findIndex(e => e.uid === editingEntryUid.value);
      if (entryIndex !== -1) {
        // 更新条目
        worldbook[entryIndex] = {
          ...worldbook[entryIndex],
          ...editingEntry.value,
          uid: editingEntryUid.value, // 确保 UID 不变
        } as WorldbookEntry;
      }
      return worldbook;
    });

    // 更新本地数据
    worldbookEntries.value = updatedWorldbook;

    // 关闭对话框
    showEditDialog.value = false;
    editingEntry.value = {};
    editingEntryUid.value = null;

    window.toastr.success('条目已保存');
  } catch (error) {
    console.error('保存条目失败:', error);
    window.toastr.error('保存失败：' + (error as Error).message);
  }
};

// 删除世界书条目
const deleteWorldbookEntry = async (entry: WorldbookEntry) => {
  if (!confirm(`确定要删除条目 "${entry.name}" 吗？`)) {
    return;
  }

  try {
    // 使用 deleteWorldbookEntries API
    const { worldbook } = await deleteWorldbookEntries(selectedViewerWorldbook.value, e => e.uid === entry.uid);

    // 重新加载列表
    worldbookEntries.value = worldbook;

    window.toastr.success(`已删除条目 "${entry.name}"`);
  } catch (error) {
    console.error('删除条目失败:', error);
    window.toastr.error('删除失败：' + (error as Error).message);
  }
};
</script>

<style scoped>
.tools-tab {
  height: 100%;
  overflow-y: auto;
  padding: 25px !important;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  border: 1px solid #3a3a3a;
}

.section-header:hover {
  background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 反八股工具美化 */
.section-header-anti-cliche {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.95) 0%, rgba(58, 58, 58, 0.95) 100%) !important;
  border: 1px solid rgba(255, 107, 107, 0.3) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 107, 107, 0.1) inset !important;
  backdrop-filter: blur(10px);
}

.section-header-anti-cliche:hover {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(238, 90, 36, 0.2) 100%) !important;
  border-color: rgba(255, 107, 107, 0.5) !important;
  box-shadow:
    0 4px 16px rgba(255, 107, 107, 0.3),
    0 0 0 1px rgba(255, 107, 107, 0.2) inset !important;
  transform: translateY(-2px) !important;
}

/* 世界书条目生成工具美化 */
.section-header-worldbook {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.95) 0%, rgba(58, 58, 58, 0.95) 100%) !important;
  border: 1px solid rgba(255, 193, 7, 0.3) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 193, 7, 0.1) inset !important;
  backdrop-filter: blur(10px);
}

.section-header-worldbook:hover {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%) !important;
  border-color: rgba(255, 193, 7, 0.5) !important;
  box-shadow:
    0 4px 16px rgba(255, 193, 7, 0.3),
    0 0 0 1px rgba(255, 193, 7, 0.2) inset !important;
  transform: translateY(-2px) !important;
}

/* 角色卡生成工具美化 */
.section-header-character {
  background: linear-gradient(135deg, rgba(42, 42, 42, 0.95) 0%, rgba(58, 58, 58, 0.95) 100%) !important;
  border: 1px solid rgba(23, 162, 184, 0.3) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(23, 162, 184, 0.1) inset !important;
  backdrop-filter: blur(10px);
}

.section-header-character:hover {
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.2) 0%, rgba(19, 132, 150, 0.2) 100%) !important;
  border-color: rgba(23, 162, 184, 0.5) !important;
  box-shadow:
    0 4px 16px rgba(23, 162, 184, 0.3),
    0 0 0 1px rgba(23, 162, 184, 0.2) inset !important;
  transform: translateY(-2px) !important;
}

/* 工具区域整体美化 */
.tool-section-anti-cliche,
.tool-section-worldbook,
.tool-section-character {
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(26, 26, 26, 0.5);
  backdrop-filter: blur(5px);
}

.tool-content {
  background: #1e1e1e;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.tool-instructions {
  background: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 12px;
  color: #ccc;
  font-size: 12px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.output-section {
  margin-top: 20px;
}

.output-content {
  background: #1e1e1e;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 15px;
  color: #e0e0e0;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.output-actions {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.process-button,
.clear-button,
.generate-button,
.copy-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.process-button:hover:not(:disabled),
.clear-button:hover:not(:disabled),
.generate-button:hover:not(:disabled),
.copy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.copy-button:hover {
  background: #218838 !important;
}

.tool-instructions {
  background: #1a1a1a;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 12px;
  color: #ccc;
  font-size: 12px;
  margin-bottom: 15px;
}

/* 美化按钮的悬停效果 */
.process-button:hover:not(:disabled) .shimmer-effect,
.clear-button:hover:not(:disabled) .shimmer-effect,
.generate-button:hover:not(:disabled) .shimmer-effect,
.copy-button:hover .shimmer-effect {
  left: 100%;
}

.process-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.clear-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.generate-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 162, 184, 0.4);
}

.copy-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.process-button:disabled,
.clear-button:disabled,
.generate-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.process-button:disabled:hover,
.clear-button:disabled:hover,
.generate-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 滚动条样式 */
.output-content::-webkit-scrollbar {
  width: 6px;
}

.output-content::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}

.output-content::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 3px;
}

.output-content::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .output-actions {
    flex-direction: column;
  }
}
</style>
