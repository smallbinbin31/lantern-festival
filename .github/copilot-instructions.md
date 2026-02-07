# Copilot 指示

## 專案概述

此專案使用 **GitHub Spec-Kit** 進行規格驅動開發（Spec-Driven Development）。Spec-Kit 是一個開源工具套件，專注於從高層需求開始，透過多步驟精煉流程建構可用於生產環境的應用程式。

**核心理念**：
- 規格定義「要什麼」，而非「怎麼做」
- 使用 AI 協助進行規格解讀和程式碼生成
- 強調可測試性和獨立開發的功能單元

## 專案結構

```
.github/
├── copilot-instructions.md      # AI 助手指引（本檔案）
└── prompts/                     # Spec-Kit 斜線命令定義
    ├── speckit.constitution.prompt.md    # 建立專案原則
    ├── speckit.specify.prompt.md         # 定義功能規格
    ├── speckit.plan.prompt.md            # 建立實作計畫
    ├── speckit.tasks.prompt.md           # 生成任務清單
    ├── speckit.implement.prompt.md       # 執行實作
    ├── speckit.clarify.prompt.md         # 釐清模糊區域
    ├── speckit.analyze.prompt.md         # 一致性分析
    └── speckit.checklist.prompt.md       # 品質檢查清單

.specify/
├── memory/
│   └── constitution.md          # 專案管理原則和開發指引
├── scripts/                     # Spec-Kit 工具腳本
└── templates/                   # 規格、計畫、任務範本

.vscode/                         # VS Code 工作區設定
```

## 開發工作流程（Spec-Driven Development）

### 核心工作流程（依序執行）

1. **建立專案原則**
   ```
   /speckit.constitution
   ```
   定義專案的核心原則、編碼標準、測試要求和品質標準

2. **定義功能規格**
   ```
   /speckit.specify [功能描述]
   ```
   建立使用者故事和功能需求規格

3. **建立實作計畫**
   ```
   /speckit.plan [技術堆疊和架構決策]
   ```
   定義技術實作方法和架構設計

4. **生成任務清單**
   ```
   /speckit.tasks
   ```
   將計畫分解為可執行的開發任務

5. **執行實作**
   ```
   /speckit.implement
   ```
   根據任務清單建構功能

### 選用增強命令

- `/speckit.clarify` - 在規劃前釐清模糊需求（建議在 `/speckit.plan` 之前使用）
- `/speckit.analyze` - 檢查文件間的一致性（在 `/speckit.tasks` 後、`/speckit.implement` 前執行）
- `/speckit.checklist` - 產生品質檢查清單（在 `/speckit.plan` 之後）

### 驗證 Spec-Kit 安裝

```bash
specify check
```

## 編碼慣例

### 規格優先原則

- **所有功能開發從規格開始**：不直接撰寫程式碼，而是先定義規格
- **使用者故事優先級**：按 P1、P2、P3 排序，P1 是最關鍵功能
- **獨立可測試性**：每個使用者故事必須能夠獨立開發、測試和部署
- **測試驅動開發（TDD）**：先寫測試 → 測試失敗 → 實作 → 測試通過

### 專案管理原則（Constitution）

專案原則定義在 `.specify/memory/constitution.md` 中，包含：
- 核心開發原則（如函式庫優先、CLI 介面設計等）
- 測試標準和品質要求
- 技術堆疊限制和偏好
- 治理規則和變更流程

**所有開發決策必須符合 Constitution 中定義的原則**

### 功能分支管理

- 使用 Git 分支進行功能開發：`###-feature-name` 格式
- 或設定環境變數 `SPECIFY_FEATURE` 指定功能目錄名稱

## 重要檔案和目錄

- `.specify/memory/constitution.md` - 專案核心原則和開發指引，所有決策的最高優先級參考
- `.specify/templates/` - 規格、計畫、任務的範本檔案
- `.github/prompts/` - Spec-Kit 斜線命令的完整定義和使用說明
- `.github/prompts/install-speckit.prompt.md` - Spec-Kit 安裝和設定完整指引

## 工具和依賴項

### 必要工具

- **Python 3.11+** - Spec-Kit CLI 執行環境
- **uv** - Python 套件管理工具
- **Git** - 版本控制系統
- **specify-cli** - Spec-Kit 命令列工具

### 當前功能技術堆疊 (Feature: 001-lantern-festival)

- **語言**: JavaScript (ES6+) / HTML5 / CSS3
- **資料庫**: Firebase Realtime Database（免費方案：1GB 儲存空間，10GB/月下載流量）
- **專案類型**: Web 單頁應用程式（SPA）
- **主要依賴**: Firebase SDK 9.x (Realtime Database, Authentication)
- **部署平台**: Netlify（免費託管）
- **開發方式**: Vanilla JavaScript（無框架），響應式設計（CSS Grid/Flexbox）

### AI 助手整合

支援多種 AI 編碼助手：
- ✅ **GitHub Copilot**（本專案使用）
- ✅ Claude Code
- ✅ Cursor
- ✅ Windsurf
- 其他支援的助手請參考 `install-speckit.prompt.md`

## 常見任務

### 開始新功能開發

1. 確保已執行 `/speckit.constitution` 建立專案原則
2. 使用 `/speckit.specify [功能描述]` 定義功能需求
3. 使用 `/speckit.plan [技術決策]` 建立實作計畫
4. 使用 `/speckit.tasks` 生成任務清單
5. 使用 `/speckit.implement` 執行實作

### 更新 Spec-Kit 工具

```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```

### 在非 Git 分支環境工作

設定環境變數指定功能目錄：
```powershell
$env:SPECIFY_FEATURE = "001-feature-name"
```

## 注意事項

- **規格優先**：永遠從規格開始，不要跳過規格直接寫程式碼
- **Constitution 是最高準則**：所有開發決策必須符合 Constitution 中定義的原則
- **獨立功能單元**：設計功能時考慮獨立可測試性和 MVP 可行性
- **憑證安全**：`.github/` 目錄可能包含 AI 助手的憑證，考慮加入 `.gitignore`
- **Windows 環境**：使用 PowerShell 腳本（`--script ps`）而非 Bash
- **測試先行**：實作前必須先撰寫並經過批准的測試

## 參考資源

- [Spec-Driven Development 完整指南](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Spec-Kit 官方文件](https://github.github.io/spec-kit/)
- [Spec-Kit 影片教學](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- [GitHub Spec-Kit 儲存庫](https://github.com/github/spec-kit)
- 本地安裝指引：`.github/prompts/install-speckit.prompt.md`
