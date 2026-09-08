# 🌐 통합 대시보드 인앱 뷰어 허브 (Dashboard Portal)

GitHub 계정 정보나 소유자 ID를 외부에 전혀 노출하지 않고, 오직 **대시보드 이름**만을 기반으로 한 화면에서 모든 대시보드를 자유롭게 전환하며 조회할 수 있는 포털 허브입니다.

---

## 📁 파일 구조
```text
dashboard-portal/
├── index.html       # 메인 포털 레이아웃 및 뷰어 구조
├── styles.css       # 모던 디자인 시스템 (다크/라이트 모드, 반응형, 애니메이션)
├── app.js           # 대시보드 전환, 검색, 전체화면, 즐겨찾기 로직
├── config.js        # 대시보드 이름 및 배포 URL 설정 파일 (핵심!)
└── README.md        # 사용 및 배포 가이드
```

---

## ⚙️ 내 대시보드 추가 및 수정 방법

`config.js` 파일을 열고 `dashboards` 배열에 대시보드 정보만 입력하시면 됩니다:

```javascript
dashboards: [
  {
    id: "sales-2026",                 // 고유 ID (영문/숫자)
    name: "2026 매출 실적 대시보드",     // 화면에 노출될 대시보드 이름 (계정명 X)
    category: "매출 / 영업",           // (선택) 카테고리 태그
    description: "월별 실적 및 매출 지표", // 대시보드 요약 설명
    badge: "핵심",                     // (선택) 우측 상단 배지
    icon: "trending-up",              // 아이콘 (trending-up, users, package, activity, message-square 등)
    url: "https://<내-배포-주소>.github.io/<레포-이름>/"  // 실제 접속할 GitHub Pages 배포 URL
  },
  // 원하는 만큼 계속 추가 가능
]
```

> **보안 & 프라이버시**:
> - 화면의 UI(사이드바, 타이틀, 헤더 등) 어디에도 GitHub 계정명은 노출되지 않습니다.
> - 오직 `name`으로 지정한 대시보드 이름만 세련되게 표시됩니다.

---

## 🚀 실행 및 배포 방법

### 1. 로컬에서 바로 실행하기
* `index.html` 파일을 더블 클릭하여 크롬, 엣지 등 브라우저에서 바로 열 수 있습니다. (별도 설치/서버 불필요)

### 2. GitHub Pages로 무료 호스팅 배포하기 (팀원 공유용)
1. 새로운 GitHub 저장소(예: `dashboard-hub` 또는 `analytics-portal`)를 하나 생성합니다.
2. 위 파일들(`index.html`, `styles.css`, `app.js`, `config.js`)을 push합니다.
3. 해당 레포의 **Settings > Pages**에서 브랜치를 `main`으로 설정하고 저장하면 끝!
4. 생성된 포털 URL(예: `https://<계정>.github.io/dashboard-hub/`) 하나만 즐겨찾기해 두고 모든 대시보드를 관리할 수 있습니다.
