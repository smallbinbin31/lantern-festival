# 圖片資源目錄

## 使用說明

此目錄存放網站所需的所有圖片資源。

### 圖片規格建議

- **格式**: WebP（支援度高且檔案小）或 JPG/PNG
- **大小**: 建議每張圖片壓縮至 100KB 以下
- **尺寸**: 
  - 主題封面圖: 1200x600px (寬螢幕)
  - 活動照片: 800x600px (標準比例)
  - 圖示/Logo: 200x200px (正方形)

### 命名規範

使用有意義的檔名，例如：
- `theme-qigui.webp` - 傳統乞龜主題圖
- `theme-dice.webp` - 擲筊杯主題圖
- `theme-model.webp` - 廟會模型主題圖
- `theme-market.webp` - 龍興市集主題圖
- `theme-lantern.webp` - 觀音燈會主題圖
- `turtle-intro.webp` - 錢龜介紹圖
- `logo.webp` - 龍興堂 Logo

### 圖片壓縮工具

**線上工具（免費）**:
- [TinyPNG](https://tinypng.com/) - PNG/JPG 壓縮
- [Squoosh](https://squoosh.app/) - 多格式壓縮（支援 WebP）
- [Convertio](https://convertio.co/zh/image-converter/) - 格式轉換

**指令行工具**:
```bash
# 使用 cwebp 轉換為 WebP
cwebp -q 80 input.jpg -o output.webp

# 批次轉換
for file in *.jpg; do cwebp -q 80 "$file" -o "${file%.jpg}.webp"; done
```

### Lazy Loading

網站使用 Lazy Loading 技術，圖片在進入視窗範圍時才載入，HTML 範例：

```html
<img src="images/theme-qigui.webp" 
     alt="傳統乞龜活動" 
     loading="lazy"
     width="1200" 
     height="600">
```

### 注意事項

1. **版權**: 確保所有圖片擁有使用權
2. **備份**: 保留原始高解析度圖片在其他地方備份
3. **檔案大小**: 所有圖片總計建議不超過 5MB，避免首次載入過慢
4. **替代文字**: 每張圖片都應該有有意義的 alt 屬性（無障礙設計）

### 範例目錄結構

```
images/
├── logo.webp                 (20KB)
├── theme-qigui.webp          (80KB)
├── theme-dice.webp           (75KB)
├── theme-model.webp          (90KB)
├── theme-market.webp         (85KB)
├── theme-lantern.webp        (95KB)
├── turtle-intro-1.webp       (70KB)
├── turtle-intro-2.webp       (65KB)
└── placeholder.webp          (5KB) - 載入中顯示的佔位圖
```

---

**完成 Phase 1 Task T014 後，請將準備好的圖片放置於此目錄。**
