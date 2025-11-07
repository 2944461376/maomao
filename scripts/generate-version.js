/**
 * 生成版本信息文件
 * 在每次构建后自动运行，生成包含版本号、commit hash、构建时间的 version.json
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 从 HelpTab.vue 中提取版本号
function extractVersionFromHelpTab() {
  const helpTabPath = path.join(__dirname, '../src/记忆_with_worldbook/components/HelpTab.vue');
  const content = fs.readFileSync(helpTabPath, 'utf-8');
  
  // 匹配版本号，支持多种格式：
  // 1. 版本 v1.34
  // 2. {{ t('helpPage.version') }} v1.34
  // 3. Version v1.34
  const patterns = [
    /版本 v(\d+\.\d+)/,
    /Version v(\d+\.\d+)/,
    /\{\{\s*t\(['"]\w+\.\w+['"]\)\s*\}\}\s*v(\d+\.\d+)/,  // {{ t('helpPage.version') }} v1.34
    /version-info[^>]*>\s*[^v]*v(\d+\.\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  console.warn('⚠️  未能从 HelpTab.vue 提取版本号，使用默认版本 1.0');
  return '1.0';
}

// 获取当前 git commit hash
function getCommitHash() {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch (error) {
    console.warn('⚠️  无法获取 git commit hash');
    return 'unknown';
  }
}

// 获取短 commit hash（前7位）
function getShortCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    return 'unknown';
  }
}

// 生成版本信息
function generateVersion() {
  const version = extractVersionFromHelpTab();
  const commitHash = getCommitHash();
  const shortHash = getShortCommitHash();
  const buildTime = new Date().toISOString();
  
  const versionInfo = {
    version,
    commitHash,
    shortHash,
    buildTime,
    updateUrl: `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao@${shortHash}/dist/记忆_with_worldbook/index.js`,
  };
  
  // 输出到 dist 目录
  const outputPath = path.join(__dirname, '../dist/记忆_with_worldbook/version.json');
  
  // 确保目录存在
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // 写入文件
  fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2), 'utf-8');
  
  console.log('✅ 版本信息已生成：');
  console.log(`   版本号: v${version}`);
  console.log(`   Commit: ${shortHash}`);
  console.log(`   构建时间: ${buildTime}`);
  console.log(`   输出路径: ${outputPath}`);
  
  return versionInfo;
}

// 执行生成
try {
  console.log('🚀 开始生成版本信息...\n');
  generateVersion();
  console.log('\n✨ 版本信息生成完成！');
} catch (error) {
  console.error('❌ 生成版本信息失败:', error.message);
  process.exit(1);
}

