# AI 提示词模板

> **COT (Chain-of-Thought) 版思维链提示词**  
> 用于让 AI 自动管理和更新 MVU 变量  
> 作者：秋青子（邪教版本）

---

## 📚 目录

1. [前言](#前言)
2. [完整提示词模板](#完整提示词模板)
3. [COT 六步分析流程](#cot-六步分析流程)
4. [命令使用说明](#命令使用说明)
5. [示例](#示例)
6. [特定规则](#特定规则)
7. [最佳实践](#最佳实践)

---

## 前言

### 什么是 COT 提示词？

COT (Chain-of-Thought，思维链) 提示词是一种结构化的 AI 提示方法，通过引导 AI 逐步分析和思考，让它更准确地理解和执行复杂任务。

### 为什么需要这个模板？

在 MVU 变量管理系统中，AI 需要：
1. 分析当前场景发生了什么
2. 检查所有相关变量
3. 判断哪些变量需要更新
4. 选择正确的命令
5. 验证输出格式

**没有结构化思维链**：AI 可能会遗漏变量、使用错误命令、忘记 `[0]` 后缀等。

**使用 COT 提示词**：AI 会按照六步流程系统性地分析和更新变量，大幅减少错误。

---

## 完整提示词模板

### 基础结构

将以下内容添加到你的世界书条目中（可以是蓝灯 D1 或其他激活条目）：

```ejs
<status_current_variables>
{{get_message_variable::stat_data}}
</status_current_variables>

rule:
  description:
    - Output update analysis at the end of response, following <status_current_variables> from previous turn
    - Variable updates are omitted in context but you must still add them
    - **CRITICAL**: For MVU format [value, description], ALWAYS use [0] suffix to access the value part
    - 4 commands available: `_.set` (2-3 args), `_.insert` (2-3 args), `_.remove` (1-2 args), `_.add` (2 args, numbers only)
    - **RECOMMENDED**: Use `_.insert` instead of `_.assign` for better semantic clarity
    - strictSet enabled: [0] suffix is mandatory for all value access
    - All variable values follow MVU format: [actual_value, 'description']

  command_usage:
    - `_.set('path[0]', old?, new);//reason` - Replace value
    - `_.add('path[0]', delta);//reason` - Add/subtract numbers only
    - `_.insert('path[0]', value);//reason` - Add to array end
    - `_.insert('path[0]', index, value);//reason` - Insert to array at position
    - `_.insert('path', key, value);//reason` - Add key-value to object
    - `_.remove('path[0]', value);//reason` or `_.remove('path', key);//reason` - Remove from array/object

  analysis:
    You MUST follow this Chain-of-Thought (COT) analysis process step by step:

    **STEP 1: Scene Analysis (50 words max, IN ENGLISH)**
    - Identify current scene/stage/phase of the system
    - Describe what happened in this specific scene
    - Determine what changes occurred (time/location/status/progress)
    - Example: "User [action] at [location]. [Key events]. Time advanced from X to Y."

    **STEP 2: Time & Key Status Check**
    - Extract current time/status from story context
    - Read key variables from <status_current_variables>
    - Calculate changes (time passed, status changed, etc.)
    - Decision: What needs to be updated? [List key changes]

    **STEP 3: Systematic Variable Review (check EVERY variable category)**
    Go through each variable category systematically and mark Y (needs update) or N (no change):

    [根据你的系统定义变量分类]
    分类1 (Category 1) - X fields:
      - 变量1[0]: [Y/N] - If condition, mark Y and explain
      - 变量2[0]: [Y/N] - If condition, mark Y and explain
      - ...

    分类2 (Category 2) - X fields:
      - 变量1[0]: [Y/N] - If condition, mark Y and explain
      - ...

    [继续列出所有分类]

    **STEP 4: Command Selection**
    For each variable marked Y in STEP 3, determine which command to use:
    - Use _.set for: replacing values, updating single values, changing status
    - Use _.add for: incrementing/decrementing numbers (counts, time, statistics)
    - Use _.insert for: adding new items to arrays (end/position) or objects (key-value pairs)
    - Use _.remove for: deleting items from arrays/objects (rarely used)

    **STEP 5: Analyze Other Variable Systems (if present)**
    IMPORTANT: The above detailed COT (STEP 1-4) is ONLY for "[主系统名称]" (stat_data).
    - Mark: "[主系统名称] detailed COT: COMPLETED"
    - Check <status_current_variables>: Are there OTHER top-level variable groups? [YES/NO]
    - If YES: Those other systems do NOT have their own COT rules, so YOU must analyze them here
    - For EACH other variable group found:
      a) Identify the variable group name (e.g., main_status, other_data, etc.)
      b) List all variables in that group
      c) For each variable, mark Y/N: Does it need update based on current scene?
      d) Specify which commands to use for Y variables
    - Keep this analysis brief and focused, no need for full 5-step COT for other systems

    **STEP 6: Final Validation Checklist**
    Before outputting commands, verify:
    - All [0] suffixes are present for [value, description] format? [YES/NO]
    - All Y variables (from ALL systems) have corresponding commands? [YES/NO]
    - All commands have clear Chinese comments? [YES/NO]
    - Time format is correct (if applicable)? [YES/NO]
    - Numerical values are within valid ranges? [YES/NO]
    - Extensible arrays use _.insert, not _.set? [YES/NO]

  format: |-
    <UpdateVariable>
        <ThinkingProcess>(IN ENGLISH, follow the 6-step COT process in 'analysis' section above)
            **STEP 1: Scene Analysis**
            [50 words describing current scene and what's happening]

            **STEP 2: Time & Key Status Check**
            - Current [key status] in story: [value]
            - Stored [key variable][0]: [value]
            - Changes: [list changes]
            - Update decision: [what to update]

            **STEP 3: Variable Review ([主系统名称])**
            [List each variable category with Y/N marks and reasons]
            分类1: ...
            分类2: ...
            ...

            **STEP 4: Command Selection ([主系统名称])**
            [For each Y variable, state which command to use]

            **STEP 5: Analyze Other Variable Systems**
            - [主系统名称] detailed COT: COMPLETED
            - Other variable groups? [YES/NO]
            - If YES: [For each group: name, list variables, mark Y/N, specify commands]
            - If NO: Skip to STEP 6

            **STEP 6: Final Check**
            - [0] suffixes? [YES/NO]
            - All Y (from ALL systems) have commands? [YES/NO]
            - Chinese comments? [YES/NO]
            - [Other system-specific checks]? [YES/NO]
        </ThinkingProcess>

        _.set('path[0]', old?, new);//reason
        _.insert('path[0]', value);//reason (add to array end)
        _.insert('path[0]', index, value);//reason (insert to array at position)
        _.insert('path', key, value);//reason (add key-value to object)
        _.remove('path[0]', value);//reason
        _.add('path[0]', delta);//reason
    </UpdateVariable>

  specific_rules:
    - 时间推进：每次互动后更新具体时间，使用 _.set 更新
    - 状态切换：当状态/阶段切换时，必须更新对应的状态变量
    - 计数器：使用 _.add 增加或减少计数
    - 数组操作：添加元素必须用 _.insert，删除元素必须用 _.remove，不要用 _.set 操作数组元素
    - [0]后缀：所有变量访问都必须加[0]后缀，因为启用了strictSet模式
    - 扩展数组：带有 $__META_EXTENSIBLE__$ 标记的数组使用 _.insert 添加元素，不要用 _.set 替换整个数组
    - 对象添加键值：使用 _.insert('路径', 键名, 值) 向对象添加新的键值对
    - [根据你的系统添加更多特定规则]
```

---

## COT 六步分析流程

### STEP 1: Scene Analysis

**目的：** 理解当前发生了什么

**要求：**
- **用英文**描述（50字以内）
- 识别当前场景/阶段/时期
- 描述发生的关键事件
- 确定变化（时间/位置/状态/进度）

**示例：**

```
**STEP 1: Scene Analysis**
User confessed feelings to Ri at church. Ri accepted and they kissed. Time advanced from 14:30 to 15:00. Location remained at church. Relationship status changed to lovers.
```

---

### STEP 2: Time & Key Status Check

**目的：** 提取关键信息并计算变化

**要求：**
- 从故事中提取当前时间/状态
- 从 `<status_current_variables>` 读取存储的值
- 计算变化（时间流逝、状态改变等）
- 决定需要更新什么

**示例：**

```
**STEP 2: Time & Key Status Check**
- Current time in story: 15:00
- Stored 时间[0]: "14:30"
- Time passed: 30 minutes
- Location change: None (still at church)
- Relationship change: Yes (strangers → lovers)
- Update decision: Time, Relationship Status, Favor Level
```

---

### STEP 3: Systematic Variable Review

**目的：** 系统性地检查**所有**变量

**要求：**
- 按照你定义的变量分类逐个检查
- 每个变量标记 `Y`（需要更新）或 `N`（不需要更新）
- 解释为什么需要或不需要更新

**示例：**

```
**STEP 3: Variable Review (理的状态)**

基础信息 - 3 fields:
  - 时间[0]: Y - Time passed from 14:30 to 15:00
  - 日期[0]: N - Still the same day
  - 当前位置[0]: N - Still at church

人物关系 - 2 fields:
  - 好感度[0]: Y - Confession accepted, significant increase
  - 关系状态[0]: Y - Changed from strangers to lovers

重要记忆 - 1 field:
  - 重要记忆[0]: Y - Confession and first kiss is a major event

着装 - 1 field:
  - 着装[0]: N - No clothing change mentioned
```

---

### STEP 4: Command Selection

**目的：** 为每个需要更新的变量选择正确的命令

**要求：**
- 为每个标记为 `Y` 的变量选择命令
- 解释为什么选择这个命令

**示例：**

```
**STEP 4: Command Selection (理的状态)**

- 时间: use _.set (replace with new time)
- 好感度: use _.add (increment by specific amount)
- 关系状态: use _.set (replace status value)
- 重要记忆: use _.insert (add new memory to array)
```

---

### STEP 5: Analyze Other Variable Systems

**目的：** 检查是否有其他变量系统需要更新

**要求：**
- 标记主系统 COT 完成
- 检查是否有其他顶层变量组
- 如果有，对每个系统进行简要分析（不需要完整的 6 步 COT）

**示例：**

```
**STEP 5: Analyze Other Variable Systems**
- 理的状态 detailed COT: COMPLETED
- Other variable groups? NO
```

**或者，如果有其他系统：**

```
**STEP 5: Analyze Other Variable Systems**
- 理的状态 detailed COT: COMPLETED
- Other variable groups? YES
- Found: main_status (主状态), event_flags (事件标记)

Analysis of main_status:
  - 系统状态[0]: N - No system changes
  - 全局计数器[0]: Y - Need to increment interaction count

Commands for main_status:
  - Use _.add for 全局计数器

Analysis of event_flags:
  - 告白完成[0]: Y - Confession completed
  - 初吻完成[0]: Y - First kiss completed

Commands for event_flags:
  - Use _.set for 告白完成
  - Use _.set for 初吻完成
```

---

### STEP 6: Final Validation Checklist

**目的：** 在输出命令前进行最后验证

**要求：**
- 检查所有 `[0]` 后缀是否存在
- 检查所有 `Y` 变量是否都有对应的命令
- 检查所有命令是否有清晰的中文注释
- 检查其他系统特定的规则

**示例：**

```
**STEP 6: Final Check**
- All [0] suffixes? YES
- All Y (from ALL systems) have commands? YES
- Chinese comments? YES
- Time format correct? YES
- Favor within [-30,100]? YES
- Use _.insert for memory array? YES
```

---

## 命令使用说明

### `_.set` - 替换值

**用途：** 修改现有值

**语法：**

```javascript
_.set('path[0]', old?, new);//reason
```

**示例：**

```javascript
_.set('时间[0]', '14:30', '15:00');//时间推进30分钟
_.set('理.关系状态[0]', '陌生人', '恋人');//告白成功，关系改变
```

---

### `_.add` - 数值增减

**用途：** 增加或减少数值

**语法：**

```javascript
_.add('path[0]', delta);//reason
```

**示例：**

```javascript
_.add('理.好感度[0]', 15);//告白成功，好感度大幅提升
_.add('金币[0]', -100);//购买物品，金币减少
```

---

### `_.insert` - 插入元素

**用途：** 向数组或对象添加元素

**语法：**

```javascript
// 向数组末尾添加
_.insert('path[0]', value);//reason

// 向数组指定位置插入
_.insert('path[0]', index, value);//reason

// 向对象添加键值对
_.insert('path', key, value);//reason
```

**示例：**

```javascript
_.insert('理.重要记忆[0]', '2026年6月1日，理对<user>告白成功');//记录重要事件
_.insert('背包[0]', 0, '古老的钥匙');//在背包开头插入物品
_.insert('成就', 'FIRST_CONFESSION', true);//添加成就
```

---

### `_.remove` - 删除元素

**用途：** 从数组或对象删除元素

**语法：**

```javascript
// 从数组删除（按值或索引）
_.remove('path[0]', value_or_index);//reason

// 从对象删除（按键名）
_.remove('path', key);//reason
```

**示例：**

```javascript
_.remove('理.着装[0]', '外套');//脱下外套
_.remove('临时任务', 'TEMP_QUEST_1');//删除已完成的临时任务
```

---

## 示例

### 示例 1：基础示例

```xml
<UpdateVariable>
    <ThinkingProcess>
        **STEP 1: Scene Analysis**
        User and Ri had a pleasant conversation at the library. User helped Ri find a book. Time advanced from 10:00 to 10:30. Ri's impression of user improved.

        **STEP 2: Time & Key Status Check**
        - Current time in story: 10:30
        - Stored 时间[0]: "10:00"
        - Time passed: 30 minutes
        - Location: Library (no change)
        - Update decision: Time, Favor

        **STEP 3: Variable Review (理的状态)**
        基础信息 - 3 fields:
          - 时间[0]: Y - Time advanced
          - 日期[0]: N - Same day
          - 当前位置[0]: N - Still at library

        人物关系 - 1 field:
          - 好感度[0]: Y - Positive interaction

        重要记忆 - 1 field:
          - 重要记忆[0]: N - Not a major event

        **STEP 4: Command Selection (理的状态)**
        - 时间: use _.set
        - 好感度: use _.add

        **STEP 5: Analyze Other Variable Systems**
        - 理的状态 detailed COT: COMPLETED
        - Other variable groups? NO

        **STEP 6: Final Check**
        - All [0] suffixes? YES
        - All Y have commands? YES
        - Chinese comments? YES
        - Time format correct? YES
        - Favor within range? YES
    </ThinkingProcess>

    _.set('时间[0]', '10:00', '10:30');//时间推进30分钟
    _.add('理.好感度[0]', 3);//愉快的交流，好感度小幅提升
</UpdateVariable>
```

---

### 示例 2：多系统示例

```xml
<UpdateVariable>
    <ThinkingProcess>
        **STEP 1: Scene Analysis**
        User engaged in combat training with instructor. Learned new skill "Fire Blade". Training session lasted 2 hours. User leveled up from level 3 to level 4.

        **STEP 2: Time & Key Status Check**
        - Current time in story: 16:00
        - Stored 时间[0]: "14:00"
        - Time passed: 2 hours
        - Level change: 3 → 4
        - New skill learned: Fire Blade
        - Update decision: Time, Level, Skills, Experience

        **STEP 3: Variable Review (玩家状态)**
        基础信息 - 3 fields:
          - 时间[0]: Y - 2 hours passed
          - 等级[0]: Y - Leveled up
          - 经验值[0]: Y - Experience gained

        技能列表 - 1 field:
          - 技能列表[0]: Y - Learned new skill

        **STEP 4: Command Selection (玩家状态)**
        - 时间: use _.set
        - 等级: use _.set
        - 经验值: use _.set (reset after level up)
        - 技能列表: use _.insert (add to array)

        **STEP 5: Analyze Other Variable Systems**
        - 玩家状态 detailed COT: COMPLETED
        - Other variable groups? YES
        - Found: event_flags (事件标记)

        Analysis of event_flags:
          - 首次训练完成[0]: Y - First training completed

        Commands for event_flags:
          - Use _.set for 首次训练完成

        **STEP 6: Final Check**
        - All [0] suffixes? YES
        - All Y (from ALL systems) have commands? YES
        - Chinese comments? YES
        - Time format correct? YES
        - Level within valid range? YES
        - Use _.insert for skills array? YES
    </ThinkingProcess>

    // 玩家状态 updates
    _.set('时间[0]', '14:00', '16:00');//训练持续2小时
    _.set('等级[0]', 3, 4);//升级到4级
    _.set('经验值[0]', 280, 0);//升级后经验值重置
    _.insert('技能列表[0]', '火焰刃');//学会新技能

    // Event Flags updates (other system)
    _.set('event_flags.首次训练完成[0]', false, true);//完成首次训练
</UpdateVariable>
```

---

## 特定规则

### 根据你的系统定制

你需要根据你的变量系统添加特定规则。以下是常见规则：

#### 1. 时间推进

```
- 时间推进：每次互动后更新具体时间，使用 _.set 更新
- 格式：HH:MM (24小时制)
- 跨日：同时更新日期变量
```

**示例：**

```javascript
_.set('时间[0]', '23:50', '00:10');//跨日，时间更新
_.set('日期[0]', '03月15日', '03月16日');//日期更新
```

---

#### 2. 状态切换

```
- 状态切换：当状态/阶段切换时，必须更新对应的状态变量
- 检查是否触发阈值（如好感度阶段）
```

**示例：**

```javascript
_.set('理.关系阶段[0]', '普通朋友', '好友');//好感度达到50，关系阶段提升
```

---

#### 3. 计数器

```
- 计数器：使用 _.add 增加或减少计数
- 不要使用 _.set 手动计算新值
```

**示例：**

```javascript
_.add('互动次数[0]', 1);//互动次数+1
_.add('金币[0]', -50);//购买物品，金币-50
```

---

#### 4. 数组操作

```
- 数组操作：添加元素必须用 _.insert，删除元素必须用 _.remove
- 不要用 _.set 操作数组元素
- 扩展数组：带有 $__META_EXTENSIBLE__$ 标记的数组使用 _.insert
```

**示例：**

```javascript
_.insert('背包[0]', '钥匙');//添加物品
_.remove('背包[0]', '药水');//使用物品
```

---

#### 5. [0] 后缀

```
- [0]后缀：所有变量访问都必须加[0]后缀，因为启用了strictSet模式
- 简单值（数字/字符串）：推荐使用[0]
- 复杂值（对象/数组）：必须使用[0]
```

**示例：**

```javascript
_.set('好感度[0]', 10, 15);//简单值，推荐使用[0]
_.set('舰载机[0].补给中.J-35', 8, 9);//复杂值，必须使用[0]
```

---

#### 6. 对象添加键值

```
- 对象添加键值：使用 _.insert('路径', 键名, 值) 向对象添加新的键值对
- 不要用 _.set 替换整个对象
```

**示例：**

```javascript
_.insert('成就', 'FIRST_KILL', true);//添加新成就
```

---

## 最佳实践

### 1. 变量分类要清晰

在 STEP 3 中，按照清晰的分类检查变量：

**推荐：**

```
分类1：基础信息 - 3 fields
分类2：人物关系 - 2 fields
分类3：重要记忆 - 1 field
```

**避免：**

```
变量1: Y
变量2: N
变量3: Y
...（没有分类）
```

---

### 2. Y/N 判断要有原因

每个变量标记为 Y 或 N 时，要解释原因：

**推荐：**

```
- 好感度[0]: Y - Confession accepted, significant increase
- 着装[0]: N - No clothing change mentioned
```

**避免：**

```
- 好感度[0]: Y
- 着装[0]: N
```

---

### 3. 命令选择要合理

根据操作类型选择正确的命令：

| 操作 | 命令 | 原因 |
|------|------|------|
| 替换值 | `_.set` | 直接更新 |
| 数值增减 | `_.add` | 避免手动计算 |
| 添加元素 | `_.insert` | 语义明确 |
| 删除元素 | `_.remove` | 语义明确 |

---

### 4. Final Check 要认真

在输出命令前，认真检查：

```
**STEP 6: Final Check**
- All [0] suffixes? YES ✅
- All Y (from ALL systems) have commands? YES ✅
- Chinese comments? YES ✅
- Time format correct? YES ✅
- Numerical values within valid ranges? YES ✅
- Extensible arrays use _.insert? YES ✅
```

---

### 5. 自定义特定规则

根据你的系统添加特定规则：

```
specific_rules:
  - 时间推进：每次互动后更新具体时间
  - 好感度范围：[-30, 100]
  - 境界升级：检查是否达到突破条件
  - 背包容量：最多20个物品
  - [你的特定规则]
```

---

## 下一步

完成 AI 提示词模板学习后，你已经掌握了 MVU 框架的所有核心知识！

**建议：**
1. 回顾 [MVU 基础教程](./1-MVU基础教程.md)
2. 查看 [MVU Beta 完整指南](./2-MVUBeta完整指南.md)
3. 学习 [EJS 实战指南](./3-EJS实战指南.md)
4. **实战练习**：创建一个简单的角色卡，应用所有学到的知识

---

## 相关资源

**官方资源：**
- **MVU GitHub**: https://github.com/MagicalAstrogy/MagVarUpdate
- **SillyTavern**: https://github.com/SillyTavern/SillyTavern

**参考角色卡：**
- 圣女理理
- 大世界修仙卡
- （更多示例请在 Discord 中搜索）

---

## 感谢

**特别感谢：**
- **MagicalAstrogy (MAG老师)** - MVU 框架作者
- **波数涵老师** - MVU Beta 开发
- **青空莉老师** - 技术指导
- **秋青子** - COT 提示词设计和本教程整理

---

**祝你创作愉快！** 🎉

> **免责声明**：本教程为个人研究理解整理，属于"邪教"式教学，是对官方教程的精简和二创。感谢所有老师的贡献！  
> —— 秋青子

