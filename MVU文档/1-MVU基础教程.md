# MVU 基础教程

> **MVU (MagVarUpdate)** - 一种更方便的变量更新、维护框架  
> 作者：MagicalAstrogy (MAG老师)

---

## 📖 目录

1. [前言 - 为什么需要 MVU？](#前言)
2. [安装配置](#安装)
3. [使用方法](#使用)
4. [问题定位](#问题定位)
5. [初始值设定](#初始值设定)
6. [不同开局的不同初始值](#不同开局的不同初始值)
7. [变量条件判断](#变量条件判断)
8. [状态栏显示](#状态栏显示)
9. [高阶用法](#高阶用法)
10. [总结和参考资源](#总结和参考资源)

---

## 前言

![MVU头图](https://gcore.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@master/doc/title.png)

### 为什么需要 MVU？

目前基于正则变量更新的好感度方案，在实际使用上存在以下问题：

1. **正则表达式复杂**：需要针对 LLM 的各种抽风、边缘状态与正则表达式塔塔开
2. **楼层依赖问题**：无法随意隐藏较早楼层，需要在 `<FullVariableUpdate>` 产生后才能隐藏，否则会出现变量不一致
3. **性能开销大**：需要持续对所有楼层进行正则处理，有较高的运行时开销

### MVU 的优势

为了解决上述问题，MVU 采用了全新的设计思路：在每次 LLM 生成完消息时，对消息里的变量变更进行扫描，读取里面的变更记录。

**核心特性：**

1. ✅ 引入了新的不依赖于 Check 的变量更新条件描述方法
2. ✅ 支持根据开局设置变量初始值
3. ✅ 要求类似代码的格式输出，避免 LLM 填写错误
4. ✅ 在变量更新时设置回调，编写专有逻辑
5. ✅ 变量记录不依赖于过往楼层，可以随时隐藏/删除
6. ✅ 可以将整个变量 JSON 传给 LLM，让它设计状态栏
7. ✅ 支持在全局世界书中使用

**最佳搭配：** 建议与 [提示词模板语法](https://discord.com/channels/1134557553011998840/1336648321963524127) 一同使用，以获得最好的效果。

---

## 安装

MVU 的安装需要配置：**1个脚本 + 2个正则 + 1个世界书条目**

### 步骤 1：添加局部脚本

在你的角色卡中，新增一个局部脚本，内容为：

```javascript
import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@master/artifact/bundle.js'
```

**配置截图：**  
![脚本配置](https://gcore.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@master/doc/img.png)

点击确认后**启用**这个脚本即可。

---

### 步骤 2：添加正则表达式

#### 2.1 正则 1：去除变量更新

- **名称**：`去除变量更新`
- **正则内容**：
  ```regex
  /<UpdateVariable>[\s\S]*?</UpdateVariable>/gm
  ```
- **作用范围**：`AI输出` 和 `用户输入`
- **其他选项**：`仅格式显示` + `仅格式提示词`

**配置截图：**  
![正则配置](https://gcore.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate@master/doc/img_1.png)

#### 2.2 正则 2：对 AI 隐藏状态栏

- **名称**：`对 AI 隐藏状态栏`
- **正则内容**：
  ```regex
  <StatusPlaceHolderImpl/>
  ```
- **作用范围**：`AI输出`
- **其他选项**：`仅格式提示词`

#### 2.3 正则 3（可选）：隐藏流式输出

如果要避免流式过程中显示出变量更新的内容，可以添加：

```regex
/<update(?:variable)?>((?!.*<\/update(?:variable)?>).*$|.*<\/update(?:variable)?>)/gsi
```

---

### 步骤 3：添加世界书条目

在你的角色使用的世界书中，新增 `蓝灯 D1` 条目，作用是将变量列表输出给 LLM，并说明变量更新的规则：

```ejs
<status_description>//do not output following content
    {{get_message_variable::stat_data}},
</status_description>//do not output content below directly
<Analysis>$(IN ENGLISH$)
    - calculate time passed: ...
    - decide whether dramatic updates are allowed as it's in a special case or the time passed is more than usual: yes or no
    - list every variable in `<status_description>` section before actual variable analysis: ...
    - Analyze whether this variable satisfies its change conditions, do not output reason:...
    - Ignore summary related content when evaluate.
</Analysis>

rule:
description: You should output the update analysis in the end of the next reply
analysis:
    - You must rethink what variables are defined in <self_description> property, and analyze how to update each of them accordingly
    - For counting variables, change it when the corresponding event occur but don't change it any more during the same event
    - When a numerical variable changes, check if it crosses any stage threshold and update to the corresponding stage
    - if dest element is an array, only update and only output the first element, not `[]` block.
    format: |-
    <UpdateVariable>
        <Analysis>
            ${path}: Y/N
            ...
        </Analysis>
        _.set('${path}', ${old}, ${new});//${reason}
    </UpdateVariable>
    example: |-
    <UpdateVariable>
        <Analysis>
            悠纪.好感度: Y
            暮莲.日程.周三.上午: Y
            ...
        </Analysis>
        _.set('悠纪.好感度', 33,35);//愉快的一次讨论，悠纪觉得与你一起是开心的
        _.set('暮莲.日程.周三.上午', "空", "地点：data_center_zone.数据服务器室 行为：检查");//暮莲规划了周三上午的日程
    </UpdateVariable>
```

---

### ✅ 安装完成检查

配置完上面的内容后，你就完成了安装。可以通过 **SillyTavern 的命令行**，确定实际发出的内容。

---

## 使用

下面将从各个方面的特性，介绍安装了 MVU 之后，应当在角色卡中如何使用它。

---

## 问题定位

### 检查变量状态

大部分情况下，发生问题时都需要检查：
1. **SillyTavern 的命令行**
2. **当前的变量状态**

**安装变量查看器插件：**  
https://github.com/LenAnderson/SillyTavern-Variable-Viewer/

**使用方法：**  
在聊天框输入 `/variableviewer` 来开关变量查看器。

---

### 检查更新操作

每次 LLM 输出的字符串，都会有专门的段来说明更新的变量：

```xml
<UpdateVariable>
    <Analysis>
        悠纪.好感度: Y
        暮莲.日程.周三.上午: Y
        ...
    </Analysis>
    _.set('悠纪.好感度', 33,35);//愉快的一次讨论，悠纪觉得与你一起是开心的
    _.set('暮莲.日程.周三.上午', "空", "地点：data_center_zone.数据服务器室 行为：检查");//暮莲规划了周三上午的日程
</UpdateVariable>
```

**核心语法：**

```javascript
_.set('变量路径', 老值, 新值);//更新原因
```

> **注意**：有时新值会是 `[]` 包裹的字符串，但这并不影响它正常执行。

---

### 通过聊天文件检查

变量被记录在聊天文件中，每一个 Assistant 消息都有其对应的变量状态。

**查看方法：**

1. **导出聊天文件**
2. **直接查看存档**（推荐）  
   路径：`SillyTavern/default-user/chats/角色卡名称/聊天文件`

用 **VSCode** 打开能看见变量实时更新。

你也可以通过修改这个 JSON 后，重新载入聊天，来进行变量输入的修改。

---

## 初始值设定

### `[InitVar]` 世界书条目

在新的聊天加载，和每一条消息发出之前，MVU 都会检测变量是否进行过初始化。

**初始化方式：**  
使用所有名字中包含 `[InitVar]` 的世界书条目进行初始化。

> **注意**：这个条目**可以是关闭的状态**。

---

### 变量格式

变量需要按照指定的 JSON 格式进行编写：

```json
{
    "日期": ["03月15日", "今天的日期，格式为 mm月dd日"],
    "时间": [
        "09:00",
        "按照进行行动后实际经历的时间进行更新，每次行动后更新，格式为 hh:mm"
    ],
    "user": {
        "身份": ["新来的牧师", "随故事进展改变"],
        "当前位置": ["教堂","user所在位置，移动后改变"],
        "重要经历": ["", "与理发生的重要事情会记录在这"],
        "与理的关系": ["", "当与理的关系阶段发生改变时更新"]
    },
    "理":{
        "当前位置": ["教堂","理所在位置，移动后改变"],
        "情绪状态": {
            "pleasure": [
                0.1,
                "[-1,1]之间,情绪变化时更新,−1 - 极端痛苦、悲伤、厌恶；1 - 极端喜悦、满足、陶醉。"
            ]
        },
        "当前所想": ["今天吃什么好呢？", "理 现在脑子里想的事情，随互动更新"]
    }
}
```

### 格式说明

**数组格式：**

```json
["初始值", "变量更新的条件、变量相关的信息"]
```

- `[0]`：变量的初始值
- `[1]`：变量更新的条件/说明

**嵌套结构：**  
整体变量遵循 JSON 的分层结构，一层层嵌套。这种嵌套可以：
- 告诉 LLM 指定变量的归属和关系
- 引导 LLM 更好地读取和生成变量更新语句

**示例分析：**  
在 `理.情绪状态.pleasure` 中，描述了：
- 取值范围：`[-1, 1]`
- 取值含义：情绪状态的量化表示
- 更新条件：情绪变化时更新

这些信息辅助 LLM 更好地理解和使用这个变量。

> **注意**：不写条件不意味着 LLM 不会进行更新，它也会根据变量的名字来自行判断。

---

## 不同开局的不同初始值

MVU 支持对应不同的开局设定初始值。

### 配置方法

在**额外问候语**的字符串中加入 `<UpdateVariable>` 段：

```xml
然后，她再次抬眸望向你，用一种几乎透明到胆怯程度的语调补上一句：

**"如果您愿意…以后我们可以一起主持礼拜……我可以学一些新的诗篇……只要您觉得合适……"**

<UpdateVariable>
_.set('user.身份', '未知', '新来的牧师');//故事开始的设定
_.set("理.好感度",0,15);//故事开始的设定
</UpdateVariable>
```

### 工作原理

这些在额外问候语中的更新语句，会在 `[InitVar]` 的基础上进行**覆盖**，变为此处设定的值。

> **提示**：老值可以填写为任意内容，实际上并不关心。

---

## 变量条件判断

### ⚠️ 核心原则

**不要将复杂条件交给 LLM 判断，容易产生矛盾。**

老老实实使用 **提示词模板语法** 进行相关的工作。

---

### 分段好感度示例

```ejs
<relationship_ri_with_user>
//理在目前好感度下，对<user>的行为特征
<% if (_.has(getvar("stat_data"), '理.好感度.[0]')) {%>
理:
<% if (getvar("stat_data").理["好感度"][0] >= -100 && getvar("stat_data").理["好感度"][0] < 20) { %>
    daily_performance:
      behavior:
        - "她在面对<user>时始终保持有礼而端庄的态度，言行举止透着圣女的庄重与温和，并未表现出太多个人情绪。"
//具体内容略
<% } %>
//重复若干次
</relationship_ri_with_user>
```

### 代码解析

**第一个 if：** 检查变量是否存在
```javascript
if (_.has(getvar("stat_data"), '理.好感度.[0]'))
```
- 检查变量是否已初始化
- 不加可能导致在第一条消息发送之前提示词模板报错（虽然不影响游玩）

**第二个 if：** 具体的变量检查
```javascript
if (getvar("stat_data").理["好感度"][0] >= -100 && getvar("stat_data").理["好感度"][0] < 20)
```

### 变量访问规则

1. **所有变量都挂在 `stat_data` 下**
2. **通过 `getvar("stat_data")` 获取**
3. **根据定义的层次进行访问**
4. **不要忘了最后的 `[0]`**，否则获取到的是一个数组

---

## 状态栏显示

### 核心变量

MVU 提供了两个核心的变量：

| 变量 | 含义 | 格式 |
|------|------|------|
| `stat_data` | 当前值 | `[最新值, "更新条件"]` |
| `display_data` | 显示值 | `"老值->新值(原因)"` |

### 示例对比

**更新语句：**
```javascript
_.set('理.好感度', 66, 74); //接受告白并确认关系，好感度大幅提升
```

**在 `stat_data` 中：**
```javascript
[74, "[-30,100]之间,理对 user 的好感度，在与 理 交流过程中变化，变化范围为 [-5,8]"]
```

**在 `display_data` 中：**
```javascript
"66->74(接受告白并确认关系，好感度大幅提升)"
```

**用途：** 通过 `display_data` 可以在结果中更加细致地显示变量的变更。

---

### HTML 状态栏

在 HTML 代码中，通过异步方法 `getChatMessages` 获得对应的变量：

```javascript
function initDisplay() {
  const variables = getVariables({ type: 'message', message_id: getCurrentMessageId() });
  const stat_data = _.get(variables, 'display_data', _.get(variables, 'stat_data'));
  // 略
}

$(() => {
  initDisplay();
});
```

**参考对话：**  
https://claude.ai/share/fb0d85fe-486a-4184-a3d0-c5dee4053c24

**重要提示：**
- 需要 LLM 实现一个 `SafeGetValue` 来处理数组和非数组的情况
- 使用 `strict: true`，并且避免使用 `//` 形式的注释

**参考示例：**  
`圣女理理` 角色卡中的 `状态栏` 正则

---

### 纯文本状态栏

你也可以以纯文本的形式来编写状态栏，将这些部分置入正则的 `替换为` 部分即可：

```ejs
💖 当前好感度: {{get_message_variable::stat_data.理.好感度[0]}}
🎁 重要物品: {{get_message_variable::stat_data.理.重要物品[0]}}
🧠 重要记忆: {{get_message_variable::stat_data.理.重要记忆[0]}}
👗 着装: {{get_message_variable::stat_data.理.着装[0]}}
🌸 处女: {{get_message_variable::stat_data.理.处女[0]}}
🔢 性行为次数: {{get_message_variable::stat_data.理.性行为次数[0]}}
😊 情绪状态‑pleasure: {{get_message_variable::stat_data.理.情绪状态.pleasure[0]}}
🔥 情绪状态‑arousal: {{get_message_variable::stat_data.理.情绪状态.arousal[0]}}
👑 情绪状态‑dominance: {{get_message_variable::stat_data.理.情绪状态.dominance[0]}}
🤝 情绪状态‑affinity: {{get_message_variable::stat_data.理.情绪状态.affinity[0]}}
💭 当前所想: {{get_message_variable::stat_data.理.当前所想[0]}}
```

**语法说明：**  
每个 `{{get_message_variable::stat_data.理.当前所想[0]}}` 段，都是在取 `stat_data` 中对应名称的变量。你可以按照你想要的任意形式来组织文本结构。

> **版本要求**：需要更新到酒馆助手 3.2.1 以上版本才能正常运行

**参考示例：**  
`圣女理理` 角色卡中的 `状态栏-纯文本` 正则

---

## 高阶用法

### 变量更新回调

对于有 JavaScript 编写能力的开发者，可以参考 [example_src](https://github.com/MagicalAstrogy/MagVarUpdate/tree/master/example_src) 中的代码，对接 **变量更新时** 的回调。

**示例场景：**  
实现在 LLM 日替时如果忘记更新日期了，会替代 LLM 自己进行更新。

---

### 事件类型

MVU 提供了三种事件：

```javascript
"mag_variable_updated"        // 更新时
"mag_variable_update_ended"   // 完成整个回复的更新后
"mag_variable_update_started" // 开始整个回复的更新前
```

### 函数定义

```typescript
[mag_variable_updated]: (
  stat_data: Record<string, any>, 
  path: string, 
  _oldValue: any, 
  _newValue: any
) => void

[mag_variable_update_ended]: (
  variables: GameData, 
  out_is_updated: boolean
) => void

[mag_variable_update_started]: (
  variables: GameData, 
  out_is_updated: boolean
) => void
```

**参考资料：**  
- 代码参考：https://github.com/MagicalAstrogy/MagVarUpdate/blob/master/src/main.ts
- 复杂用例：https://discord.com/channels/1291925535324110879/1355209319548977333

---

## 总结和参考资源

### 核心优势

MVU 系统为角色卡创作者提供了一个**强大而灵活的工具**，使得角色的状态管理变得更加**可靠和高效**。

无论你是：
- ✅ 经验丰富的角色卡作者
- ✅ 刚刚开始尝试创建自己的角色

MVU 系统都能为你提供实用的支持。

---

### 样例角色卡

**圣女理理** - MVU 框架完整实现示例：
- Discord: https://discord.com/channels/1291925535324110879/1367723727827111998
- Discord: https://discord.com/channels/1134557553011998840/1381913493774536755

**实现的功能：**
1. 设置变量初始值 ([InitVar] 世界书条目)
2. 根据开局设置变量初始值
3. 根据输出格式编写角色卡
4. 在变量更新时设置回调，编写专有逻辑
5. 基于变量 & 提示词模板语法，实现分段好感度
6. 基于变量，实现特定触发条件的剧情事件

**对话记录：**  
https://claude.ai/share/fb0d85fe-486a-4184-a3d0-c5dee4053c24

---

### 相关资源

**官方资源：**
- **MVU GitHub**: https://github.com/MagicalAstrogy/MagVarUpdate
- **示例代码**: https://github.com/MagicalAstrogy/MagVarUpdate/tree/master/example_src
- **提示词模板语法**: https://discord.com/channels/1134557553011998840/1336648321963524127

**参考角色卡：**
- https://discord.com/channels/1291925535324110879/1339557809137778688
- https://discord.com/channels/1291925535324110879/1355209319548977333
- https://discord.com/channels/1134557553011998840/1307433067463315538
- https://discord.com/channels/1134557553011998840/1309438694557487145

---

## 下一步学习

完成基础教程后，推荐继续学习：

1. **[MVU Beta 完整指南](./2-MVUBeta完整指南.md)** - 学习 Beta 版的高级功能
2. **[EJS 实战指南](./3-EJS实战指南.md)** - 掌握动态世界书和复杂逻辑

---

**祝你创作愉快！** 🎉

