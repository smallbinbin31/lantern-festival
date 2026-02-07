# 佔位圖片快速建立指南

如果您尚未準備實際圖片，可以使用以下方法快速建立佔位圖進行測試。

---

## 方法 1: 使用線上佔位圖服務（最快）

### Placeholder.com

直接使用 URL，無需下載：

```
https://via.placeholder.com/1200x600/d32f2f/ffffff?text=傳統乞龜活動
```

**修改 app.js 暫時使用**：

```javascript
// 在 app.js 的 pages 物件中，將圖片路徑改為：
<img src="https://via.placeholder.com/1200x600/d32f2f/ffffff?text=傳統乞龜活動" 
     alt="傳統乞龜活動" loading="lazy">
```

**所有主題佔位圖 URL**：

```javascript
傳統乞龜: https://via.placeholder.com/1200x600/d32f2f/ffffff?text=傳統乞龜活動
擲筊杯:   https://via.placeholder.com/1200x600/ffa000/ffffff?text=元宵擲筊杯競賽
廟會模型: https://via.placeholder.com/1200x600/4caf50/ffffff?text=廟會模型展覽
龍興市集: https://via.placeholder.com/1200x600/2196f3/ffffff?text=龍興市集
觀音燈會: https://via.placeholder.com/1200x600/9c27b0/ffffff?text=無相觀音燈會
Logo:     https://via.placeholder.com/60x60/d32f2f/ffffff?text=Logo
```

**優點**: 
- ✅ 最快速，無需下載
- ✅ 可自訂顏色和文字
- ✅ 自動響應大小

**缺點**: 
- ❌ 需要網路連線
- ❌ 不適合正式環境

---

## 方法 2: 建立簡單的 SVG 佔位圖

### 建立 SVG 檔案

在 `public/images/` 目錄建立以下檔案：

**logo.svg**:
```xml
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="60" fill="#d32f2f"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="12">Logo</text>
</svg>
```

**theme-qigui.svg**:
```xml
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#d32f2f"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48" font-weight="bold">傳統乞龜活動</text>
</svg>
```

**theme-dice.svg**:
```xml
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#ffa000"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48" font-weight="bold">元宵擲筊杯競賽</text>
</svg>
```

**theme-model.svg**:
```xml
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#4caf50"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48" font-weight="bold">廟會模型展覽</text>
</svg>
```

**theme-market.svg**:
```xml
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#2196f3"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48" font-weight="bold">龍興市集</text>
</svg>
```

**theme-lantern.svg**:
```xml
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#9c27b0"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="48" font-weight="bold">無相觀音燈會</text>
</svg>
```

### 修改圖片副檔名

將 app.js 中的 `.webp` 改為 `.svg`：

```javascript
// 範例
<img src="images/theme-qigui.svg" alt="傳統乞龜活動" loading="lazy">
```

**優點**: 
- ✅ 檔案極小（< 1KB）
- ✅ 無限縮放不失真
- ✅ 無需網路連線
- ✅ 可用於正式環境

**缺點**: 
- ❌ 需要手動建立檔案
- ❌ 視覺效果簡單

---

## 方法 3: 使用 PowerShell 批次建立純色圖片

### 安裝 ImageMagick（如果需要）

```powershell
winget install ImageMagick.ImageMagick
```

### 建立佔位圖腳本

在專案根目錄建立 `create-placeholders.ps1`:

```powershell
# 切換到 images 目錄
cd public/images

# 建立純色佔位圖（需要 ImageMagick）
magick -size 1200x600 xc:"#d32f2f" -pointsize 72 -fill white -gravity center -annotate +0+0 "傳統乞龜活動" theme-qigui.jpg
magick -size 1200x600 xc:"#ffa000" -pointsize 72 -fill white -gravity center -annotate +0+0 "元宵擲筊杯競賽" theme-dice.jpg
magick -size 1200x600 xc:"#4caf50" -pointsize 72 -fill white -gravity center -annotate +0+0 "廟會模型展覽" theme-model.jpg
magick -size 1200x600 xc:"#2196f3" -pointsize 72 -fill white -gravity center -annotate +0+0 "龍興市集" theme-market.jpg
magick -size 1200x600 xc:"#9c27b0" -pointsize 72 -fill white -gravity center -annotate +0+0 "無相觀音燈會" theme-lantern.jpg
magick -size 60x60 xc:"#d32f2f" logo.jpg

Write-Host "佔位圖建立完成！" -ForegroundColor Green
```

執行：
```powershell
powershell -ExecutionPolicy Bypass -File create-placeholders.ps1
```

**優點**: 
- ✅ 批次建立，節省時間
- ✅ 真實圖片格式
- ✅ 可轉換為 WebP

**缺點**: 
- ❌ 需要安裝 ImageMagick
- ❌ 檔案較大

---

## 方法 4: 直接跳過圖片（僅測試功能）

### 修改 CSS 處理圖片錯誤

在 `main.css` 中加入：

```css
/* 圖片載入失敗時顯示 alt 文字 */
img {
  font-size: 1rem;
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border: 2px dashed #e0e0e0;
}
```

這樣即使圖片不存在，也會顯示優雅的佔位效果。

**優點**: 
- ✅ 無需任何準備
- ✅ 可直接測試功能

**缺點**: 
- ❌ 無視覺效果
- ❌ 無法測試圖片相關功能

---

## 建議流程

1. **快速功能測試** → 使用方法 1 (Placeholder.com)
2. **離線開發** → 使用方法 2 (SVG)
3. **視覺驗證** → 使用實際圖片或方法 3
4. **正式上線** → 使用壓縮過的 WebP 圖片

---

## 取得實際圖片後的處理

### 1. 壓縮圖片

使用線上工具：
- [Squoosh](https://squoosh.app/) - Google 開發
- [TinyPNG](https://tinypng.com/) - 批次壓縮
- [Compressor.io](https://compressor.io/) - 多格式支援

### 2. 轉換為 WebP

```powershell
# 使用線上工具或安裝 cwebp
cwebp -q 80 input.jpg -o output.webp
```

### 3. 命名規範

- `logo.webp` - 龍興堂 Logo (60x60px)
- `theme-qigui.webp` - 傳統乞龜 (1200x600px)
- `theme-dice.webp` - 擲筊杯 (1200x600px)
- `theme-model.webp` - 廟會模型 (1200x600px)
- `theme-market.webp` - 龍興市集 (1200x600px)
- `theme-lantern.webp` - 觀音燈會 (1200x600px)

### 4. 檔案大小目標

- Logo: < 20KB
- 主題圖片: < 100KB
- 總計: < 500KB

---

**完成圖片準備後，請執行 `TESTING-US1.md` 中的測試流程！**
