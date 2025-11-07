/**
 * 版本检测模块
 * 检查是否有新版本可用，并提示用户更新
 */

// 当前版本信息（构建时会被替换）
// @ts-ignore
const CURRENT_VERSION = '__VERSION__';
// @ts-ignore
const CURRENT_COMMIT = '__COMMIT__';
// @ts-ignore
const BUILD_TIME = '__BUILD_TIME__';

interface VersionInfo {
  version: string;
  commitHash: string;
  shortHash: string;
  buildTime: string;
  updateUrl: string;
}

/**
 * 从 CDN 获取最新版本信息
 */
async function fetchLatestVersion(): Promise<VersionInfo | null> {
  try {
    // 添加时间戳参数绕过缓存，而不是使用自定义请求头（避免 CORS 问题）
    const timestamp = Date.now();
    const response = await fetch(
      `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao/dist/记忆_with_worldbook/version.json?_=${timestamp}`,
    );

    if (!response.ok) {
      console.warn('⚠️  无法获取版本信息:', response.status);
      return null;
    }

    const versionInfo: VersionInfo = await response.json();
    return versionInfo;
  } catch (error) {
    console.warn('⚠️  获取版本信息失败:', error);
    return null;
  }
}

/**
 * 比较版本号
 * @returns true 如果远程版本更新
 */
function isNewerVersion(currentVersion: string, remoteVersion: string): boolean {
  // 如果版本号相同，不提示更新
  if (currentVersion === remoteVersion) {
    return false;
  }

  try {
    const current = currentVersion.split('.').map(Number);
    const remote = remoteVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(current.length, remote.length); i++) {
      const c = current[i] || 0;
      const r = remote[i] || 0;
      if (r > c) return true;
      if (r < c) return false;
    }
  } catch (error) {
    console.warn('⚠️  版本号比较失败，使用字符串比较');
    return currentVersion !== remoteVersion;
  }

  return false;
}

/**
 * 显示更新提示
 */
function showUpdateNotification(latestVersion: VersionInfo) {
  // 检查用户是否选择了"不再提示"
  const skipVersion = localStorage.getItem('maomao_skip_update_version');
  if (skipVersion === latestVersion.version) {
    console.log(`ℹ️  用户选择跳过版本 ${latestVersion.version} 的更新提示`);
    return;
  }

  // 创建更新提示 UI
  const updateDialog = $(`
    <div id="maomao-update-dialog" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999999;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px 40px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      color: white;
      max-width: 500px;
      min-width: 350px;
      text-align: center;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
      <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">发现新版本！</h2>
      <div style="font-size: 16px; margin-bottom: 20px; opacity: 0.95;">
        <div style="margin-bottom: 8px;">
          <strong>当前版本:</strong> v${CURRENT_VERSION}
        </div>
        <div>
          <strong>最新版本:</strong> v${latestVersion.version}
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px;">
        <button id="maomao-update-now" style="
          padding: 12px 24px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        ">
          <i class="fa-solid fa-refresh" style="margin-right: 6px;"></i>
          立即更新
        </button>
        
        <button id="maomao-update-later" style="
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        ">
          稍后提醒
        </button>
        
        <button id="maomao-update-skip" style="
          padding: 12px 24px;
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s;
        ">
          跳过此版本
        </button>
      </div>
    </div>
    
    <style>
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -60%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      
      #maomao-update-now:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      #maomao-update-later:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      #maomao-update-skip:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    </style>
  `);

  // 添加到页面
  $('body').append(updateDialog);

  // 绑定按钮事件
  $('#maomao-update-now').on('click', () => {
    window.toastr.info('正在刷新页面以应用更新...', '更新中', { timeOut: 2000 });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  });

  $('#maomao-update-later').on('click', () => {
    updateDialog.fadeOut(200, () => updateDialog.remove());
    window.toastr.info('您可以随时在"帮助"页面查看版本信息', '稍后更新', { timeOut: 3000 });
  });

  $('#maomao-update-skip').on('click', () => {
    localStorage.setItem('maomao_skip_update_version', latestVersion.version);
    updateDialog.fadeOut(200, () => updateDialog.remove());
    window.toastr.success(`已跳过版本 ${latestVersion.version}`, '更新提示', { timeOut: 3000 });
  });

  console.log(`🎉 发现新版本: v${CURRENT_VERSION} -> v${latestVersion.version}`);
}

/**
 * 检查更新
 * @param showToast 是否显示检查中的提示
 */
export async function checkForUpdates(showToast: boolean = false): Promise<void> {
  try {
    if (showToast) {
      window.toastr.info('正在检查更新...', '版本检查', { timeOut: 2000 });
    }

    console.log('🔍 检查版本更新...');
    console.log(`   当前版本: v${CURRENT_VERSION} (${CURRENT_COMMIT})`);

    const latestVersion = await fetchLatestVersion();

    if (!latestVersion) {
      if (showToast) {
        window.toastr.warning('无法获取最新版本信息', '检查更新', { timeOut: 3000 });
      }
      return;
    }

    console.log(`   远程版本: v${latestVersion.version} (${latestVersion.shortHash})`);

    // 比较版本
    if (isNewerVersion(CURRENT_VERSION, latestVersion.version)) {
      console.log('✨ 发现新版本！');
      showUpdateNotification(latestVersion);
    } else {
      console.log('✅ 当前已是最新版本');
      if (showToast) {
        window.toastr.success('当前已是最新版本！', '版本检查', { timeOut: 3000 });
      }
    }
  } catch (error) {
    console.error('❌ 检查更新失败:', error);
    if (showToast) {
      window.toastr.error('检查更新失败', '版本检查', { timeOut: 3000 });
    }
  }
}

/**
 * 初始化版本检查
 * 在脚本加载时自动检查一次
 */
export function initVersionChecker(): void {
  console.log('🚀 初始化版本检查器...');

  // 延迟5秒检查，避免影响脚本启动速度
  setTimeout(() => {
    checkForUpdates(false);
  }, 5000);
}

/**
 * 获取当前版本信息
 */
export function getCurrentVersion(): { version: string; commit: string; buildTime: string } {
  return {
    version: CURRENT_VERSION,
    commit: CURRENT_COMMIT,
    buildTime: BUILD_TIME,
  };
}
