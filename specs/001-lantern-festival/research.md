# Research & Technical Decisions

**Feature**: 塭堵龍興堂115年元宵節活動網站  
**Date**: 2025-10-30  
**Phase**: 0 - Outline & Research

## Research Tasks Completed

### 1. Firebase Realtime Database 最佳實踐

**Decision**: 使用 Firebase Realtime Database（而非 Firestore）

**Rationale**:
- 免費方案更慷慨（1GB 儲存 vs Firestore 的文件數量限制）
- 報名資料結構簡單，不需要複雜查詢功能
- 即時同步特性適合管理後台即時更新報名清單
- 客戶端 SDK 輕量，適合靜態網站

**Alternatives Considered**:
- **Firestore**: 更強大的查詢能力，但免費方案限制更嚴格（每日 50K 讀取），對於小型專案過於複雜
- **Supabase**: 提供更完整的後端服務，但需要學習成本，且本專案不需要複雜的 SQL 查詢
- **LocalStorage + Google Sheets API**: 完全免費但資料持久性和安全性較差

**Implementation Notes**:
- 資料結構設計為扁平化（避免深層巢狀）以優化讀取效能
- 使用 Firebase Authentication 僅用於管理者登入
- 設定 Database Rules 限制寫入權限

---

### 2. 管理者身份驗證方案

**Decision**: 使用 Firebase Authentication (Email/Password) + 簡易權限控制

**Rationale**:
- Firebase Auth 提供現成的安全登入機制，免費方案支援無限用戶
- Email/Password 方式簡單直觀，適合少數管理者使用
- 密碼雜湊和會話管理由 Firebase 處理，減少安全風險
- 可在 Realtime Database Rules 中直接檢查 `auth.uid`

**Alternatives Considered**:
- **自行實作 JWT**: 需要額外開發和維護，增加複雜度和安全風險
- **OAuth 第三方登入**: 對於內部管理者過於複雜，且需要額外設定
- **簡單密碼驗證（前端）**: 安全性極低，容易被破解

**Implementation Notes**:
- 管理者帳號在 Firebase Console 手動建立
- 登入狀態使用 Firebase Auth 的 `onAuthStateChanged` 監聽
- 30 分鐘無操作自動登出使用 JavaScript `setTimeout`

---

### 3. 單頁應用程式（SPA）路由策略

**Decision**: 使用 Hash-based Routing（`#/page`）

**Rationale**:
- 不需要伺服器端配置（Netlify 不需要額外 rewrite rules）
- 純客戶端實作，符合靜態網站架構
- 支援瀏覽器前進/後退按鈕
- 簡單易實作，無需引入路由函式庫

**Alternatives Considered**:
- **History API (pushState)**: 需要 Netlify 設定 `_redirects` 檔案處理 404，增加部署複雜度
- **多頁面網站**: 每次切換都要重新載入，使用者體驗較差，且增加 Firebase SDK 初始化次數
- **URL Query Parameters**: URL 不夠語意化，且難以處理複雜的頁面層級

**Implementation Notes**:
- 監聽 `hashchange` 事件處理路由切換
- 路由表範例：`#/` (首頁), `#/turtle` (傳統乞龜), `#/register` (報名), `#/admin` (後台)

---

### 4. 表單驗證策略

**Decision**: 客戶端即時驗證 + Firebase Rules 雙重驗證

**Rationale**:
- 客戶端驗證提供即時回饋，改善使用者體驗
- Firebase Database Rules 提供伺服器端驗證，防止惡意繞過客戶端檢查
- 使用 HTML5 原生驗證屬性（如 `required`, `pattern`）減少 JavaScript 程式碼

**Alternatives Considered**:
- **僅客戶端驗證**: 容易被繞過，不夠安全
- **使用第三方驗證函式庫**: 對於簡單表單過於複雜，增加依賴

**Implementation Notes**:
- 姓名驗證：2-50 字元，支援中文、英文、常見符號
- 電話驗證：正則表達式 `^09\d{8}$`（行動電話）或 `^\d{2,4}-?\d{6,8}$`（市話）
- 錯誤訊息在表單欄位下方即時顯示

---

### 5. 響應式設計實作方法

**Decision**: Mobile-First CSS + Flexbox/Grid 佈局

**Rationale**:
- Mobile-First 確保手機體驗優先（預期大部分訪客使用手機）
- CSS Grid 適合整體頁面佈局（主題分頁、內容區域）
- Flexbox 適合元件內部對齊（導覽列、按鈕組、表單）
- 不使用 CSS 框架（如 Bootstrap）保持檔案大小最小

**Alternatives Considered**:
- **Bootstrap/Tailwind CSS**: 功能強大但檔案大，對於簡單網站過於龐大
- **Desktop-First**: 不符合行動優先的現代開發趨勢

**Implementation Notes**:
- 斷點設定：Mobile (< 768px), Tablet (768px-1024px), Desktop (> 1024px)
- 使用 CSS 變數管理主題色彩和間距
- 字體大小使用 `rem` 單位以支援使用者縮放

---

### 6. 圖片優化策略

**Decision**: WebP 格式 + Lazy Loading + 響應式圖片

**Rationale**:
- WebP 格式比 JPEG/PNG 檔案小 25-35%，減少頻寬消耗
- Lazy Loading 延遲載入非首屏圖片，加快首次載入速度
- 響應式圖片（`srcset`）為不同裝置提供適當尺寸

**Alternatives Considered**:
- **僅使用 JPEG/PNG**: 檔案較大，影響載入速度和 Netlify 流量限制
- **使用 CDN**: 增加複雜度，且免費 CDN 可能有速度限制

**Implementation Notes**:
- 圖片壓縮工具：TinyPNG 或 Squoosh
- 使用 `<img loading="lazy">` 屬性
- 提供 WebP + JPEG 備案（使用 `<picture>` 元素）

---

### 7. 管理後台資料匯出功能

**Decision**: 客戶端 CSV 生成（使用純 JavaScript）

**Rationale**:
- 不需要伺服器端處理，符合靜態網站架構
- JavaScript 可直接將 JSON 轉換為 CSV 並觸發下載
- CSV 格式相容性高，可用 Excel 或 Google Sheets 開啟

**Alternatives Considered**:
- **JSON 匯出**: 非技術人員不易閱讀和處理
- **Excel (XLSX) 匯出**: 需要額外函式庫（如 SheetJS），增加複雜度

**Implementation Notes**:
- 使用 `Blob` 和 `URL.createObjectURL()` 生成下載連結
- CSV 格式包含 UTF-8 BOM（`\uFEFF`）以確保中文正確顯示
- 檔案名稱包含時間戳記（如：`報名清單_20251030_1430.csv`）

---

## Technology Stack Summary

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Frontend Language | JavaScript | ES6+ | 現代瀏覽器原生支援，無需編譯 |
| UI Framework | Vanilla JS | N/A | 專案規模小，無需複雜框架 |
| CSS Methodology | Mobile-First + BEM | N/A | 結構化命名，易於維護 |
| Database | Firebase Realtime DB | 9.x | 免費方案慷慨，即時同步 |
| Authentication | Firebase Auth | 9.x | 安全且免費 |
| Hosting | Netlify | N/A | 自動部署，免費 SSL |
| Image Format | WebP + JPEG | N/A | 優化載入速度 |
| Testing | Manual + DevTools | N/A | 小型專案手動測試足夠 |

---

## Risk Mitigation Strategies

### Firebase 配額管理

**Risk**: 超過免費方案限制（1GB 儲存、10GB/月流量）

**Mitigation**:
1. 資料結構優化：僅儲存必要欄位（姓名、電話、時間戳記）
2. 圖片不儲存在 Firebase，使用 Netlify 託管靜態圖片
3. 實作資料匯出和定期清理機制（活動結束後清除舊資料）
4. 在 Firebase Console 設定用量警報

### 惡意報名攻擊

**Risk**: 機器人大量提交假報名資料

**Mitigation**:
1. Firebase Database Rules 限制寫入頻率（每 IP/用戶 每分鐘最多 10 次）
2. 前端實作簡易 honeypot 欄位（隱藏欄位檢查）
3. 可選：整合 Google reCAPTCHA v3（如果問題嚴重）

### 瀏覽器相容性

**Risk**: 舊版瀏覽器不支援 ES6+ 語法

**Mitigation**:
1. 在 `<head>` 加入現代瀏覽器提示
2. 使用 Babel 轉譯（如需支援 IE11）
3. 提供基本的 polyfills（Promise、fetch）

---

## Next Steps

1. ✅ 完成技術研究和決策
2. ➡️ **Phase 1**: 建立資料模型（`data-model.md`）
3. ➡️ **Phase 1**: 定義 Firebase Database 結構和安全規則（`contracts/`）
4. ➡️ **Phase 1**: 撰寫快速開始指南（`quickstart.md`）
5. ➡️ **Phase 1**: 更新 Copilot 代理上下文檔案
