# Firebase Realtime Database Security Rules

**Feature**: 塭堵龍興堂115年元宵節活動網站  
**File**: `database.rules.json`  
**Date**: 2025-10-30

## Overview

此文件說明 Firebase Realtime Database 的安全規則設計，確保資料存取的安全性和正確性。

---

## Security Rules Structure

### 1. Global Rules

```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

**說明**: 
- 預設拒絕所有讀取和寫入
- 僅在特定路徑明確授權存取

---

### 2. Registrations Path: `/registrations`

#### Read Access

```json
"registrations": {
  ".read": "auth != null"
}
```

**說明**:
- 僅允許已登入的使用者（管理者）讀取報名資料
- 未登入的訪客無法讀取任何報名記錄

**使用情境**: 管理者登入後台查看報名清單

---

#### Write Access

```json
"$registrationId": {
  ".write": "auth == null && !data.exists()"
}
```

**說明**:
- 允許未登入的使用者（訪客）寫入新報名記錄
- 限制條件：
  - `auth == null`: 必須是未登入狀態（避免管理者誤操作）
  - `!data.exists()`: 該路徑必須不存在（防止覆寫已有資料）

**使用情境**: 訪客提交招財錢龜報名表單

**安全考量**:
- 訪客只能新增資料，無法修改或刪除已存在的報名記錄
- 管理者需要修改資料時，應透過 Firebase Console 手動處理

---

#### Data Validation

```json
".validate": "newData.hasChildren(['name', 'phone', 'timestamp', 'createdAt'])"
```

**說明**: 新報名記錄必須包含所有必要欄位

##### Name Field Validation

```json
"name": {
  ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 50"
}
```

- 類型: 字串
- 長度: 2-50 字元
- 說明: 確保姓名在合理範圍內

##### Phone Field Validation

```json
"phone": {
  ".validate": "newData.isString() && newData.val().matches(/^09[0-9]{8}$|^[0-9]{2,4}-?[0-9]{6,8}$/)"
}
```

- 類型: 字串
- 格式: 
  - 行動電話: `09` 開頭 10 碼數字（如 `0912345678`）
  - 市話: 2-4 碼區碼 + 可選連字號 + 6-8 碼號碼（如 `02-12345678` 或 `0212345678`）

##### Timestamp Field Validation

```json
"timestamp": {
  ".validate": "newData.isNumber() && newData.val() > 0"
}
```

- 類型: 數字
- 條件: 必須大於 0（有效的 Unix 時間戳記）

##### CreatedAt Field Validation

```json
"createdAt": {
  ".validate": "newData.isString()"
}
```

- 類型: 字串
- 說明: ISO 8601 格式的時間字串

##### Prevent Extra Fields

```json
"$other": {
  ".validate": false
}
```

**說明**: 拒絕任何未定義的額外欄位，防止資料污染

---

### 3. Admins Path: `/admins` (Optional)

```json
"admins": {
  ".read": "auth != null",
  ".write": "auth != null"
}
```

**說明**:
- 僅允許已登入的管理者讀寫管理者資訊
- 目前此路徑為選用，未來可用於儲存額外的管理者資料

---

## Security Best Practices

### 1. 最小權限原則

- 訪客只能新增報名記錄，無法讀取或修改
- 管理者可以讀取所有報名記錄，但寫入需透過 Firebase Console

### 2. 資料驗證

- 所有欄位都有類型和格式驗證
- 防止注入攻擊和惡意資料

### 3. 防止資料覆寫

- `!data.exists()` 確保新報名不會覆寫已有記錄
- 使用 Firebase Push ID 避免衝突

### 4. 限制額外欄位

- `$other: { ".validate": false }` 防止未授權的欄位被寫入

---

## Testing Security Rules

### Test Cases

#### ✅ Should Allow: 訪客新增報名

```javascript
// 測試：未登入使用者新增報名記錄
const newRegistration = {
  name: "王小明",
  phone: "0912345678",
  timestamp: Date.now(),
  createdAt: new Date().toISOString()
};

firebase.database().ref('registrations').push(newRegistration);
// 預期結果: 成功
```

#### ❌ Should Deny: 訪客讀取報名資料

```javascript
// 測試：未登入使用者嘗試讀取報名記錄
firebase.database().ref('registrations').once('value');
// 預期結果: Permission denied
```

#### ✅ Should Allow: 管理者讀取報名資料

```javascript
// 測試：已登入管理者讀取報名記錄
firebase.auth().signInWithEmailAndPassword('admin@example.com', 'password')
  .then(() => {
    return firebase.database().ref('registrations').once('value');
  });
// 預期結果: 成功
```

#### ❌ Should Deny: 無效的電話格式

```javascript
// 測試：提交無效電話號碼
const invalidRegistration = {
  name: "王小明",
  phone: "123", // 無效格式
  timestamp: Date.now(),
  createdAt: new Date().toISOString()
};

firebase.database().ref('registrations').push(invalidRegistration);
// 預期結果: Validation failed
```

#### ❌ Should Deny: 缺少必要欄位

```javascript
// 測試：缺少 phone 欄位
const incompleteRegistration = {
  name: "王小明",
  timestamp: Date.now(),
  createdAt: new Date().toISOString()
};

firebase.database().ref('registrations').push(incompleteRegistration);
// 預期結果: Validation failed
```

---

## Deployment Instructions

### 1. 透過 Firebase Console 部署

1. 前往 Firebase Console → Realtime Database → Rules
2. 複製 `database.rules.json` 的內容
3. 貼上並點擊「發布」

### 2. 透過 Firebase CLI 部署

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 初始化專案（如果尚未初始化）
firebase init database

# 將 database.rules.json 複製到專案根目錄

# 部署規則
firebase deploy --only database
```

---

## Rate Limiting Considerations

Firebase Realtime Database 本身不提供速率限制功能。如需防止濫用，建議：

1. **客戶端節流**: 使用 JavaScript 限制提交頻率（如 1 分鐘內最多提交 1 次）
2. **Firebase Cloud Functions**: 實作伺服器端速率限制（需升級方案）
3. **Honeypot 欄位**: 前端加入隱藏欄位檢測機器人

---

## Next Steps

1. ✅ 完成 Firebase Database 安全規則
2. ➡️ 在 Firebase Console 部署規則
3. ➡️ 建立快速開始指南（`quickstart.md`）
4. ➡️ 更新 Copilot 代理上下文
