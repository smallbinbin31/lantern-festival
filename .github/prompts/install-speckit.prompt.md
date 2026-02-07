---
mode: agent
---

# GitHub Spec-Kit 安裝指引

## 任務目標

在專案中安裝並配置 GitHub Spec-Kit，以實現規格驅動開發（Spec-Driven Development）工作流程。

## 什麼是 Spec-Kit？

Spec-Kit 是 GitHub 開發的開源工具套件，用於實現規格驅動開發（Spec-Driven Development, SDD）。它讓開發者能夠專注於產品場景和可預測的結果，而不是從零開始編寫每個部分。

### 核心理念

- **意圖驅動開發**：規格定義「要什麼」，而非「怎麼做」
- **豐富的規格創建**：使用防護欄和組織原則
- **多步驟精煉**：而非從提示一次性生成程式碼
- **善用 AI 能力**：充分利用先進 AI 模型進行規格解讀

## 系統需求

### 必要條件

- **作業系統**：Linux / macOS / Windows
- **Python**：3.11 或更高版本
- **Git**：版本控制系統
- **uv**：Python 套件管理工具
- **AI 程式碼助手**：支援以下任一工具
  - ✅ Claude Code
  - ✅ GitHub Copilot
  - ✅ Gemini CLI
  - ✅ Cursor
  - ✅ Windsurf
  - ✅ Qwen Code
  - ✅ opencode
  - ✅ Kilo Code
  - ✅ Auggie CLI
  - ✅ CodeBuddy CLI
  - ✅ Roo Code
  - ✅ Codex CLI
  - ✅ Amp
  - ⚠️ Amazon Q Developer CLI（不支援自訂斜線命令參數）

## 安裝步驟

### 步驟 1：安裝前置工具

#### 1.1 安裝 Python 3.11+

**Windows (使用 winget)：**
```powershell
winget install Python.Python.3.11
```

**macOS (使用 Homebrew)：**
```bash
brew install python@3.11
```

**Linux (Ubuntu/Debian)：**
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

#### 1.2 安裝 uv 套件管理工具

**Windows (PowerShell)：**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**macOS/Linux：**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### 1.3 驗證 Git 安裝

```bash
git --version
```

如果未安裝，請前往 [Git 官網](https://git-scm.com/downloads) 下載安裝。

### 步驟 2：安裝 Specify CLI

#### 選項 A：持久安裝（推薦）

一次安裝，到處使用：

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

**使用方式：**
```bash
specify init <PROJECT_NAME>
specify check
```

**升級工具：**
```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```

**持久安裝的優點：**
- 工具安裝後可在 PATH 中使用
- 無需建立 shell 別名
- 更好的工具管理（`uv tool list`、`uv tool upgrade`、`uv tool uninstall`）
- 更乾淨的 shell 配置

#### 選項 B：一次性使用

直接執行而不安裝：

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

### 步驟 3：初始化專案

#### 3.1 基本初始化

```bash
# 基本專案初始化
specify init my-project

# 指定 AI 助手（GitHub Copilot）
specify init my-project --ai copilot

# 在當前目錄初始化
specify init . --ai copilot
# 或使用 --here 旗標
specify init --here --ai copilot

# 強制合併到當前（非空）目錄，無需確認
specify init . --force --ai copilot
```

#### 3.2 Windows PowerShell 專用

```powershell
# 使用 PowerShell 腳本（Windows/跨平台）
specify init my-project --ai copilot --script ps
```

#### 3.3 其他初始化選項

```bash
# 跳過 Git 初始化
specify init my-project --ai gemini --no-git

# 啟用除錯輸出
specify init my-project --ai claude --debug

# 使用 GitHub Token（適用於企業環境）
specify init my-project --ai claude --github-token ghp_your_token_here

# 跳過 SSL/TLS 驗證（不建議）
specify init my-project --ai copilot --skip-tls
```

### 步驟 4：驗證安裝

執行系統檢查：

```bash
specify check
```

此命令會檢查已安裝的工具（git、claude、gemini、code/code-insiders、cursor-agent、windsurf、qwen、opencode、codex）。

## Specify CLI 命令參考

### 主要命令

| 命令 | 說明 |
|------|------|
| `init` | 從最新範本初始化新的 Specify 專案 |
| `check` | 檢查已安裝的工具 |

### `specify init` 參數與選項

| 參數/選項 | 類型 | 說明 |
|-----------|------|------|
| `<project-name>` | 參數 | 新專案目錄名稱（使用 --here 時可選，或使用 . 表示當前目錄） |
| `--ai` | 選項 | AI 助手：claude, gemini, copilot, cursor-agent, qwen, opencode, codex, windsurf, kilocode, auggie, roo, codebuddy, amp, 或 q |
| `--script` | 選項 | 腳本變體：sh (bash/zsh) 或 ps (PowerShell) |
| `--ignore-agent-tools` | 旗標 | 跳過 AI 代理工具檢查（如 Claude Code） |
| `--no-git` | 旗標 | 跳過 git 儲存庫初始化 |
| `--here` | 旗標 | 在當前目錄初始化專案，而非建立新目錄 |
| `--force` | 旗標 | 在當前目錄初始化時強制合併/覆寫（跳過確認） |
| `--skip-tls` | 旗標 | 跳過 SSL/TLS 驗證（不建議） |
| `--debug` | 旗標 | 啟用詳細的除錯輸出 |
| `--github-token` | 選項 | 用於 API 請求的 GitHub Token（或設定 GH_TOKEN/GITHUB_TOKEN 環境變數） |

## 規格驅動開發工作流程

### 可用的斜線命令

#### 核心命令

| 命令 | 說明 |
|------|------|
| `/speckit.constitution` | 建立或更新專案管理原則和開發指引 |
| `/speckit.specify` | 定義要建構的內容（需求和使用者故事） |
| `/speckit.plan` | 使用所選技術堆疊建立技術實作計畫 |
| `/speckit.tasks` | 產生可執行的任務清單 |
| `/speckit.implement` | 執行所有任務，根據計畫建構功能 |

#### 選用命令

| 命令 | 說明 |
|------|------|
| `/speckit.clarify` | 釐清規格不足的區域（建議在 /speckit.plan 之前使用） |
| `/speckit.analyze` | 跨文件一致性和覆蓋率分析（在 /speckit.tasks 後、/speckit.implement 前執行） |
| `/speckit.checklist` | 產生自訂品質檢查清單 |

### 環境變數

| 變數 | 說明 |
|------|------|
| `SPECIFY_FEATURE` | 覆寫非 Git 儲存庫的功能偵測。設定為功能目錄名稱（例如：001-photo-albums）以在不使用 Git 分支時處理特定功能。**必須在使用 /speckit.plan 或後續命令前，在代理的上下文中設定。** |

## 使用範例：建立相簿應用程式

### 1. 建立專案原則

```
/speckit.constitution 建立專注於程式碼品質、測試標準、使用者體驗一致性和效能需求的原則
```

### 2. 建立規格

```
/speckit.specify 建立一個可以幫我將照片整理到不同相簿的應用程式。相簿按日期分組，可以在主頁面拖放重新整理。相簿不會巢狀在其他相簿中。每個相簿內，照片以類似磁磚的介面預覽。
```

### 3. 建立技術實作計畫

```
/speckit.plan 應用程式使用 Vite，使用最少數量的函式庫。盡可能使用原生 HTML、CSS 和 JavaScript。圖片不會上傳到任何地方，中繼資料儲存在本地 SQLite 資料庫中。
```

### 4. 分解任務

```
/speckit.tasks
```

### 5. 執行實作

```
/speckit.implement
```

## 開發階段

| 階段 | 方法 | 說明 |
|------|------|------|
| **從零到一開發（Greenfield）** | 從頭生成 | 從高層需求開始 → 生成規格 → 規劃實作步驟 → 建構可用於生產的應用程式 |
| **創意探索** | 平行實作 | 探索多樣化解決方案 → 支援多種技術堆疊與架構 → 實驗 UX 模式 |
| **迭代增強（Brownfield）** | 棕地現代化 | 迭代新增功能 → 現代化遺留系統 → 調整流程 |

## 疑難排解

### Linux 上的 Git 憑證管理器問題

如果在 Linux 上遇到 Git 驗證問題，可以安裝 Git Credential Manager：

```bash
#!/usr/bin/env bash
set -e
echo "下載 Git Credential Manager v2.6.1..."
wget https://github.com/git-ecosystem/git-credential-manager/releases/download/v2.6.1/gcm-linux_amd64.2.6.1.deb
echo "安裝 Git Credential Manager..."
sudo dpkg -i gcm-linux_amd64.2.6.1.deb
echo "設定 Git 使用 GCM..."
git config --global credential.helper manager
echo "清理..."
rm gcm-linux_amd64.2.6.1.deb
```

### 常見問題

1. **SSL/TLS 驗證錯誤**：使用 `--skip-tls` 旗標（僅用於測試）
2. **GitHub API 速率限制**：使用 `--github-token` 提供個人存取權杖
3. **工具未找到**：執行 `specify check` 檢查所有必要工具是否已安裝
4. **代理整合問題**：開啟 [GitHub Issue](https://github.com/github/spec-kit/issues/new) 回報問題

## 成功標準

安裝成功後，您應該能夠：

1. ✅ 執行 `specify check` 看到所有必要工具已安裝
2. ✅ 執行 `specify init test-project --ai copilot` 成功建立測試專案
3. ✅ 在 AI 助手中使用 `/speckit.*` 斜線命令
4. ✅ 查看 `.speckit/` 目錄中的專案範本和配置檔案
5. ✅ 開始使用規格驅動開發工作流程建立功能

## 延伸學習資源

- **完整方法論**：[Spec-Driven Development 完整指南](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- **影片教學**：[Spec Kit 影片概覽](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- **專案文件**：[GitHub Spec-Kit 官方文件](https://github.github.io/spec-kit/)
- **問題回報**：[GitHub Issues](https://github.com/github/spec-kit/issues)

## 專案資訊

- **授權**：MIT License
- **維護者**：Den Delimarsky ([@localden](https://github.com/localden)), John Lam ([@jflam](https://github.com/jflam))
- **最新版本**：v0.0.78
- **GitHub Stars**：40.5k+
- **貢獻者**：61+

---

**更新日期**：2025年10月22日  
**來源**：https://github.com/github/spec-kit  
