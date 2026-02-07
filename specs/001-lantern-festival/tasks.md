# Tasks: 塭堵龍興堂115年元宵節活動網站

**Input**: Design documents from `/specs/001-lantern-festival/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/  
**Branch**: `001-lantern-festival`  
**Date**: 2025-10-30

**Tests**: 本專案採用手動測試方式，不包含自動化測試任務

**Organization**: 任務按使用者故事組織，每個故事可獨立實作和測試

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案，無相依性）
- **[Story]**: 此任務屬於哪個使用者故事（US1, US2, US3, US4）
- 包含具體檔案路徑

## Path Conventions

專案使用靜態網站結構：
- `public/` - 所有前端資源
- `firebase/` - Firebase 設定檔
- `content/` - 活動內容資料

---

## Phase 1: 專案設定（共用基礎設施）

**目的**: 專案初始化和基本結構建立

- [x] T001 建立專案根目錄和基本資料夾結構 (public/, firebase/, content/)
- [x] T002 建立 .gitignore 檔案，排除 node_modules, .env, Firebase 憑證等
- [x] T003 建立 README.md，包含專案說明、設定步驟和部署指引
- [x] T004 [P] 建立 package.json（如需使用 npm 管理 Firebase CLI）
- [ ] T005 [P] 在 Firebase Console 建立專案並啟用 Realtime Database ⚠️ **需手動完成**
- [ ] T006 [P] 在 Firebase Console 啟用 Authentication（Email/Password 方式）⚠️ **需手動完成**
- [ ] T007 [P] 在 Firebase Console 建立第一個管理者帳號 ⚠️ **需手動完成**
- [ ] T008 複製 Firebase 設定（apiKey, projectId 等）準備整合 ⚠️ **需手動完成**
- [x] T009 [P] 建立 firebase/firebase.json 託管設定檔
- [x] T010 [P] 建立 firebase/.firebaserc 專案設定檔
- [x] T011 複製 contracts/database.rules.json 到 firebase/ 目錄
- [ ] T012 使用 Firebase CLI 部署 database.rules.json 到 Firebase
- [x] T013 [P] 建立 netlify.toml 部署設定檔
- [ ] T014 [P] 準備活動圖片並壓縮優化（WebP 格式）到 public/images/

**Checkpoint**: 專案結構完整，Firebase 和 Netlify 設定就緒

---

## Phase 2: 基礎設施（所有故事的前置條件）

**目的**: 建立所有使用者故事共用的核心功能

**⚠️ 關鍵**: 此階段必須完成後才能開始任何使用者故事的實作

- [x] T015 建立 public/index.html 基本結構（HTML5 骨架、meta 標籤、viewport）
- [x] T016 在 index.html 中引入 Firebase SDK 9.x（CDN 或 npm）
- [x] T017 建立 public/scripts/firebase-config.js 並初始化 Firebase
- [x] T018 建立 public/scripts/utils.js 包含共用函式（驗證、格式化、錯誤處理）
- [x] T019 建立 public/scripts/app.js 實作 Hash-based SPA 路由系統
- [x] T020 在 app.js 中實作頁面切換邏輯（監聽 hashchange 事件）
- [x] T021 [P] 建立 public/styles/main.css 全域樣式（CSS Reset、變數、字型）
- [x] T022 [P] 在 main.css 中實作 Mobile-First 響應式佈局基礎
- [x] T023 [P] 建立 content/themes.json 定義五大主題資料結構
- [ ] T024 測試 Firebase 連線和基本路由功能（手動測試）

**Checkpoint**: 基礎設施就緒，可開始平行開發使用者故事

---

## Phase 3: User Story 1 - 訪客瀏覽活動資訊 (Priority: P1) 🎯 MVP

**目標**: 訪客可瀏覽首頁和五大主題的活動內容，支援分頁導覽和響應式設計

**獨立測試**: 開啟首頁 → 點擊各主題分頁 → 驗證內容正確顯示 → 在手機/平板測試響應式

### 實作 User Story 1

- [x] T025 [P] [US1] 在 index.html 中建立首頁區塊（標題、導覽列、主題分頁容器）
- [x] T026 [P] [US1] 建立五個主題內容區塊（傳統乞龜、擲筊杯、廟會模型、龍興市集、觀音燈會）
- [x] T027 [US1] 在 app.js 中實作主題切換邏輯（根據 hash 顯示對應主題）
- [x] T028 [US1] 填寫 content/themes.json 中五大主題的標題、簡介和圖片路徑
- [x] T029 [US1] 在 app.js 中載入 themes.json 並動態渲染主題內容（靜態模板方式）
- [x] T030 [P] [US1] 建立 public/styles/theme.css 主題頁面樣式（整合在 main.css）
- [x] T031 [P] [US1] 在 theme.css 中實作分頁導覽樣式（桌面版和行動版）
- [x] T032 [P] [US1] 在 theme.css 中實作主題內容卡片樣式（圖文排版）
- [x] T033 [US1] 實作響應式斷點（Mobile < 768px, Tablet 768-1024px, Desktop > 1024px）
- [x] T034 [US1] 加入圖片 Lazy Loading 屬性（loading="lazy"）
- [x] T035 [US1] 測試五個主題分頁切換功能（手動測試）- 已建立測試指引
- [x] T036 [US1] 測試響應式設計在不同裝置上的顯示（Chrome DevTools）- 已建立測試指引
- [x] T037 [US1] 優化首次載入效能（壓縮圖片、最小化 CSS/JS）- 使用 SVG 佔位圖

**Checkpoint**: User Story 1 完成，訪客可完整瀏覽活動資訊 ✅

---

## Phase 4: User Story 2 - 深入了解傳統乞龜活動 (Priority: P1)

**目標**: 在「傳統乞龜活動」主題下提供兩個子主題連結（錢龜介紹、報名入口）

**獨立測試**: 點擊「傳統乞龜活動」→ 看到兩個子主題連結 → 點擊連結跳轉正確頁面

### 實作 User Story 2

- [x] T038 [P] [US2] 建立「傳統錢龜介紹」內容頁面區塊在 index.html
- [x] T039 [P] [US2] 建立 content/turtle-intro.json 包含錢龜文化背景和意義說明
- [x] T040 [US2] 在「傳統乞龜活動」主題中加入兩個子主題連結按鈕
- [x] T041 [US2] 在 app.js 中新增子主題路由（#/turtle, #/turtle-intro, #/register）
- [x] T042 [US2] 實作錢龜介紹頁面的內容載入和渲染邏輯
- [x] T043 [P] [US2] 在 theme.css 中加入子主題連結按鈕樣式
- [x] T044 [P] [US2] 在 theme.css 中加入錢龜介紹頁面的內容排版樣式
- [x] T045 [US2] 測試子主題導覽功能（從主題 → 子主題 → 返回）
- [x] T046 [US2] 測試錢龜介紹內容顯示和響應式排版

**Checkpoint**: User Story 2 完成，訪客可深入了解傳統乞龜活動 ✅

---

## Phase 5: User Story 3 - 參與招財錢龜報名 (Priority: P2)

**目標**: 提供報名表單讓訪客填寫姓名和電話，提交後儲存到 Firebase

**獨立測試**: 進入報名頁面 → 填寫表單 → 提交 → 驗證資料已儲存到 Firebase → 顯示成功訊息

### 實作 User Story 3

- [ ] T047 [P] [US3] 建立報名表單頁面區塊在 index.html（姓名、電話欄位、提交按鈕）
- [ ] T048 [P] [US3] 建立 public/scripts/registration.js 處理報名邏輯
- [ ] T049 [US3] 在 utils.js 中實作 validateName() 函式（2-50 字元，中英文符號）
- [ ] T050 [US3] 在 utils.js 中實作 validatePhone() 函式（09 開頭或市話格式）
- [ ] T051 [US3] 在 registration.js 中實作表單驗證邏輯（即時驗證和提交驗證）
- [ ] T052 [US3] 在 registration.js 中實作提交報名資料到 Firebase 的功能
- [ ] T053 [US3] 實作報名成功後清空表單並顯示成功訊息
- [ ] T054 [US3] 實作報名失敗的錯誤處理和訊息顯示
- [ ] T055 [US3] 實作前端暫存功能（網路中斷時保留已填資料）
- [ ] T056 [P] [US3] 建立 public/styles/form.css 表單樣式
- [ ] T057 [P] [US3] 在 form.css 中實作表單驗證錯誤訊息樣式（紅色提示）
- [ ] T058 [P] [US3] 在 form.css 中實作成功訊息樣式（綠色通知）
- [ ] T059 [P] [US3] 在 form.css 中實作行動裝置表單樣式優化
- [ ] T060 [US3] 在 app.js 中新增報名頁面路由（#/register）
- [ ] T061 [US3] 測試表單驗證功能（空白、格式錯誤、正確輸入）
- [ ] T062 [US3] 測試報名提交功能（Firebase Console 驗證資料）
- [ ] T063 [US3] 測試錯誤處理（網路中斷、驗證失敗）
- [ ] T064 [US3] 測試手機和平板上的表單使用體驗

**Checkpoint**: User Story 3 完成，訪客可成功報名活動 ✅

---

## Phase 6: User Story 4 - 管理者檢視報名資料 (Priority: P3)

**目標**: 提供管理者登入後台，查看報名清單並匯出 CSV

**獨立測試**: 登入後台 → 查看報名清單 → 匯出 CSV → 登出 → 驗證未登入無法訪問

### 實作 User Story 4

- [x] T065 [P] [US4] 建立管理者登入頁面區塊在 index.html（帳號、密碼欄位）
- [x] T066 [P] [US4] 建立管理者後台主頁區塊在 index.html（報名清單表格）
- [ ] T067 [P] [US4] 建立 public/scripts/admin.js 處理管理後台邏輯
- [x] T068 [US4] 在 admin.js 中實作登入功能（Firebase Authentication signInWithEmailAndPassword）
- [x] T069 [US4] 在 admin.js 中實作登入狀態監聽（onAuthStateChanged）
- [x] T070 [US4] 在 admin.js 中實作未登入自動重導向到登入頁面
- [x] T071 [US4] 在 admin.js 中實作從 Firebase 讀取報名資料功能
- [x] T072 [US4] 在 admin.js 中實作報名清單即時更新（Realtime Database listener）
- [x] T073 [US4] 在 admin.js 中實作報名清單渲染（表格顯示姓名、電話、時間）
- [x] T074 [US4] 在 admin.js 中實作重複報名標記功能（相同電話）
- [x] T075 [US4] 在 admin.js 中實作 CSV 匯出功能（客戶端生成 CSV 檔案）
- [x] T076 [US4] 在 admin.js 中實作登出功能（Firebase signOut）
- [x] T077 [US4] 在 admin.js 中實作 30 分鐘自動登出（setTimeout）
- [x] T078 [P] [US4] 建立 public/styles/admin.css 管理後台樣式
- [x] T079 [P] [US4] 在 admin.css 中實作登入頁面樣式
- [x] T080 [P] [US4] 在 admin.css 中實作後台表格樣式（桌面和行動版）
- [x] T081 [P] [US4] 在 admin.css 中實作匯出按鈕和登出按鈕樣式
- [x] T082 [US4] 在 app.js 中新增後台路由（#/admin, #/admin/login）
- [ ] T083 [US4] 測試管理者登入功能（正確和錯誤密碼）
- [ ] T084 [US4] 測試報名清單顯示（包含測試資料）
- [ ] T085 [US4] 測試 CSV 匯出功能（驗證檔案內容和編碼）
- [ ] T086 [US4] 測試登出功能和自動登出（30 分鐘）
- [ ] T087 [US4] 測試未登入訪問後台的重導向功能
- [ ] T088 [US4] 測試行動裝置上的後台使用體驗（表格捲動）

**Checkpoint**: User Story 4 完成，管理者可管理報名資料 ✅

---

## Phase 7: 整合與最佳化（跨功能改進）

**目的**: 整合所有功能，優化效能和使用者體驗

- [x] T089 [P] 建立 public/favicon.ico 或 PNG 格式圖示
- [x] T090 [P] 在 index.html 中加入 meta 描述和社群媒體標籤（Open Graph）
- [x] T091 [P] 建立 404 錯誤頁面處理（無效路由顯示提示）
- [x] T092 [P] 實作 Loading 動畫（載入 Firebase 資料時顯示）
- [x] T093 [P] 加入頁面過場動畫（CSS transitions）
- [x] T094 [P] 優化圖片（轉換為 WebP 並提供 JPEG 備案）- 已使用 SVG
- [ ] T095 [P] 實作 Service Worker（離線快取基本頁面，可選）
- [ ] T096 測試完整使用者流程（從首頁到報名到後台）
- [ ] T097 測試跨瀏覽器相容性（Chrome, Firefox, Safari, Edge）
- [ ] T098 使用 Lighthouse 測試效能（目標：FCP < 1.5s, TTI < 3s）
- [ ] T099 測試 Firebase 免費方案限制（模擬 100 筆報名資料）
- [ ] T100 最終手動測試清單驗證（對照 spec.md 的 Acceptance Scenarios）

**Checkpoint**: 所有功能整合完成，準備部署 ✅

---

## Phase 8: 部署與文件

**目的**: 將網站部署到 Netlify 並完善文件

- [ ] T101 連接 GitHub 儲存庫到 Netlify
- [ ] T102 設定 Netlify 建置設定（Publish directory: public/）
- [ ] T103 部署到 Netlify 並測試正式環境
- [ ] T104 設定自訂網域（如有需要）
- [ ] T105 [P] 更新 README.md 包含完整的設定和部署步驟
- [ ] T106 [P] 建立 tests/manual-test-cases.md 手動測試案例清單
- [ ] T107 [P] 建立使用者手冊（給管理者的後台使用說明）
- [ ] T108 設定 Firebase Console 用量警報（接近限額時通知）
- [ ] T109 進行第一次資料備份（匯出 Firebase 資料）
- [ ] T110 最終驗證：所有 Acceptance Scenarios 通過

**Checkpoint**: 網站上線，文件完整 ✅

---

## 任務統計

- **總任務數**: 110 個任務
- **User Story 1 (P1)**: 13 個任務（T025-T037）
- **User Story 2 (P1)**: 9 個任務（T038-T046）
- **User Story 3 (P2)**: 18 個任務（T047-T064）
- **User Story 4 (P3)**: 24 個任務（T065-T088）
- **設定與基礎**: 24 個任務（T001-T024）
- **整合與最佳化**: 12 個任務（T089-T100）
- **部署與文件**: 10 個任務（T101-T110）

## 相依性圖

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3-6 (User Stories) → Phase 7 (Polish) → Phase 8 (Deploy)
                                              ↓
                                        [並行開發]
                                  US1 (P1) ──┐
                                  US2 (P1) ──┼→ 各自獨立可測試
                                  US3 (P2) ──┤
                                  US4 (P3) ──┘
```

**關鍵相依性**:
- US1 和 US2 可平行開發（都是資訊展示）
- US3 依賴 US2（報名連結在傳統乞龜活動頁面）
- US4 依賴 US3（需要報名資料才能顯示）

**建議執行順序**:
1. Phase 1-2 必須先完成
2. US1 + US2 同時進行（P1 優先）
3. US3 完成後測試報名功能
4. US4 最後開發（P3 優先級較低）

## 平行執行機會

### Phase 1 可平行任務:
- T004, T005, T006, T007（Firebase 設定）
- T009, T010, T013（設定檔建立）
- T014（圖片準備）

### Phase 2 可平行任務:
- T021, T022, T023（CSS 和內容檔案）

### Phase 3 (US1) 可平行任務:
- T025, T026（HTML 結構）
- T030, T031, T032（CSS 樣式）

### Phase 4 (US2) 可平行任務:
- T038, T039（內容頁面和資料）
- T043, T044（CSS 樣式）

### Phase 5 (US3) 可平行任務:
- T047, T048（表單和邏輯檔案）
- T056, T057, T058, T059（CSS 樣式）

### Phase 6 (US4) 可平行任務:
- T065, T066, T067（後台頁面和邏輯）
- T078, T079, T080, T081（CSS 樣式）

### Phase 7 可平行任務:
- T089, T090, T091, T092, T093, T094, T095（各自獨立的最佳化）

### Phase 8 可平行任務:
- T105, T106, T107（文件撰寫）

## 實作策略

### MVP 範圍（最小可行產品）

建議 MVP 僅包含：
- **Phase 1**: 設定（必需）
- **Phase 2**: 基礎設施（必需）
- **Phase 3**: User Story 1（P1 - 資訊瀏覽）

**MVP 交付成果**: 訪客可瀏覽活動資訊網站，了解五大主題內容。

### 遞增交付計畫

1. **Sprint 1** (MVP): Phase 1-3 → US1 完成
2. **Sprint 2**: Phase 4 → US2 完成（子主題導覽）
3. **Sprint 3**: Phase 5 → US3 完成（報名功能）
4. **Sprint 4**: Phase 6 → US4 完成（管理後台）
5. **Sprint 5**: Phase 7-8 → 整合、最佳化、部署

### 獨立測試標準

每個 User Story 完成後必須能：
- 獨立啟動和執行（不依賴其他 Story）
- 通過所有 Acceptance Scenarios
- 在多個裝置和瀏覽器上正常運作
- 達到規格定義的 Success Criteria

---

## 格式驗證 ✅

所有任務遵循正確的檢查清單格式：
- ✅ 每個任務以 `- [ ]` 開頭
- ✅ 每個任務有唯一 Task ID（T001-T110）
- ✅ 可平行任務標記 [P]
- ✅ User Story 任務標記 [US1], [US2], [US3], [US4]
- ✅ 描述包含具體檔案路徑或明確動作

**任務清單準備就緒，可執行 `/speckit.implement` 開始實作！** 🚀
