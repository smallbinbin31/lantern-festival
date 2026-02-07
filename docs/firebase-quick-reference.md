# Firebase 設定快速參考

⚡ 5 分鐘快速設定指南

---

## 🔥 步驟總覽

1. **建立 Firebase 專案** → https://console.firebase.google.com/
2. **啟用 Realtime Database** → 選擇 `asia-southeast1` + 鎖定模式
3. **部署安全性規則** → 複製 `firebase/database.rules.json` 內容
4. **啟用 Authentication** → Email/Password 方式
5. **建立管理者帳號** → Authentication → Users → 新增使用者
6. **取得 Firebase 設定** → 專案設定 → 應用程式 → Web
7. **更新 firebase-config.js** → 取代 `firebaseConfig` 物件

---

## 📋 需要記錄的資訊

### Firebase 設定（從專案設定複製）

```javascript
const firebaseConfig = {
  apiKey: "________________________",
  authDomain: "________________________",
  databaseURL: "________________________",
  projectId: "________________________",
  storageBucket: "________________________",
  messagingSenderId: "________________________",
  appId: "________________________"
};
```

### 管理者帳號（請妥善保管）

```
Email: ________________________
密碼: ________________________
```

---

## 🗄️ Realtime Database 安全性規則

```json
{
  "rules": {
    "registrations": {
      ".read": "auth != null",
      ".write": "auth != null || request.auth == null",
      "$registrationId": {
        ".validate": "newData.hasChildren(['name', 'phone', 'timestamp', 'createdAt'])",
        "name": {
          ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 50"
        },
        "phone": {
          ".validate": "newData.isString() && newData.val().matches(/^[0-9]{10,12}$/)"
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

**說明**：
- 未登入使用者可以**寫入**報名資料
- 只有**已登入**的管理者可以**讀取**報名資料
- 資料必須包含 name, phone, timestamp, createdAt 四個欄位
- name: 2-50 個字元
- phone: 10-12 位數字

---

## 🧪 快速測試

### 1️⃣ 測試報名功能

```
http://localhost:8000#register
姓名：測試使用者
電話：0912345678
```

✅ 應顯示「報名成功！」

### 2️⃣ 測試管理者登入

```
http://localhost:8000#admin-login
Email：（您建立的管理者 Email）
密碼：（您設定的密碼）
```

✅ 應自動跳轉到後台並看到報名清單

### 3️⃣ 驗證 Firebase 資料

```
Firebase Console → Realtime Database → 資料
```

✅ 應看到 `registrations` 節點包含測試資料

---

## 🚨 常見錯誤

| 錯誤訊息 | 原因 | 解決方法 |
|---------|------|---------|
| `Permission denied` | 安全性規則未設定 | 重新部署 database.rules.json |
| `auth/invalid-email` | Email 格式錯誤 | 檢查 Email 格式 |
| `auth/wrong-password` | 密碼錯誤 | 確認密碼正確或重設 |
| `Firebase not initialized` | 設定未完成 | 檢查 firebase-config.js |

---

## 📞 需要協助？

參考完整指引：`docs/firebase-setup-guide.md`

Firebase 官方文件：https://firebase.google.com/docs
