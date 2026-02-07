# 快速啟動指南

## 方法 1: 使用 VS Code Live Server（推薦）

### 步驟：

1. **安裝 Live Server 擴充功能**（如果尚未安裝）
   - 按 `Ctrl+Shift+X` 開啟擴充功能面板
   - 搜尋 "Live Server"
   - 點擊 "Install"（作者：Ritwick Dey）

2. **啟動 Live Server**
   - 在 VS Code 中開啟 `public/index.html`
   - 右鍵點擊編輯區
   - 選擇 "Open with Live Server"
   - 或點擊右下角的 "Go Live" 按鈕

3. **自動開啟瀏覽器**
   - 預設網址：`http://127.0.0.1:5500` 或 `http://localhost:5500`
   - 瀏覽器會自動開啟並載入網站

4. **即時預覽**
   - 修改 HTML/CSS/JS 檔案會自動重新載入
   - 無需手動重新整理

---

## 方法 2: 直接開啟 HTML 檔案（簡單但有限制）

### 步驟：

1. 在檔案總管中找到 `public/index.html`
2. 雙擊開啟（或右鍵 → 開啟方式 → 瀏覽器）
3. 網址會顯示為 `file:///C:/Users/...`

### ⚠️ 限制：
- **Firebase 功能無法運作**（CORS 限制）
- 管理者登入會失敗
- 但基本導覽和內容顯示正常

### ✅ 可測試項目：
- 首頁主題卡片顯示
- 導覽列切換
- 主題內容顯示
- 響應式設計（按 F12 切換裝置）

---

## 方法 3: 使用 Node.js http-server（需安裝 Node.js）

### 前提：已安裝 Node.js

檢查是否已安裝：
```powershell
node --version
```

### 步驟：

1. **安裝 http-server**（僅需一次）
```powershell
npm install -g http-server
```

2. **啟動伺服器**
```powershell
cd public
http-server -p 8000
```

3. **開啟瀏覽器**
```
http://localhost:8000
```

---

## 方法 4: 安裝 Python（如需完整測試）

### 下載 Python：

```powershell
# 使用 winget 安裝（Windows 10/11）
winget install Python.Python.3.11
```

或前往官網下載：https://www.python.org/downloads/

### 安裝後啟動：

```powershell
cd public
python -m http.server 8000
```

瀏覽器開啟：`http://localhost:8000`

---

## 方法 5: 使用 PowerShell 內建 HTTP Server（Windows 10+）

### PowerShell 指令碼（實驗性）：

在 `public` 目錄建立 `start-server.ps1`：

```powershell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

Write-Host "伺服器已啟動於 http://localhost:8000/" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止伺服器" -ForegroundColor Yellow

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        $filePath = Join-Path $PWD $path.TrimStart('/')
        
        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
}
```

執行：
```powershell
cd public
powershell -ExecutionPolicy Bypass -File start-server.ps1
```

---

## 🎯 推薦方法順序

1. **最推薦**: VS Code Live Server（最簡單、最強大）
2. **次推薦**: Node.js http-server（如已安裝 Node.js）
3. **臨時測試**: 直接開啟 HTML（部分功能受限）
4. **完整測試**: 安裝 Python（長期使用）

---

## 📝 測試清單

開啟網站後，請依照 `specs/001-lantern-festival/TESTING-US1.md` 執行測試。

### 快速檢查清單：

#### 1. 首頁測試
- [ ] 標題顯示「塭堵龍興堂115年元宵節活動」
- [ ] 顯示 5 個主題卡片（紅、橙、綠、藍、紫）
- [ ] 每個卡片有圖片、標題、簡介、「了解更多」按鈕

#### 2. 導覽測試
- [ ] 導覽列顯示 6 個分頁（首頁 + 5 主題）
- [ ] 點擊「傳統乞龜」→ 顯示乞龜內容
- [ ] 點擊「擲筊杯競賽」→ 顯示競賽內容
- [ ] 點擊「廟會模型展」→ 顯示展覽內容
- [ ] 點擊「龍興市集」→ 顯示市集內容
- [ ] 點擊「觀音燈會」→ 顯示燈會內容
- [ ] URL hash 正確改變（#qigui, #dice, #model, #market, #lantern）

#### 3. 響應式測試
- [ ] 按 F12 開啟開發者工具
- [ ] 點擊「Toggle device toolbar」（Ctrl+Shift+M）
- [ ] 選擇 iPhone SE → 主題卡片單欄顯示
- [ ] 選擇 iPad → 主題卡片雙欄顯示
- [ ] 選擇 Desktop → 主題卡片三欄顯示

#### 4. Console 檢查
- [ ] 按 F12 → Console 分頁
- [ ] 應該看到：
  ```
  Firebase initialized successfully
  Utils module loaded successfully
  Router initialized
  Application initialized successfully
  Loading page: home
  ```
- [ ] 無紅色錯誤訊息（Firebase 設定警告可忽略）

#### 5. 管理者登入測試（可選）
- [ ] 點擊右上角「管理者登入」按鈕
- [ ] Modal 彈出
- [ ] 顯示 Email 和密碼欄位
- [ ] 點擊 X 或外部可關閉 Modal

---

## 🐛 常見問題

### Q1: 圖片沒有顯示？
**A**: 檢查瀏覽器 Console 是否有 404 錯誤。SVG 圖片應該在 `public/images/` 目錄。

### Q2: Firebase 錯誤訊息？
**A**: 正常！因為還沒設定 Firebase 憑證。基本導覽功能不受影響。

### Q3: 分頁點擊沒反應？
**A**: 確認使用 HTTP Server，不要直接開啟檔案（file:// 協定）。

### Q4: 樣式沒有載入？
**A**: 檢查 `public/styles/main.css` 是否存在，確認路徑正確。

### Q5: CORS 錯誤？
**A**: 需要使用 HTTP Server，不能使用 file:// 協定。

---

## ✅ 測試完成後

1. **記錄測試結果** 到 `TESTING-US1.md`
2. **截圖保存**（首頁 + 各主題頁面）
3. **回報問題**（如有發現）
4. **繼續開發** Phase 4 或修正問題

---

**現在請選擇一個方法啟動伺服器並開始測試！** 🚀
