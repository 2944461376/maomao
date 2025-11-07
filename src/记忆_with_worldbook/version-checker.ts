/**
 * 版本检测模块
 * 检查是否有新版本可用，并提示用户更新
 *
 * 策略：
 * - 不依赖构建时注入的版本信息（因为混淆后可能失效）
 * - 从 localStorage 缓存上次检查的版本信息
 * - 与远程最新版本比较
 */

const VERSION_CACHE_KEY = 'maomao_tool_cached_version';

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
 * 从 localStorage 获取缓存的版本信息
 */
function getCachedVersion(): VersionInfo | null {
  try {
    const cached = localStorage.getItem(VERSION_CACHE_KEY);
    if (!cached) {
      return null;
    }
    return JSON.parse(cached);
  } catch (error) {
    console.warn('读取缓存版本失败:', error);
    return null;
  }
}

/**
 * 保存版本信息到 localStorage
 */
function setCachedVersion(versionInfo: VersionInfo): void {
  try {
    localStorage.setItem(VERSION_CACHE_KEY, JSON.stringify(versionInfo));
  } catch (error) {
    console.warn('保存缓存版本失败:', error);
  }
}

/**
 * 比较版本号
 * @returns true 如果远程版本比缓存版本更新
 */
function isNewerVersion(cached: VersionInfo | null, remote: VersionInfo): boolean {
  if (!cached) {
    // 首次运行，保存当前版本
    console.log('📌 首次检测，保存当前版本:', remote.version);
    setCachedVersion(remote);
    return false;
  }

  // 比较 commit hash（最可靠）
  if (remote.commitHash !== cached.commitHash) {
    console.log('🔄 检测到新的 commit:', cached.shortHash, '->', remote.shortHash);
    return true;
  }

  // 比较版本号
  if (remote.version !== cached.version) {
    console.log('🔄 检测到新的版本:', cached.version, '->', remote.version);
    return true;
  }

  return false;
}

/**
 * 显示更新提示
 */
function showUpdateNotification(cached: VersionInfo | null, latest: VersionInfo) {
  // 检查用户是否选择了"不再提示"
  const skipVersion = localStorage.getItem('maomao_skip_update_version');
  if (skipVersion === latest.version) {
    console.log(`ℹ️  用户选择跳过版本 ${latest.version} 的更新提示`);
    return;
  }

  const currentVersion = cached ? `v${cached.version}` : '未知';
  const latestVersion = `v${latest.version}`;

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
          <strong>当前版本:</strong> ${currentVersion}
        </div>
        <div>
          <strong>最新版本:</strong> ${latestVersion}
        </div>
      </div>
      
      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px; flex-wrap: wrap;">
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
          <i class="fa-solid fa-download" style="margin-right: 6px;"></i>
          下载新版本
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
  $('#maomao-update-now').on('click', async () => {
    try {
      window.toastr.info('正在下载新版本...', '更新中', { timeOut: 2000 });

      // 从 CDN 获取最新版本的 JSON 文件
      const jsonUrl = `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao/dist/记忆_with_worldbook/猫猫的写卡小工具 v${latest.version}.json?_=${Date.now()}`;
      const response = await fetch(jsonUrl);

      if (!response.ok) {
        throw new Error(`下载失败: HTTP ${response.status}`);
      }

      const jsonContent = await response.text();

      // 创建下载链接
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `猫猫的写卡小工具 v${latest.version}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 更新缓存版本
      setCachedVersion(latest);
      updateDialog.fadeOut(200, () => updateDialog.remove());

      window.toastr.success(`v${latest.version} 已下载完成，请在酒馆脚本库重新导入该文件`, '下载成功', {
        timeOut: 8000,
      });
    } catch (error) {
      console.error('下载失败:', error);
      window.toastr.error('下载失败: ' + error.message, '错误', { timeOut: 5000 });
    }
  });

  $('#maomao-update-later').on('click', () => {
    updateDialog.fadeOut(200, () => updateDialog.remove());
    window.toastr.info('您可以随时在"帮助"页面查看版本信息', '稍后更新', { timeOut: 3000 });
  });

  $('#maomao-update-skip').on('click', () => {
    // 更新缓存版本（跳过此版本相当于当作已更新）
    setCachedVersion(latest);
    localStorage.setItem('maomao_skip_update_version', latest.version);
    updateDialog.fadeOut(200, () => updateDialog.remove());
    window.toastr.success(`已跳过版本 ${latestVersion}`, '更新提示', { timeOut: 3000 });
  });

  console.log(`🎉 发现新版本: ${currentVersion} -> ${latestVersion}`);
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

    const cached = getCachedVersion();
    console.log('🔍 检查版本更新...');
    if (cached) {
      console.log(`   缓存版本: v${cached.version} (${cached.shortHash})`);
    } else {
      console.log('   缓存版本: (首次检测)');
    }

    const latest = await fetchLatestVersion();

    if (!latest) {
      if (showToast) {
        window.toastr.warning('无法获取最新版本信息', '检查更新', { timeOut: 3000 });
      }
      return;
    }

    console.log(`   远程版本: v${latest.version} (${latest.shortHash})`);

    // 比较版本
    if (isNewerVersion(cached, latest)) {
      console.log('✨ 发现新版本！');
      showUpdateNotification(cached, latest);
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
export function getCurrentVersion(): VersionInfo | null {
  return getCachedVersion();
}
