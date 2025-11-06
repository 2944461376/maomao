<template>
  <div
    v-if="show"
    @click.self="handleClose"
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
  >
    <div
      style="
        background: #2a2a2a;
        border: 2px solid #667eea;
        border-radius: 12px;
        padding: 30px;
        max-width: 500px;
        width: 100%;
        text-align: center;
      "
      @click.stop
    >
      <h3 style="color: #667eea; margin: 0 0 15px 0">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        {{ title || 'AI 生成' }}
      </h3>
      <p style="color: #888; margin: 0 0 25px 0; line-height: 1.6">
        {{ description || 'AI 正在为你生成内容...' }}
      </p>

      <!-- 显示输入框（可选） -->
      <textarea
        v-if="showInput"
        v-model="localInput"
        :placeholder="placeholder || '输入你的需求...'"
        style="
          width: 100%;
          min-height: 120px;
          background: #1a1a1a;
          color: #e0e0e0;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 12px;
          font-size: 14px;
          margin-bottom: 20px;
          resize: vertical;
          box-sizing: border-box;
        "
      ></textarea>

      <!-- 加载动画 -->
      <div v-if="isGenerating" style="margin-bottom: 25px">
        <div
          style="
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 4px solid #3a3a3a;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          "
        ></div>
        <p style="color: #888; margin-top: 15px; font-size: 14px">正在生成中，请稍候...</p>
      </div>

      <div style="display: flex; gap: 12px">
        <button
          v-if="!isGenerating"
          @click="handleConfirm"
          :disabled="showInput && !localInput"
          style="
            flex: 1;
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
          "
          :style="{ opacity: showInput && !localInput ? 0.5 : 1 }"
        >
          <i class="fa-solid fa-check"></i>
          确认生成
        </button>
        <button
          @click="handleClose"
          :disabled="isGenerating"
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
            transition: all 0.2s;
          "
          :style="{ opacity: isGenerating ? 0.5 : 1 }"
        >
          {{ isGenerating ? '生成中...' : '取消' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  isGenerating?: boolean;
  showInput?: boolean; // 是否显示输入框
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm', input?: string): void;
}>();

const localInput = ref('');

// 当对话框显示时，清空输入
watch(
  () => props.show,
  newVal => {
    if (newVal) {
      localInput.value = '';
    }
  },
);

const handleConfirm = () => {
  if (!props.isGenerating) {
    if (props.showInput) {
      emit('confirm', localInput.value);
    } else {
      emit('confirm');
    }
  }
};

const handleClose = () => {
  if (!props.isGenerating) {
    emit('close');
  }
};
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

button:disabled {
  cursor: not-allowed !important;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 滚动条样式 */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: #1a1a1a;
}

div::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}
</style>

