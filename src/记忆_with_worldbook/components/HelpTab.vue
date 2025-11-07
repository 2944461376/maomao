<template>
  <div class="help-tab" style="padding: 25px !important; background: #1a1a1a !important">
    <!-- 版本信息 -->
    <div
      style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 35px 30px;
        border-radius: 20px;
        margin-bottom: 25px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        text-align: center;
        position: relative;
        overflow: hidden;
      "
    >
      <!-- 装饰元素 -->
      <div
        style="
          position: absolute;
          top: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        "
      ></div>
      <div
        style="
          position: absolute;
          bottom: -30px;
          left: -30px;
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        "
      ></div>

      <div style="position: relative; z-index: 1">
        <div style="font-size: 48px; margin-bottom: 10px">🐱</div>
        <h2 style="margin: 0 0 10px 0; color: white; font-size: 24px; font-weight: 600">
          {{ currentLocale === 'zh-CN' ? 'mzrodyu猫猫的小破烂' : "mzrodyu's Tool" }}
        </h2>
        <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin-bottom: 15px" class="version-info">
          {{ t('helpPage.version') }} v1.34
        </div>

        <!-- 按钮组 -->
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
          <button
            @click="checkUpdate"
            style="
              padding: 12px 24px;
              background: white;
              color: #667eea;
              border: none;
              border-radius: 10px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
              display: flex;
              align-items: center;
              gap: 8px;
            "
            @mouseover="$event.target.style.transform = 'translateY(-2px)'"
            @mouseleave="$event.target.style.transform = ''"
          >
            <i class="fa-solid fa-rotate" style="margin-right: 6px"></i>
            {{ t('helpPage.checkUpdate') }}
          </button>

          <button
            @click="downloadLatest"
            style="
              padding: 12px 24px;
              background: rgba(255, 255, 255, 0.2);
              color: white;
              border: 1px solid rgba(255, 255, 255, 0.5);
              border-radius: 10px;
              font-size: 15px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s;
              display: flex;
              align-items: center;
              gap: 8px;
            "
            @mouseover="$event.target.style.background = 'rgba(255, 255, 255, 0.3)'"
            @mouseleave="$event.target.style.background = 'rgba(255, 255, 255, 0.2)'"
          >
            <i class="fa-solid fa-download" style="margin-right: 6px"></i>
            {{ t('helpPage.downloadLatest') }}
          </button>
        </div>

        <!-- 版权声明 -->
        <div
          style="
            margin-top: 25px;
            padding: 20px;
            background: rgba(220, 53, 69, 0.15);
            border: 2px solid rgba(220, 53, 69, 0.3);
            border-radius: 12px;
            backdrop-filter: blur(10px);
          "
        >
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; justify-content: center">
            <i class="fa-solid fa-shield-halved" style="color: #ffc107; font-size: 16px"></i>
            <span style="color: white; font-weight: 600; font-size: 14px">{{ t('helpPage.copyright') }}</span>
          </div>
          <div style="color: rgba(255, 255, 255, 0.95); font-size: 13px; line-height: 1.8; text-align: left">
            <div style="margin-bottom: 5px" v-html="t('helpPage.copyrightContent.line1')"></div>
            <div style="margin-bottom: 5px" v-html="t('helpPage.copyrightContent.line2')"></div>
            <div style="margin-bottom: 5px" v-html="t('helpPage.copyrightContent.line3')"></div>
            <div v-html="t('helpPage.copyrightContent.line4')"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div
      style="
        background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
        padding: 25px;
        border-radius: 16px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(74, 158, 255, 0.2);
      "
    >
      <h3
        style="
          margin: 0 0 20px 0;
          color: #4a9eff;
          font-size: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        "
        @click="expandedSections.usage = !expandedSections.usage"
      >
        <i class="fa-solid fa-book-open" style="color: #4a9eff; font-size: 18px"></i>
        {{ t('helpPage.usageGuide') }}
        <i
          :class="expandedSections.usage ? 'fa-chevron-up' : 'fa-chevron-down'"
          class="fa-solid"
          style="
            margin-left: auto;
            font-size: 14px;
            transition: transform 0.3s;
            color: #888;
          "
        ></i>
      </h3>

      <div
        v-show="expandedSections.usage"
        style="
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.8;
          animation: fadeIn 0.3s ease-in;
        "
      >
        <h4 style="color: #4a9eff; margin-top: 0; margin-bottom: 15px; font-size: 16px" v-html="t('helpPage.features.title')"></h4>
        <ul style="margin: 5px 0; padding-left: 20px">
          <li v-html="t('helpPage.features.summary')"></li>
          <li v-html="t('helpPage.features.cardAssist')"></li>
          <li v-html="t('helpPage.features.statusBar')"></li>
          <li v-html="t('helpPage.features.mvu')"></li>
          <li v-html="t('helpPage.features.others')"></li>
        </ul>

        <h4 style="color: #4a9eff; margin-top: 25px; margin-bottom: 15px; font-size: 16px" v-html="t('helpPage.usage.title')"></h4>
        <div
          style="
            background: rgba(220, 53, 69, 0.1);
            border-left: 4px solid #dc3545;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
          "
        >
          <div style="color: #dc3545; font-weight: 600; margin-bottom: 8px" v-html="t('helpPage.usage.apiConfig')"></div>
          <div style="font-size: 13px; color: #e0e0e0; line-height: 1.6">
            <div style="margin-bottom: 8px">
              <span v-html="t('helpPage.usage.apiFormats')"></span>
              <ul style="margin: 5px 0; padding-left: 20px">
                <li v-html="t('helpPage.usage.apiFormat1')"></li>
                <li v-html="t('helpPage.usage.apiFormat2')"></li>
                <li v-html="t('helpPage.usage.apiFormat3')"></li>
              </ul>
            </div>
            <div style="margin-bottom: 5px">
              <span v-html="t('helpPage.usage.apiExample')"></span>
              <code style="background: rgba(220, 53, 69, 0.2); padding: 2px 6px; border-radius: 4px"
                >https://api.openai.com</code
              >
            </div>
          </div>
        </div>
        <ul style="margin: 5px 0; padding-left: 20px">
          <li v-html="t('helpPage.usage.import')"></li>
          <li v-html="t('helpPage.usage.firstUse')"></li>
          <li v-html="t('helpPage.usage.autoSummary')"></li>
        </ul>
      </div>
    </div>

    <!-- 更新日志 -->
    <div
      style="
        background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
        padding: 25px;
        border-radius: 16px;
        margin-bottom: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(40, 167, 69, 0.2);
      "
    >
      <h3
        style="
          margin: 0 0 20px 0;
          color: #28a745;
          font-size: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        "
        @click="expandedSections.changelog = !expandedSections.changelog"
      >
        <i class="fa-solid fa-clock-rotate-left" style="color: #28a745; font-size: 18px"></i>
        {{ t('helpPage.changelog') }}
        <i
          :class="expandedSections.changelog ? 'fa-chevron-up' : 'fa-chevron-down'"
          class="fa-solid"
          style="
            margin-left: auto;
            font-size: 14px;
            transition: transform 0.3s;
            color: #888;
          "
        ></i>
      </h3>

      <div
        v-show="expandedSections.changelog"
        style="
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.8;
          animation: fadeIn 0.3s ease-in;
        "
      >
        <!-- v1.34 -->
        <div
          style="
            padding: 20px;
            background: rgba(76, 175, 80, 0.05);
            border-left: 4px solid #4caf50;
            border-radius: 8px;
            margin-bottom: 15px;
          "
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div
              style="
                font-size: 16px;
                font-weight: 600;
                color: #4caf50;
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              v1.34
            </div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v134.date') }}</div>
          </div>
          <ul class="update-list">
            <li v-for="feature in t('helpPage.updates.v134.features')" :key="feature" class="update-item">
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- v1.33 -->
        <div
          style="
            padding: 20px;
            background: rgba(255, 152, 0, 0.05);
            border-left: 4px solid #ff9800;
            border-radius: 8px;
            margin-bottom: 15px;
          "
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div
              style="
                font-size: 16px;
                font-weight: 600;
                color: #ff9800;
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              v1.33 - {{ t('helpPage.updates.v133.title') }}
            </div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v133.date') }}</div>
          </div>
          <ul class="update-list">
            <li v-for="feature in t('helpPage.updates.v133.features')" :key="feature" class="update-item">
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- v1.32 -->
        <div style="padding: 20px; background: rgba(99, 102, 241, 0.05); border-left: 4px solid #6366f1; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #6366f1">v1.32</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v132.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #6366f1; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v132.optimize') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="opt in t('helpPage.updates.v132.optimizeFeatures')" :key="opt">{{ opt }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.31 -->
        <div style="padding: 20px; background: rgba(99, 102, 241, 0.05); border-left: 4px solid #6366f1; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #6366f1">v1.31</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v131.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v131.newFeatures') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v131.newFeaturesList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
          <div style="margin-bottom: 15px">
            <div style="color: #6366f1; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v131.optimize') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="opt in t('helpPage.updates.v131.optimizeFeatures')" :key="opt">{{ opt }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.30 -->
        <div style="padding: 20px; background: rgba(99, 102, 241, 0.05); border-left: 4px solid #6366f1; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #6366f1">v1.30</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v130.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v130.newFeatures') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v130.newFeaturesList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
          <div style="margin-bottom: 15px">
            <div style="color: #6366f1; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v130.optimize') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="opt in t('helpPage.updates.v130.optimizeFeatures')" :key="opt">{{ opt }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.29 -->
        <div style="padding: 20px; background: rgba(99, 102, 241, 0.05); border-left: 4px solid #6366f1; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #6366f1">v1.29</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v129.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #10b981; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v129.newFeatures') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v129.newFeaturesList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.28 -->
        <div style="padding: 20px; background: rgba(99, 102, 241, 0.05); border-left: 4px solid #6366f1; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #6366f1">v1.28</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v128.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #dc3545; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v128.majorUpdate') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v128.majorUpdateList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.27 -->
        <div style="padding: 20px; background: rgba(40, 167, 69, 0.05); border-left: 4px solid #28a745; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #28a745">v1.27</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v127.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v127.newFeatures') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v127.newFeaturesList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.26 -->
        <div style="padding: 20px; background: rgba(40, 167, 69, 0.05); border-left: 4px solid #28a745; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #28a745">v1.26</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v126.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v126.newFeatures') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v126.newFeaturesList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.25 -->
        <div style="padding: 20px; background: rgba(40, 167, 69, 0.05); border-left: 4px solid #28a745; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #28a745">v1.25</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v125.date') }}</div>
          </div>

          <div style="margin-bottom: 15px">
            <div style="color: #28a745; font-weight: 600; margin-bottom: 8px">{{ t('helpPage.updates.v125.newFeatures') }}</div>
            <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
              <li v-for="feature in t('helpPage.updates.v125.newFeaturesList')" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>

        <!-- v1.0.0 -->
        <div style="padding: 20px; background: rgba(220, 53, 69, 0.05); border-left: 4px solid #dc3545; border-radius: 8px; margin-bottom: 15px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
            <div style="font-size: 16px; font-weight: 600; color: #dc3545">v1.0.0</div>
            <div style="font-size: 13px; color: #888">{{ t('helpPage.updates.v100.date') }}</div>
          </div>

          <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px">
            <li v-for="feature in t('helpPage.updates.v100.features')" :key="feature">{{ feature }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 关于 -->
    <div
      style="
        text-align: center;
        color: #888;
        font-size: 13px;
        padding: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      "
    >
      <div style="margin-bottom: 8px">{{ t('helpPage.madeWith') }} <span style="color: #dc3545">❤️</span> {{ t('helpPage.by') }} mzrodyu</div>
      <div style="font-size: 12px">
        {{ t('helpPage.basedOn') }}
        <a
          href="https://github.com/SillyTavern/SillyTavern"
          target="_blank"
          style="color: #4a9eff; text-decoration: none"
          >SillyTavern</a
        >
        {{ t('helpPage.and') }}
        <a
          href="https://n0vi028.github.io/JS-Slash-Runner-Doc/"
          target="_blank"
          style="color: #4a9eff; text-decoration: none"
          >Tavern Helper</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { checkForUpdates } from '../version-checker';

const { t, locale } = useI18n();
const currentLocale = computed(() => locale.value);

// 折叠展开状态
const expandedSections = ref({
  usage: false,
  changelog: false,
});

// 检查更新
const checkUpdate = () => {
  checkForUpdates(true);
};

// 下载最新版本
const downloadLatest = async () => {
  try {
    window.toastr.info(
      currentLocale.value === 'zh-CN' ? '正在获取最新版本信息...' : 'Fetching latest version info...',
      currentLocale.value === 'zh-CN' ? '下载中' : 'Downloading',
      { timeOut: 2000 },
    );

    // 1. 获取最新版本号
    const timestamp = Date.now();
    const versionResponse = await fetch(
      `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao/dist/记忆_with_worldbook/version.json?_=${timestamp}`,
    );

    if (!versionResponse.ok) {
      throw new Error(currentLocale.value === 'zh-CN' ? '无法获取版本信息' : 'Failed to fetch version info');
    }

    const versionInfo = await versionResponse.json();
    const version = versionInfo.version;

    window.toastr.info(
      currentLocale.value === 'zh-CN' ? `正在下载 v${version}...` : `Downloading v${version}...`,
      currentLocale.value === 'zh-CN' ? '下载中' : 'Downloading',
      { timeOut: 2000 },
    );

    // 2. 下载对应版本的 JSON 文件
    const jsonUrl = `https://testingcf.jsdelivr.net/gh/mzrodyu/maomao/dist/记忆_with_worldbook/猫猫的写卡小工具 v${version}.json?_=${timestamp}`;
    const jsonResponse = await fetch(jsonUrl);

    if (!jsonResponse.ok) {
      throw new Error(
        currentLocale.value === 'zh-CN' ? `下载失败: HTTP ${jsonResponse.status}` : `Download failed: HTTP ${jsonResponse.status}`,
      );
    }

    const jsonContent = await jsonResponse.text();

    // 3. 创建下载链接
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `猫猫的写卡小工具 v${version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.toastr.success(
      currentLocale.value === 'zh-CN'
        ? `v${version} 已下载完成，请在酒馆脚本库重新导入该文件`
        : `v${version} downloaded successfully, please re-import the file in SillyTavern script library`,
      currentLocale.value === 'zh-CN' ? '下载成功' : 'Success',
      { timeOut: 8000 },
    );
  } catch (error: any) {
    console.error('下载失败:', error);
    window.toastr.error(
      (currentLocale.value === 'zh-CN' ? '下载失败: ' : 'Download failed: ') + error.message,
      currentLocale.value === 'zh-CN' ? '错误' : 'Error',
      { timeOut: 5000 },
    );
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.update-list {
  margin: 5px 0;
  padding-left: 20px;
  font-size: 14px;
}

.update-item {
  margin-bottom: 8px;
  line-height: 1.6;
}
</style>
