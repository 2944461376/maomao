# EJS 实战指南

> **EJS (Embedded JavaScript Templates)** - 动态世界书的核心技术  
> 教程整理：秋青子  
> **免责声明**：本教程为个人研究理解整理，属于"邪教"式教学，是对官方教程的精简和二创

---

## 📚 目录

1. [前言](#前言)
2. [基础语法](#基础语法)
3. [变量系统](#变量系统)
4. [世界书操作](#世界书操作)
5. [多阶段人设系统](#多阶段人设系统)
6. [装饰器与内容注入](#装饰器与内容注入)
7. [调试技巧](#调试技巧)
8. [常见错误](#常见错误)
9. [最佳实践](#最佳实践)
10. [实战示例](#实战示例)

---

## 前言

### 作者说明

> "我真的受不了每次都有玩家问我世界书是不是忘记开了！哪怕我写了"世界书不用开"也还会再问一遍！！！"  
> —— 秋青子

这份 EJS 实战指南的核心重点是：**禁用世界书条目调用**

这个功能在大世界修仙卡中测试效果极好，无论你怎么玩，Token 的量都被控制在一个极其完美的数值上，绝不会误触任何一个条目。

**效果：**
- 不用的时候：0 Token
- 用的时候：需要什么插入什么，绝不会多也不会少

### 前置要求

在学习本指南之前，请确保你：
- ✅ 阅读并掌握 [MVU基础教程](./1-MVU基础教程.md) 和 [MVU Beta完整指南](./2-MVUBeta完整指南.md)
- ✅ 了解 JSON 和 JavaScript 基础语法
- ✅ 熟悉 SillyTavern 的世界书系统

---

## 基础语法

### 标签类型

| 标签           | 作用             | 说明                 |
| -------------- | ---------------- | -------------------- |
| `<% 代码 %>`   | 执行代码         | 不输出内容，有空白行 |
| `<%_ 代码 _%>` | 执行代码（推荐） | 不输出内容，去除空白 |
| `<%= 变量 %>`  | 输出变量         | HTML转义，安全输出   |
| `<%- 变量 %>`  | 输出变量（推荐） | 不转义，原样输出     |
| `<%# 注释 %>`  | EJS注释          | 不会被处理           |

---

### 最佳实践

```javascript
<%_
// ✅ 使用 <%_ _%> 避免多余换行
const value = 100;
_%>

<%- output %>           // ✅ 使用 <%- 输出内容
<%# 这是注释 %>         // ✅ 使用 <%# 写注释

<% print(value) %>     // ❌ 不推荐使用 print()
<% // 普通注释 %>       // ❌ 不推荐用 JS 注释
```

---

### 混合渲染示例

EJS 可以在同一文件中混合代码逻辑和文本输出：

```javascript
<%_
const name = '夏莉';
const level = 5;
_%>

## 角色信息
**姓名**: <%= name %>
**等级**: <%= level %>

<% if (level > 3) { %>
这是高级角色！
<% } %>
```

**渲染结果：**

```markdown
## 角色信息
**姓名**: 夏莉
**等级**: 5

这是高级角色！
```

---

## 变量系统

### 变量作用域（EJS官方）

#### variables 对象

EJS 提供了一个全局的 `variables` 对象，包含所有合并后的变量：

```javascript
variables = {}  // 按优先级合并的所有变量
```

---

#### 作用域类型

| 作用域    | 说明     | 持久化 | 使用场景             |
| --------- | -------- | ------ | -------------------- |
| `global`  | 全局变量 | ✅      | 跨角色、跨对话共享   |
| `local`   | 聊天变量 | ✅      | 当前聊天记录         |
| `message` | 消息变量 | ✅      | 绑定到具体消息       |
| `cache`   | 临时变量 | ❌      | 临时计算（默认）     |
| `initial` | 初始变量 | ❌      | 只读，来自 [InitVar] |

---

#### 优先级顺序

当多个作用域有同名变量时，按以下顺序合并（从高到低）：

1. **消息变量**（从最新到最旧）
2. **局部变量**
3. **全局变量**

---

### MVU框架变量（⚠️ 必看！）

`stat_data` **不是 EJS 官方功能**，而是 **MVU变量管理框架** 的数据结构。

#### 存储格式

MVU 将数据存储在 `local` 作用域的 `stat_data` 对象中：

```javascript
{
  "stat_data": {
    "角色名": {
      "属性名": [值, "说明"]  // [0]是值，[1]是说明
    }
  }
}
```

---

#### 读取规则（EJS中）

```javascript
// ✅ 正确写法
const value = getvar('stat_data.角色.属性[0]') || 默认值;

// ❌ 常见错误
const value = getvar('角色.属性[0]');         // 缺少 stat_data 前缀
const value = getvar('stat_data.角色.属性');  // 缺少 [0] 索引
```

**核心要点：**
- **必须**包含 `stat_data.` 前缀
- **必须**使用 `[0]` 访问值（`[1]` 是说明文本）

---

### 变量操作函数（EJS官方）

#### `getvar()` - 读取变量

**语法：**

```javascript
getvar(key, options)
```

**参数：**
- `key`：变量路径（字符串）
- `options`：可选配置对象
  - `scope`：指定作用域（`'global'`、`'local'`、`'message'`、`'cache'`、`'initial'`）
  - `defaults`：默认值
  - `noCache`：禁用缓存（用于读取刚设置的变量）

**示例：**

```javascript
<%_
// 读取 MVU 变量
const aoValue = getvar('stat_data.傲娇系统.傲[0]') || 100;

// 指定作用域和默认值
const userName = getvar('用户名', { scope: 'local', defaults: '未知' });

// 禁用缓存
setvar('temp', 999);
const temp = getvar('temp', { noCache: true });
_%>
```

---

#### `setvar()` - 设置变量

**语法：**

```javascript
setvar(key, value, options)
```

**参数：**
- `key`：变量名
- `value`：变量值
- `options`：可选配置对象
  - `scope`：作用域（默认 `'message'`）
  - `flags`：设置标志（见下表）

**Flags 标志：**

| 标志  | 说明                            |
| ----- | ------------------------------- |
| `n`   | 直接设置（默认）                |
| `nx`  | 不存在时才设置（基于cache）     |
| `xx`  | 存在时才设置（基于cache）       |
| `nxs` | 不存在时才设置（基于指定scope） |
| `xxs` | 存在时才设置（基于指定scope）   |

**示例：**

```javascript
<%_
// 设置到 local 作用域
setvar('计数器', 1, { scope: 'local' });

// 仅当变量不存在时设置
setvar('初始化标记', true, { scope: 'local', flags: 'nx' });
_%>
```

---

#### `incvar()` / `decvar()` - 增减变量

**语法：**

```javascript
incvar(key, value, options)  // 增加
decvar(key, value, options)  // 减少
```

**参数：**
- `key`：变量路径
- `value`：变化量
- `options`：可选配置对象
  - `scope`：作用域
  - `min`：最小值限制
  - `max`：最大值限制

**示例：**

```javascript
<%_
// 好感度 +5，限制在 [0, 100]
incvar('好感度', 5, { scope: 'local', min: 0, max: 100 });

// 金币 -100，不低于 0
decvar('金币', 100, { scope: 'local', min: 0 });
_%>
```

---

## 世界书操作

### `getwi()` - 读取禁用条目

**语法：**

```javascript
getwi(lorebook, title, data)
getwi(title, data)              // 自动推断世界书
```

**参数：**
- `lorebook`：世界书名（`null` 表示当前世界书）
- `title`：条目标题或 UID
- `data`：传递给条目的数据（可选）

---

#### 基础示例

```javascript
<%_
const progress = getvar('stat_data.训练.进度[0]') || 0;
_%>

<% if (progress < 25) { %>
  <%- await getwi(null, '阶段01_初期') %>
<% } else if (progress < 50) { %>
  <%- await getwi(null, '阶段02_中期') %>
<% } else if (progress < 75) { %>
  <%- await getwi(null, '阶段03_后期') %>
<% } else { %>
  <%- await getwi(null, '阶段04_完成') %>
<% } %>
```

---

#### 动态拼接条目名

```javascript
<%_
const characterName = getvar('stat_data.目标.姓名[0]') || '未知';
_%>

<%- await getwi(null, `角色_${characterName}_档案`) %>
```

---

#### 传递数据

```javascript
<%_
const level = getvar('stat_data.等级[0]') || 1;
_%>

<%- await getwi(null, '角色档案', { level: level, extra: '额外信息' }) %>
```

**在目标条目中访问：**

```javascript
<%_
// ejs_data 是 getwi() 传递的数据对象
const level = ejs_data.level;
const extra = ejs_data.extra;
_%>

等级：<%= level %>
额外信息：<%= extra %>
```

---

### `activewi()` - 激活条目

**语法：**

```javascript
activewi(lorebook, title, force)
activewi(title, force)              // 自动推断世界书
```

**参数：**
- `lorebook`：世界书名（`null` 表示当前世界书）
- `title`：条目标题或 UID
- `force`：是否强制激活（`true` 或 `false`，默认 `false`）

**作用：** 激活条目后，该条目会被正常扫描，可以通过关键词触发

---

#### 基础示例

```javascript
<%_
const inCombat = getvar('stat_data.战斗中[0]') || false;

if (inCombat) {
  activewi(null, '战斗系统');
  activewi(null, '技能列表');
}
_%>
```

---

#### `getwi()` vs `activewi()`

| 功能 | `getwi()` | `activewi()` |
|------|-----------|--------------|
| 立即插入内容 | ✅ | ❌ |
| 激活后可被关键词触发 | ❌ | ✅ |
| 适用场景 | 分阶段人设、动态内容 | 开关某些系统 |

---

### 实战：0 Token 世界书系统

**核心思路：** 所有条目默认禁用，只通过 EJS 精确控制调用

**示例：修仙卡的境界系统**

```javascript
<%_
const realm = getvar('stat_data.角色.修为境界[0]') || '练气期';
_%>

<% if (realm === '练气期') { %>
  <%- await getwi(null, '境界_练气期') %>
<% } else if (realm === '筑基期') { %>
  <%- await getwi(null, '境界_筑基期') %>
<% } else if (realm === '金丹期') { %>
  <%- await getwi(null, '境界_金丹期') %>
<% } %>
```

**优势：**
- 不在练气期时，`境界_筑基期` 和 `境界_金丹期` 不占 Token
- 精确控制，永远不会多插入或少插入

---

## 多阶段人设系统

### 设计思路

根据变量（如好感度、时间、剧情进度）动态切换角色人设，实现角色成长和变化。

---

### 基础实现

#### 步骤 1：创建禁用的人设条目

在世界书中创建多个禁用的条目：
- `人设_陌生人`
- `人设_普通朋友`
- `人设_好友`
- `人设_恋人`

---

#### 步骤 2：编写调度世界书

创建一个**启用的**世界书条目（如 `人设调度器`），负责根据好感度调用相应的人设条目：

```javascript
<%_
const favor = getvar('stat_data.理.好感度[0]') || 0;
_%>

<% if (favor < 20) { %>
  <%- await getwi(null, '人设_陌生人') %>
<% } else if (favor < 50) { %>
  <%- await getwi(null, '人设_普通朋友') %>
<% } else if (favor < 80) { %>
  <%- await getwi(null, '人设_好友') %>
<% } else { %>
  <%- await getwi(null, '人设_恋人') %>
<% } %>
```

---

### 高级实现：多维度判断

结合多个变量实现更细腻的人设切换：

```javascript
<%_
const favor = getvar('stat_data.理.好感度[0]') || 0;
const trust = getvar('stat_data.理.信任度[0]') || 0;
const stage = getvar('stat_data.剧情.阶段[0]') || 0;
_%>

<% if (stage < 2) { %>
  <%- await getwi(null, '人设_序章') %>
<% } else if (favor < 50) { %>
  <% if (trust < 30) { %>
    <%- await getwi(null, '人设_警惕') %>
  <% } else { %>
    <%- await getwi(null, '人设_谨慎开放') %>
  <% } %>
<% } else { %>
  <% if (trust >= 70 && favor >= 80) { %>
    <%- await getwi(null, '人设_完全信任_恋人') %>
  <% } else if (favor >= 80) { %>
    <%- await getwi(null, '人设_恋人') %>
  <% } else { %>
    <%- await getwi(null, '人设_好友') %>
  <% } %>
<% } %>
```

---

### 优势

1. **Token 精确控制**：同一时刻只会插入一个人设，不会浪费 Token
2. **动态变化**：角色行为随变量变化自然演进
3. **易于调试**：可以通过修改变量快速测试不同阶段
4. **模块化**：每个人设独立，易于修改和扩展

---

## 装饰器与内容注入

### `setinjection()` - 内容注入

**语法：**

```javascript
setinjection(key, value, options)
```

**参数：**
- `key`：注入点名称
- `value`：要注入的内容
- `options`：可选配置对象
  - `position`：注入位置（`'before'`、`'after'`、`'replace'`）
  - `scan`：是否扫描注入的内容（`true` 或 `false`，默认 `true`）

---

### 示例：动态角色卡

**在世界书中设置注入：**

```javascript
<%_
const favor = getvar('stat_data.理.好感度[0]') || 0;

if (favor >= 80) {
  setinjection('char_description', `
【理对你已经完全敞开心扉】
她现在愿意分享自己的秘密和脆弱的一面。
她的言行举止更加亲密和依赖。
`, { position: 'after', scan: true });
}
_%>
```

**在角色卡描述中添加注入点：**

```markdown
## 角色设定

理是一位虔诚的修女...（基础描述）

{{inject::char_description}}
```

**效果：** 当好感度达到 80 时，角色卡描述会动态追加新的行为特征。

---

## 调试技巧

### 使用 `/echo` 命令

**语法：**

```javascript
/echo {{getvar::stat_data}}
```

**作用：** 在聊天窗口显示变量内容

---

### 使用 `/variableviewer`

安装插件：https://github.com/LenAnderson/SillyTavern-Variable-Viewer/

**作用：** 实时查看所有作用域的变量

---

### EJS 调试输出

```javascript
<%_
const value = getvar('stat_data.角色.好感度[0]') || 0;
_%>

<!-- DEBUG: 好感度 = <%= value %> -->

<% if (value < 50) { %>
  <!-- DEBUG: 触发了低好感度分支 -->
  <%- await getwi(null, '人设_陌生人') %>
<% } %>
```

**注意：** 使用 HTML 注释 `<!-- -->` 输出调试信息，这样不会影响 AI，但在"查看源代码"时可以看到。

---

### 日志记录

```javascript
<%_
const log = (msg) => {
  const logs = getvar('debug_log', { scope: 'local', defaults: [] });
  logs.push(`[${new Date().toISOString()}] ${msg}`);
  setvar('debug_log', logs, { scope: 'local' });
};

log('开始人设调度');
const favor = getvar('stat_data.理.好感度[0]') || 0;
log(`当前好感度: ${favor}`);
_%>
```

**查看日志：**

```javascript
/echo {{getvar::debug_log}}
```

---

## 常见错误

### 错误 1：缺少 `await`

**错误代码：**

```javascript
<%- getwi(null, '人设') %>
```

**错误原因：** `getwi()` 是异步函数，必须使用 `await`

**正确写法：**

```javascript
<%- await getwi(null, '人设') %>
```

---

### 错误 2：忘记 `stat_data.` 前缀

**错误代码：**

```javascript
const favor = getvar('理.好感度[0]');
```

**错误原因：** MVU 变量存储在 `stat_data` 对象中

**正确写法：**

```javascript
const favor = getvar('stat_data.理.好感度[0]');
```

---

### 错误 3：忘记 `[0]` 索引

**错误代码：**

```javascript
const favor = getvar('stat_data.理.好感度');
```

**错误原因：** MVU 变量是 `[值, 说明]` 数组，需要用 `[0]` 访问值

**正确写法：**

```javascript
const favor = getvar('stat_data.理.好感度[0]');
```

---

### 错误 4：使用 `print()` 输出

**错误代码：**

```javascript
<% print('Hello') %>
```

**错误原因：** `print()` 不是推荐的输出方式

**正确写法：**

```javascript
<%- 'Hello' %>
```

或者

```javascript
<%= 'Hello' %>
```

---

### 错误 5：路径错误导致 `getwi()` 失败

**错误代码：**

```javascript
<%- await getwi(null, '人设 陌生人') %>  // 条目名有空格
```

**错误原因：** 条目名必须完全匹配，包括空格、下划线等

**正确写法：**

```javascript
<%- await getwi(null, '人设_陌生人') %>  // 使用下划线
```

---

### 错误 6：作用域混淆

**错误代码：**

```javascript
setvar('计数器', 1);  // 默认是 message 作用域
// ...
const count = getvar('计数器', { scope: 'local' });  // 读取 local 作用域
```

**错误原因：** `setvar` 默认存储到 `message` 作用域，但 `getvar` 从 `local` 作用域读取，两者不匹配

**正确写法：**

```javascript
setvar('计数器', 1, { scope: 'local' });
const count = getvar('计数器', { scope: 'local' });
```

---

## 最佳实践

### 1. 使用 `_%>` 去除空白

**推荐：**

```javascript
<%_
const value = 100;
_%>
```

**避免：**

```javascript
<%
const value = 100;
%>
```

**原因：** `<%_ _%>` 会去除多余的空白行，让输出更整洁

---

### 2. 使用默认值

**推荐：**

```javascript
const favor = getvar('stat_data.理.好感度[0]') || 0;
```

**避免：**

```javascript
const favor = getvar('stat_data.理.好感度[0]');
```

**原因：** 如果变量不存在，`getvar` 返回 `undefined`，使用 `||` 提供默认值避免错误

---

### 3. 条目命名规范

**推荐：**
- `人设_陌生人`
- `阶段01_初期`
- `技能_火球术`

**避免：**
- `陌生人` （太模糊）
- `阶段1` （难以排序）
- `火球术` （可能与其他内容冲突）

**原因：** 使用前缀便于组织和快速定位条目

---

### 4. 模块化设计

**推荐：** 将复杂逻辑拆分成多个条目

```
人设调度器 (启用)
  └─ 调用 人设_陌生人 (禁用)
  └─ 调用 人设_朋友 (禁用)
  └─ 调用 人设_恋人 (禁用)
```

**避免：** 所有逻辑写在一个条目中

**原因：** 模块化便于维护和调试

---

### 5. 使用注释

**推荐：**

```javascript
<%_
// 读取角色好感度，默认值为 0
const favor = getvar('stat_data.理.好感度[0]') || 0;

// 根据好感度调用不同的人设
if (favor < 50) {
  // 好感度低于 50 时，理会保持距离
  _%>
  <%- await getwi(null, '人设_陌生人') %>
  <%_
}
_%>
```

**原因：** 注释让代码更易理解和维护

---

## 实战示例

### 示例 1：完整的多阶段人设系统

**InitVar 世界书（`[InitVar]角色初始值`）：**

```json
{
  "理": {
    "好感度": [0, "[-30,100]之间，与理交流时变化"],
    "信任度": [50, "[0,100]之间，发生重要事件时变化"]
  },
  "剧情": {
    "阶段": [0, "0-序章, 1-日常, 2-告白, 3-恋爱"]
  }
}
```

---

**人设调度器（启用）：**

```javascript
<%_
const favor = getvar('stat_data.理.好感度[0]') || 0;
const trust = getvar('stat_data.理.信任度[0]') || 50;
const stage = getvar('stat_data.剧情.阶段[0]') || 0;
_%>

<% if (stage === 0) { %>
  <%- await getwi(null, '人设_序章') %>
<% } else if (stage === 1) { %>
  <% if (favor < 20) { %>
    <%- await getwi(null, '人设_陌生人') %>
  <% } else if (favor < 50) { %>
    <%- await getwi(null, '人设_普通朋友') %>
  <% } else { %>
    <%- await getwi(null, '人设_好友') %>
  <% } %>
<% } else if (stage === 2) { %>
  <%- await getwi(null, '人设_告白阶段') %>
<% } else if (stage === 3) { %>
  <% if (trust >= 80 && favor >= 90) { %>
    <%- await getwi(null, '人设_完全信任_恋人') %>
  <% } else { %>
    <%- await getwi(null, '人设_恋人') %>
  <% } %>
<% } %>
```

---

### 示例 2：动态技能系统

**InitVar 世界书：**

```json
{
  "player": {
    "level": [1, "角色等级"],
    "skills": [[], "已学会的技能列表"]
  }
}
```

---

**技能调度器（启用）：**

```javascript
<%_
const skills = getvar('stat_data.player.skills[0]') || [];
_%>

## 可用技能

<% if (skills.includes('火球术')) { %>
  <%- await getwi(null, '技能_火球术') %>
<% } %>

<% if (skills.includes('冰冻术')) { %>
  <%- await getwi(null, '技能_冰冻术') %>
<% } %>

<% if (skills.includes('治疗术')) { %>
  <%- await getwi(null, '技能_治疗术') %>
<% } %>

<% if (skills.length === 0) { %>
  （角色还没有学会任何技能）
<% } %>
```

---

### 示例 3：0 Token 大世界修仙卡

**InitVar 世界书：**

```json
{
  "player": {
    "境界": ["练气期", "当前修为境界"],
    "当前位置": ["外门", "玩家所在位置"],
    "宗门身份": ["外门弟子", "在宗门的身份"]
  }
}
```

---

**境界系统调度器（启用）：**

```javascript
<%_
const realm = getvar('stat_data.player.境界[0]') || '练气期';
_%>

<% if (realm === '练气期') { %>
  <%- await getwi(null, '境界_练气期') %>
<% } else if (realm === '筑基期') { %>
  <%- await getwi(null, '境界_筑基期') %>
<% } else if (realm === '金丹期') { %>
  <%- await getwi(null, '境界_金丹期') %>
<% } else if (realm === '元婴期') { %>
  <%- await getwi(null, '境界_元婴期') %>
<% } %>
```

---

**位置系统调度器（启用）：**

```javascript
<%_
const location = getvar('stat_data.player.当前位置[0]') || '外门';
_%>

<% if (location === '外门') { %>
  <%- await getwi(null, '地点_外门') %>
<% } else if (location === '内门') { %>
  <%- await getwi(null, '地点_内门') %>
<% } else if (location === '藏经阁') { %>
  <%- await getwi(null, '地点_藏经阁') %>
<% } else if (location === '炼丹房') { %>
  <%- await getwi(null, '地点_炼丹房') %>
<% } %>
```

---

**宗门身份调度器（启用）：**

```javascript
<%_
const identity = getvar('stat_data.player.宗门身份[0]') || '外门弟子';
_%>

<% if (identity === '外门弟子') { %>
  <%- await getwi(null, '身份_外门弟子') %>
<% } else if (identity === '内门弟子') { %>
  <%- await getwi(null, '身份_内门弟子') %>
<% } else if (identity === '核心弟子') { %>
  <%- await getwi(null, '身份_核心弟子') %>
<% } else if (identity === '真传弟子') { %>
  <%- await getwi(null, '身份_真传弟子') %>
<% } %>
```

**效果：**
- 练气期时不插入筑基期及以上境界的说明
- 在外门时不插入内门、藏经阁等地点的说明
- 作为外门弟子时不插入核心弟子的特权说明
- **Token 完美控制：需要什么插入什么，不需要的完全不占 Token**

---

## 下一步学习

完成 EJS 实战指南后，推荐继续学习：

1. **[AI 提示词模板](./4-AI提示词模板.md)** - 让 AI 自动管理变量的 COT 模板

---

## 相关资源

**官方资源：**
- **MVU GitHub**: https://github.com/MagicalAstrogy/MagVarUpdate
- **SillyTavern**: https://github.com/SillyTavern/SillyTavern
- **EJS 官方文档**: https://ejs.co/

**参考角色卡（秋青子）：**
- 大世界修仙卡
- 全能世界书
- （更多示例请在 Discord 中搜索）

---

## 感谢

**特别感谢：**
- **MagicalAstrogy (MAG老师)** - MVU 框架作者
- **波数涵老师** - MVU Beta 开发
- **青空莉老师** - 技术指导和耐心解答
- **秋青子** - 本教程整理

---

**祝你创作愉快！** 🎉

> **作者寄语**：如果你成功运用了这套 EJS 技术，请艾特我一下！这是我的虚荣心，请务必满足我，谢谢！  
> —— 秋青子

