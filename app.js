/**
 * ===================================================================
 *  메인 대시보드 포털 로직 (app.js)
 * ===================================================================
 */

// 애플리케이션 상태
const state = {
  activeDashboardId: null,
  activeCategory: "전체",
  searchQuery: "",
  isSidebarCollapsed: false,
  theme: localStorage.getItem("portal_theme") || APP_CONFIG.defaultTheme || "light",
  favorites: JSON.parse(localStorage.getItem("portal_favorites") || "[]")
};

// DOM 요소 캐시
const DOM = {
  appContainer: document.getElementById("appContainer"),
  sidebar: document.getElementById("sidebar"),
  btnCollapse: document.getElementById("btnCollapse"),
  brandHomeBtn: document.getElementById("brandHomeBtn"),
  portalTitle: document.getElementById("portalTitle"),
  portalSubtitle: document.getElementById("portalSubtitle"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  dashboardList: document.getElementById("dashboardList"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  themeText: document.getElementById("themeText"),
  
  // 메인 뷰어 요소
  currentTitle: document.getElementById("currentTitle"),
  currentDesc: document.getElementById("currentDesc"),
  btnRefresh: document.getElementById("btnRefresh"),
  btnFullscreen: document.getElementById("btnFullscreen"),
  btnNewTab: document.getElementById("btnNewTab"),
  btnHomeNav: document.getElementById("btnHomeNav"),
  btnTogglePin: document.getElementById("btnTogglePin"),
  
  // 뷰어 컨테이너
  viewerContainer: document.getElementById("viewerContainer"),
  dashboardFrame: document.getElementById("dashboardFrame"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  welcomeScreen: document.getElementById("welcomeScreen"),
  cardsGrid: document.getElementById("cardsGrid"),
  toast: document.getElementById("toast")
};

// Lucide 아이콘 SVG 맵 (외부 라이브러리 의존성 없이 가볍게 사용)
const ICONS = {
  "bar-chart": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>`,
  "activity": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  "trending-up": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  "dollar": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  "users": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  "network": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><line x1="5" y1="16" x2="5" y2="12"></line><line x1="19" y1="16" x2="19" y2="12"></line><line x1="5" y1="12" x2="19" y2="12"></line><line x1="12" y1="8" x2="12" y2="12"></line></svg>`,
  "clock": `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  "star": `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  "default": `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`
};

function getIcon(name) {
  return ICONS[name] || ICONS["default"];
}

// 초기화 함수
function init() {
  // 포털 타이틀 적용
  if (DOM.portalTitle) DOM.portalTitle.textContent = APP_CONFIG.portalTitle || "기획 대시보드 HUB";
  if (DOM.portalSubtitle) DOM.portalSubtitle.textContent = APP_CONFIG.portalSubtitle || "VGT Cooperative Dashboard HUB";

  // 테마 초기화
  applyTheme(state.theme);

  // 카테고리 필터 태그 생성
  renderCategoryFilters();

  // 대시보드 목록 생성
  renderDashboardList();

  // 메인 웰컴 그리드 카드 생성
  renderHomeCards();

  // 이벤트 리스너 바인딩
  attachEventListeners();
}

// 테마 적용
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portal_theme", theme);
  
  if (DOM.themeText) {
    DOM.themeText.textContent = theme === "dark" ? "라이트 모드" : "다크 모드";
  }
}

// 카테고리 필터 칩 렌더링
function renderCategoryFilters() {
  const categories = APP_CONFIG.categories || ["전체"];
  
  DOM.categoryFilter.innerHTML = categories.map(cat => `
    <button class="filter-chip ${state.activeCategory === cat ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join("");

  DOM.categoryFilter.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", (e) => {
      state.activeCategory = e.target.dataset.category;
      renderCategoryFilters();
      renderDashboardList();
    });
  });
}

// 사이드바 대시보드 목록 렌더링
function renderDashboardList() {
  let list = APP_CONFIG.dashboards || [];

  // 카테고리 필터링
  if (state.activeCategory !== "전체") {
    list = list.filter(item => item.category === state.activeCategory);
  }

  // 검색어 필터링
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) || 
      (item.description && item.description.toLowerCase().includes(q))
    );
  }

  if (list.length === 0) {
    DOM.dashboardList.innerHTML = `<div style="padding: 16px; font-size: 13px; color: var(--text-muted); text-align: center;">검색 결과가 없습니다.</div>`;
    return;
  }

  DOM.dashboardList.innerHTML = list.map(d => {
    const isActive = d.id === state.activeDashboardId;
    const isFav = state.favorites.includes(d.id);
    return `
      <div class="nav-item ${isActive ? 'active' : ''}" data-id="${d.id}" title="${d.name}">
        <div class="nav-item-icon">${getIcon(d.icon)}</div>
        <div class="nav-item-content">
          <span class="nav-item-title">${d.name}</span>
          <span class="nav-item-cat">${d.category || ''}</span>
        </div>
        ${isFav ? `<div style="color: #f59e0b; display: flex;">${ICONS['star']}</div>` : ''}
        ${d.category ? `<span class="nav-item-badge">${d.category}</span>` : ''}
      </div>
    `;
  }).join("");

  DOM.dashboardList.querySelectorAll(".nav-item").forEach(el => {
    el.addEventListener("click", () => {
      selectDashboard(el.dataset.id);
    });
  });
}

// 메인 웰컴 그리드 카드 렌더링
function renderHomeCards() {
  DOM.cardsGrid.innerHTML = APP_CONFIG.dashboards.map(d => `
    <div class="dashboard-card" data-id="${d.id}">
      <div>
        <div class="card-top">
          <div class="card-icon">
            ${getIcon(d.icon)}
          </div>
          ${d.category ? `<span class="card-badge">${d.category}</span>` : ''}
        </div>
        <div class="card-body">
          <h3>${d.name}</h3>
          <p class="card-desc">${d.description || '대시보드 상세 분석을 제공합니다.'}</p>
          ${d.updateCycle ? `
            <div class="card-update-info">
              ${getIcon('clock')}
              <span>업데이트: ${d.updateCycle}</span>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="card-footer">
        <span>대시보드 열기</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  `).join("");

  DOM.cardsGrid.querySelectorAll(".dashboard-card").forEach(card => {
    card.addEventListener("click", () => {
      selectDashboard(card.dataset.id);
    });
  });
}

// 특정 대시보드 선택 및 Iframe 로드
function selectDashboard(id) {
  const item = APP_CONFIG.dashboards.find(d => d.id === id);
  if (!item) return;

  state.activeDashboardId = id;
  
  // 목록 활성화 표시 갱신
  renderDashboardList();

  // 상단 헤더 정보 표시
  DOM.currentTitle.textContent = item.name;
  DOM.currentDesc.textContent = (item.description || "") + (item.updateCycle ? ` | 업데이트: ${item.updateCycle}` : "");
  
  // 즐겨찾기 버튼 상태 업데이트
  updatePinButtonState();

  // 웰컴 화면 숨기기
  DOM.welcomeScreen.classList.add("hidden");

  // URL이 비어있는 경우 안내 화면 표시
  if (!item.url || item.url.trim() === "") {
    DOM.loadingOverlay.classList.add("hidden");
    DOM.dashboardFrame.removeAttribute("src");
    DOM.dashboardFrame.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8fafc;
            color: #334155;
            text-align: center;
            padding: 24px;
            box-sizing: border-box;
          }
          .box {
            background: #ffffff;
            padding: 40px 32px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.05);
            max-width: 500px;
          }
          .icon {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: #eff6ff;
            color: #2563eb;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          h2 { margin: 0 0 10px; font-size: 20px; color: #0f172a; }
          p { margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.6; }
          code { background: #f1f5f9; padding: 3px 8px; border-radius: 6px; color: #2563eb; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </div>
          <h2>${item.name} 대시보드 준비 중</h2>
          <p>해당 대시보드의 URL이 아직 설정되지 않았습니다.<br><code>config.js</code> 파일의 <code>url</code> 항목에 주소를 입력하세요.</p>
        </div>
      </body>
      </html>
    `;
    return;
  }

  // URL이 있는 경우 Iframe 로드
  DOM.dashboardFrame.removeAttribute("srcdoc");
  DOM.loadingOverlay.classList.remove("hidden");
  DOM.dashboardFrame.src = item.url;
}

// 즐겨찾기 버튼 UI 업데이트
function updatePinButtonState() {
  if (!state.activeDashboardId || !DOM.btnTogglePin) return;
  const isFav = state.favorites.includes(state.activeDashboardId);
  DOM.btnTogglePin.style.color = isFav ? "#f59e0b" : "var(--text-secondary)";
}

// 홈(웰컴) 화면으로 돌아가기
function showHomeScreen() {
  state.activeDashboardId = null;
  renderDashboardList();
  
  DOM.currentTitle.textContent = "";
  DOM.currentDesc.textContent = "";
  
  DOM.welcomeScreen.classList.remove("hidden");
  DOM.dashboardFrame.removeAttribute("srcdoc");
  DOM.dashboardFrame.src = "about:blank";
  DOM.loadingOverlay.classList.add("hidden");
  
  if (DOM.btnTogglePin) {
    DOM.btnTogglePin.style.color = "var(--text-secondary)";
  }
}

// 토스트 알림 표시
function showToast(message) {
  DOM.toast.textContent = message;
  DOM.toast.classList.add("show");
  setTimeout(() => {
    DOM.toast.classList.remove("show");
  }, 2500);
}

// 이벤트 리스너 등록
function attachEventListeners() {
  // 사이드바 접기/펼치기
  DOM.btnCollapse.addEventListener("click", () => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    DOM.sidebar.classList.toggle("collapsed", state.isSidebarCollapsed);
  });

  // 브랜드 클릭 시 홈 화면 이동
  DOM.brandHomeBtn.addEventListener("click", showHomeScreen);
  if (DOM.btnHomeNav) {
    DOM.btnHomeNav.addEventListener("click", showHomeScreen);
  }

  // 실시간 검색
  DOM.searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderDashboardList();
  });

  // 단축키 / 입력 시 검색창 포커스
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== DOM.searchInput) {
      e.preventDefault();
      DOM.searchInput.focus();
    }
  });

  // Iframe 로드 완료 시 로딩 렌더링 제거
  DOM.dashboardFrame.addEventListener("load", () => {
    DOM.loadingOverlay.classList.add("hidden");
  });

  // 새로고침 버튼
  DOM.btnRefresh.addEventListener("click", () => {
    if (!state.activeDashboardId) return;
    const item = APP_CONFIG.dashboards.find(d => d.id === state.activeDashboardId);
    if (!item) return;
    
    DOM.loadingOverlay.classList.remove("hidden");
    DOM.dashboardFrame.src = item.url;
    showToast("대시보드를 새로고침했습니다.");
  });

  // 전체화면 버튼
  DOM.btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      DOM.viewerContainer.requestFullscreen().catch(err => {
        showToast("전체화면 모드를 지원하지 않는 환경입니다.");
      });
    } else {
      document.exitFullscreen();
    }
  });

  // 새 탭에서 열기
  if (DOM.btnNewTab) {
    DOM.btnNewTab.addEventListener("click", () => {
      if (!state.activeDashboardId) {
        showToast("선택된 대시보드가 없습니다.");
        return;
      }
      const item = APP_CONFIG.dashboards.find(d => d.id === state.activeDashboardId);
      if (item && item.url) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      }
    });
  }

  // 즐겨찾기(Pin) 등록/해제
  if (DOM.btnTogglePin) {
    DOM.btnTogglePin.addEventListener("click", () => {
      if (!state.activeDashboardId) return;
      const idx = state.favorites.indexOf(state.activeDashboardId);
      if (idx > -1) {
        state.favorites.splice(idx, 1);
        showToast("즐겨찾기에서 제거되었습니다.");
      } else {
        state.favorites.push(state.activeDashboardId);
        showToast("즐겨찾기에 등록되었습니다.");
      }
      localStorage.setItem("portal_favorites", JSON.stringify(state.favorites));
      updatePinButtonState();
      renderDashboardList();
    });
  }

  // 테마 전환 버튼
  DOM.themeToggleBtn.addEventListener("click", () => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

// DOM 로드 완료 시 애플리케이션 시작
document.addEventListener("DOMContentLoaded", init);
