/**
 * ===================================================================
 *  대시보드 목록 설정 파일 (config.js)
 * ===================================================================
 * 
 * - UI 화면 어디에도 GitHub 계정명이나 소유자 정보가 노출되지 않습니다.
 * - 오직 "대시보드 이름(name)"과 "설명(description)"만 화면에 표시됩니다.
 */

const APP_CONFIG = {
  // 포털 상단 및 타이틀 설정
  portalTitle: "참좋은여행 기획 대시보드 HUB",
  portalSubtitle: "VGT Cooperative Dashboard HUB",
  
  // 기본 테마 ('light' 또는 'dark')
  defaultTheme: "light",

  // 새 탭에서 열기 버튼 노출 여부
  allowOpenInNewTab: true,

  // 고정 카테고리 필터 키워드
  categories: ["전체", "기획", "마케팅", "협력사", "제휴"],

  // 대시보드 목록
  dashboards: [
    {
      id: "route-booking",
      name: "노선별 예약",
      category: "기획",
      description: "노선별 주차별 전년대비 예약 추이",
      updateCycle: "매주 월요일",
      icon: "bar-chart",
      url: "https://hhhvgt000-dot.github.io/route_booking/"
    },
    {
      id: "lead-time",
      name: "리드타임(마케팅)",
      category: "마케팅",
      description: "팀별, 가격대별, 상품별 리드타임, 예약, 객단가",
      updateCycle: "매주 월요일",
      icon: "activity",
      url: "https://hhhvgt000-dot.github.io/leadtime-dashboard-final/"
    },
    {
      id: "wow-booking",
      name: "리드타임(기획)",
      category: "기획",
      description: "주차별 팀별 예약 인원 리드타임",
      updateCycle: "매주 목요일",
      icon: "trending-up",
      url: "https://hhhvgt000-dot.github.io/leadtime-dashboard/"
    },
    {
      id: "profitability-master",
      name: "마스터별 수익성",
      category: "기획",
      description: "마스터별 수익성(정산수익, 인원, 인당수익) 분석",
      updateCycle: "매월 중순~말(정산 완료 시점)",
      icon: "dollar",
      url: "https://hhhvgt000-dot.github.io/master_profitability/"
    },
    {
      id: "partner-arrangements",
      name: "협력사 수배현황",
      category: "협력사",
      description: "협력사별/지역별 인원 수배 및 지상비 지출 현황 분석",
      updateCycle: "매월 중순~말(정산 완료 시점)",
      icon: "users",
      url: "https://pippapap.github.io/land_agent/"
    },
    {
      id: "affiliate-inflow",
      name: "제휴 유입 현황",
      category: "제휴",
      description: "노선별 제휴 채널 유입 인원 및 비중 현황",
      updateCycle: "매월 중순~말(정산 완료 시점)",
      icon: "network",
      url: "" // 배포 후 URL 입력 시 자동 활성화
    }
  ]
};
