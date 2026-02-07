// Main Application Logic
// Hash-based SPA Router and Page Management

import { database, auth, isFirebaseConfigured } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { ref, push, set, update, onValue, get } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { getElement, showErrorMessage, showSuccessMessage, validateName, validatePhone, formatTimestamp, convertToCSV, downloadFile, getCurrentISOTime } from './utils.js';

// ============================================================================
// Global State
// ============================================================================

let currentUser = null;
let currentPage = 'home';

// ============================================================================
// Page Templates
// ============================================================================

const pages = {
  home: {
    title: '歡迎參加塭堵龍興堂115年元宵節活動',
    content: `
      <div class="page-content home-page">
        <div class="hero-section">
          <h2>歡迎參加塭堵龍興堂115年元宵節活動</h2>
          <p class="lead">體驗傳統文化，共度佳節時光</p>
        </div>
        
        <div class="themes-grid">
          <div class="theme-card">
            <img src="images/theme-qigui.svg" alt="傳統乞龜活動" loading="lazy">
            <h3>傳統乞龜活動</h3>
            <p>體驗百年傳統乞龜文化，參與招財錢龜報名</p>
            <a href="#qigui" class="btn btn-secondary">了解更多</a>
          </div>
          
          <div class="theme-card">
            <img src="images/theme-dice.svg" alt="元宵擲筊杯競賽" loading="lazy">
            <h3>元宵擲筊杯競賽</h3>
            <p>參加傳統擲筊杯活動，祈求新年好運</p>
            <a href="#dice" class="btn btn-secondary">了解更多</a>
          </div>
          
          <div class="theme-card">
            <img src="images/theme-model.svg" alt="廟會模型展覽" loading="lazy">
            <h3>廟會模型展覽</h3>
            <p>欣賞精緻廟會模型，感受傳統工藝之美</p>
            <a href="#model" class="btn btn-secondary">了解更多</a>
          </div>
          
          <div class="theme-card">
            <img src="images/theme-market.svg" alt="龍興市集" loading="lazy">
            <h3>龍興市集</h3>
            <p>品嚐在地美食，選購特色商品</p>
            <a href="#market" class="btn btn-secondary">了解更多</a>
          </div>
          
          <div class="theme-card">
            <img src="images/theme-lantern.svg" alt="無相觀音燈會" loading="lazy">
            <h3>無相觀音燈會</h3>
            <p>欣賞璀璨燈飾，感受元宵節慶氛圍</p>
            <a href="#lantern" class="btn btn-secondary">了解更多</a>
          </div>
          
          <div class="theme-card">
            <img src="images/theme-sponsor.svg" alt="贊助名單" loading="lazy">
            <h3>贊助名單</h3>
            <p>感謝各界善心人士的大力支持</p>
            <a href="#sponsor" class="btn btn-secondary">查看名單</a>
          </div>
        </div>
      </div>
    `
  },
  
  qigui: {
    title: '傳統乞龜活動',
    content: `
      <div class="page-content theme-page">
        <h2>傳統乞龜活動</h2>
        <div class="theme-intro">
          <img src="images/theme-qigui.svg" alt="傳統乞龜活動" loading="lazy">
          <p>乞龜是台灣傳統元宵節習俗，象徵祈求平安、財運亨通。龍興堂延續百年傳統，舉辦傳統乞龜活動。</p>
        </div>
        
        <div class="sub-themes">
          <div class="sub-theme-card">
            <h3>傳統錢龜介紹</h3>
            <p>了解錢龜的文化背景與傳統意義</p>
            <a href="#turtle-intro" class="btn btn-primary">閱讀介紹</a>
          </div>
          
          <div class="sub-theme-card">
            <h3>招財錢龜介紹</h3>
            <p>認識招財錢龜項目與參與辦法</p>
            <a href="#fortune-turtle-intro" class="btn btn-primary">閱讀介紹</a>
          </div>
          
          <div class="sub-theme-card highlight">
            <h3>招財錢龜報名</h3>
            <p>立即報名參加招財錢龜活動</p>
            <a href="#register" class="btn btn-primary">前往報名</a>
          </div>
        </div>
      </div>
    `
  },
  
  dice: {
    title: '元宵擲筊杯競賽',
    content: `
      <div class="page-content theme-page dice-competition-page">
        <h2>元宵擲筊杯競賽</h2>
        <div class="theme-intro">
          <img src="images/theme-dice.svg" alt="元宵擲筊杯競賽" loading="lazy">
          <p>擲筊杯是台灣民間信仰的重要儀式，透過擲筊與神明溝通。元宵期間舉辦擲筊杯競賽，增添節慶趣味。</p>
        </div>
        
        <div class="competition-rules">
          <section class="rule-section">
            <h3>📅 一、比賽時間（初賽）</h3>
            <p class="note">⚠️ 活動期間若現場仍有排隊人潮，將延長至最後一位排隊者擲完為止。</p>
            
            <div class="schedule-table">
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026/03/03 (二) ～ 03/06 (五)</strong>
                </div>
                <div class="schedule-time">17:00 – 22:00</div>
              </div>
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026/03/07 (六)</strong>
                </div>
                <div class="schedule-time">12:00 – 22:00</div>
              </div>
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026/03/08 (日)</strong>
                </div>
                <div class="schedule-time">12:00 – 17:00</div>
              </div>
            </div>
          </section>

          <section class="rule-section">
            <h3>🎯 二、初賽辦法與規則</h3>
            
            <div class="rule-item">
              <h4>💰 參加費用</h4>
              <p>每人每次 <strong>100 元</strong>（共 3 次擲筊機會）</p>
            </div>

            <div class="rule-item">
              <h4>🏆 晉級資格</h4>
              <p>連續擲出 <strong class="highlight-number">7 次聖筊</strong>者，即可進入決賽。</p>
            </div>

            <div class="rule-item special">
              <h4>⭐ 特殊晉級</h4>
              <p>若擲出「<strong>立筊</strong>」者，免除後續次數，<strong>直接晉級決賽</strong>（須由現場工作人員判定為準）。</p>
            </div>

            <div class="rule-item">
              <h4>📋 規範事項</h4>
              <ul class="regulation-list">
                <li>
                  <strong>擲筊姿勢：</strong>可站立或跪立，惟雙手需離地面 <strong>30 公分以上</strong>。
                </li>
                <li>
                  <strong>結果認定：</strong>一正一反為「<strong>聖筊</strong>」。若有任何爭議，一律以本廟工作人員之判定為最終依據。
                </li>
                <li>
                  <strong>決賽憑證：</strong>晉級者務必領取「<strong>決賽券</strong>」，並確認券上有工作人員簽名及蓋章始為有效。
                </li>
              </ul>
              <p class="warning-text">⚠️ <strong>注意：</strong>決賽券請妥善保管，<strong>認券不認人</strong>，遺失恕不補發。</p>
            </div>
          </section>

          <section class="rule-section final-rules">
            <h3>🏅 三、決賽規則</h3>
            
            <div class="rule-item">
              <h4>⏰ 決賽時間</h4>
              <div class="final-time">
                <strong>2026年3月8日 (日)</strong><br>
                <span class="time">19:30 開始</span>
              </div>
            </div>

            <div class="rule-item">
              <h4>✅ 報到規範</h4>
              <ul class="regulation-list">
                <li>參賽者須憑「<strong>決賽券</strong>」準時報到。</li>
                <li>決賽順序依初賽晉級先後順序叫號。</li>
                <li>第一輪叫號未到者，待全員結束後進行第二輪補叫號。</li>
                <li class="warning-item">若第二輪叫號仍未到場，<strong>視同放棄參賽權利</strong>，不得異議。</li>
              </ul>
            </div>

            <div class="rule-item">
              <h4>🎲 決賽方式</h4>
              <ul class="regulation-list">
                <li>
                  <strong>姿勢限定：</strong>決賽人員一律採「<strong>站姿</strong>」，手需離地面 30 公分以上。
                </li>
                <li>
                  <strong>勝負判定：</strong>以「<strong>聖筊</strong>」數量多者為勝。
                </li>
                <li>
                  若聖筊數相同，則進行「<strong>比杯</strong>」直到分出名次。
                </li>
                <li>
                  <strong>筊相權重：</strong><span class="priority-order">聖筊 > 陰筊 > 笑筊</span>
                </li>
                <li>
                  <strong>獎項挑選：</strong>依聖筊數由高至低，依序自選心儀獎品（獎項內容詳見獎品公告圖）。
                </li>
              </ul>
            </div>
          </section>

          <section class="rule-section special-award">
            <h3>🎁 四、特別獎規則</h3>
            
            <div class="rule-item">
              <h4>🌟 獲獎資格</h4>
              <p>限進入決賽之人員，自決賽第一輪開始至結束，<strong>連續擲出「笑筊」</strong>者獲得。</p>
            </div>

            <div class="rule-item">
              <h4>🏆 名次判定</h4>
              <p>若符合資格者之笑筊次數相同，則進行「<strong>笑筊拚杯</strong>」直到分出勝負。</p>
            </div>

            <div class="rule-item">
              <h4>😊 笑筊認定</h4>
              <p><strong>兩面平面朝上</strong>即為「笑筊」。</p>
            </div>
          </section>
        </div>
      </div>
    `
  },
  
  model: {
    title: '廟會模型展覽',
    content: `
      <div class="page-content theme-page model-exhibition-page">
        <h2>廟會模型展覽</h2>
        <div class="theme-intro">
          <img src="images/theme-model.svg" alt="廟會模型展覽" loading="lazy">
          <p>精心製作的廟會模型，重現傳統廟會盛況，展現台灣傳統工藝之美。</p>
        </div>
        
        <div class="exhibition-content">
          <section class="intro-section">
            <h3>🏛️ 廟會模型展覽說明</h3>
            <p>本模型呈現的是<strong>台灣傳統廟會的熱鬧場景</strong>。</p>
            <p>廟會不只是宗教儀式，更是台灣早期社會中<strong>凝聚人情、傳承文化與地方認同</strong>的重要活動。</p>
            <p>在傳統社會裡，居民會透過廟會來<strong>感謝神明保佑</strong>，也祈求來年平安、順利、風調雨順。整個活動通常由地方信眾共同籌辦，從陣頭、繞境、供品到戲曲演出，都是社區力量的展現。</p>
          </section>

          <section class="intro-section highlights">
            <h3>🔔 模型內容重點說明</h3>
            
            <div class="highlight-grid">
              <div class="highlight-card">
                <div class="highlight-icon">🏮</div>
                <h4>主神神轎</h4>
                <p>位於隊伍核心，象徵神明出巡巡境，保佑地方安定、驅邪避災。</p>
              </div>

              <div class="highlight-card">
                <div class="highlight-icon">🎭</div>
                <h4>陣頭文化</h4>
                <p>如宋江陣、八家將、官將首、舞龍舞獅等，除了表演性，也具有守護、開路、驅煞的宗教意涵。</p>
              </div>

              <div class="highlight-card">
                <div class="highlight-icon">🙏</div>
                <h4>信眾參與</h4>
                <p>模型中可看到抬轎、焚香、跪拜的信眾，代表「人與神之間的連結」，也是台灣廟會最重要的精神核心。</p>
              </div>

              <div class="highlight-card">
                <div class="highlight-icon">🎉</div>
                <h4>熱鬧街景</h4>
                <p>鑼鼓、鞭炮、攤販與人群，呈現廟會不只是宗教活動，更是地方的年度盛事與生活記憶。</p>
              </div>
            </div>
          </section>

          <section class="intro-section exhibition-time">
            <h3>📅 展覽時間</h3>
            <div class="schedule-table">
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月6日（星期五）</strong><br>
                  <span class="lunar-date">農曆正月十八日</span>
                </div>
                <div class="schedule-time">16:00～22:00</div>
              </div>
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月7日（星期六）</strong><br>
                  <span class="lunar-date">農曆正月十九日</span>
                </div>
                <div class="schedule-time">12:00～22:00</div>
              </div>
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月8日（星期日）</strong><br>
                  <span class="lunar-date">農曆正月二十日</span>
                </div>
                <div class="schedule-time">12:00～22:00</div>
              </div>
            </div>
          </section>

          <section class="intro-section photo-gallery">
            <h3>📸 模型展示照片</h3>
            <p class="photo-hint">點擊圖片可放大查看</p>
            <div class="photo-grid">
              <div class="photo-item">
                <img src="images/廟會模型1.jpg" alt="廟會模型展示 1" loading="lazy" onclick="openLightbox('images/廟會模型1.jpg')">
              </div>
              <div class="photo-item">
                <img src="images/廟會模型2.jpg" alt="廟會模型展示 2" loading="lazy" onclick="openLightbox('images/廟會模型2.jpg')">
              </div>
              <div class="photo-item">
                <img src="images/廟會模型3.jpg" alt="廟會模型展示 3" loading="lazy" onclick="openLightbox('images/廟會模型3.jpg')">
              </div>
              <div class="photo-item">
                <img src="images/廟會模型4.jpg" alt="廟會模型展示 4" loading="lazy" onclick="openLightbox('images/廟會模型4.jpg')">
              </div>
              <div class="photo-item">
                <img src="images/廟會模型5.jpg" alt="廟會模型展示 5" loading="lazy" onclick="openLightbox('images/廟會模型5.jpg')">
              </div>
            </div>
          </section>

          <div class="admission-note">
            <p>🎫 <strong>免費參觀</strong> | 歡迎蒞臨欣賞台灣傳統廟會文化之美</p>
          </div>
        </div>
      </div>
    `
  },
  
  market: {
    title: '龍興市集',
    content: `
      <div class="page-content theme-page">
        <h2>龍興市集</h2>
        <div class="theme-intro">
          <img src="images/theme-market.svg" alt="龍興市集" loading="lazy">
          <p>結合在地美食、手工藝品、文創商品的特色市集，體驗在地文化與人情味。</p>
        </div>
        
        <div class="activity-details">
          <h3>市集亮點</h3>
          <ul>
            <li><strong>美食</strong>：在地小吃、傳統糕餅、特色飲品</li>
            <li><strong>文創</strong>：手工藝品、祈福小物、紀念品</li>
            <li><strong>時間</strong>：元宵節前三天至元宵節當天</li>
            <li><strong>攤位</strong>：超過 30 個特色攤位</li>
          </ul>
        </div>
      </div>
    `
  },
  
  lantern: {
    title: '無相觀音燈會',
    content: `
      <div class="page-content theme-page lantern-page">
        <h2>無相觀音燈會</h2>
        <div class="theme-intro">
          <img src="images/theme-lantern.svg" alt="無相觀音燈會" loading="lazy">
          <p>璀璨的燈飾裝置，營造莊嚴祥和的元宵氛圍，展現觀音慈悲精神。</p>
        </div>
        
        <div class="activity-details">
          <h3>燈會特色</h3>
          <ul>
            <li><strong>主題</strong>：無相觀音與慈悲精神</li>
            <li><strong>規模</strong>：超過 1000 盞花燈</li>
            <li><strong>時間</strong>：每晚 18:00-22:00 點燈</li>
            <li><strong>亮點</strong>：大型主燈、祈福燈籠、互動裝置</li>
          </ul>
        </div>

        <div class="lantern-gallery">
          <h3>📸 主燈展示</h3>
          <div class="lantern-photo-grid">
            <div class="lantern-photo-item" onclick="openLightbox('images/無相觀音燈會1.jpg')">
              <img src="images/無相觀音燈會1.jpg" alt="無相觀音主燈" loading="lazy">
              <div class="photo-overlay">
                <span class="zoom-icon">🔍 點擊放大</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox Modal -->
      <div id="lightboxModal" class="lightbox-modal" onclick="closeLightbox()">
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightboxImage">
      </div>
    `
  },
  
  'online-dice': {
    title: '線上擲筊杯',
    content: `
      <div class="page-content online-dice-page">
        <h2>線上擲筊杯</h2>
        
        <div class="dice-container">
          <div class="deity-image">
            <img src="images/無相觀音.jpg" alt="無相觀音" class="deity-img">
          </div>
          
          <div class="dice-game">
            <div class="dice-display">
              <img src="images/左邊-正面.png" alt="筊杯" id="leftDice" class="dice-img">
              <img src="images/右邊-正面.png" alt="筊杯" id="rightDice" class="dice-img">
            </div>
            
            <div class="dice-result">
              <div class="cup-count">
                <span class="count-number" id="cupCount">0</span>
              </div>
              <div class="result-text" id="resultText">請按下「擲筊杯」開始</div>
            </div>
            
            <div class="dice-controls">
              <button class="btn btn-primary btn-large" id="throwDiceBtn" onclick="throwDice()">
                🙏 擲筊杯
              </button>
            </div>
            
            <div class="welcome-text">
              <p class="welcome-large">歡迎蒞臨龍興堂參加現場擲筊杯比賽</p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  
  sponsor: {
    title: '贊助名單',
    content: `
      <div class="page-content sponsor-page">
        <h2>贊助名單</h2>
        <div class="sponsor-intro">
          <img src="images/theme-sponsor.svg" alt="贊助名單" loading="lazy">
          <p>感謝以下善心人士與企業對本次活動的大力支持，您的善心讓傳統文化得以延續發揚。</p>
        </div>
        
        <div class="sponsor-photo-section">
          <h3>📜 捐獻信士名單</h3>
          <div class="sponsor-photo-container">
            <img src="images/捐獻信士.jpg" alt="捐獻信士名單" onclick="openLightbox('images/捐獻信士.jpg')" class="sponsor-photo">
            <p class="photo-hint">點擊圖片可放大查看</p>
          </div>
        </div>
        
        <div id="sponsorListContent" class="sponsor-content loading">
          <p>載入中...</p>
        </div>
        
        <div class="sponsor-note">
          <p class="text-muted">* 名單依贊助時間排序，如有遺漏敬請告知</p>
          <p class="text-muted">* 感恩各界的支持與參與</p>
        </div>
      </div>
    `
  },
  
  'turtle-intro': {
    title: '傳統錢龜介紹',
    content: `
      <div class="page-content turtle-intro-page">
        <h2>傳統錢龜介紹</h2>
        <p class="subtitle">了解錢龜的文化背景與傳統意義</p>
        
        <div class="turtle-description">
          <section class="intro-section">
            <h3>📿 說明</h3>
            <p>龍興堂錢龜向來被信眾視為<strong>招財納庫、事業開運、生意興旺及保佑身體健康</strong>的重要信物。多年來，不少歷屆得主表示，迎回錢龜期間，<strong>客源變多、貴人出現、合作機會接連而來</strong>，可趨吉避凶、逢凶化吉，也可保佑全家身體健康。歸還時，再添油香回饋神恩，福氣也隨之延續，年年更旺。</p>
            <p>錢龜不僅象徵財庫滿盈，更代表一份誠心請示、神明應允的福緣。凡從事<strong>生意、業務、投資、創業</strong>，或希望事業更上一層樓者，皆可把握良機，誠心擲杯，迎請錢龜回家，共結善緣、廣納財福。</p>
          </section>

          <section class="intro-section">
            <h3>🐢 一、錢龜項目</h3>
            <p>龍興堂錢龜分為下列項目：</p>
            <div class="turtle-types">
              <div class="turtle-type-card">
                <div class="turtle-icon">👑</div>
                <h4>龜王</h4>
              </div>
              <div class="turtle-type-card">
                <div class="turtle-icon">👸</div>
                <h4>龜母</h4>
              </div>
              <div class="turtle-type-card">
                <div class="turtle-icon">🐢</div>
                <h4>錢龜</h4>
              </div>
              <div class="turtle-type-card">
                <div class="turtle-icon">💎</div>
                <h4>珍珠龜</h4>
                <p class="small-text">（2隻為一對，共2對）</p>
              </div>
              <div class="turtle-type-card">
                <div class="turtle-icon">💰</div>
                <h4>招財龜</h4>
              </div>
              <div class="turtle-type-card">
                <div class="turtle-icon">🏆</div>
                <h4>進寶龜</h4>
              </div>
            </div>
          </section>

          <section class="intro-section">
            <h3>👥 二、參與資格</h3>
            <p>符合下列任一資格者，皆可參與：</p>
            <ul class="qualification-list">
              <li>✅ 龍興堂委員</li>
              <li>✅ 龍興堂爐下信徒</li>
              <li>✅ 曾任錢龜得主</li>
              <li>✅ 由委員引薦之貴賓</li>
            </ul>
          </section>

          <section class="intro-section highlight-section">
            <h3>📅 三、擲茭杯時間</h3>
            <div class="schedule-table">
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月3日（星期二）</strong><br>
                  <span class="lunar-date">農曆正月十五日</span>
                </div>
                <div class="schedule-time">19:00～22:00</div>
              </div>
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月4日（星期三）</strong><br>
                  <span class="lunar-date">農曆正月十六日</span>
                </div>
                <div class="schedule-time">19:00～22:00</div>
              </div>
              <div class="schedule-row highlight">
                <div class="schedule-date">
                  <strong>2026年3月5日（星期四）</strong><br>
                  <span class="lunar-date">農曆正月十七日</span>
                </div>
                <div class="schedule-time">19:00～22:30</div>
              </div>
            </div>
            <p class="note">⚠️ 最後一天將延長至協助本廟擲茭杯比賽之工作人員全數擲完為止</p>
          </section>

          <section class="intro-section">
            <h3>🎯 四、同杯拚杯時間</h3>
            <p>若出現同杯情形，將進行拚杯：</p>
            <div class="special-date">
              <strong>2026年3月6日（星期五）</strong><br>
              <span class="lunar-date">農曆正月十八日</span><br>
              <span class="time">20:00</span>
            </div>
          </section>

          <section class="intro-section">
            <h3>🏅 五、得主判定方式</h3>
            <p class="highlight-text">於三天擲茭杯期間內，<strong>杯數最高者</strong>即為該項錢龜得主。</p>
          </section>

          <section class="intro-section return-rules">
            <h3>🔄 六、錢龜歸還規定</h3>
            <p>所有錢龜須於<strong>明年元宵節前一週歸還</strong>，各項規定如下：</p>
            <div class="return-table">
              <div class="return-row">
                <div class="turtle-name">龜王</div>
                <div class="return-detail">電影一天（3,000 元），油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">龜母</div>
                <div class="return-detail">電影一天（3,000 元），油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">錢龜</div>
                <div class="return-detail">電影一天（3,000 元），油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">珍珠龜</div>
                <div class="return-detail">油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">招財龜</div>
                <div class="return-detail">油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">進寶龜</div>
                <div class="return-detail">油香自由捐獻</div>
              </div>
            </div>
          </section>

          <div class="cta-section">
            <a href="#register" class="btn btn-primary btn-large">立即報名參加</a>
          </div>
        </div>
      </div>
    `
  },
  
  'fortune-turtle-intro': {
    title: '招財錢龜介紹',
    content: `
      <div class="page-content turtle-intro-page">
        <h2>招財錢龜介紹</h2>
        <p class="subtitle">認識招財錢龜項目與參與辦法</p>
        
        <div class="turtle-description">
          <section class="intro-section">
            <h3>🐢 一、錢龜項目</h3>
            <p class="highlight-text"><strong>招財錢龜</strong></p>
          </section>

          <section class="intro-section">
            <h3>👥 二、參與資格</h3>
            <p class="highlight-text">不限資格，另<strong>18歲以下須由家長陪同</strong></p>
          </section>

          <section class="intro-section highlight-section">
            <h3>📅 三、擲筊杯時間</h3>
            <div class="schedule-table">
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月6日（星期五）</strong><br>
                  <span class="lunar-date">農曆正月十八日</span>
                </div>
                <div class="schedule-time">18:00～21:30</div>
              </div>
              <div class="schedule-row">
                <div class="schedule-date">
                  <strong>2026年3月7日（星期六）</strong><br>
                  <span class="lunar-date">農曆正月十九日</span>
                </div>
                <div class="schedule-time">13:00～21:30</div>
              </div>
              <div class="schedule-row highlight">
                <div class="schedule-date">
                  <strong>2026年3月8日（星期日）</strong><br>
                  <span class="lunar-date">農曆正月二十日</span>
                </div>
                <div class="schedule-time">13:00～17:00</div>
              </div>
            </div>
            <p class="note">⚠️ 每天若有排隊將延長至排隊人員全數擲完為止</p>
          </section>

          <section class="intro-section">
            <h3>🎯 四、同杯拚杯時間</h3>
            <p>若出現同杯情形，將進行拚杯：</p>
            <div class="special-date">
              <strong>2026年3月8日（星期日）</strong><br>
              <span class="lunar-date">農曆正月二十日</span><br>
              <span class="time">17:30</span>
            </div>
          </section>

          <section class="intro-section">
            <h3>🏅 五、得主判定方式</h3>
            <p class="highlight-text">於三天擲筊杯期間內，<strong>杯數最高者</strong>即為該項錢龜得主。</p>
          </section>

          <section class="intro-section">
            <h3>📿 六、錢龜供奉方式</h3>
            <p>放置公司/家中，若有神桌，放置於神桌；若無神桌，可使用四腳桌供奉，錢龜向外招財保平安。</p>
          </section>

          <section class="intro-section return-rules">
            <h3>🔄 七、錢龜歸還規定</h3>
            <p>所有錢龜須於<strong>明年元宵節前一週歸還</strong>，各項規定如下：</p>
            <div class="return-table">
              <div class="return-row">
                <div class="turtle-name">鎮殿佛祖招財錢龜</div>
                <div class="return-detail">金莎200顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">開基佛祖招財錢龜</div>
                <div class="return-detail">金莎200顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">二佛祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">三佛祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">四佛祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">五佛祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">副五祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">六佛祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">石頭祖招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">宋府千歲招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">范府千歲招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">老朱府千歲招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">朱府千歲招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">開基福德正神招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">福德正神招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
              <div class="return-row">
                <div class="turtle-name">大鵬鳥元帥招財錢龜</div>
                <div class="return-detail">金莎100顆，油香自由捐獻</div>
              </div>
            </div>
          </section>

          <div class="cta-section">
            <a href="#register" class="btn btn-primary btn-large">立即前往報名</a>
          </div>
        </div>
      </div>
    `
  },
  
  register: {
    title: '招財錢龜報名',
    content: `
      <div class="page-content register-page">
        <h2>招財錢龜報名</h2>
        <p class="subtitle">立即報名參加招財錢龜活動</p>
        
        <div class="register-container">
          <div class="register-info">
            <h3>報名須知</h3>
            <ul>
              <li>報名後請於元宵節當天至龍興堂參加乞龜儀式</li>
              <li>由主持人帶領信眾擲筊，詢問神明意願</li>
              <li>擲出聖筊者可乞得錢龜</li>
              <li>隔年元宵節前需準備更多硬幣還願</li>
              <li>名額有限，額滿為止</li>
            </ul>
          </div>
          
          <form id="registrationForm" class="registration-form">
            <div class="form-group">
              <label for="regName">姓名 <span class="required">*</span></label>
              <input type="text" id="regName" name="name" required 
                     placeholder="請輸入您的姓名（2-50字元）"
                     minlength="2" maxlength="50">
              <span class="error-message" id="nameError"></span>
            </div>
            
            <div class="form-group">
              <label for="regPhone">電話 <span class="required">*</span></label>
              <input type="tel" id="regPhone" name="phone" required 
                     placeholder="請輸入手機號碼（例如：0912345678）"
                     pattern="[0-9]{10,12}">
              <span class="error-message" id="phoneError"></span>
            </div>
            
            <div class="form-group">
              <label>選擇擲筊杯的招財錢龜 <span class="required">*</span></label>
              <p class="form-hint">請勾選最多 3 個招財錢龜（必須至少選擇 1 個）</p>
              <div class="checkbox-group" id="turtleSelection">
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="鎮殿佛祖招財錢龜">
                  <span>鎮殿佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="開基佛祖招財錢龜">
                  <span>開基佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="二佛祖招財錢龜">
                  <span>二佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="三佛祖招財錢龜">
                  <span>三佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="四佛祖招財錢龜">
                  <span>四佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="五佛祖招財錢龜">
                  <span>五佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="副五祖招財錢龜">
                  <span>副五祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="六佛祖招財錢龜">
                  <span>六佛祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="石頭祖招財錢龜">
                  <span>石頭祖招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="宋府千歲招財錢龜">
                  <span>宋府千歲招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="范府千歲招財錢龜">
                  <span>范府千歲招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="老朱府千歲招財錢龜">
                  <span>老朱府千歲招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="朱府千歲招財錢龜">
                  <span>朱府千歲招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="大鵬鳥元帥招財錢龜">
                  <span>大鵬鳥元帥招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="福德正神招財錢龜">
                  <span>福德正神招財錢龜</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" name="turtle" value="開基福德正神招財錢龜">
                  <span>開基福德正神招財錢龜</span>
                </label>
              </div>
              <span class="error-message" id="turtleError"></span>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-submit">
                提交報名
              </button>
            </div>
            
            <div id="formMessages"></div>
          </form>
        </div>
      </div>
    `
  },
  
  'admin-login': {
    title: '管理者登入',
    content: `
      <div class="page-content admin-login-page">
        <div class="login-container">
          <h2>管理者登入</h2>
          <p class="subtitle">請使用管理者帳號登入</p>
          
          <form id="adminLoginForm" class="login-form">
            <div class="form-group">
              <label for="adminEmail">帳號 Email</label>
              <input type="email" id="adminEmail" name="email" required 
                     placeholder="請輸入管理者 Email"
                     autocomplete="username">
              <span class="error-message" id="emailError"></span>
            </div>
            
            <div class="form-group">
              <label for="adminPassword">密碼</label>
              <input type="password" id="adminPassword" name="password" required 
                     placeholder="請輸入密碼"
                     autocomplete="current-password">
              <span class="error-message" id="passwordError"></span>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary btn-submit">
                登入
              </button>
            </div>
            
            <div id="loginMessages"></div>
          </form>
        </div>
      </div>
    `
  },
  
  admin: {
    title: '管理者後台',
    content: `
      <div class="page-content admin-page">
        <div class="admin-header">
          <h2>報名管理</h2>
          <div class="admin-actions">
            <button id="saveAllBtn" class="btn btn-primary">
              <span>💾</span> 儲存所有變更
            </button>
            <button id="exportCSVBtn" class="btn btn-secondary">
              <span>📥</span> 匯出 CSV
            </button>
            <button id="logoutBtn" class="btn btn-outline">
              <span>🚪</span> 登出
            </button>
          </div>
        </div>
        
        <div class="admin-stats">
          <div class="stat-card">
            <h3>總報名人數</h3>
            <p id="totalCount" class="stat-number">0</p>
          </div>
          <div class="stat-card">
            <h3>今日報名</h3>
            <p id="todayCount" class="stat-number">0</p>
          </div>
          <div class="stat-card">
            <h3>已處理</h3>
            <p id="processedCount" class="stat-number">0</p>
          </div>
          <div class="stat-card">
            <h3>未處理</h3>
            <p id="unprocessedCount" class="stat-number">0</p>
          </div>
        </div>
        
        <div class="admin-filters">
          <div class="filter-group">
            <label for="dateFilter">📅 日期：</label>
            <input type="date" id="dateFilter" class="filter-input">
          </div>
          
          <div class="filter-group">
            <label for="nameFilter">👤 姓名：</label>
            <input type="text" id="nameFilter" class="filter-input" placeholder="搜尋姓名...">
          </div>
          
          <div class="filter-group">
            <label for="turtleFilter">🐢 招財錢龜：</label>
            <select id="turtleFilter" class="filter-input">
              <option value="">全部</option>
              <option value="鎮殿佛祖招財錢龜">鎮殿佛祖招財錢龜</option>
              <option value="開基佛祖招財錢龜">開基佛祖招財錢龜</option>
              <option value="二佛祖招財錢龜">二佛祖招財錢龜</option>
              <option value="三佛祖招財錢龜">三佛祖招財錢龜</option>
              <option value="四佛祖招財錢龜">四佛祖招財錢龜</option>
              <option value="五佛祖招財錢龜">五佛祖招財錢龜</option>
              <option value="副五祖招財錢龜">副五祖招財錢龜</option>
              <option value="六佛祖招財錢龜">六佛祖招財錢龜</option>
              <option value="石頭祖招財錢龜">石頭祖招財錢龜</option>
              <option value="宋府千歲招財錢龜">宋府千歲招財錢龜</option>
              <option value="范府千歲招財錢龜">范府千歲招財錢龜</option>
              <option value="老朱府千歲招財錢龜">老朱府千歲招財錢龜</option>
              <option value="朱府千歲招財錢龜">朱府千歲招財錢龜</option>
              <option value="大鵬鳥元帥招財錢龜">大鵬鳥元帥招財錢龜</option>
              <option value="福德正神招財錢龜">福德正神招財錢龜</option>
              <option value="開基福德正神招財錢龜">開基福德正神招財錢龜</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="statusFilter">✅ 處理狀態：</label>
            <select id="statusFilter" class="filter-input">
              <option value="">全部</option>
              <option value="processed">已處理</option>
              <option value="unprocessed">未處理</option>
            </select>
          </div>
          
          <div class="filter-group">
            <button onclick="clearAllFilters()" class="btn btn-small">🔄 清除所有篩選</button>
          </div>
        </div>
        
        <div class="table-container">
          <table id="registrationsTable" class="admin-table">
            <thead>
              <tr>
                <th>編號</th>
                <th>姓名</th>
                <th>電話</th>
                <th>選擇的招財錢龜</th>
                <th>報名時間</th>
                <th>已處理</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody id="registrationsTableBody">
              <tr>
                <td colspan="7" class="loading">載入中...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div id="adminMessages"></div>
      </div>
    `
  },
  
  'event-info': {
    title: '活動資訊',
    content: `
      <div class="page-content event-info-page">
        <h2>活動資訊</h2>
        <p class="subtitle">塭堵龍興堂115年元宵節活動完整資訊</p>
        
        <div class="info-section">
          <div class="info-card">
            <h3>📍 活動地點</h3>
            <div class="info-content">
              <p><strong>廟宇名稱：</strong>塭堵龍興堂</p>
              <p><strong>地址：</strong>高雄市梓官區光明路92巷16號（鄰近中正路/禮仁路交叉口）</p>
              <p><strong>Google 地圖：</strong><a href="https://www.google.com/maps/search/塭堵龍興堂" target="_blank" class="link">點此開啟地圖 🗺️</a></p>
              <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.5!2d120.26!3d22.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ1JzM2LjAiTiAxMjDCsDE1JzM2LjAiRQ!5e0!3m2!1szh-TW!2stw!4v1234567890!5m2!1szh-TW!2stw&q=塭堵龍興堂" 
                  width="100%" height="350" style="border:0; border-radius: 8px;" allowfullscreen="" 
                  loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3>🚗 交通資訊</h3>
            <div class="info-content">
              <p><strong>塭堵龍興堂 交通資訊</strong></p>
              <p><strong>地址：</strong>高雄市梓官區光明路92巷16號（鄰近中正路/禮仁路交叉口）</p>
              
              <h4>🚗 自行開車</h4>
              <ul>
                <li><strong>國道1號（中山高）：</strong>由 岡山交流道 下，往岡山方向銜接 介壽東路 (台19甲線)，持續西行並接 梓官路，轉入 中正路 後，再轉向 光明路 即可抵達。</li>
                <li><strong>省道台17線（濱海公路）：</strong>由高雄市區北上，行駛至梓官段（蚵子寮方向），轉入中正路即可到達。</li>
                <li><strong>導航建議：</strong>建議設定導航至「梓官中正路」與「禮仁路」路口。</li>
              </ul>
              
              <h4>🚌 大眾運輸</h4>
              <ul>
                <li><strong>公車：</strong>搭乘高雄市公車 紅53 至「中正路通安路口」站下車，步行約5分鐘。</li>
                <li><strong>捷運：</strong>搭乘高雄捷運紅線至世運站，出站後轉乘高雄市公車 紅53 至「中正路通安路口」站下車，步行約5分鐘。</li>
              </ul>
            </div>
          </div>
          
          <div class="info-card">
            <h3>📋 活動須知</h3>
            <div class="info-content">
              <ul>
                <li>請保持廟宇環境整潔，垃圾請丟入垃圾桶</li>
                <li>廟內禁止吸菸、嚼檳榔</li>
                <li>參與乞龜活動請先線上報名或現場登記</li>
                <li>請尊重廟宇禮儀，保持莊嚴肅靜</li>
                <li>攜帶寵物者請注意環境衛生</li>
                <li>活動期間人潮較多，請注意自身財物安全</li>
                <li>如遇雨天，部分戶外活動將移至室內進行</li>
              </ul>
            </div>
          </div>
          
          <div class="info-card">
            <h3>❓ 常見問題 FAQ</h3>
            <div class="info-content faq-list">
              <div class="faq-item">
                <h4>Q1：報名參加乞龜活動需要費用嗎？</h4>
                <p>A：完全免費，但名額有限，建議提早線上報名。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q2：如何參加招財錢龜報名？</h4>
                <p>A：請至網站「傳統乞龜」頁面點擊「前往報名」填寫資料，或活動當日現場報名。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q3：乞得錢龜後，隔年需要怎麼還願？</h4>
                <p>A：隔年元宵節前準備更多硬幣（建議加倍）並誠心還願即可。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q4：活動現場有提供餐飲嗎？</h4>
                <p>A：龍興市集提供多種在地小吃和飲料，也歡迎自備餐點。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q5：可以攜帶外食進入廟宇嗎？</h4>
                <p>A：可以，但請在指定用餐區域食用，並注意環境清潔。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q6：活動有年齡限制嗎？</h4>
                <p>A：沒有年齡限制，歡迎全家大小一同參與。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q7：如何進行贊助？</h4>
                <p>A：請洽廟方或透過網站贊助表單登記，感恩您的善心支持。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q8：活動當天停車方便嗎？</h4>
                <p>A：廟前廣場有停車位，但活動期間較為擁擠，建議提早到達或搭乘大眾運輸。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q9：遇到問題可以聯絡誰？</h4>
                <p>A：請撥打廟方電話 (07) 617-3845 或私訊龍興堂 Facebook 粉絲專頁。</p>
              </div>
              
              <div class="faq-item">
                <h4>Q10：活動會因天氣取消嗎？</h4>
                <p>A：除非遇到颱風等重大天災，否則活動照常舉行。最新消息請關注官方網站或 Facebook。</p>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3>📞 聯絡我們</h3>
            <div class="info-content contact-info">
              <p><strong>廟方電話：</strong>(07) 619-3845</p>
              <p><strong>服務時間:</strong>每日 08:00-22:00</p>
              <p><strong>Facebook：</strong><a href="https://www.facebook.com/longxingtang/?locale=zh_TW" target="_blank" class="link">塭堵龍興堂 粉絲專頁</a></p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  
  about: {
    title: '關於龍興堂',
    content: `
      <div class="page-content about-page">
        <h2>關於塭堵龍興堂</h2>
        <p class="subtitle">承傳百年信仰，守護地方文化</p>
        
        <div class="about-section">
          <div class="about-card hero">
            <h3>🏛️ 廟宇沿革</h3>
            <div class="about-content">
              <p>塭堵龍興堂的淵源可追溯至清光緒年間。當時塭堵庄民在每年的烏魚季節，都會迎請鳳山龍山寺的觀音佛祖前來坐鎮，保佑漁獲豐收與庄頭平安。</p>
              <p>某日，觀音佛祖降乩指示：「由大陸安海而來的觀音佛祖，有意於塭堵庄顯化救世。」</p>
              <p>庄民隨即依照神諭上山採取神木，雕刻金身奉祀。後因地理變遷，原庄頭遭海浪侵蝕，庄民於民國29年遷徙至蚵子寮定居。觀音佛祖初期由爐主輪流供奉，直到民國80年（1991年）才正式興建廟宇，命名為「龍興堂」。</p>
            </div>
          </div>
          
          <div class="about-card">
            <h3>📿 無相觀音－開基祖</h3>
            <div class="about-content">
              <p>「無相」乃得來於佛道至理，師父教導其弟子有一階段必須拜佛像而漸入佛法至理，之後不必執著於佛像偶像外型的形像(有相)而感覺到萬物大相似空無形空即無相，乃為無相之理。</p>
              <p>供奉的神像原是一尊臉部五官未開面的黑釉觀音佛，後因日治時期被強行招認以及經年久的誦經禮拜再沾染香灰終而成了深黑色的顏色，成為日後「無相觀音」的由來。</p>
            </div>
          </div>
          
          <div class="about-card">
            <h3>🗿 石頭祖由來</h3>
            <div class="about-content">
              <p>「石頭祖」之稱緣由乃是某天先師夢中神靈指示，告知老廟內供桌下之石頭遺失了，緣由源於原供桌為沿用原料，且重量過重，新建廟時決議換新供桌故將其暫放於庭院，任由風吹日曬雨淋，加上原始供桌較高也較寬敞，隔板下常容納一些不明的信物件，之後後人重新檢視供桌，才發現到供桌隔板內的石頭，認為是神格較高之佛聖，重新以聖筊確認。</p>
              <p>此「石頭祖」的由來，亦是吾人非常尊崇的歷史遺產。</p>
            </div>
          </div>
          
          <div class="about-card">
            <h3>🎥 龍興堂介紹影片</h3>
            <div class="about-content">
              <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0;">
                <iframe 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;"
                  src="https://www.youtube.com/embed/weiGJ1CI7z8?si=3XEvdna8Ph2QY26F" 
                  title="塭堵龍興堂介紹影片" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowfullscreen>
                </iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-card">
            <h3>📍 活動地點</h3>
            <div class="info-content">
              <p><strong>廟宇名稱：</strong>塭堵龍興堂</p>
              <p><strong>地址：</strong>高雄市梓官區光明路92巷16號（鄰近中正路/禮仁路交叉口）</p>
              <p><strong>Google 地圖：</strong><a href="https://www.google.com/maps/search/塭堵龍興堂" target="_blank" class="link">點此開啟地圖 🗺️</a></p>
              <div class="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.5!2d120.26!3d22.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ1JzM2LjAiTiAxMjDCsDE1JzM2LjAiRQ!5e0!3m2!1szh-TW!2stw!4v1234567890!5m2!1szh-TW!2stw&q=塭堵龍興堂" 
                  width="100%" height="350" style="border:0; border-radius: 8px;" allowfullscreen="" 
                  loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
          
          <div class="info-card">
            <h3>🚗 交通資訊</h3>
            <div class="info-content">
              <p><strong>地址：</strong>高雄市梓官區光明路92巷16號（鄰近中正路/禮仁路交叉口）</p>
              
              <h4>🚗 自行開車</h4>
              <ul>
                <li><strong>國道1號（中山高）：</strong>由 岡山交流道 下，往岡山方向銜接 介壽東路 (台19甲線)，持續西行並接 梓官路，轉入 中正路 後，再轉向 光明路 即可抵達。</li>
                <li><strong>省道台17線（濱海公路）：</strong>由高雄市區北上，行駛至梓官段（蚵子寮方向），轉入中正路即可到達。</li>
                <li><strong>導航建議：</strong>建議設定導航至「梓官中正路」與「禮仁路」路口。</li>
              </ul>
              
              <h4>🚌 大眾運輸</h4>
              <ul>
                <li><strong>公車：</strong>搭乘高雄市公車 紅53 至「中正路通安路口」站下車，步行約5分鐘。</li>
                <li><strong>捷運：</strong>搭乘高雄捷運紅線至世運站，出站後轉乘高雄市公車 紅53 至「中正路通安路口」站下車，步行約5分鐘。</li>
              </ul>
            </div>
          </div>
          
          <div class="info-card">
            <h3>📞 聯絡我們</h3>
            <div class="info-content contact-info">
              <p><strong>廟方電話：</strong>(07) 619-3845</p>
              <p><strong>服務時間：</strong>每日 08:00-22:00</p>
              <p><strong>Facebook：</strong><a href="https://www.facebook.com/longxingtang/?locale=zh_TW" target="_blank" class="link">塭堵龍興堂 粉絲專頁</a></p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  
  '404': {
    title: '找不到頁面',
    content: `
      <div class="page-content error-page">
        <div class="error-container">
          <h1 class="error-code">404</h1>
          <h2>找不到頁面</h2>
          <p class="error-message">抱歉，您要找的頁面不存在。</p>
          <p class="error-hint">可能是網址輸入錯誤，或該頁面已被移除。</p>
          <div class="error-actions">
            <a href="#home" class="btn btn-primary">返回首頁</a>
            <a href="#qigui" class="btn btn-secondary">查看活動</a>
          </div>
        </div>
      </div>
    `
  }
};

// ============================================================================
// Router Functions
// ============================================================================

/**
 * 初始化路由系統
 */
function initRouter() {
  // 監聽 hash 變化
  window.addEventListener('hashchange', handleRouteChange);
  
  // 初始載入
  handleRouteChange();
  
  console.log('Router initialized');
}

/**
 * 處理路由變化
 */
function handleRouteChange() {
  const hash = window.location.hash.slice(1) || 'home';
  loadPage(hash);
}

/**
 * 載入頁面
 * @param {string} pageName - 頁面名稱
 */
function loadPage(pageName) {
  console.log(`Loading page: ${pageName}`);
  
  // 檢查頁面是否存在
  let page = pages[pageName];
  if (!page) {
    console.warn(`Page not found: ${pageName}, showing 404 page`);
    page = pages['404'];
    pageName = '404';
  }
  
  // 更新當前頁面
  currentPage = pageName;
  
  // 更新導航列 active 狀態
  updateNavigation(pageName);
  
  // 渲染頁面內容
  renderPage(page);
  
  // 等待 DOM 更新後再初始化特殊頁面功能
  setTimeout(() => {
    // 特殊頁面處理
    if (pageName === 'turtle-intro') {
      loadTurtleIntroContent();
    } else if (pageName === 'sponsor') {
      loadSponsorList();
    } else if (pageName === 'register') {
      initRegistrationForm();
    } else if (pageName === 'admin-login') {
      initAdminLoginForm();
    } else if (pageName === 'admin') {
      checkAdminAuth();
    }
  }, 0);
}

/**
 * 更新導航列 active 狀態
 * @param {string} activePage - 當前頁面
 */
function updateNavigation(activePage) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === activePage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 渲染頁面內容
 * @param {Object} page - 頁面物件
 */
function renderPage(page) {
  const mainContent = getElement('#mainContent');
  if (!mainContent) return;
  
  mainContent.innerHTML = page.content;
  
  // 添加返回按鈕（首頁除外）
  if (currentPage !== 'home') {
    addBackButton(mainContent);
  }
  
  // 更新頁面標題
  document.title = `${page.title} - 塭堵龍興堂115年元宵節活動`;
  
  // 滾動到頂部
  window.scrollTo(0, 0);
}

/**
 * 添加返回按鈕
 * @param {HTMLElement} container - 容器元素
 */
function addBackButton(container) {
  // 檢查是否已經有返回按鈕
  if (container.querySelector('.back-button')) return;
  
  // 創建返回按鈕
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.innerHTML = '← 返回上一頁';
  backButton.onclick = () => {
    window.history.back();
  };
  
  // 將返回按鈕插入到內容的開頭
  const firstChild = container.firstElementChild;
  if (firstChild) {
    container.insertBefore(backButton, firstChild);
  } else {
    container.appendChild(backButton);
  }
}

// ============================================================================
// Authentication Functions
// ============================================================================

/**
 * 初始化認證監聽
 */
/**
 * 初始化認證監聽
 */
function initAuth() {
  // Skip if Firebase is not configured
  if (!isFirebaseConfigured || !auth || auth._isDemoMode) {
    console.warn('Firebase Auth not configured. Demo mode active.');
    updateAuthUI(null);
    return;
  }
  
  try {
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      updateAuthUI(user);
      console.log('Auth state changed:', user ? user.email : 'Not logged in');
    });
  } catch (error) {
    console.warn('Firebase Auth initialization failed:', error);
    // Firebase 未設定時，仍然顯示登入按鈕
    updateAuthUI(null);
  }
}

/**
 * 更新認證相關 UI
 * @param {Object|null} user - 使用者物件
 */
function updateAuthUI(user) {
  const adminBtn = getElement('#adminLoginBtn');
  if (!adminBtn) return;
  
  if (user) {
    adminBtn.textContent = '管理後台';
    adminBtn.onclick = () => {
      window.location.hash = 'admin';
    };
  } else {
    adminBtn.textContent = '管理者登入';
    adminBtn.onclick = showAdminModal;
  }
}

/**
 * 顯示管理者登入 Modal
 */
function showAdminModal() {
  const modal = getElement('#adminModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * 隱藏管理者登入 Modal
 */
function hideAdminModal() {
  const modal = getElement('#adminModal');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // 清空表單
  const form = getElement('#adminLoginForm');
  if (form) {
    form.reset();
  }
  
  // 清空錯誤訊息
  const errorDiv = getElement('#loginError');
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
}

// ============================================================================
// Event Listeners
// ============================================================================

/**
 * 初始化事件監聽
 */
function initEventListeners() {
  // 關閉 Modal
  const closeBtn = getElement('#closeModal');
  if (closeBtn) {
    closeBtn.onclick = hideAdminModal;
  }
  
  // 點擊 Modal 外部關閉
  const modal = getElement('#adminModal');
  if (modal) {
    modal.onclick = (event) => {
      if (event.target === modal) {
        hideAdminModal();
      }
    };
  }
  
  // 管理者登入表單
  const loginForm = getElement('#adminLoginForm');
  if (loginForm) {
    loginForm.onsubmit = handleAdminLogin;
  }
  
  console.log('Event listeners initialized');
}

// ============================================================================
// Page-Specific Functions
// ============================================================================

/**
 * 載入錢龜介紹內容
 */
async function loadTurtleIntroContent() {
  const container = getElement('#turtleIntroContent');
  if (!container) return;
  
  try {
    const response = await fetch('content/turtle-intro.json');
    if (!response.ok) throw new Error('Failed to load content');
    
    const data = await response.json();
    
    // 建立內容 HTML
    let html = '';
    
    data.sections.forEach(section => {
      html += `
        <section class="intro-section" id="${section.id}">
          <h3>${section.title}</h3>
          <div class="section-content">
            ${section.content.map(para => `<p>${para}</p>`).join('')}
          </div>
        </section>
      `;
    });
    
    // CTA 區塊
    html += `
      <div class="cta-section">
        <h3>${data.cta.title}</h3>
        <p>${data.cta.description}</p>
        <a href="${data.cta.buttonLink}" class="btn btn-primary">${data.cta.buttonText}</a>
      </div>
    `;
    
    container.innerHTML = html;
    container.classList.remove('loading');
    
  } catch (error) {
    console.error('Error loading turtle intro:', error);
    container.innerHTML = '<p class="error">載入內容時發生錯誤，請重新整理頁面。</p>';
    container.classList.remove('loading');
  }
}

/**
 * 載入贊助名單
 */
async function loadSponsorList() {
  const container = getElement('#sponsorListContent');
  if (!container) return;
  
  // Demo 模式：顯示範例資料
  if (!isFirebaseConfigured) {
    displayDemoSponsorList(container);
    return;
  }
  
  try {
    const sponsorsRef = ref(database, 'sponsors');
    const snapshot = await get(sponsorsRef);
    
    if (!snapshot.exists()) {
      container.innerHTML = '<p class="text-center text-muted">目前尚無贊助資料</p>';
      container.classList.remove('loading');
      return;
    }
    
    const sponsors = [];
    snapshot.forEach(childSnapshot => {
      sponsors.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // 按金額分類
    const categories = {
      diamond: sponsors.filter(s => s.amount >= 100000),
      gold: sponsors.filter(s => s.amount >= 50000 && s.amount < 100000),
      silver: sponsors.filter(s => s.amount >= 10000 && s.amount < 50000),
      bronze: sponsors.filter(s => s.amount < 10000)
    };
    
    let html = '';
    
    // 鑽石級贊助
    if (categories.diamond.length > 0) {
      html += '<div class="sponsor-category diamond-sponsors">';
      html += '<h3>💎 鑽石級贊助（10萬元以上）</h3>';
      html += '<div class="sponsor-grid">';
      categories.diamond.forEach(sponsor => {
        html += `
          <div class="sponsor-item diamond">
            <div class="sponsor-name">${sponsor.name || '匿名'}</div>
            <div class="sponsor-amount">NT$ ${sponsor.amount.toLocaleString()}</div>
            ${sponsor.message ? `<div class="sponsor-message">${sponsor.message}</div>` : ''}
          </div>
        `;
      });
      html += '</div></div>';
    }
    
    // 金級贊助
    if (categories.gold.length > 0) {
      html += '<div class="sponsor-category gold-sponsors">';
      html += '<h3>🥇 金級贊助（5萬～10萬元）</h3>';
      html += '<div class="sponsor-grid">';
      categories.gold.forEach(sponsor => {
        html += `
          <div class="sponsor-item gold">
            <div class="sponsor-name">${sponsor.name || '匿名'}</div>
            <div class="sponsor-amount">NT$ ${sponsor.amount.toLocaleString()}</div>
            ${sponsor.message ? `<div class="sponsor-message">${sponsor.message}</div>` : ''}
          </div>
        `;
      });
      html += '</div></div>';
    }
    
    // 銀級贊助
    if (categories.silver.length > 0) {
      html += '<div class="sponsor-category silver-sponsors">';
      html += '<h3>🥈 銀級贊助（1萬～5萬元）</h3>';
      html += '<div class="sponsor-list">';
      categories.silver.forEach(sponsor => {
        html += `<div class="sponsor-item-small">${sponsor.name || '匿名'} NT$ ${sponsor.amount.toLocaleString()}</div>`;
      });
      html += '</div></div>';
    }
    
    // 銅級贊助
    if (categories.bronze.length > 0) {
      html += '<div class="sponsor-category bronze-sponsors">';
      html += '<h3>🥉 銅級贊助（1萬元以下）</h3>';
      html += '<div class="sponsor-list">';
      categories.bronze.forEach(sponsor => {
        html += `<div class="sponsor-item-small">${sponsor.name || '匿名'} NT$ ${sponsor.amount.toLocaleString()}</div>`;
      });
      html += '</div></div>';
    }
    
    container.innerHTML = html;
    container.classList.remove('loading');
    
  } catch (error) {
    console.error('Error loading sponsors:', error);
    container.innerHTML = '<p class="error">載入贊助名單時發生錯誤，請重新整理頁面。</p>';
    container.classList.remove('loading');
  }
}

/**
 * 顯示示範贊助名單
 */
function displayDemoSponsorList(container) {
  const html = `
    <div class="sponsor-category diamond-sponsors">
      <h3>💎 鑽石級贊助（10萬元以上）</h3>
      <div class="sponsor-grid">
        <div class="sponsor-item diamond">
          <div class="sponsor-name">○○企業股份有限公司</div>
          <div class="sponsor-amount">NT$ 200,000</div>
          <div class="sponsor-message">祈求風調雨順，國泰民安</div>
        </div>
      </div>
    </div>
    
    <div class="sponsor-category gold-sponsors">
      <h3>🥇 金級贊助（5萬～10萬元）</h3>
      <div class="sponsor-grid">
        <div class="sponsor-item gold">
          <div class="sponsor-name">△△建設有限公司</div>
          <div class="sponsor-amount">NT$ 80,000</div>
        </div>
        <div class="sponsor-item gold">
          <div class="sponsor-name">□□貿易股份有限公司</div>
          <div class="sponsor-amount">NT$ 60,000</div>
        </div>
      </div>
    </div>
    
    <div class="sponsor-category silver-sponsors">
      <h3>🥈 銀級贊助（1萬～5萬元）</h3>
      <div class="sponsor-list">
        <div class="sponsor-item-small">王○○先生 NT$ 30,000</div>
        <div class="sponsor-item-small">李○○女士 NT$ 20,000</div>
        <div class="sponsor-item-small">陳○○先生 NT$ 15,000</div>
        <div class="sponsor-item-small">林○○女士 NT$ 10,000</div>
      </div>
    </div>
    
    <div class="sponsor-category bronze-sponsors">
      <h3>🥉 銅級贊助（1萬元以下）</h3>
      <div class="sponsor-list">
        <div class="sponsor-item-small">張○○ NT$ 5,000</div>
        <div class="sponsor-item-small">黃○○ NT$ 3,000</div>
        <div class="sponsor-item-small">吳○○ NT$ 2,000</div>
        <div class="sponsor-item-small">周○○ NT$ 1,000</div>
        <div class="sponsor-item-small">鄭○○ NT$ 1,000</div>
      </div>
    </div>
    
    <p class="demo-notice text-center text-muted" style="margin-top: 2rem;">
      <strong>Demo 模式</strong>：以上為示範資料，實際資料需要 Firebase 設定
    </p>
  `;
  
  container.innerHTML = html;
  container.classList.remove('loading');
}

/**
 * 初始化報名表單
 */
function initRegistrationForm() {
  const form = getElement('#registrationForm');
  if (!form) return;
  
  form.addEventListener('submit', handleRegistrationSubmit);
  
  // 即時驗證
  const nameInput = getElement('#regName');
  const phoneInput = getElement('#regPhone');
  
  if (nameInput) {
    nameInput.addEventListener('blur', () => validateNameField(nameInput));
  }
  
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => validatePhoneField(phoneInput));
  }
  
  // 監聽招財錢龜選擇，限制最多3個
  const turtleCheckboxes = document.querySelectorAll('input[name="turtle"]');
  turtleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const checkedCount = document.querySelectorAll('input[name="turtle"]:checked').length;
      const errorElement = getElement('#turtleError');
      
      if (checkedCount > 3) {
        checkbox.checked = false;
        if (errorElement) {
          errorElement.textContent = '最多只能選擇 3 個招財錢龜';
          setTimeout(() => {
            errorElement.textContent = '';
          }, 3000);
        }
      } else {
        if (errorElement) errorElement.textContent = '';
      }
    });
  });
}

/**
 * 驗證姓名欄位
 * @param {HTMLElement} input - 輸入欄位
 */
function validateNameField(input) {
  const name = input.value.trim();
  const errorElement = getElement('#nameError');
  
  if (!name) {
    if (errorElement) errorElement.textContent = '請輸入姓名';
    return false;
  }
  
  if (!validateName(name)) {
    if (errorElement) errorElement.textContent = '姓名格式不正確（2-50字元，中英文符號）';
    return false;
  }
  
  if (errorElement) errorElement.textContent = '';
  return true;
}

/**
 * 驗證電話欄位
 * @param {HTMLElement} input - 輸入欄位
 */
function validatePhoneField(input) {
  const phone = input.value.trim();
  const errorElement = getElement('#phoneError');
  
  if (!phone) {
    if (errorElement) errorElement.textContent = '請輸入電話號碼';
    return false;
  }
  
  if (!validatePhone(phone)) {
    if (errorElement) errorElement.textContent = '電話格式不正確（例如：0912345678）';
    return false;
  }
  
  if (errorElement) errorElement.textContent = '';
  return true;
}

/**
 * 驗證招財錢龜選擇
 */
function validateTurtleSelection() {
  const checkedBoxes = document.querySelectorAll('input[name="turtle"]:checked');
  const errorElement = getElement('#turtleError');
  
  if (checkedBoxes.length === 0) {
    if (errorElement) errorElement.textContent = '請至少選擇 1 個招財錢龜';
    return false;
  }
  
  if (checkedBoxes.length > 3) {
    if (errorElement) errorElement.textContent = '最多只能選擇 3 個招財錢龜';
    return false;
  }
  
  if (errorElement) errorElement.textContent = '';
  return true;
}

/**
 * 處理報名表單提交
 * @param {Event} event - 表單提交事件
 */
async function handleRegistrationSubmit(event) {
  event.preventDefault();
  
  const nameInput = getElement('#regName');
  const phoneInput = getElement('#regPhone');
  const messagesDiv = getElement('#formMessages');
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  if (!nameInput || !phoneInput || !messagesDiv) return;
  
  // 清除舊訊息
  messagesDiv.innerHTML = '';
  
  // 驗證所有欄位
  const nameValid = validateNameField(nameInput);
  const phoneValid = validatePhoneField(phoneInput);
  const turtleValid = validateTurtleSelection();
  
  if (!nameValid || !phoneValid || !turtleValid) {
    showErrorMessage('請修正表單錯誤後再提交', messagesDiv);
    return;
  }
  
  // 準備資料
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const selectedTurtles = Array.from(document.querySelectorAll('input[name="turtle"]:checked'))
    .map(cb => cb.value);
  const timestamp = Date.now();
  const createdAt = getCurrentISOTime();
  
  // 顯示載入狀態
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
  }
  
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured || database._isDemoMode) {
      throw new Error('FIREBASE_NOT_CONFIGURED');
    }
    
    // 建立報名資料
    const registrationData = {
      name,
      phone,
      selectedTurtles,
      turtleCount: selectedTurtles.length,
      timestamp,
      createdAt
    };
    
    // 儲存到 Firebase
    const registrationsRef = ref(database, 'registrations');
    const newRegistrationRef = push(registrationsRef);
    await set(newRegistrationRef, registrationData);
    
    // 顯示成功訊息
    showSuccessMessage('報名成功！感謝您的參與，期待在元宵節見到您！', messagesDiv);
    
    // 清空表單
    nameInput.value = '';
    phoneInput.value = '';
    document.querySelectorAll('input[name="turtle"]:checked').forEach(cb => cb.checked = false);
    getElement('#nameError').textContent = '';
    getElement('#phoneError').textContent = '';
    getElement('#turtleError').textContent = '';
    
    // 滾動到成功訊息
    messagesDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMsg = '報名失敗，請稍後再試。';
    if (error.message === 'FIREBASE_NOT_CONFIGURED') {
      errorMsg = '⚠️ Firebase 尚未設定。請先完成 Firebase 設定才能使用報名功能。\n\n請參考 docs/firebase-setup-guide.md 進行設定。';
    } else if (error.message && error.message.includes('YOUR_API_KEY')) {
      errorMsg = '⚠️ Firebase 尚未設定。請先完成 Firebase 設定才能使用報名功能。\n\n請參考 docs/firebase-setup-guide.md 進行設定。';
    } else if (error.code === 'PERMISSION_DENIED') {
      errorMsg = '權限不足，請確認 Firebase 安全性規則是否正確設定。';
    } else if (!navigator.onLine) {
      errorMsg = '網路連線中斷，請檢查網路後再試。';
    } else if (error.message) {
      errorMsg = `報名失敗：${error.message}`;
    }
    
    showErrorMessage(errorMsg, messagesDiv);
  } finally {
    // 恢復按鈕狀態
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '提交報名';
    }
  }
}

// ============================================================================
// Admin Functions
// ============================================================================

// 自動登出計時器
let autoLogoutTimer = null;

/**
 * 初始化管理者登入表單
 */
function initAdminLoginForm() {
  const form = getElement('#adminLoginForm');
  if (!form) {
    console.error('Admin login form not found');
    return;
  }
  
  console.log('Admin login form initialized');
  form.addEventListener('submit', handleAdminLogin);
}

/**
 * 處理管理者登入
 * @param {Event} event - 表單提交事件
 */
async function handleAdminLogin(event) {
  event.preventDefault();
  console.log('Login form submitted');
  
  const emailInput = document.querySelector('#adminEmail');
  const passwordInput = document.querySelector('#adminPassword');
  let messagesDiv = document.querySelector('#loginMessages');
  const submitBtn = event.target.querySelector('button[type="submit"]');
  
  // 如果找不到 messagesDiv，創建一個
  if (!messagesDiv) {
    messagesDiv = document.createElement('div');
    messagesDiv.id = 'loginMessages';
    messagesDiv.className = 'messages';
    event.target.appendChild(messagesDiv);
  }
  
  if (!emailInput || !passwordInput) {
    console.error('Email or password input not found');
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // 清除舊訊息
  messagesDiv.innerHTML = '';
  
  // 驗證欄位
  if (!email || !password) {
    showErrorMessage('請輸入帳號和密碼', messagesDiv);
    return;
  }
  
  // 禁用按鈕，顯示載入狀態
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '登入中...';
  }
  
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured || auth._isDemoMode) {
      throw new Error('⚠️ Firebase 尚未設定。請先完成 Firebase 設定才能使用管理者功能。\n\n請參考 docs/firebase-setup-guide.md 進行設定。');
    }
    
    // 使用 Firebase Authentication 登入
    await signInWithEmailAndPassword(auth, email, password);
    
    // 登入成功，導向後台
    showSuccessMessage('登入成功！', messagesDiv);
    setTimeout(() => {
      window.location.hash = 'admin';
    }, 500);
    
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMsg = '登入失敗，請重試。';
    if (error.code === 'auth/invalid-email') {
      errorMsg = 'Email 格式不正確';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMsg = '帳號或密碼錯誤';
    } else if (error.code === 'auth/too-many-requests') {
      errorMsg = '嘗試次數過多，請稍後再試';
    } else if (error.code === 'auth/invalid-credential') {
      errorMsg = '帳號或密碼錯誤';
    }
    
    showErrorMessage(errorMsg, messagesDiv);
  } finally {
    // 恢復按鈕狀態
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '登入';
    }
  }
}

/**
 * 檢查管理者認證狀態
 */
function checkAdminAuth() {
  if (!currentUser) {
    // 未登入，導向登入頁面
    showErrorMessage('請先登入', getElement('#adminMessages'));
    setTimeout(() => {
      window.location.hash = 'admin-login';
    }, 1000);
    return;
  }
  
  // 已登入，載入報名資料
  loadRegistrations();
  initAdminEventListeners();
  startAutoLogoutTimer();
}

/**
 * 初始化管理者頁面事件監聽
 */
function initAdminEventListeners() {
  const saveAllBtn = getElement('#saveAllBtn');
  const exportBtn = getElement('#exportCSVBtn');
  const logoutBtn = getElement('#logoutBtn');
  const dateFilterInput = getElement('#dateFilter');
  const nameFilterInput = getElement('#nameFilter');
  const turtleFilterSelect = getElement('#turtleFilter');
  const statusFilterSelect = getElement('#statusFilter');
  
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', handleSaveAll);
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', handleExportCSV);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleAdminLogout);
  }
  
  if (dateFilterInput) {
    dateFilterInput.addEventListener('change', () => {
      loadRegistrations();
    });
  }
  
  if (nameFilterInput) {
    nameFilterInput.addEventListener('input', () => {
      loadRegistrations();
    });
  }
  
  if (turtleFilterSelect) {
    turtleFilterSelect.addEventListener('change', () => {
      loadRegistrations();
    });
  }
  
  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', () => {
      loadRegistrations();
    });
  }
}

// 儲存所有報名資料供篩選使用
let allRegistrations = [];

// 追蹤已處理狀態的變更
let processedStatusChanges = {};

/**
 * 載入報名資料
 */
function loadRegistrations() {
  const tableBody = getElement('#registrationsTableBody');
  if (!tableBody) return;
  
  // 監聽 Firebase Realtime Database 的報名資料
  const registrationsRef = ref(database, 'registrations');
  
  onValue(registrationsRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) {
      tableBody.innerHTML = '<tr><td colspan="7" class="no-data">尚無報名資料</td></tr>';
      allRegistrations = [];
      updateStats([], []);
      return;
    }
    
    // 轉換為陣列並排序（最新的在前）
    allRegistrations = Object.entries(data).map(([id, reg]) => ({
      id,
      ...reg,
      processed: reg.processed || false
    })).sort((a, b) => b.timestamp - a.timestamp);
    
    // 取得所有篩選條件
    const dateFilterInput = getElement('#dateFilter');
    const nameFilterInput = getElement('#nameFilter');
    const turtleFilterSelect = getElement('#turtleFilter');
    const statusFilterSelect = getElement('#statusFilter');
    
    const selectedDate = dateFilterInput ? dateFilterInput.value : '';
    const nameSearch = nameFilterInput ? nameFilterInput.value.trim().toLowerCase() : '';
    const selectedTurtle = turtleFilterSelect ? turtleFilterSelect.value : '';
    const selectedStatus = statusFilterSelect ? statusFilterSelect.value : '';
    
    // 篩選資料
    let filteredRegistrations = allRegistrations;
    
    // 日期篩選
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filteredRegistrations = filteredRegistrations.filter(reg => {
        const regDate = new Date(reg.timestamp);
        return regDate >= filterDate && regDate < nextDay;
      });
    }
    
    // 姓名篩選
    if (nameSearch) {
      filteredRegistrations = filteredRegistrations.filter(reg => 
        reg.name.toLowerCase().includes(nameSearch)
      );
    }
    
    // 招財錢龜篩選
    if (selectedTurtle) {
      filteredRegistrations = filteredRegistrations.filter(reg => 
        reg.selectedTurtles && reg.selectedTurtles.includes(selectedTurtle)
      );
    }
    
    // 處理狀態篩選
    if (selectedStatus === 'processed') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.processed === true);
    } else if (selectedStatus === 'unprocessed') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.processed !== true);
    }
    
    // 渲染表格
    renderRegistrationsTable(filteredRegistrations);
    
    // 找出重複報名
    const duplicates = findDuplicateRegistrations(filteredRegistrations);
    
    // 更新統計
    updateStats(filteredRegistrations, duplicates);
  }, (error) => {
    console.error('Error loading registrations:', error);
    tableBody.innerHTML = '<tr><td colspan="7" class="error">載入資料失敗</td></tr>';
  });
}

/**
 * 渲染報名清單表格
 * @param {Array} registrations - 報名資料陣列
 */
function renderRegistrationsTable(registrations) {
  const tableBody = getElement('#registrationsTableBody');
  if (!tableBody) return;
  
  const duplicatePhones = findDuplicatePhones(registrations);
  
  const html = registrations.map((reg, index) => {
    const isDuplicate = duplicatePhones.has(reg.phone);
    const isProcessed = reg.processed === true;
    
    // 格式化招財錢龜選項
    const turtles = reg.selectedTurtles && Array.isArray(reg.selectedTurtles) 
      ? reg.selectedTurtles.join('、') 
      : '未選擇';
    
    // 生成唯一編號（使用 Firebase ID 的最後 6 碼）
    const displayId = reg.id.slice(-6).toUpperCase();
    
    return `
      <tr class="${isProcessed ? 'processed' : ''}">
        <td class="id-cell">#${displayId}</td>
        <td>${escapeHtml(reg.name)}</td>
        <td>${escapeHtml(reg.phone)}</td>
        <td class="turtle-cell">${escapeHtml(turtles)}</td>
        <td>${formatTimestamp(reg.timestamp)}</td>
        <td class="checkbox-cell">
          <input type="checkbox" 
                 id="processed_${reg.id}" 
                 ${isProcessed ? 'checked' : ''}
                 onchange="toggleProcessed('${reg.id}', this.checked)"
                 class="processed-checkbox">
          <label for="processed_${reg.id}" class="checkbox-label-inline">
            ${isProcessed ? '✅ 已處理' : '⏳ 未處理'}
          </label>
        </td>
        <td class="action-cell">
          <button class="btn-delete" onclick="deleteRegistration('${reg.id}')" title="刪除此筆報名">
            🗑️ 刪除
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  tableBody.innerHTML = html;
}

/**
 * 找出重複的電話號碼
 * @param {Array} registrations - 報名資料陣列
 * @returns {Set} 重複的電話號碼集合
 */
function findDuplicatePhones(registrations) {
  const phoneCount = {};
  const duplicates = new Set();
  
  registrations.forEach(reg => {
    phoneCount[reg.phone] = (phoneCount[reg.phone] || 0) + 1;
  });
  
  Object.entries(phoneCount).forEach(([phone, count]) => {
    if (count > 1) {
      duplicates.add(phone);
    }
  });
  
  return duplicates;
}

/**
 * 找出重複報名的紀錄
 * @param {Array} registrations - 報名資料陣列
 * @returns {Array} 重複報名的紀錄
 */
function findDuplicateRegistrations(registrations) {
  const duplicatePhones = findDuplicatePhones(registrations);
  return registrations.filter(reg => duplicatePhones.has(reg.phone));
}

/**
 * 更新統計數據
 * @param {Array} registrations - 所有報名資料
 * @param {Array} duplicates - 重複報名資料
 */
function updateStats(registrations, duplicates) {
  const totalCountEl = getElement('#totalCount');
  const todayCountEl = getElement('#todayCount');
  const processedCountEl = getElement('#processedCount');
  const unprocessedCountEl = getElement('#unprocessedCount');
  
  if (totalCountEl) {
    totalCountEl.textContent = registrations.length;
  }
  
  if (todayCountEl) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const todayRegs = registrations.filter(reg => reg.timestamp >= todayTimestamp);
    todayCountEl.textContent = todayRegs.length;
  }
  
  if (processedCountEl) {
    const processedRegs = registrations.filter(reg => reg.processed === true);
    processedCountEl.textContent = processedRegs.length;
  }
  
  if (unprocessedCountEl) {
    const unprocessedRegs = registrations.filter(reg => reg.processed !== true);
    unprocessedCountEl.textContent = unprocessedRegs.length;
  }
}

/**
 * 處理 CSV 匯出
 */
function handleExportCSV() {
  const registrationsRef = ref(database, 'registrations');
  
  get(registrationsRef).then((snapshot) => {
    const data = snapshot.val();
    
    if (!data) {
      alert('目前沒有報名資料可匯出');
      return;
    }
    
    // 轉換為陣列
    const registrations = Object.entries(data).map(([id, reg]) => {
      const turtles = reg.selectedTurtles && Array.isArray(reg.selectedTurtles) 
        ? reg.selectedTurtles.join('、') 
        : '未選擇';
      
      return {
        編號: id,
        姓名: reg.name,
        電話: reg.phone,
        選擇的招財錢龜: turtles,
        報名時間: formatTimestamp(reg.timestamp)
      };
    });
    
    // 轉換為 CSV
    const csv = convertToCSV(registrations);
    
    // 下載檔案
    const timestamp = formatTimestamp(Date.now()).replace(/[/:]/g, '-').replace(/ /g, '_');
    downloadFile(csv, `報名清單_${timestamp}.csv`, 'text/csv;charset=utf-8;');
    
    showSuccessMessage('CSV 匯出成功！', getElement('#adminMessages'));
  }).catch((error) => {
    console.error('Export error:', error);
    showErrorMessage('匯出失敗，請重試', getElement('#adminMessages'));
  });
}

/**
 * 切換已處理狀態
 * @param {string} registrationId - 報名記錄 ID
 * @param {boolean} isProcessed - 是否已處理
 */
function toggleProcessed(registrationId, isProcessed) {
  processedStatusChanges[registrationId] = isProcessed;
  
  // 更新標籤文字
  const label = document.querySelector(`label[for="processed_${registrationId}"]`);
  if (label) {
    label.textContent = isProcessed ? '✅ 已處理' : '⏳ 未處理';
  }
  
  // 更新行樣式
  const checkbox = document.getElementById(`processed_${registrationId}`);
  if (checkbox) {
    const row = checkbox.closest('tr');
    if (row) {
      if (isProcessed) {
        row.classList.add('processed');
      } else {
        row.classList.remove('processed');
      }
    }
  }
  
  // 顯示提示訊息
  const messagesDiv = getElement('#adminMessages');
  if (messagesDiv) {
    showSuccessMessage('請點擊「💾 儲存所有變更」按鈕以保存變更', messagesDiv);
    
    // 3 秒後自動清除訊息
    setTimeout(() => {
      messagesDiv.innerHTML = '';
    }, 3000);
  }
}

/**
 * 儲存所有已處理狀態變更
 */
async function handleSaveAll() {
  const messagesDiv = getElement('#adminMessages');
  const saveBtn = getElement('#saveAllBtn');
  
  if (Object.keys(processedStatusChanges).length === 0) {
    showErrorMessage('沒有需要儲存的變更', messagesDiv);
    return;
  }
  
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span> 儲存中...';
  }
  
  try {
    // 批次更新 Firebase
    const updates = {};
    for (const [id, processed] of Object.entries(processedStatusChanges)) {
      updates[`registrations/${id}/processed`] = processed;
    }
    
    await update(ref(database), updates);
    
    // 清空變更記錄
    processedStatusChanges = {};
    
    showSuccessMessage(`成功儲存 ${Object.keys(updates).length} 筆變更！`, messagesDiv);
    
    // 重新載入資料
    setTimeout(() => {
      loadRegistrations();
    }, 1000);
    
  } catch (error) {
    console.error('Save error:', error);
    showErrorMessage('儲存失敗，請重試', messagesDiv);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>💾</span> 儲存所有變更';
    }
  }
}

/**
 * 清除所有篩選條件
 */
function clearAllFilters() {
  const dateFilter = getElement('#dateFilter');
  const nameFilter = getElement('#nameFilter');
  const turtleFilter = getElement('#turtleFilter');
  const statusFilter = getElement('#statusFilter');
  
  if (dateFilter) dateFilter.value = '';
  if (nameFilter) nameFilter.value = '';
  if (turtleFilter) turtleFilter.value = '';
  if (statusFilter) statusFilter.value = '';
  
  loadRegistrations();
}

// 將函數設為全域
window.toggleProcessed = toggleProcessed;
window.clearAllFilters = clearAllFilters;

/**
 * 處理管理者登出
 */
async function handleAdminLogout() {
  if (!confirm('確定要登出嗎？')) {
    return;
  }
  
  try {
    await signOut(auth);
    clearAutoLogoutTimer();
    showSuccessMessage('已登出', getElement('#adminMessages'));
    setTimeout(() => {
      window.location.hash = 'admin-login';
    }, 500);
  } catch (error) {
    console.error('Logout error:', error);
    showErrorMessage('登出失敗', getElement('#adminMessages'));
  }
}

/**
 * 啟動自動登出計時器（30分鐘）
 */
function startAutoLogoutTimer() {
  clearAutoLogoutTimer();
  
  // 30 分鐘 = 1800000 毫秒
  autoLogoutTimer = setTimeout(() => {
    alert('閒置時間過長，系統將自動登出');
    handleAdminLogout();
  }, 30 * 60 * 1000);
}

/**
 * 清除自動登出計時器
 */
function clearAutoLogoutTimer() {
  if (autoLogoutTimer) {
    clearTimeout(autoLogoutTimer);
    autoLogoutTimer = null;
  }
}

/**
 * 刪除報名記錄
 * @param {string} registrationId - 報名記錄 ID
 */
async function deleteRegistration(registrationId) {
  if (!confirm('確定要刪除這筆報名記錄嗎？\n此操作無法復原！')) {
    return;
  }
  
  try {
    const registrationRef = ref(database, `registrations/${registrationId}`);
    await set(registrationRef, null);
    
    showSuccessMessage('報名記錄已刪除', getElement('#adminMessages'));
    
    // 自動清除訊息
    setTimeout(() => {
      const messagesDiv = getElement('#adminMessages');
      if (messagesDiv) messagesDiv.innerHTML = '';
    }, 3000);
  } catch (error) {
    console.error('Delete error:', error);
    showErrorMessage('刪除失敗，請重試', getElement('#adminMessages'));
  }
}

// 將刪除函數設為全域，供 HTML onclick 使用
window.deleteRegistration = deleteRegistration;

/**
 * HTML 跳脫函數
 * @param {string} text - 要跳脫的文字
 * @returns {string} 跳脫後的文字
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// Application Initialization
// ============================================================================

/**
 * 初始化應用程式
 */
function initApp() {
  console.log('Initializing application...');
  
  // 路由系統（必須）
  initRouter();
  
  // Firebase 認證（可選，如果未設定也能運行）
  try {
    initAuth();
  } catch (error) {
    console.warn('Firebase Auth not initialized. Admin features will be disabled.', error);
  }
  
  // 事件監聽（必須）
  initEventListeners();
  
  console.log('Application initialized successfully');
}

// ============================================================================
// Lightbox Functions
// ============================================================================

/**
 * 開啟燈箱放大照片
 */
function openLightbox(imageSrc) {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImage');
  
  if (modal && modalImg) {
    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    modalImg.style.transform = 'scale(1)'; // 重置縮放
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 關閉燈箱
 */
function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.style.display = 'none';
    // 恢復背景滾動
    document.body.style.overflow = 'auto';
  }
}

// 滑鼠滾輪縮放功能
let currentScale = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.1;

function handleLightboxWheel(event) {
  const modalImg = document.getElementById('lightboxImage');
  const modal = document.getElementById('lightboxModal');
  
  if (modal && modal.style.display === 'flex' && modalImg) {
    event.preventDefault();
    
    // 根據滾輪方向調整縮放
    if (event.deltaY < 0) {
      // 向上滾 - 放大
      currentScale = Math.min(currentScale + SCALE_STEP, MAX_SCALE);
    } else {
      // 向下滾 - 縮小
      currentScale = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
    }
    
    modalImg.style.transform = `scale(${currentScale})`;
  }
}

// 重置縮放比例
function resetLightboxScale() {
  currentScale = 1;
}

// 監聽滾輪事件
document.addEventListener('wheel', handleLightboxWheel, { passive: false });

// 讓函數在全域可用
window.openLightbox = function(src) {
  resetLightboxScale();
  openLightbox(src);
};
window.closeLightbox = closeLightbox;

// ============================================================================
// Online Dice Functions (線上擲筊杯)
// ============================================================================

let cupCount = 0;
let isThrowingDice = false;

/**
 * 擲筊杯功能
 */
function throwDice() {
  if (isThrowingDice) return;
  
  isThrowingDice = true;
  const throwBtn = document.getElementById('throwDiceBtn');
  const resultText = document.getElementById('resultText');
  const leftDice = document.getElementById('leftDice');
  const rightDice = document.getElementById('rightDice');
  
  if (throwBtn) throwBtn.disabled = true;
  if (resultText) resultText.textContent = '擲筊中...';
  
  // 動畫效果：快速切換圖片
  let animationCount = 0;
  const animationInterval = setInterval(() => {
    const leftRandom = Math.random() > 0.5;
    const rightRandom = Math.random() > 0.5;
    
    if (leftDice) {
      leftDice.src = leftRandom ? 'images/左邊-正面.png' : 'images/左邊-反面.png';
    }
    if (rightDice) {
      rightDice.src = rightRandom ? 'images/右邊-正面.png' : 'images/右邊-反面.png';
    }
    
    animationCount++;
    if (animationCount >= 10) {
      clearInterval(animationInterval);
      showFinalResult();
    }
  }, 100);
}

/**
 * 顯示最終結果
 */
function showFinalResult() {
  const leftDice = document.getElementById('leftDice');
  const rightDice = document.getElementById('rightDice');
  const resultText = document.getElementById('resultText');
  const cupCountElement = document.getElementById('cupCount');
  const throwBtn = document.getElementById('throwDiceBtn');
  
  // 隨機決定最終結果，85% 機率為聖杯（一正一反）
  const random = Math.random();
  let leftFace, rightFace;
  
  if (random < 0.85) {
    // 85% 機率：聖杯（一正一反）
    leftFace = Math.random() > 0.5;
    rightFace = !leftFace; // 強制相反
  } else {
    // 15% 機率：笑杯或陰杯
    const bothSame = Math.random() > 0.5;
    leftFace = bothSame;
    rightFace = bothSame;
  }
  
  // 設定最終圖片
  if (leftDice) {
    leftDice.src = leftFace ? 'images/左邊-正面.png' : 'images/左邊-反面.png';
  }
  if (rightDice) {
    rightDice.src = rightFace ? 'images/右邊-正面.png' : 'images/右邊-反面.png';
  }
  
  // 判斷結果
  if (leftFace !== rightFace) {
    // 聖杯：一正一反
    cupCount++;
    if (cupCountElement) cupCountElement.textContent = cupCount;
    if (resultText) resultText.textContent = '🎉 聖杯！繼續擲筊';
    if (throwBtn) {
      throwBtn.disabled = false;
      throwBtn.innerHTML = '🙏 擲筊杯';
    }
  } else if (leftFace && rightFace) {
    // 陰杯：兩正
    if (resultText) resultText.textContent = `🌙 陰杯！本次共獲得 ${cupCount} 個聖杯`;
    if (throwBtn) {
      throwBtn.disabled = false;
      throwBtn.innerHTML = '🔄 重新開始';
      throwBtn.onclick = resetDice;
    }
  } else {
    // 笑杯：兩反
    if (resultText) resultText.textContent = `😊 笑杯！本次共獲得 ${cupCount} 個聖杯`;
    if (throwBtn) {
      throwBtn.disabled = false;
      throwBtn.innerHTML = '🔄 重新開始';
      throwBtn.onclick = resetDice;
    }
  }
  
  isThrowingDice = false;
}

/**
 * 重新開始擲筊
 */
function resetDice() {
  cupCount = 0;
  isThrowingDice = false;
  
  const cupCountElement = document.getElementById('cupCount');
  const resultText = document.getElementById('resultText');
  const throwBtn = document.getElementById('throwDiceBtn');
  const leftDice = document.getElementById('leftDice');
  const rightDice = document.getElementById('rightDice');
  
  if (cupCountElement) cupCountElement.textContent = '0';
  if (resultText) resultText.textContent = '請按下「擲筊杯」開始';
  if (throwBtn) {
    throwBtn.disabled = false;
    throwBtn.innerHTML = '🙏 擲筊杯';
    throwBtn.onclick = throwDice;
  }
  if (leftDice) leftDice.src = 'images/左邊-正面.png';
  if (rightDice) rightDice.src = 'images/右邊-正面.png';
}

// 將函數設為全域可用
window.throwDice = throwDice;
window.resetDice = resetDice;

// 當 DOM 載入完成後初始化應用程式
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for testing
export { initApp, loadPage, handleAdminLogin };

