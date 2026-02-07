# 🔥 Firebase 快速設定指引

**立即處理 - Firebase 設定（T005-T008, T012）**

---

## ✅ 檢查清單

- [ ] T005 - 建立 Firebase 專案並啟用 Realtime Database
- [ ] T006 - 啟用 Authentication (Email/Password)
- [ ] T007 - 建立管理者帳號
- [ ] T008 - 更新 firebase-config.js
- [ ] T012 - 部署 database.rules.json

---

## 📋 步驟 1：建立 Firebase 專案 (T005)

### 1.1 前往 Firebase Console
🔗 **開啟連結**：https://console.firebase.google.com/

### 1.2 建立新專案
1. 點擊「**新增專案**」或「**Create a project**」
2. **專案名稱**：`lantern-festival-2026`（可自訂）
3. 點擊「**繼續**」
4. **Google Analytics**：選擇「**不啟用**」（不需要）
5. 點擊「**建立專案**」
6. 等待 30 秒後，點擊「**繼續**」

### 1.3 啟用 Realtime Database
1. 左側選單：「**建構**」→「**Realtime Database**」
2. 點擊「**建立資料庫**」
3. **位置**：選擇「**asia-southeast1**」（新加坡 - 最接近台灣）
4. 點擊「**下一步**」
5. **安全性規則**：選擇「**鎖定模式**」
6. 點擊「**啟用**」

### 1.4 記錄 Database URL
📝 複製此 URL（頁面頂部）：
```
https://lantern-festival-2026-default-rtdb.firebaseio.com/
```

✅ **T005 完成**

---

## 🔐 步驟 2：啟用 Authentication (T006)

1. 左側選單：「**建構**」→「**Authentication**」
2. 點擊「**開始使用**」
3. 選擇「**Sign-in method**」標籤
4. 找到「**Email/Password**」，點擊進入
5. **啟用第一個開關**（Email/Password）
6. **不要啟用**電子郵件連結
7. 點擊「**儲存**」

✅ **T006 完成**

---

## 👤 步驟 3：建立管理者帳號 (T007)

1. 在 Authentication 頁面，點擊「**Users**」標籤
2. 點擊「**新增使用者**」
3. 填寫資料：
   - **電子郵件**：`admin@longxingtang.com`（可自訂）
   - **密碼**：至少 6 個字元（**請記住此密碼！**）
4. 點擊「**新增使用者**」

📝 **請記錄管理者帳號**：
```
Email: admin@longxingtang.com
密碼: ____________________
```

✅ **T007 完成**

---

## ⚙️ 步驟 4：取得 Firebase 設定 (T008)

### 4.1 註冊 Web 應用程式
1. 點擊左上角「**齒輪圖示**」→「**專案設定**」
2. 向下捲動到「**您的應用程式**」區塊
3. 點擊「**</>**」圖示（Web 應用程式）
4. **應用程式暱稱**：`lantern-festival-web`
5. **不要勾選** Firebase Hosting
6. 點擊「**註冊應用程式**」

### 4.2 複製 Firebase Config
在下一個畫面會看到以下程式碼，**完整複製**：

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "lantern-festival-2026.firebaseapp.com",
  databaseURL: "https://lantern-festival-2026-default-rtdb.firebaseio.com",
  projectId: "lantern-festival-2026",
  storageBucket: "lantern-festival-2026.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:..."
};
```

### 4.3 更新專案設定檔
開啟檔案：`public/scripts/firebase-config.js`

**取代這段程式碼**：
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**改成步驟 4.2 複製的實際設定值，然後儲存檔案。**

✅ **T008 完成**

---

## 📜 步驟 5：部署 Database Rules (T012)

### 選項 A：使用 Firebase Console（手動，較簡單）

1. 前往 Firebase Console → **Realtime Database** → **規則**標籤
2. **完整取代**現有內容為以下規則：

```json
{
  "rules": {
    "registrations": {
      ".read": "auth != null",
      ".write": "auth != null || request.auth == null",
      "$registrationId": {
        ".validate": "newData.hasChildren(['name', 'phone', 'selectedTurtles', 'turtleCount', 'timestamp', 'createdAt'])",
        "name": {
          ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 50"
        },
        "phone": {
          ".validate": "newData.isString() && newData.val().matches(/^[0-9]{10,12}$/)"
        },
        "selectedTurtles": {
          ".validate": "newData.hasChildren()"
        },
        "turtleCount": {
          ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 3"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        },
        "createdAt": {
          ".validate": "newData.isString()"
        }
      }
    },
    "sponsors": {
      ".read": true,
      ".write": "auth != null",
      "$sponsorId": {
        ".validate": "newData.hasChildren(['name', 'amount', 'timestamp', 'createdAt'])",
        "name": {
          ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 100"
        },
        "amount": {
          ".validate": "newData.isNumber() && newData.val() > 0"
        },
        "message": {
          ".validate": "newData.isString() && newData.val().length <= 500"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        },
        "createdAt": {
          ".validate": "newData.isString()"
        }
      }
    }
  }
}
```

3. 點擊「**發布**」

### 選項 B：使用 Firebase CLI（命令列，較進階）

```powershell
# 1. 安裝 Firebase CLI（只需執行一次）
npm install -g firebase-tools

# 2. 登入 Firebase
firebase login

# 3. 初始化專案（在專案根目錄執行）
cd C:\Users\WPHung\Desktop\Template
firebase init database

# 選擇：
# - 使用現有專案：選擇您剛建立的專案
# - Database Rules 檔案：使用 firebase/database.rules.json
# - 不要覆蓋現有檔案

# 4. 部署規則
firebase deploy --only database
```

✅ **T012 完成**

---

## 🧪 步驟 6：測試 Firebase 連線

### 6.1 重新啟動伺服器
```powershell
cd C:\Users\WPHung\Desktop\Template\public
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

### 6.2 測試步驟
1. 開啟瀏覽器：http://localhost:8000
2. 按 **F12** 開啟開發者工具
3. 查看 **Console** 標籤，應該看到：
   ```
   Firebase initialized successfully
   Database URL: https://your-project-id-default-rtdb.firebaseio.com
   ```
   ✅ **沒有錯誤訊息**

### 6.3 測試報名功能
1. 點擊「**傳統乞龜**」→「**前往報名**」
2. 填寫測試資料：
   - 姓名：`測試使用者`
   - 電話：`0912345678`
   - 選擇 1-3 個招財錢龜
3. 點擊「**提交報名**」
4. ✅ 應該看到綠色成功訊息

### 6.4 驗證資料已儲存
1. 回到 Firebase Console
2. **Realtime Database** → **資料**標籤
3. 展開 `registrations`
4. ✅ 應該看到新的報名紀錄

### 6.5 測試管理者登入
1. 點擊右上角「**管理後台**」連結
2. 輸入步驟 3 建立的管理者帳號
3. ✅ 登入成功，可以看到報名資料

---

## 🎉 完成！

所有 Firebase 設定任務已完成：
- ✅ T005 - Firebase 專案和 Realtime Database
- ✅ T006 - Authentication 啟用
- ✅ T007 - 管理者帳號建立
- ✅ T008 - firebase-config.js 更新
- ✅ T012 - Database Rules 部署

**現在您的網站已經可以真正儲存和讀取資料了！** 🚀

---

## 📞 遇到問題？

### 常見錯誤排除

**錯誤 1：「Permission denied」**
- 檢查 Database Rules 是否正確部署
- 確認 `.write` 規則允許匿名寫入（報名功能需要）

**錯誤 2：「Firebase not initialized」**
- 確認 `firebase-config.js` 的設定值已更新
- 檢查 Console 是否有初始化錯誤訊息

**錯誤 3：「Invalid API key」**
- 回到 Firebase Console 專案設定，重新複製正確的 API Key
- 確認沒有多餘的空格或引號

### 詳細文件
完整說明請參考：`docs/firebase-setup-guide.md`

---

**建立日期**：2025-10-31  
**專案**：塭堵龍興堂115年元宵節活動網站
