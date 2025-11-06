/**
 * 自动将 dist 目录下的脚本转换为酒馆助手 JSON 格式
 */

const fs = require('fs');
const path = require('path');

// 配置：需要转换的脚本列表
const configs = [
  {
    jsPath: 'dist/记忆_with_worldbook/index.js',
    outputPath: 'dist/记忆_with_worldbook/猫猫的写卡小工具 v1.33.json',
    id: 'memory-with-worldbook',
    name: '猫猫的写卡小工具 v1.33',
    info: '记忆管理脚本 - 支持世界书条目生成、查看和自动总结、开场白管理器',
  },
  {
    jsPath: 'dist/记忆/index.js',
    outputPath: 'dist/记忆/记忆管理.json',
    id: 'memory-management',
    name: '记忆管理',
    info: '记忆管理脚本 - 支持自动总结和历史记录管理',
  },
  {
    jsPath: 'dist/脚本示例/index.js',
    outputPath: 'dist/脚本示例/脚本示例.json',
    id: 'script-example',
    name: '脚本示例',
    info: '酒馆助手脚本示例',
  },
];

// 转换函数
function convertToJson(config) {
  try {
    // 检查 JS 文件是否存在
    if (!fs.existsSync(config.jsPath)) {
      console.log(`⚠️  跳过 ${config.jsPath}（文件不存在）`);
      return;
    }

    // 读取 JS 文件内容
    const jsContent = fs.readFileSync(config.jsPath, 'utf-8');

    // 创建 JSON 对象
    const json = {
      id: config.id,
      name: config.name,
      content: jsContent,
      info: config.info,
      buttons: [],
    };

    // 确保输出目录存在
    const outputDir = path.dirname(config.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入 JSON 文件
    fs.writeFileSync(config.outputPath, JSON.stringify(json, null, 2), 'utf-8');

    console.log(`✅ 成功生成：${config.outputPath}`);
  } catch (error) {
    console.error(`❌ 转换失败 ${config.jsPath}:`, error.message);
  }
}

// 执行转换
console.log('🚀 开始转换脚本为 JSON 格式...\n');
configs.forEach(config => convertToJson(config));
console.log('\n✨ 转换完成！');

