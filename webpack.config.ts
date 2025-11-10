import HtmlInlineScriptWebpackPlugin from 'html-inline-script-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
<<<<<<< HEAD
import { execSync } from 'node:child_process';
=======
>>>>>>> 5222cd67a858e8df734db29241ac1f211ca14bca
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';
import RemarkHTML from 'remark-html';
import { Server } from 'socket.io';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import unpluginAutoImport from 'unplugin-auto-import/webpack';
import { VueUseComponentsResolver, VueUseDirectiveResolver } from 'unplugin-vue-components/resolvers';
import unpluginVueComponents from 'unplugin-vue-components/webpack';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
import WebpackObfuscator from 'webpack-obfuscator';
const require = createRequire(import.meta.url);
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

<<<<<<< HEAD
// 提取版本信息
function getVersionInfo() {
  try {
    // 从 HelpTab.vue 提取版本号
    const helpTabPath = path.join(__dirname, 'src/记忆_with_worldbook/components/HelpTab.vue');
    const content = fs.readFileSync(helpTabPath, 'utf-8');
    const match = content.match(/版本 v(\d+\.\d+)/);
    const version = match ? match[1] : '1.0';

    // 获取 git commit hash
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const buildTime = new Date().toISOString();

    return { version, commitHash, buildTime };
  } catch (error) {
    console.warn('⚠️  无法获取版本信息，使用默认值');
    return { version: '1.0', commitHash: 'unknown', buildTime: new Date().toISOString() };
  }
}

// 在配置加载时缓存版本信息，避免每次调用都重新执行
const versionInfo = getVersionInfo();
console.log('📦 构建版本信息:', versionInfo);

=======
>>>>>>> 5222cd67a858e8df734db29241ac1f211ca14bca
interface Config {
  port: number;
  entries: Entry[];
}
interface Entry {
  script: string;
  html?: string;
}

function parse_entry(script_file: string) {
  const html = path.join(path.dirname(script_file), 'index.html');
  if (fs.existsSync(html)) {
    return { script: script_file, html };
  }
  return { script: script_file };
}

function common_path(lhs: string, rhs: string) {
  const lhs_parts = lhs.split(path.sep);
  const rhs_parts = rhs.split(path.sep);
  for (let i = 0; i < Math.min(lhs_parts.length, rhs_parts.length); i++) {
    if (lhs_parts[i] !== rhs_parts[i]) {
      return lhs_parts.slice(0, i).join(path.sep);
    }
  }
  return lhs_parts.join(path.sep);
}

function glob_script_files() {
  const files: string[] = fs
<<<<<<< HEAD
    .globSync(`src/**/index.{ts,js}`)
=======
    .globSync(`src/**/index.{ts,tsx,js,jsx}`)
>>>>>>> 5222cd67a858e8df734db29241ac1f211ca14bca
    .filter(file => process.env.CI !== 'true' || !fs.readFileSync(path.join(__dirname, file)).includes('@no-ci'));

  const results: string[] = [];
  const handle = (file: string) => {
    const file_dirname = path.dirname(file);
    for (const [index, result] of results.entries()) {
      const result_dirname = path.dirname(result);
      const common = common_path(result_dirname, file_dirname);
      if (common === result_dirname) {
        return;
      }
      if (common === file_dirname) {
        results.splice(index, 1, file);
        return;
      }
    }
    results.push(file);
  };
  files.forEach(handle);
  return results;
}

const config: Config = {
  port: 6621,
  entries: glob_script_files().map(parse_entry),
};

let io: Server;
function watch_it(compiler: webpack.Compiler) {
  if (compiler.options.watch) {
    if (!io) {
      const port = config.port ?? 6621;
      io = new Server(port, { cors: { origin: '*' } });
      console.info(`[Listener] 已启动酒馆监听服务, 正在监听: http://0.0.0.0:${port}`);
      io.on('connect', socket => {
        console.info(`[Listener] 成功连接到酒馆网页 '${socket.id}', 初始化推送...`);
        io.emit('iframe_updated');
        socket.on('disconnect', reason => {
          console.info(`[Listener] 与酒馆网页 '${socket.id}' 断开连接: ${reason}`);
        });
      });
    }

    compiler.hooks.done.tap('updater', () => {
      console.info('\n[Listener] 检测到完成编译, 推送更新事件...');
      io.emit('iframe_updated');
    });
  }
}

function parse_configuration(entry: Entry): (_env: any, argv: any) => webpack.Configuration {
  const should_obfuscate = fs.readFileSync(path.join(__dirname, entry.script), 'utf-8').includes('@obfuscate');
  const script_filepath = path.parse(entry.script);

  return (_env, argv) => ({
    experiments: {
      outputModule: true,
    },
    devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
    watchOptions: {
      ignored: ['**/dist', '**/node_modules'],
    },
    entry: path.join(__dirname, entry.script),
    target: 'browserslist',
    output: {
      devtoolNamespace: 'tavern_helper_template',
      devtoolModuleFilenameTemplate: info => {
        const resource_path = decodeURIComponent(info.resourcePath.replace(/^\.\//, ''));
        const is_direct = info.allLoaders === '';
        const is_vue_script =
          resource_path.match(/\.vue$/) &&
          info.query.match(/\btype=script\b/) &&
          !info.allLoaders.match(/\bts-loader\b/);

        return `${is_direct === true ? 'src' : 'webpack'}://${info.namespace}/${resource_path}${is_direct || is_vue_script ? '' : '?' + info.hash}`;
      },
      filename: `${script_filepath.name}.js`,
      path: path.join(__dirname, 'dist', path.relative(path.join(__dirname, 'src'), script_filepath.dir)),
      chunkFilename: `${script_filepath.name}.[contenthash].chunk.js`,
      asyncChunks: true,
      clean: true,
      publicPath: '',
      library: {
        type: 'module',
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
          exclude: /node_modules/,
        },
        {
          oneOf: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
                compilerOptions: {
                  noUnusedLocals: false,
                  noUnusedParameters: false,
                },
              },
              resourceQuery: /raw/,
              type: 'asset/source',
              exclude: /node_modules/,
            },
            {
              test: /\.(sa|sc)ss$/,
              use: ['postcss-loader', 'sass-loader'],
              resourceQuery: /raw/,
              type: 'asset/source',
              exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              use: ['postcss-loader'],
              resourceQuery: /raw/,
              type: 'asset/source',
              exclude: /node_modules/,
            },
            {
              resourceQuery: /raw/,
              type: 'asset/source',
              exclude: /node_modules/,
            },
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
                compilerOptions: {
                  noUnusedLocals: false,
                  noUnusedParameters: false,
                },
              },
              resourceQuery: /url/,
              type: 'asset/inline',
              exclude: /node_modules/,
            },
            {
              test: /\.(sa|sc)ss$/,
              use: ['postcss-loader', 'sass-loader'],
              resourceQuery: /url/,
              type: 'asset/inline',
              exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              use: ['postcss-loader'],
              resourceQuery: /url/,
              type: 'asset/inline',
              exclude: /node_modules/,
            },
            {
              resourceQuery: /url/,
              type: 'asset/inline',
              exclude: /node_modules/,
            },
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
                compilerOptions: {
                  noUnusedLocals: false,
                  noUnusedParameters: false,
                },
              },
              exclude: /node_modules/,
            },
            {
              test: /\.html$/,
              use: 'html-loader',
              exclude: /node_modules/,
            },
            {
              test: /\.md$/,
              use: [
                {
                  loader: 'html-loader',
                },
                {
                  loader: 'remark-loader',
                  options: {
                    remarkOptions: {
                      plugins: [RemarkHTML],
                    },
                  },
                },
              ],
            },
          ].concat(
            entry.html === undefined
              ? <any[]>[
                  {
                    test: /\.vue\.s(a|c)ss$/,
                    use: [
                      { loader: 'vue-style-loader', options: { ssrId: true } },
                      { loader: 'css-loader', options: { url: false } },
                      'postcss-loader',
                      'sass-loader',
                    ],
                    exclude: /node_modules/,
                  },
                  {
                    test: /\.vue\.css$/,
                    use: [
                      { loader: 'vue-style-loader', options: { ssrId: true } },
                      { loader: 'css-loader', options: { url: false } },
                      'postcss-loader',
                    ],
                    exclude: /node_modules/,
                  },
                  {
                    test: /\.s(a|c)ss$/,
                    use: [
                      'style-loader',
                      { loader: 'css-loader', options: { url: false } },
                      'postcss-loader',
                      'sass-loader',
                    ],
                    exclude: /node_modules/,
                  },
                  {
                    test: /\.css$/,
                    use: ['style-loader', { loader: 'css-loader', options: { url: false } }, 'postcss-loader'],
                    exclude: /node_modules/,
                  },
                ]
              : <any[]>[
                  {
                    test: /\.s(a|c)ss$/,
                    use: [
                      MiniCssExtractPlugin.loader,
                      { loader: 'css-loader', options: { url: false } },
                      'postcss-loader',
                      'sass-loader',
                    ],
                    exclude: /node_modules/,
                  },
                  {
                    test: /\.css$/,
                    use: [
                      MiniCssExtractPlugin.loader,
                      { loader: 'css-loader', options: { url: false } },
                      'postcss-loader',
                    ],
                    exclude: /node_modules/,
                  },
                ],
          ),
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.css'],
      plugins: [
        new TsconfigPathsPlugin({
          extensions: ['.ts', '.js', '.tsx', '.jsx'],
          configFile: path.join(__dirname, 'tsconfig.json'),
        }),
      ],
      alias: {},
    },
    plugins: (entry.html === undefined
      ? [new MiniCssExtractPlugin()]
      : [
          new HtmlWebpackPlugin({
            template: path.join(__dirname, entry.html),
            filename: path.parse(entry.html).base,
            scriptLoading: 'module',
            cache: false,
          }),
          new HtmlInlineScriptWebpackPlugin(),
          new MiniCssExtractPlugin(),
          new HTMLInlineCSSWebpackPlugin({
            styleTagFactory({ style }: { style: string }) {
              return `<style>${style}</style>`;
            },
          }),
        ]
    )
      .concat(
        { apply: watch_it },
        new VueLoaderPlugin(),
        unpluginAutoImport({
          dts: true,
          dtsMode: 'overwrite',
          imports: [
            'vue',
            'pinia',
            '@vueuse/core',
            { from: 'dedent', imports: [['default', 'dedent']] },
            { from: 'klona', imports: ['klona'] },
            { from: 'vue-final-modal', imports: ['useModal'] },
            { from: 'zod', imports: ['z'] },
          ],
        }),
        unpluginVueComponents({
          dts: true,
          syncMode: 'overwrite',
          // globs: ['src/panel/component/*.vue'],
          resolvers: [VueUseComponentsResolver(), VueUseDirectiveResolver()],
        }),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        new webpack.DefinePlugin({
          __VUE_OPTIONS_API__: false,
          __VUE_PROD_DEVTOOLS__: process.env.CI !== 'true',
          __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
<<<<<<< HEAD
          // vue-i18n 全局变量
          __INTLIFY_PROD_DEVTOOLS__: false,
          __VUE_I18N_FULL_INSTALL__: true,
          __VUE_I18N_LEGACY_API__: false,
          // 版本信息（用于版本检测）
          __VERSION__: JSON.stringify(versionInfo.version),
          __COMMIT__: JSON.stringify(versionInfo.commitHash),
          __BUILD_TIME__: JSON.stringify(versionInfo.buildTime),
        }),
        // ⚠️ 在打包后的 JS 文件开头注入全局变量定义
        // 必须在 vue-i18n 从 CDN 加载之前就定义好这些变量
        new webpack.BannerPlugin({
          banner: `
// vue-i18n 全局变量（必须在模块加载之前定义）
window.__VUE_PROD_DEVTOOLS__ = false;
window.__INTLIFY_PROD_DEVTOOLS__ = false;
window.__VUE_I18N_FULL_INSTALL__ = true;
window.__VUE_I18N_LEGACY_API__ = false;
          `.trim(),
          raw: true,
          entryOnly: true,
=======
>>>>>>> 5222cd67a858e8df734db29241ac1f211ca14bca
        }),
      )
      .concat(
        should_obfuscate
          ? [
              new WebpackObfuscator({
                controlFlowFlattening: true,
                numbersToExpressions: true,
                selfDefending: true,
                simplify: true,
                splitStrings: true,
              }),
            ]
          : [],
      ),
    optimization: {
      minimize: true,
      minimizer: [
        argv.mode === 'production'
          ? new TerserPlugin({
              terserOptions: { format: { quote_style: 1 }, mangle: { reserved: ['_', 'toastr', 'YAML', '$', 'z'] } },
            })
          : new TerserPlugin({
              extractComments: false,
              terserOptions: {
                format: { beautify: true, indent_level: 2 },
                compress: false,
                mangle: false,
              },
            }),
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            name: 'default',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    externals: ({ context, request }, callback) => {
      if (!context || !request) {
        return callback();
      }

      if (
        request.startsWith('-') ||
        request.startsWith('.') ||
        request.startsWith('/') ||
        request.startsWith('!') ||
        request.startsWith('http') ||
        path.isAbsolute(request) ||
        fs.existsSync(path.join(context, request)) ||
        fs.existsSync(request)
      ) {
        return callback();
      }

      const builtin = ['vue3-pixi', 'vue-demi'];
      if (builtin.includes(request)) {
        return callback();
      }
      if (argv.mode !== 'production' && ['vue', 'pixi'].some(key => request.includes(key))) {
        return callback();
      }
<<<<<<< HEAD
=======
      if (['react'].some(key => request.includes(key))) {
        return callback();
      }
>>>>>>> 5222cd67a858e8df734db29241ac1f211ca14bca
      const global = {
        jquery: '$',
        lodash: '_',
        showdown: 'showdown',
        toastr: 'toastr',
        vue: 'Vue',
        'vue-router': 'VueRouter',
        yaml: 'YAML',
        zod: 'z',
        'pixi.js': 'PIXI',
      };
      if (request in global) {
        return callback(null, 'var ' + global[request as keyof typeof global]);
      }
      const cdn = {
        sass: 'https://jspm.dev/sass',
      };
      return callback(
        null,
        'module-import ' + (cdn[request as keyof typeof cdn] ?? `https://testingcf.jsdelivr.net/npm/${request}/+esm`),
      );
    },
  });
}

export default config.entries.map(parse_configuration);
