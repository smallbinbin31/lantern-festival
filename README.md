# 塭堵龍興堂115年元宵節活動網站

一個展示塭堵龍興堂元宵節活動資訊的單頁應用程式（SPA），包含五大主題展示、招財錢龜報名功能和管理者後台。

## 🎯 功能特色

### 訪客功能
- 📖 瀏覽五大活動主題
  - 傳統乞龜活動
  - 元宵擲筊杯競賽
  - 廟會模型展覽
  - 龍興市集
  - 無相觀音燈會
- 🐢 招財錢龜活動報名（姓名、電話）
- 📱 響應式設計（支援手機、平板、桌機）

### 管理者功能
- 🔐 安全登入系統（Firebase Authentication）
- 📊 查看所有報名資料
- 📥 匯出 CSV 報表
- 🔍 搜尋和篩選報名紀錄

## 🛠️ 技術架構

### 前端
- **純 JavaScript (ES6+)** - 無框架，輕量快速
- **HTML5 + CSS3** - 語義化標籤、現代化樣式
- **Hash-based SPA** - 單頁路由系統

### 後端服務
- **Firebase Realtime Database** - 即時資料庫（免費 1GB）
- **Firebase Authentication** - Email/Password 登入
- **Netlify** - 靜態網站託管（免費 100GB/月）

### 開發工具
- **Firebase CLI** - 資料庫規則部署
- **Git** - 版本控制

## 📁 專案結構

```
Template/
├── public/                    # 前端靜態資源
│   ├── index.html            # 主要 HTML 檔案
│   ├── scripts/              # JavaScript 檔案
│   │   ├── firebase-config.js   # Firebase 初始化
│   │   ├── app.js               # 路由和頁面邏輯
│   │   └── utils.js             # 工具函式
│   ├── styles/               # CSS 樣式表
│   │   └── main.css            # 主樣式檔
│   └── images/               # 圖片資源
├── firebase/                  # Firebase 設定
│   ├── firebase.json         # Firebase 託管設定
│   ├── .firebaserc           # Firebase 專案設定
│   └── database.rules.json   # 資料庫安全規則
├── content/                   # 內容資料
│   └── themes.json           # 五大主題內容
├── specs/                     # 規格文件
│   └── 001-lantern-festival/ # 功能規格、計畫、任務
└── README.md                  # 本檔案
```

## 🚀 快速開始

### 前置需求

- **Node.js 14+** (用於安裝 Firebase CLI)
- **Firebase CLI** (用於部署資料庫規則)
- **Git** (版本控制)
- **Firebase 專案** (免費方案即可)
- **Netlify 帳號** (免費方案即可)

### 步驟 1: 複製專案

```bash
git clone <repository-url>
cd Template
git checkout 001-lantern-festival
```

### 步驟 2: 設定 Firebase

**完整設定指引**：請參閱 [`docs/firebase-setup-guide.md`](docs/firebase-setup-guide.md)

**快速參考**：請參閱 [`docs/firebase-quick-reference.md`](docs/firebase-quick-reference.md)

簡要步驟：
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用 **Realtime Database**（選擇 `asia-southeast1` 區域）
4. 啟用 **Authentication** → Email/Password
5. 建立管理者帳號
6. 複製 Firebase 設定到 `public/scripts/firebase-config.js`
7. 部署安全性規則（見下方步驟 4）

### 步驟 3: 設定 Firebase 憑證

在 `public/scripts/firebase-config.js` 中填入您的 Firebase 設定：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 步驟 4: 部署 Firebase 規則

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 初始化專案（選擇 Database 和 Hosting）
firebase init

# 部署資料庫安全規則
firebase deploy --only database
```

### 步驟 5: 本地測試

```bash
# 使用 Firebase 本地伺服器
firebase serve

# 或使用任何 HTTP 伺服器（如 Python）
cd public
python -m http.server 8000
```

瀏覽器開啟 `http://localhost:5000` 或 `http://localhost:8000`

### 步驟 6: 部署到 Netlify

**方法 A: 透過 Netlify UI（推薦）**

1. 登入 [Netlify](https://netlify.com)
2. 點擊 "Add new site" > "Import an existing project"
3. 連接 Git 儲存庫
4. 設定：
   - **Build command**: 留空（靜態網站無需建置）
   - **Publish directory**: `public`
5. 點擊 "Deploy site"

**方法 B: 透過 Netlify CLI**

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 登入 Netlify
netlify login

# 部署（首次）
cd public
netlify deploy --prod --dir .
```

## 📝 使用說明

### 訪客使用

1. 開啟網站首頁
2. 點擊五大主題分頁瀏覽活動內容
3. 在「傳統乞龜活動」中選擇「招財錢龜報名」
4. 填寫姓名和電話後提交

### 管理者使用

1. 點擊右上角「管理者登入」
2. 使用 Firebase 建立的管理者帳號登入
3. 查看所有報名資料
4. 使用搜尋功能篩選特定報名
5. 點擊「匯出 CSV」下載報表

## 🔒 安全性

### 資料庫規則

- ✅ 訪客：只能新增報名資料（寫入一次）
- ✅ 管理者：可讀取所有報名資料
- ✅ 欄位驗證：姓名（2-50字元）、電話（10-12字元）
- ✅ 無法修改或刪除已提交的報名

### 認證機制

- 使用 Firebase Authentication Email/Password
- 只有預先建立的管理者帳號可登入後台
- 無公開註冊功能（防止濫用）

## 🧪 測試

### 手動測試項目

**US1: 訪客瀏覽活動資訊**
- [ ] 首頁正常顯示五大主題分頁
- [ ] 點擊各主題可正常切換
- [ ] 手機/平板/桌機響應式顯示正常

**US2: 深入了解傳統乞龜活動**
- [ ] 傳統乞龜頁面顯示兩個子主題連結
- [ ] 點擊「傳統錢龜介紹」顯示內容
- [ ] 點擊「招財錢龜報名」進入報名表單

**US3: 參與招財錢龜報名**
- [ ] 報名表單顯示姓名、電話欄位
- [ ] 未填寫必填欄位顯示錯誤提示
- [ ] 電話格式驗證正常
- [ ] 提交成功後顯示成功訊息並清空表單
- [ ] 資料正確儲存到 Firebase

**US4: 管理者查看報名資料**
- [ ] 管理者可成功登入
- [ ] 顯示所有報名資料（姓名、電話、時間）
- [ ] 搜尋功能正常
- [ ] CSV 匯出功能正常
- [ ] 登出功能正常

## 📊 Firebase 配額限制（免費方案）

| 資源 | 免費額度 | 預估可支援 |
|------|----------|------------|
| Realtime Database 儲存 | 1 GB | ~500,000 筆報名 |
| 下載流量 | 10 GB/月 | ~50,000 次頁面瀏覽 |
| 並發連線 | 100 | ~100 人同時線上 |
| Authentication 使用者 | 無限制 | 無限制管理者 |

**注意**: 元宵節期間流量若超出，建議升級至 Firebase Blaze (按量計費) 方案。

## 🐛 問題排除

### Firebase 連線失敗
- 檢查 `firebase-config.js` 的設定是否正確
- 確認 Firebase 專案已啟用 Realtime Database
- 檢查瀏覽器 Console 是否有錯誤訊息

### 報名失敗
- 確認 Firebase 資料庫規則已正確部署
- 檢查姓名和電話格式是否符合驗證規則
- 查看瀏覽器 Console 的錯誤訊息

### 管理者無法登入
- 確認 Firebase Authentication 已啟用 Email/Password
- 檢查管理者帳號是否已在 Firebase Console 建立
- 確認輸入的 Email 和密碼正確

### 圖片無法顯示
- 確認圖片檔案放在 `public/images/` 目錄
- 檢查圖片路徑是否正確（相對路徑）
- 建議使用 WebP 格式並壓縮至 100KB 以下

## 📖 相關文件

詳細規格文件位於 `specs/001-lantern-festival/` 目錄：

- **spec.md** - 功能規格和使用者故事
- **plan.md** - 技術實作計畫
- **tasks.md** - 詳細任務清單
- **research.md** - 技術決策研究
- **data-model.md** - 資料結構定義
- **quickstart.md** - 完整設定指南
- **contracts/** - API 合約和安全規則

## 📄 授權

本專案僅供塭堵龍興堂內部使用。

## 🙏 致謝

感謝 Firebase 和 Netlify 提供免費方案，讓小型專案能夠輕鬆部署。

---

**專案管理**: 使用 [GitHub Spec-Kit](https://github.com/github/spec-kit) 進行規格驅動開發

**功能分支**: `001-lantern-festival`

**維護聯絡**: [請填寫聯絡資訊]
