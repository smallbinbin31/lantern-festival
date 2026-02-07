# Quick Start Guide

**Feature**: 塭堵龍興堂115年元宵節活動網站  
**Date**: 2025-10-30  
**Audience**: 開發人員

---

## 📋 Prerequisites

在開始之前，請確保您已安裝以下工具：

- **Git**: 版本控制系統
- **Node.js**: 14.x 或更高版本（用於 Firebase CLI）
- **文字編輯器**: VS Code、Sublime Text 或任何您偏好的編輯器
- **現代瀏覽器**: Chrome、Firefox 或 Edge（用於測試）

---

## 🚀 Setup Instructions

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd lantern-festival-website
```

### Step 2: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 3: Login to Firebase

```bash
firebase login
```

### Step 4: Create Firebase Project

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 點擊「新增專案」
3. 輸入專案名稱：`lantern-festival-temple`
4. 停用 Google Analytics（選用，免費方案不需要）
5. 點擊「建立專案」

### Step 5: Enable Firebase Services

#### 5.1 啟用 Realtime Database

1. 在 Firebase Console 左側選單選擇「Realtime Database」
2. 點擊「建立資料庫」
3. 選擇位置：`asia-southeast1`（新加坡，距離台灣較近）
4. 安全規則選擇「鎖定模式」（稍後會更新規則）
5. 點擊「啟用」

#### 5.2 啟用 Authentication

1. 在 Firebase Console 左側選單選擇「Authentication」
2. 點擊「開始使用」
3. 選擇「登入方式」標籤
4. 啟用「電子郵件/密碼」方式
5. 儲存設定

#### 5.3 建立管理者帳號

1. 在 Authentication → Users 標籤
2. 點擊「新增使用者」
3. 輸入管理者 Email 和密碼
4. 點擊「新增使用者」

### Step 6: Initialize Firebase in Project

```bash
firebase init
```

選擇以下選項：
- ✅ **Hosting**: Configure files for Firebase Hosting
- ✅ **Realtime Database**: Configure security rules

設定問題回答：
- Project setup: `Use an existing project` → 選擇剛建立的專案
- Database rules file: `firebase/database.rules.json`
- Public directory: `public`
- Configure as SPA: `Yes`
- Set up automatic builds: `No`

### Step 7: Get Firebase Config

1. 在 Firebase Console 專案設定中找到「網頁應用程式」
2. 如果沒有應用程式，點擊「新增應用程式」→ 選擇「網頁」
3. 複製 Firebase SDK 設定（`firebaseConfig` 物件）

### Step 8: Update Firebase Configuration

在 `public/scripts/firebase-config.js` 中貼上您的 Firebase 設定：

```javascript
// Firebase 設定（從 Firebase Console 複製）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
```

### Step 9: Deploy Database Security Rules

```bash
firebase deploy --only database
```

### Step 10: Run Local Development Server

```bash
# 使用 Firebase Hosting 本地模擬器
firebase serve

# 或使用簡易 HTTP 伺服器（需要 Python）
cd public
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server public -p 8000
```

在瀏覽器開啟：`http://localhost:5000`（Firebase）或 `http://localhost:8000`（其他）

---

## 🎨 Project Structure Overview

```
lantern-festival-website/
├── public/                      # 網站根目錄
│   ├── index.html              # 主頁面
│   ├── styles/                 # CSS 樣式表
│   │   ├── main.css
│   │   ├── theme.css
│   │   ├── form.css
│   │   └── admin.css
│   ├── scripts/                # JavaScript 檔案
│   │   ├── app.js             # 應用程式主邏輯
│   │   ├── firebase-config.js # Firebase 設定
│   │   ├── registration.js    # 報名功能
│   │   ├── admin.js           # 管理後台
│   │   └── utils.js           # 工具函式
│   └── images/                # 圖片資源
│
├── firebase/                   # Firebase 設定
│   ├── database.rules.json    # Database 安全規則
│   └── firebase.json          # Firebase 專案設定
│
├── specs/                      # 規格文件（開發參考）
│   └── 001-lantern-festival/
│       ├── spec.md            # 功能規格
│       ├── plan.md            # 實作計畫
│       ├── data-model.md      # 資料模型
│       ├── research.md        # 技術研究
│       └── contracts/         # API 合約
│
└── README.md                   # 專案說明
```

---

## 🛠️ Development Workflow

### 1. Local Development

```bash
# 啟動本地伺服器
firebase serve

# 在瀏覽器開啟 http://localhost:5000
# 開始編輯檔案，重新整理瀏覽器查看變更
```

### 2. Testing

#### Manual Testing Checklist

- [ ] 首頁載入正常
- [ ] 五個主題分頁可正常切換
- [ ] 傳統乞龜活動顯示兩個子主題連結
- [ ] 報名表單驗證運作正常
- [ ] 報名提交成功並顯示成功訊息
- [ ] 管理者可登入後台
- [ ] 後台顯示報名清單
- [ ] 匯出 CSV 功能正常
- [ ] 手機版顯示正常（使用 Chrome DevTools 測試）

#### Testing with Firebase Emulator (Optional)

```bash
# 安裝模擬器
firebase setup:emulators:database

# 啟動模擬器
firebase emulators:start

# 在 firebase-config.js 中連接到模擬器
firebase.database().useEmulator("localhost", 9000);
```

### 3. Adding Content

#### Update Theme Content

編輯 `public/scripts/app.js` 中的主題內容：

```javascript
const themes = [
  {
    id: 'turtle-activity',
    title: '傳統乞龜活動',
    description: '在此填寫活動簡介...',
    image: '/images/turtle-activity.jpg'
  },
  // 更新其他主題...
];
```

#### Add Images

1. 將圖片放入 `public/images/` 目錄
2. 使用工具壓縮圖片（推薦：TinyPNG、Squoosh）
3. 在 HTML 或 JavaScript 中引用圖片路徑

---

## 🚀 Deployment to Netlify

### Option 1: Deploy via Git (Recommended)

1. 將專案推送到 GitHub/GitLab

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. 前往 [Netlify](https://www.netlify.com/)
3. 點擊「New site from Git」
4. 連接 GitHub 並選擇您的儲存庫
5. 設定建置選項：
   - **Build command**: 留空（靜態網站）
   - **Publish directory**: `public`
6. 點擊「Deploy site」

### Option 2: Manual Deploy

```bash
# 安裝 Netlify CLI
npm install -g netlify-cli

# 登入 Netlify
netlify login

# 初始化網站
netlify init

# 部署
netlify deploy --prod --dir=public
```

### Option 3: Drag & Drop

1. 前往 [Netlify Drop](https://app.netlify.com/drop)
2. 將 `public` 資料夾拖放到頁面中
3. 網站會自動部署

---

## 🔧 Configuration

### Environment Variables (Optional)

如果需要區分開發和生產環境的 Firebase 設定：

```javascript
// firebase-config.js
const isDevelopment = window.location.hostname === 'localhost';

const firebaseConfig = isDevelopment ? {
  // 開發環境設定
  apiKey: "DEV_API_KEY",
  // ...
} : {
  // 生產環境設定
  apiKey: "PROD_API_KEY",
  // ...
};
```

### Custom Domain (Optional)

在 Netlify：
1. 前往 Site settings → Domain management
2. 點擊「Add custom domain」
3. 輸入您的網域名稱（如 `temple-event.com`）
4. 依照指示設定 DNS 記錄

---

## 📊 Monitoring & Maintenance

### Firebase Usage Monitoring

1. 前往 Firebase Console → Usage and billing
2. 監控：
   - Database 儲存空間使用量
   - 下載流量
   - 同時連線數量

### Netlify Analytics

1. 前往 Netlify Site → Analytics
2. 查看：
   - 頁面瀏覽數
   - 頻寬使用量
   - 建置歷史

### Backup Data

定期匯出報名資料備份：

1. 登入管理後台
2. 點擊「匯出 CSV」按鈕
3. 儲存檔案到安全位置（Google Drive、Dropbox）

或使用 Firebase CLI：

```bash
# 匯出整個資料庫為 JSON
firebase database:get / > backup.json
```

---

## 🐛 Troubleshooting

### Problem: Firebase 初始化失敗

**Solution**: 檢查 `firebase-config.js` 中的設定是否正確，確認 API Key 和 Project ID 無誤。

### Problem: 報名提交失敗（Permission Denied）

**Solution**: 
1. 確認 Database Rules 已正確部署
2. 檢查 Firebase Console → Realtime Database → Rules

### Problem: 管理者無法登入

**Solution**:
1. 確認 Authentication 已啟用「電子郵件/密碼」登入方式
2. 檢查管理者帳號是否已在 Firebase Console 建立
3. 確認密碼輸入正確

### Problem: 手機版顯示異常

**Solution**:
1. 檢查 `<meta name="viewport">` 標籤是否存在
2. 使用 Chrome DevTools 的 Device Mode 測試
3. 檢查 CSS media queries 是否正確

---

## 📚 Additional Resources

- [Firebase Realtime Database 文件](https://firebase.google.com/docs/database)
- [Firebase Authentication 文件](https://firebase.google.com/docs/auth)
- [Netlify 文件](https://docs.netlify.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🎯 Next Steps

完成設定後，您可以：

1. ✅ 執行 `/speckit.tasks` 生成開發任務清單
2. ✅ 開始實作功能（參考 `tasks.md`）
3. ✅ 定期測試並提交程式碼
4. ✅ 準備活動內容和圖片素材
5. ✅ 在活動開始前進行完整測試

---

**Happy Coding! 🎉**
