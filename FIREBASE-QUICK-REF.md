# 🚀 Firebase 設定快速參考

## 📋 設定步驟速查表

| 步驟 | 任務 | 位置 | 完成 |
|------|------|------|------|
| 1 | 建立 Firebase 專案 | [Firebase Console](https://console.firebase.google.com/) | [ ] |
| 2 | 啟用 Realtime Database | 建構 → Realtime Database | [ ] |
| 3 | 選擇資料庫位置 | `asia-southeast1` (新加坡) | [ ] |
| 4 | 啟用 Authentication | 建構 → Authentication | [ ] |
| 5 | 啟用 Email/Password | Sign-in method 標籤 | [ ] |
| 6 | 建立管理者帳號 | Users 標籤 | [ ] |
| 7 | 註冊 Web 應用程式 | 專案設定 → 您的應用程式 | [ ] |
| 8 | 複製 Firebase Config | 取得 7 個設定值 | [ ] |
| 9 | 更新 firebase-config.js | `public/scripts/firebase-config.js` | [ ] |
| 10 | 部署 Database Rules | Realtime Database → 規則 | [ ] |
| 11 | 測試連線 | F12 開發者工具 Console | [ ] |
| 12 | 測試報名功能 | 填寫測試報名表單 | [ ] |

---

## 🔑 需要複製的設定值

### Firebase Config (7 個值)
```javascript
const firebaseConfig = {
  apiKey: "AIza________________________",           // ← 複製這個
  authDomain: "your-project.firebaseapp.com",      // ← 複製這個
  databaseURL: "https://your-project-default-rtdb.firebaseio.com", // ← 複製這個
  projectId: "your-project-id",                    // ← 複製這個
  storageBucket: "your-project.appspot.com",       // ← 複製這個
  messagingSenderId: "1234567890",                 // ← 複製這個
  appId: "1:1234567890:web:abc123"                 // ← 複製這個
};
```

### 管理者帳號（請記錄）
```
Email: ____________________
密碼: ____________________
```

---

## 🔗 重要連結

| 名稱 | 連結 |
|------|------|
| Firebase Console | https://console.firebase.google.com/ |
| 詳細設定指引 | `FIREBASE-SETUP.md` |
| 完整文件 | `docs/firebase-setup-guide.md` |
| Database Rules 檔案 | `firebase/database.rules.json` |
| Config 檔案 | `public/scripts/firebase-config.js` |

---

## ⚡ 快速命令

### 啟動開發伺服器
```powershell
cd C:\Users\WPHung\Desktop\Template\public
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

### 使用 Firebase CLI 部署規則（選用）
```powershell
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 部署規則
cd C:\Users\WPHung\Desktop\Template
firebase deploy --only database
```

---

## ✅ 驗證檢查清單

### 瀏覽器 Console 應該顯示：
- ✅ `Firebase initialized successfully`
- ✅ `Database URL: https://...`
- ✅ `Application initialized successfully`
- ❌ 沒有任何錯誤訊息

### Firebase Console 應該可以看到：
- ✅ Realtime Database 有 `registrations` 和 `sponsors` 節點
- ✅ Authentication Users 有管理者帳號
- ✅ Database Rules 已更新（包含 selectedTurtles、sponsors）

### 功能測試：
- ✅ 報名功能可以提交（姓名、電話、選擇錢龜）
- ✅ 報名資料出現在 Firebase Database
- ✅ 管理者可以登入後台
- ✅ 贊助名單頁面可以正常顯示

---

## 🆘 常見問題

### Q: 報名後顯示「Permission denied」
**A:** 檢查 Database Rules 的 `.write` 規則：
```json
"$registrationId": {
  ".write": "auth == null && !data.exists()"
}
```
這允許匿名用戶建立新記錄（但不能修改）

### Q: Console 顯示「Firebase not configured」
**A:** 確認 `firebase-config.js` 中的 `apiKey` 不是 `"YOUR_API_KEY"`

### Q: 無法登入管理後台
**A:** 確認：
1. Authentication 中 Email/Password 已啟用
2. Users 中有建立管理者帳號
3. 輸入的 Email 和密碼正確

---

## 📞 需要幫助？

參考詳細文件：
- **快速設定**：`FIREBASE-SETUP.md`（本專案根目錄）
- **完整指引**：`docs/firebase-setup-guide.md`
- **檢查清單**：`docs/firebase-setup-checklist.md`

---

**更新日期**：2025-10-31  
**專案**：塭堵龍興堂115年元宵節活動網站
