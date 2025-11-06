<template>
  <div class="regex-ui-generator" style="padding: 25px !important; background: #1a1a1a !important">
    <!-- 标题 -->
    <div
      style="
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid rgba(102, 126, 234, 0.2);
      "
    >
      <h3 style="color: #4a9eff; margin: 0 0 10px 0; font-size: 20px; font-weight: 600">🔧 酒馆正则界面生成器</h3>
      <p style="color: #888; margin: 0; font-size: 14px; line-height: 1.6">
        AI 辅助生成酒馆正则替换界面，用自然语言描述即可生成完整的 HTML/CSS/JS 代码
      </p>
    </div>

    <!-- 新手使用流程 -->
    <div
      style="
        background: #2a2a2a;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        border-left: 4px solid #ffc107;
      "
    >
      <h4 style="color: #ffc107; margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center; gap: 8px">
        <i class="fa-solid fa-lightbulb"></i>
        新手使用流程（超简单！）：
      </h4>
      <ol style="margin: 0; padding-left: 20px; color: #ccc; line-height: 2">
        <li>
          <strong style="color: #fff">第1步：</strong> 输入触发词（比如
          <code style="background: #1a1a1a; padding: 2px 6px; border-radius: 3px; color: #4a9eff">【状态栏】</code>
          ）
        </li>
        <li><strong style="color: #fff">第2步：</strong> 用自然语言描述你想要的界面（省略技术细节）</li>
        <li><strong style="color: #fff">第3步：</strong> 点击"AI 生成"，等几秒钟，AI 自动生成代码</li>
        <li>
          <strong style="color: #fff">第4步：</strong> 看右侧<strong style="color: #51cf66">实时预览</strong
          >，不满意就点"AI 修改"继续调整
        </li>
        <li><strong style="color: #fff">第5步：</strong> 点击"复制正则"，直接粘贴到酒馆正则里就完了！</li>
        <li>
          <strong style="color: #fff">完成！</strong> 现在在聊天中输入
          <code style="background: #1a1a1a; padding: 2px 6px; border-radius: 3px; color: #51cf66">【状态栏】</code>
          就会显示你的界面了！
        </li>
      </ol>
    </div>

    <!-- 主内容区域：左右分栏 -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px">
      <!-- 左侧：输入区域 -->
      <div style="display: flex; flex-direction: column; gap: 20px">
        <!-- 触发关键词 -->
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px">
          <h4 style="color: #4a9eff; margin: 0 0 15px 0; font-size: 16px">
            <i class="fa-solid fa-key"></i>
            触发关键词:
          </h4>
          <input
            v-model="triggerKeyword"
            type="text"
            placeholder="输入触发词，例如：【开场白】"
            style="
              width: 100%;
              background: #1a1a1a;
              color: #e0e0e0;
              border: 1px solid #444;
              border-radius: 4px;
              padding: 12px;
              font-size: 14px;
            "
          />
        </div>

        <!-- 界面描述（AI 生成） -->
        <div
          style="background: #2a2a2a; padding: 20px; border-radius: 8px; flex: 1; display: flex; flex-direction: column"
        >
          <h4 style="color: #4a9eff; margin: 0 0 15px 0; font-size: 16px">
            <i class="fa-solid fa-magic"></i>
            界面描述（AI 生成）:
          </h4>
          <p style="color: #888; margin: 0 0 10px 0; font-size: 13px">
            用自然语言描述你想要的界面，比如：一个RPG游戏风格的状态栏，显示生命值、魔力值、经验值...
          </p>
          <textarea
            v-model="interfaceDescription"
            placeholder="详细描述你想要的界面（越详细越好）：&#10;- 说清楚你想要什么功能（如：生命值、魔力值、经验值）&#10;- 说清楚你想要什么样式（如：RPG游戏风格、赛博朋克、可爱风等）&#10;- 如果想要特殊效果（如：进度条、动画、按钮），也写清楚&#10;&#10;例如：&#10;我想要一个现代简洁风格的状态栏，显示当前日期、时间、地点、天气温度。"
            style="
              width: 100%;
              flex: 1;
              min-height: 200px;
              background: #1a1a1a;
              color: #e0e0e0;
              border: 1px solid #444;
              border-radius: 4px;
              padding: 12px;
              font-size: 14px;
              font-family: 'Consolas', monospace;
              resize: none;
              line-height: 1.6;
            "
          />

          <!-- AI 生成/修改按钮 -->
          <div style="display: flex; gap: 12px; margin-top: 15px">
            <button
              :disabled="!triggerKeyword || !interfaceDescription || isGenerating"
              style="
                flex: 1;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s;
              "
              :style="{ opacity: !triggerKeyword || !interfaceDescription || isGenerating ? 0.5 : 1 }"
              @click="generateWithAI"
            >
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              {{ isGenerating ? 'AI 生成中...' : generatedCode ? 'AI 重新生成' : 'AI 生成界面' }}
            </button>
            <button
              v-if="generatedCode"
              :disabled="isModifying"
              style="
                flex: 1;
                background: #ffc107;
                color: #000;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s;
              "
              :style="{ opacity: isModifying ? 0.5 : 1 }"
              @click="showModifyDialog"
            >
              <i class="fa-solid fa-edit"></i>
              {{ isModifying ? '修改中...' : 'AI 修改界面' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：实时预览 -->
      <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; display: flex; flex-direction: column">
        <h4 style="color: #51cf66; margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center; gap: 8px">
          <i class="fa-solid fa-eye"></i>
          实时预览
          <span
            v-if="generatedCode"
            style="
              margin-left: auto;
              background: #51cf66;
              color: white;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
            "
            >已生成</span
          >
        </h4>
        <div
          style="
            flex: 1;
            background: #1a1a1a;
            border: 2px solid #444;
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          "
        >
          <div v-if="!generatedCode" style="text-align: center; color: #666; padding: 40px">
            <i class="fa-solid fa-image" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3"></i>
            <p style="font-size: 16px; margin: 0">等待生成...</p>
            <p style="font-size: 14px; margin: 10px 0 0 0">点击"AI 生成界面"后，预览将显示在这里</p>
          </div>
          <iframe
            v-else
            ref="previewFrame"
            :srcdoc="generatedCode"
            style="width: 100%; height: 100%; border: none; background: white"
          ></iframe>
        </div>

        <!-- 复制正则按钮 -->
        <button
          v-if="generatedCode"
          style="
            margin-top: 15px;
            background: #51cf66;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
          "
          @click="copyRegex"
        >
          <i class="fa-solid fa-copy"></i> 复制正则代码
        </button>
      </div>
    </div>

    <!-- 生成的正则代码（可折叠） -->
    <div v-if="generatedRegex" style="background: #2a2a2a; padding: 20px; border-radius: 8px">
      <div
        style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; margin-bottom: 15px"
        @click="showCode = !showCode"
      >
        <h4 style="color: #4a9eff; margin: 0">
          <i class="fa-solid fa-code"></i>
          生成的正则代码
        </h4>
        <i
          :class="showCode ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"
          style="color: #888; transition: transform 0.3s"
        ></i>
      </div>
      <div
        v-if="showCode"
        style="
          background: #1a1a1a;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #444;
          max-height: 300px;
          overflow-y: auto;
        "
      >
        <pre
          style="
            margin: 0;
            color: #e0e0e0;
            font-family: 'Consolas', monospace;
            font-size: 13px;
            white-space: pre-wrap;
            word-wrap: break-word;
          "
          >{{ generatedRegex }}</pre
        >
      </div>
    </div>

    <!-- AI 修改对话框 -->
    <div
      v-if="showModify"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      "
      @click.self="showModify = false"
    >
      <div
        style="
          background: #2a2a2a;
          border: 2px solid #ffc107;
          border-radius: 12px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
        "
        @click.stop
      >
        <h3 style="color: #ffc107; margin: 0 0 20px 0">
          <i class="fa-solid fa-edit"></i>
          AI 修改界面
        </h3>
        <p style="color: #888; margin: 0 0 15px 0; line-height: 1.6">
          描述你想要修改的地方，AI 会在当前界面的基础上进行调整。例如：
        </p>
        <ul style="color: #888; margin: 0 0 20px 0; padding-left: 20px; line-height: 1.8">
          <li>把生命值进度条改成红色</li>
          <li>增加一个金币显示</li>
          <li>调整整体布局，改成竖向排列</li>
          <li>添加一个按钮，点击后显示详细信息</li>
        </ul>
        <textarea
          v-model="modifyInstruction"
          placeholder="输入修改建议..."
          style="
            width: 100%;
            min-height: 150px;
            background: #1a1a1a;
            color: #e0e0e0;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 12px;
            font-size: 14px;
            margin-bottom: 20px;
            resize: vertical;
          "
        ></textarea>
        <div style="display: flex; gap: 12px">
          <button
            :disabled="!modifyInstruction || isModifying"
            style="
              flex: 1;
              background: #ffc107;
              color: #000;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
            "
            :style="{ opacity: !modifyInstruction || isModifying ? 0.5 : 1 }"
            @click="modifyWithAI"
          >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            {{ isModifying ? '修改中...' : '确认修改' }}
          </button>
          <button
            style="
              flex: 1;
              background: #666;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
            "
            @click="showModify = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { normalizeApiEndpoint, useSettingsStore } from '../settings';
import { copyToClipboard } from '../utils';

const settingsStore = useSettingsStore();
const settings = settingsStore.settings;

const triggerKeyword = ref('【开场白】');
const interfaceDescription = ref('');
const generatedCode = ref('');
const generatedRegex = ref('');
const isGenerating = ref(false);
const isModifying = ref(false);
const showCode = ref(false);
const showModify = ref(false);
const modifyInstruction = ref('');
const previewFrame = ref<HTMLIFrameElement | null>(null);

// AI 生成界面代码
const generateWithAI = async () => {
  if (!triggerKeyword.value || !interfaceDescription.value) {
    window.toastr.warning('请填写触发关键词和界面描述');
    return;
  }

  isGenerating.value = true;

  try {
    const prompt = `你是一个酒馆正则替换专家。请根据用户的描述，生成一个完整的 HTML 界面代码。

用户提供的触发关键词：${triggerKeyword.value}

用户的界面描述：
${interfaceDescription.value}

请生成完整的 HTML 代码，包含：
1. HTML 结构
2. 内嵌的 <style> 标签（CSS 样式）
3. 内嵌的 <script> 标签（如果需要 JS 功能）

要求：
- HTML 代码要美观、现代化
- CSS 样式要精美，符合用户描述的风格
- JS 代码要简洁实用（如果需要）
- 整体界面要符合用户的描述
- 代码要完整可用，可以直接在浏览器中运行

直接输出完整的 HTML 代码，从 <!DOCTYPE html> 或 <div> 开始，不要有其他说明文字。`;

    const apiUrl = normalizeApiEndpoint(settings.api_endpoint);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.api_key}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的前端开发专家，擅长生成美观的 HTML/CSS/JS 代码。请根据用户描述生成完整的界面代码。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    let result = data.choices?.[0]?.message?.content || '';

    console.log('📝 [界面生成] AI 原始返回长度:', result.length);
    console.log('📝 [界面生成] AI 原始返回前500字符:', result.substring(0, 500));

    // 移除可能的 markdown 代码块标记
    result = result
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // 尝试提取HTML代码（处理AI推理过程）
    // 1. 先查找 <!DOCTYPE html 开头的完整文档
    const doctypeMatch = result.match(/<!DOCTYPE html>[\s\S]*/i);
    if (doctypeMatch) {
      result = doctypeMatch[0].trim();
      console.log('✅ [界面生成] 提取到完整的HTML文档（含DOCTYPE）');
    } else {
      // 2. 如果没有DOCTYPE，查找 <html 开头的部分
      const htmlMatch = result.match(/<html[\s\S]*/i);
      if (htmlMatch) {
        result = htmlMatch[0].trim();
        console.log('✅ [界面生成] 提取到HTML文档（不含DOCTYPE）');
      } else if (result.includes('<') && result.includes('>')) {
        // 3. 如果没有完整的html标签，但包含HTML标签
        console.log('⚠️ [界面生成] 包含HTML标签但格式不标准，尝试包装');
        // 尝试包装成完整文档
        if (!result.includes('<html')) {
          result = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
${result}
</body>
</html>`;
          console.log('✅ [界面生成] 已自动包装为完整HTML文档');
        }
      } else {
        // 4. 如果完全没有HTML标签，说明AI返回的是纯文本或推理过程
        console.error('❌ [界面生成] AI未返回有效的HTML代码');
        console.error('AI返回内容:', result);
        throw new Error('AI未返回有效的HTML代码，请尝试更详细的界面描述或更换模型');
      }
    }

    console.log('📝 [界面生成] 最终HTML长度:', result.length);

    generatedCode.value = result;

    // 生成正则配置（符合酒馆正则格式）
    const findRegex = triggerKeyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexJson = {
      id: `regex_ui_${Date.now()}`,
      scriptName: `界面_${triggerKeyword.value}`,
      findRegex: findRegex,
      replaceString: result,
      trimStrings: [],
      placement: [2], // AI输出后处理
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    };
    generatedRegex.value = JSON.stringify(regexJson, null, 2);

    window.toastr.success('AI 生成成功！');
  } catch (error) {
    console.error('AI 生成失败:', error);
    window.toastr.error('AI 生成失败: ' + (error as Error).message);
  } finally {
    isGenerating.value = false;
  }
};

// 显示修改对话框
const showModifyDialog = () => {
  modifyInstruction.value = '';
  showModify.value = true;
};

// AI 修改界面（增量修改）
const modifyWithAI = async () => {
  if (!modifyInstruction.value) {
    window.toastr.warning('请输入修改建议');
    return;
  }

  isModifying.value = true;

  try {
    // 使用增量修改：只发送原始描述 + 修改建议，让 AI 重新生成
    const prompt = `你是一个酒馆正则替换专家。请根据用户的界面描述和修改建议，生成完整的 HTML 界面代码。

用户提供的触发关键词：${triggerKeyword.value}

原始界面描述：
${interfaceDescription.value}

用户的修改建议：
${modifyInstruction.value}

请根据原始描述和修改建议，生成完整的 HTML 代码，包含：
1. HTML 结构
2. 内嵌的 <style> 标签（CSS 样式）
3. 内嵌的 <script> 标签（如果需要 JS 功能）

要求：
- 在原始描述的基础上，应用用户的修改建议
- HTML 代码要美观、现代化
- CSS 样式要精美
- JS 代码要简洁实用（如果需要）
- 代码要完整可用，可以直接在浏览器中运行

直接输出完整的 HTML 代码，从 <!DOCTYPE html> 或 <div> 开始，不要有其他说明文字。`;

    const apiUrl = normalizeApiEndpoint(settings.api_endpoint);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.api_key}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: 'system',
            content:
              '你是一个专业的前端开发专家，擅长生成和修改美观的 HTML/CSS/JS 代码。你会根据用户的描述和修改建议，生成完整的界面代码。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    let result = data.choices?.[0]?.message?.content || '';

    console.log('📝 [界面修改] AI 原始返回长度:', result.length);
    console.log('📝 [界面修改] AI 原始返回前500字符:', result.substring(0, 500));

    // 移除可能的 markdown 代码块标记
    result = result
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // 尝试提取HTML代码（处理AI推理过程）
    // 1. 先查找 <!DOCTYPE html 开头的完整文档
    const doctypeMatch = result.match(/<!DOCTYPE html>[\s\S]*/i);
    if (doctypeMatch) {
      result = doctypeMatch[0].trim();
      console.log('✅ [界面修改] 提取到完整的HTML文档（含DOCTYPE）');
    } else {
      // 2. 如果没有DOCTYPE，查找 <html 开头的部分
      const htmlMatch = result.match(/<html[\s\S]*/i);
      if (htmlMatch) {
        result = htmlMatch[0].trim();
        console.log('✅ [界面修改] 提取到HTML文档（不含DOCTYPE）');
      } else if (result.includes('<') && result.includes('>')) {
        // 3. 如果没有完整的html标签，但包含HTML标签
        console.log('⚠️ [界面修改] 包含HTML标签但格式不标准，尝试包装');
        // 尝试包装成完整文档
        if (!result.includes('<html')) {
          result = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
${result}
</body>
</html>`;
          console.log('✅ [界面修改] 已自动包装为完整HTML文档');
        }
      } else {
        // 4. 如果完全没有HTML标签，说明AI返回的是纯文本或推理过程
        console.error('❌ [界面修改] AI未返回有效的HTML代码');
        console.error('AI返回内容:', result);
        throw new Error('AI未返回有效的HTML代码，请尝试更详细的修改建议或更换模型');
      }
    }

    console.log('📝 [界面修改] 最终HTML长度:', result.length);

    generatedCode.value = result;

    // 更新正则配置（符合酒馆正则格式）
    const findRegex = triggerKeyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexJson = {
      id: `regex_ui_${Date.now()}`,
      scriptName: `界面_${triggerKeyword.value}`,
      findRegex: findRegex,
      replaceString: result,
      trimStrings: [],
      placement: [2], // AI输出后处理
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    };
    generatedRegex.value = JSON.stringify(regexJson, null, 2);

    // 更新界面描述（将修改建议合并到原描述中，用于下次修改）
    interfaceDescription.value = `${interfaceDescription.value}\n\n【已应用的修改】：\n${modifyInstruction.value}`;

    window.toastr.success('AI 修改成功！');
    showModify.value = false;
  } catch (error) {
    console.error('AI 修改失败:', error);
    window.toastr.error('AI 修改失败: ' + (error as Error).message);
  } finally {
    isModifying.value = false;
  }
};

// 复制正则代码
const copyRegex = () => {
  copyToClipboard(generatedRegex.value, '正则代码已复制到剪贴板');
};
</script>

<style scoped>
.regex-ui-generator {
  height: 100%;
  overflow-y: auto;
}

button:disabled {
  cursor: not-allowed !important;
  opacity: 0.5 !important;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

code {
  background: #1a1a1a;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', monospace;
}

pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: #1a1a1a;
}

pre::-webkit-scrollbar-thumb {
  background: #4a9eff;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #5ab0ff;
}
</style>
