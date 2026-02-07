# Data Model

**Feature**: 塭堵龍興堂115年元宵節活動網站  
**Date**: 2025-10-30  
**Phase**: 1 - Design & Contracts

## Overview

本文件定義網站的資料結構，包括 Firebase Realtime Database 的資料模型和前端應用程式的資料物件。

## Firebase Realtime Database Structure

### Database Path: `/registrations`

儲存所有招財錢龜報名資料。

```json
{
  "registrations": {
    "<registration-id>": {
      "name": "string",
      "phone": "string",
      "timestamp": "number (Unix timestamp in milliseconds)",
      "createdAt": "string (ISO 8601 date)"
    }
  }
}
```

**Example**:
```json
{
  "registrations": {
    "-NqxXy12AbCdEfGh": {
      "name": "王小明",
      "phone": "0912345678",
      "timestamp": 1730275200000,
      "createdAt": "2025-10-30T14:30:00.000Z"
    },
    "-NqxXy34IjKlMnOp": {
      "name": "李美華",
      "phone": "0987654321",
      "timestamp": 1730275320000,
      "createdAt": "2025-10-30T14:32:00.000Z"
    }
  }
}
```

**Field Specifications**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `<registration-id>` | String | Yes | Firebase Push ID | 由 Firebase `push()` 自動生成的唯一識別碼 |
| `name` | String | Yes | 2-50 字元 | 報名者姓名，支援中文、英文、常見符號 |
| `phone` | String | Yes | 10-12 字元 | 台灣電話號碼格式（行動電話或市話） |
| `timestamp` | Number | Yes | Unix timestamp (ms) | 報名提交時間（毫秒級時間戳記，用於排序） |
| `createdAt` | String | Yes | ISO 8601 | 報名時間的人類可讀格式（用於顯示） |

**Validation Rules**:
- `name`: 長度 2-50 字元，正則表達式 `^[\u4e00-\u9fa5a-zA-Z\s\(\)\-\.]+$`
- `phone`: 行動電話 `^09\d{8}$` 或市話 `^\d{2,4}-?\d{6,8}$`
- `timestamp` 和 `createdAt` 必須一致（由同一時間點生成）

---

### Database Path: `/admins` (Optional - for future expansion)

儲存管理者帳號資訊（目前使用 Firebase Authentication，此結構保留供未來擴充）。

```json
{
  "admins": {
    "<user-uid>": {
      "email": "string",
      "displayName": "string",
      "role": "admin",
      "lastLogin": "string (ISO 8601)"
    }
  }
}
```

**Note**: 目前管理者帳號直接在 Firebase Authentication 中管理，此結構僅供未來需要額外管理者資訊時使用。

---

## Frontend Data Objects

### Registration Object

前端 JavaScript 中處理報名資料的物件結構。

```javascript
/**
 * @typedef {Object} Registration
 * @property {string} id - 報名記錄的唯一識別碼（Firebase Push ID）
 * @property {string} name - 報名者姓名
 * @property {string} phone - 報名者電話號碼
 * @property {number} timestamp - Unix 時間戳記（毫秒）
 * @property {string} createdAt - ISO 8601 格式的時間字串
 */

const registration = {
  id: '-NqxXy12AbCdEfGh',
  name: '王小明',
  phone: '0912345678',
  timestamp: 1730275200000,
  createdAt: '2025-10-30T14:30:00.000Z'
};
```

---

### Theme Content Object

前端顯示主題內容的資料結構。

```javascript
/**
 * @typedef {Object} Theme
 * @property {string} id - 主題唯一識別碼
 * @property {string} title - 主題標題
 * @property {string} description - 主題簡介
 * @property {string} [image] - 主題圖片路徑（選用）
 * @property {SubTheme[]} [subThemes] - 子主題列表（如傳統乞龜活動有子主題）
 */

/**
 * @typedef {Object} SubTheme
 * @property {string} id - 子主題唯一識別碼
 * @property {string} title - 子主題標題
 * @property {string} content - 子主題詳細內容（HTML 或 Markdown）
 */

const themes = [
  {
    id: 'turtle-activity',
    title: '傳統乞龜活動',
    description: '體驗傳統乞龜文化，祈求平安吉祥',
    image: '/images/turtle-activity.jpg',
    subThemes: [
      {
        id: 'turtle-intro',
        title: '傳統錢龜介紹',
        content: '<p>錢龜的文化背景和傳統意義...</p>'
      },
      {
        id: 'turtle-register',
        title: '招財錢龜報名',
        content: '前往報名頁面填寫資訊'
      }
    ]
  },
  {
    id: 'dice-competition',
    title: '元宵擲筊杯競賽',
    description: '參加擲筊杯競賽，贏取豐富獎品',
    image: '/images/dice-competition.jpg'
  },
  {
    id: 'temple-exhibition',
    title: '廟會模型展覽',
    description: '欣賞精緻的廟會文化模型展覽',
    image: '/images/temple-exhibition.jpg'
  },
  {
    id: 'market',
    title: '龍興市集',
    description: '品嚐在地美食，選購特色商品',
    image: '/images/market.jpg'
  },
  {
    id: 'lantern-show',
    title: '無相觀音燈會',
    description: '賞燈祈福，感受元宵節氛圍',
    image: '/images/lantern-show.jpg'
  }
];
```

---

### Admin Session Object

管理者登入會話資料。

```javascript
/**
 * @typedef {Object} AdminSession
 * @property {string} uid - Firebase User UID
 * @property {string} email - 管理者 Email
 * @property {number} loginTime - 登入時間（Unix 時間戳記）
 * @property {number} lastActivity - 最後活動時間（Unix 時間戳記）
 */

const adminSession = {
  uid: 'abc123def456',
  email: 'admin@temple.org',
  loginTime: 1730275200000,
  lastActivity: 1730276400000
};
```

---

## State Management

### Application State

應用程式全域狀態管理（使用簡單的 JavaScript 物件）。

```javascript
const appState = {
  // 路由狀態
  currentRoute: '#/',
  
  // 使用者狀態
  isAdminLoggedIn: false,
  adminUser: null,
  
  // 資料快取
  registrationsCache: [],
  lastFetchTime: null,
  
  // UI 狀態
  isLoading: false,
  errorMessage: null,
  successMessage: null
};
```

---

## Data Validation

### Client-Side Validation Functions

```javascript
/**
 * 驗證姓名格式
 * @param {string} name - 姓名
 * @returns {{valid: boolean, error: string|null}}
 */
function validateName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: '請輸入姓名' };
  }
  if (name.length < 2 || name.length > 50) {
    return { valid: false, error: '姓名長度必須在 2-50 字元之間' };
  }
  const namePattern = /^[\u4e00-\u9fa5a-zA-Z\s\(\)\-\.]+$/;
  if (!namePattern.test(name)) {
    return { valid: false, error: '姓名格式不正確（僅限中英文及常見符號）' };
  }
  return { valid: true, error: null };
}

/**
 * 驗證電話號碼格式
 * @param {string} phone - 電話號碼
 * @returns {{valid: boolean, error: string|null}}
 */
function validatePhone(phone) {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: '請輸入電話號碼' };
  }
  const mobilePattern = /^09\d{8}$/;
  const landlinePattern = /^\d{2,4}-?\d{6,8}$/;
  if (!mobilePattern.test(phone) && !landlinePattern.test(phone)) {
    return { valid: false, error: '請輸入有效的電話號碼（行動電話或市話）' };
  }
  return { valid: true, error: null };
}
```

---

## Data Flow

### Registration Flow

```
User fills form
      ↓
Client-side validation
      ↓
Create registration object
      ↓
Firebase.push() to /registrations
      ↓
Success/Error callback
      ↓
Update UI (show message, clear form)
```

### Admin View Flow

```
Admin logs in via Firebase Auth
      ↓
onAuthStateChanged callback
      ↓
Fetch registrations from /registrations
      ↓
Sort by timestamp (descending)
      ↓
Render in admin table
      ↓
Real-time listener for updates
```

---

## Database Indexing

### Recommended Indexes

由於 Firebase Realtime Database 查詢能力有限，建議的索引策略：

```json
{
  "rules": {
    "registrations": {
      ".indexOn": ["timestamp"]
    }
  }
}
```

**Rationale**: 按時間戳記排序是最常見的查詢需求（最新報名在最上方）。

---

## Data Backup Strategy

### Export Format

定期匯出資料為 CSV 格式備份：

```csv
報名編號,姓名,電話,報名時間
-NqxXy12AbCdEfGh,王小明,0912345678,2025-10-30 14:30:00
-NqxXy34IjKlMnOp,李美華,0987654321,2025-10-30 14:32:00
```

### Backup Frequency

- **手動備份**: 管理者可隨時匯出 CSV
- **建議頻率**: 每週一次或活動結束後立即備份
- **儲存位置**: 本地電腦或 Google Drive

---

## Capacity Planning

### Storage Estimation

每筆報名資料約佔用：
- Firebase JSON: ~150 bytes
- 1000 筆報名: ~150 KB
- 安全餘裕（元資料、索引）: 2x = ~300 KB

**結論**: 遠低於 Firebase 免費方案 1GB 限制，可支援至少 6000+ 筆報名。

### Bandwidth Estimation

- 單次查詢所有報名（1000 筆）: ~150 KB
- 預估管理者每月查詢 100 次: ~15 MB
- 用戶報名寫入（1000 筆）: ~150 KB

**結論**: 遠低於 Firebase 免費方案 10GB/月流量限制。

---

## Next Steps

1. ✅ 完成資料模型設計
2. ➡️ 建立 Firebase Database 安全規則（`contracts/database.rules.json`）
3. ➡️ 撰寫快速開始指南（`quickstart.md`）
4. ➡️ 更新 Copilot 代理上下文
