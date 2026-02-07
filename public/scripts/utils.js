// Utility Functions
// 共用的工具函式，供整個應用程式使用

/**
 * 驗證姓名格式
 * @param {string} name - 要驗證的姓名
 * @returns {boolean} - 是否有效
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmedName = name.trim();
  
  // 長度檢查：2-50 字元
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return false;
  }
  
  // 格式檢查：中文、英文、空格、常見符號
  const nameRegex = /^[\u4e00-\u9fa5a-zA-Z\s\(\)\-\.]+$/;
  return nameRegex.test(trimmedName);
}

/**
 * 驗證電話號碼格式（台灣）
 * @param {string} phone - 要驗證的電話號碼
 * @returns {boolean} - 是否有效
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  const trimmedPhone = phone.trim();
  
  // 行動電話：09 開頭，共 10 碼
  const mobileRegex = /^09\d{8}$/;
  
  // 市話：2-4 碼區碼 + 6-8 碼號碼（可選連字號）
  const landlineRegex = /^\d{2,4}-?\d{6,8}$/;
  
  return mobileRegex.test(trimmedPhone) || landlineRegex.test(trimmedPhone);
}

/**
 * 格式化時間戳記為人類可讀格式
 * @param {number} timestamp - Unix 時間戳記（毫秒）
 * @returns {string} - 格式化後的時間字串
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 取得當前時間的 ISO 8601 格式字串
 * @returns {string} - ISO 8601 格式時間
 */
export function getCurrentISOTime() {
  return new Date().toISOString();
}

/**
 * 顯示成功訊息
 * @param {string} message - 訊息內容
 * @param {HTMLElement} container - 顯示訊息的容器元素
 */
export function showSuccessMessage(message, container) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'success-message';
  messageDiv.textContent = message;
  
  container.appendChild(messageDiv);
  
  // 3 秒後自動移除
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

/**
 * 顯示錯誤訊息
 * @param {string} message - 訊息內容
 * @param {HTMLElement} container - 顯示訊息的容器元素
 */
export function showErrorMessage(message, container) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'error-message';
  messageDiv.textContent = message;
  
  container.appendChild(messageDiv);
  
  // 5 秒後自動移除
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

/**
 * 清除容器中的所有訊息
 * @param {HTMLElement} container - 容器元素
 */
export function clearMessages(container) {
  const messages = container.querySelectorAll('.success-message, .error-message');
  messages.forEach(msg => msg.remove());
}

/**
 * 安全地取得 HTML 元素
 * @param {string} selector - CSS 選擇器
 * @returns {HTMLElement|null} - 找到的元素或 null
 */
export function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
  }
  return element;
}

/**
 * 顯示載入指示器
 * @param {HTMLElement} container - 容器元素
 */
export function showLoading(container) {
  const loader = document.createElement('div');
  loader.className = 'loading-spinner';
  loader.innerHTML = '<div class="spinner"></div><p>載入中...</p>';
  container.appendChild(loader);
}

/**
 * 隱藏載入指示器
 * @param {HTMLElement} container - 容器元素
 */
export function hideLoading(container) {
  const loader = container.querySelector('.loading-spinner');
  if (loader) {
    loader.remove();
  }
}

/**
 * 轉義 HTML 特殊字元（防止 XSS）
 * @param {string} text - 要轉義的文字
 * @returns {string} - 轉義後的文字
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 將物件陣列轉換為 CSV 格式
 * @param {Array<Object>} data - 資料陣列
 * @param {Array<string>} headers - 欄位標題
 * @returns {string} - CSV 格式字串
 */
export function convertToCSV(data, headers) {
  if (!data || data.length === 0) {
    return '';
  }
  
  // 標題列
  const csvHeaders = headers.join(',');
  
  // 資料列
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      // 如果包含逗號或換行，用雙引號包起來
      if (value.toString().includes(',') || value.toString().includes('\n')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * 下載檔案
 * @param {string} content - 檔案內容
 * @param {string} filename - 檔案名稱
 * @param {string} mimeType - MIME 類型
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  // 清理
  URL.revokeObjectURL(url);
}

/**
 * 延遲執行（Promise 版本）
 * @param {number} ms - 延遲毫秒數
 * @returns {Promise} - Promise
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Log utility initialization
console.log('Utils module loaded successfully');
