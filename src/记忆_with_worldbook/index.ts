import { watch } from 'vue';
import { klona } from 'klona';
import { useSettingsStore, useSummaryHistoryStore } from './settings';
import { getScriptIdSafe, setGlobalScriptId } from './utils';
import { summarizeMessages } from './总结功能';
import './浮动面板';
import './添加导航按钮';

$(() => {
  // 延迟初始化，确保酒馆助手完全加载
  setTimeout(() => {
    let script_id: string | null = null;
    try {
      script_id = getScriptId?.();
    } catch (e) {
      console.error('无法获取 script_id:', e);
    }

    if (!script_id) {
      console.error('无法获取 script_id，mzrodyu猫猫的小破烂脚本无法正常工作');
      window.toastr.error('mzrodyu猫猫的小破烂脚本初始化失败');
      return;
    }

    // 设置全局 script_id
    setGlobalScriptId(script_id);

    console.log('mzrodyu猫猫的小破烂脚本开始初始化，script_id:', script_id);

    // 等待一段时间确保完全准备好
    setTimeout(() => {
      // 监听消息变化，实现自动总结
      const checkAutoSummarize = () => {
        try {
          console.log('🔍 开始检查自动总结...');

          const store = useSettingsStore();
          if (!store || !store.settings) {
            console.warn('❌ 无法获取设置，跳过自动总结检查');
            return;
          }

          const settings = store.settings;

          // 验证设置完整性
          if (typeof settings.auto_summarize_enabled !== 'boolean') {
            console.warn('❌ 自动总结设置无效，跳过检查');
            return;
          }

          if (typeof settings.summary_interval !== 'number' || settings.summary_interval < 1) {
            console.warn('❌ 总结间隔设置无效，跳过检查');
            return;
          }
          console.log('📋 当前设置:', {
            auto_summarize_enabled: settings.auto_summarize_enabled,
            summary_interval: settings.summary_interval,
            has_api_key: !!settings.api_key,
          });

          if (!settings.auto_summarize_enabled) {
            console.log('⏸️ 自动总结未启用');
            return;
          }

          if (!settings.api_key) {
            console.log('❌ API Key 未设置');
            return;
          }

          const last_message_id = getLastMessageId();

          // 获取当前聊天ID
          const current_chat_id = SillyTavern.getCurrentChatId();
          if (!current_chat_id) {
            console.log('❌ 无法获取聊天ID，跳过自动总结检查');
            return;
          }

          // 获取自动总结开启时的起始楼层（基于聊天ID）
          let auto_summary_start_id = 0;
          try {
            // 根据酒馆助手文档，使用聊天变量存储每个聊天的状态
            const chatVars = getVariables({ type: 'chat' });
            const auto_summary_start_id_key = 'auto_summary_start_id';

            console.log(`🔍 检查聊天变量:`, {
              current_chat_id,
              chat_vars: chatVars,
              has_start_id: chatVars[auto_summary_start_id_key] !== undefined,
              existing_start_id: chatVars[auto_summary_start_id_key],
            });

            if (chatVars[auto_summary_start_id_key] !== undefined && chatVars[auto_summary_start_id_key] !== null) {
              auto_summary_start_id = chatVars[auto_summary_start_id_key];
              console.log(`✅ 使用现有起始楼层: ${auto_summary_start_id} (聊天: ${current_chat_id})`);
            } else {
              // 当前聊天没有起始楼层，需要智能设置
              // 检查是否有现有的总结历史，避免重复总结
              const scriptId = getScriptIdSafe();
              if (!scriptId) {
                console.warn('script_id 为空，无法检查现有总结');
                return;
              }
              const scriptVars = getVariables({ type: 'script', script_id: scriptId });
              const existingSummaries = Array.isArray(scriptVars?.summary_history) ? scriptVars.summary_history : [];

              if (existingSummaries.length > 0) {
                // 有现有总结，找到最后一个总结的结束楼层
                const lastSummary = existingSummaries[0]; // 最新的总结在数组开头
                const lastSummaryEnd = lastSummary.end_id || 0;

                // 如果当前楼层大于最后总结的结束楼层，从最后总结结束楼层+1开始
                if (last_message_id > lastSummaryEnd) {
                  auto_summary_start_id = lastSummaryEnd + 1;
                  console.log(
                    `🔄 重新加载聊天，基于现有总结设置起始楼层: ${auto_summary_start_id} (最后总结结束于第 ${lastSummaryEnd} 层)`,
                  );
                  window.toastr?.info(`重新加载聊天，起始楼层设置为第 ${auto_summary_start_id} 层`);
                } else {
                  // 当前楼层小于等于最后总结结束楼层，从当前楼层开始
                  auto_summary_start_id = last_message_id;
                  console.log(`🔄 重新加载聊天，当前楼层已总结，从当前楼层开始: ${last_message_id}`);
                  window.toastr?.info(`重新加载聊天，从当前楼层开始: ${last_message_id}`);
                }
              } else {
                // 没有现有总结，从第0层开始（包括AI开场白）
                auto_summary_start_id = 0;
                console.log(`🆕 新聊天窗口，设置起始楼层: 0 (聊天: ${current_chat_id}) - 从AI开场白开始`);
                window.toastr?.info(`新聊天窗口，起始楼层设置为第 0 层（AI开场白）`);
              }

              // 确保起始楼层从第0层开始（包括AI开场白）
              if (auto_summary_start_id < 0) {
                auto_summary_start_id = 0;
                console.log(`⚠️ 修正起始楼层为0，从AI开场白开始`);
              }

              // 保存起始楼层到聊天变量（根据酒馆助手文档）
              insertOrAssignVariables({ [auto_summary_start_id_key]: auto_summary_start_id }, { type: 'chat' });
            }
          } catch (error) {
            console.warn('获取自动总结起始楼层失败，使用当前楼层:', error);
            auto_summary_start_id = last_message_id;
          }

          console.log(
            `检查自动总结: 当前楼层=${last_message_id}, 起始楼层=${auto_summary_start_id}, 间隔=${settings.summary_interval}`,
          );

          // 检查是否需要自动总结
          // 修正计算逻辑：从起始楼层开始计算相对位置，包含起始楼层
          // 楼层编号：0=AI开场白, 1=用户, 2=AI, 3=用户...
          const relative_position = last_message_id - auto_summary_start_id;

          // 修复：间隔为5表示每5层总结一次（0-4, 5-9...）
          // 从楼层0到楼层4共5层，relative_position=4，所以触发条件是 >= interval - 1
          const should_trigger = relative_position >= settings.summary_interval - 1;

          console.log('🧮 计算检查:', {
            last_message_id,
            auto_summary_start_id,
            relative_position,
            summarize_interval: settings.summary_interval,
            should_trigger,
            calculation: `${relative_position} >= ${settings.summary_interval - 1} (包含起始楼层，共${relative_position + 1}层)`,
            expected_trigger_at_floor: auto_summary_start_id + settings.summary_interval - 1,
            will_summarize_range: `${auto_summary_start_id}-${auto_summary_start_id + settings.summary_interval - 1}`,
            floor_explanation: '楼层编号：0=AI开场白, 1=用户, 2=AI, 3=用户...',
          });

          if (last_message_id >= auto_summary_start_id && should_trigger) {
            // 计算总结范围：固定总结interval层（例如间隔5就总结5层）
            const start_id = auto_summary_start_id;
            const end_id = auto_summary_start_id + settings.summary_interval - 1;

            // 异步执行总结
            console.log(`🎯 触发自动总结: 楼层 ${start_id}-${end_id}`);
            window.toastr.info(`🔄 开始自动总结楼层 ${start_id}-${end_id}...`);

            summarizeMessages(start_id, end_id)
              .then(summary => {
                console.log(`✅ 自动总结完成: 楼层 ${start_id}-${end_id}`, summary);

                // 添加到历史总结中
                try {
                  const historyStore = useSummaryHistoryStore();
                  historyStore.addSummary(start_id, end_id, summary);
                } catch (e) {
                  console.error('添加自动总结到历史失败:', e);
                }

                // 更新起始楼层，为下次总结做准备
                const new_start_id = end_id + 1;
                insertOrAssignVariables({ auto_summary_start_id: new_start_id }, { type: 'chat' });
                console.log(`🔄 更新起始楼层为: ${new_start_id}`);

                window.toastr.success(`✅ 已自动总结第 ${start_id}-${end_id} 楼，下次将从第 ${new_start_id} 楼开始`);
              })
              .catch(error => {
                console.error('❌ 自动总结失败：', error);
                window.toastr.error('❌ 自动总结失败：' + error.message);
              });
          }
        } catch (error) {
          console.error('checkAutoSummarize 发生错误：', error);
          // 静默失败，不影响用户操作
        }
      };

      // 监听消息接收事件
      try {
        eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, () => {
          console.log('📨 收到消息渲染事件，检查自动总结...');
          checkAutoSummarize();
        });

        // 监听聊天切换事件（根据酒馆助手文档）
        eventOn(tavern_events.CHAT_CHANGED, (chat_file_name: string) => {
          console.log('🔄 聊天切换事件:', chat_file_name);

          // 检查新聊天是否已有自动总结状态
          try {
            const chatVars = getVariables({ type: 'chat' });
            const auto_summary_start_id = chatVars.auto_summary_start_id;

            if (auto_summary_start_id !== undefined && auto_summary_start_id !== null) {
              console.log(`✅ 切换到已有自动总结的聊天: ${chat_file_name}, 起始楼层: ${auto_summary_start_id}`);
            } else {
              console.log(`🆕 切换到新聊天: ${chat_file_name}, 等待下一条消息时初始化`);
            }
          } catch (error) {
            console.warn('检查聊天状态失败:', error);
          }
        });

        console.log('✅ 事件监听器已注册');
      } catch (error) {
        console.error('❌ 注册事件监听器失败:', error);
      }

      // 添加设置监控，当设置变化时重新验证
      const settingsStore = useSettingsStore();
      if (settingsStore && settingsStore.settings) {
        // 监听设置变化，确保自动总结状态正确
        const unwatch = watch(
          () => settingsStore.settings.auto_summarize_enabled,
          (newValue, oldValue) => {
            console.log(`🔄 自动总结设置变化: ${oldValue} -> ${newValue}`);
            if (newValue && !oldValue) {
              // 开启自动总结时，检查是否需要设置起始楼层
              try {
                const scriptId = getScriptIdSafe();
                if (!scriptId) {
                  console.warn('script_id 为空，无法检查起始楼层');
                  return;
                }
                const chatVars = getVariables({ type: 'chat' });
                const auto_summary_start_id = chatVars.auto_summary_start_id;

                // 只有在没有设置过起始楼层时才设置
                if (auto_summary_start_id === undefined || auto_summary_start_id === null) {
                  const last_message_id = getLastMessageId();
                  insertOrAssignVariables({ auto_summary_start_id: last_message_id }, { type: 'chat' });
                  console.log(`✅ 首次开启自动总结，起始楼层设置为: ${last_message_id}`);
                  window.toastr?.info(`自动总结已开启，将从第 ${last_message_id} 层开始`);
                } else {
                  console.log(`✅ 自动总结已开启，使用现有起始楼层: ${auto_summary_start_id}`);
                  window.toastr?.info(`自动总结已开启，起始楼层: ${auto_summary_start_id}`);
                }
              } catch (error) {
                console.error('❌ 检查起始楼层失败:', error);
              }
            }
          },
          { immediate: false },
        );

        // 页面卸载时清理监听器
        $(window).on('pagehide', () => {
          unwatch();
        });
      }

      window.toastr.success('mzrodyu猫猫的小破烂脚本已加载');
    }, 200);
  }, 100);
});
