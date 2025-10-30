# 🇰🇷 Kotreet - Korea Street Local Shop Platform

> 한국의 숨겨진 로컬 가게들을 발견하고 공유하는 플랫폼

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/kotreet)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

---

## 📖 목차

- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [빠른 시작](#-빠른-시작)
- [파일 구조](#-파일-구조)
- [사용 방법](#-사용-방법)
- [문서](#-문서)
- [기술 스택](#-기술-스택)
- [라이센스](#-라이센스)

---

## 🎯 소개

**Kotreet**는 한국의 독특하고 매력적인 로컬 가게들을 소개하는 플랫폼입니다.

### 핵심 가치
- 🔍 **발견**: 관광 가이드에 없는 숨겨진 명소
- 🎯 **큐레이션**: 엄선된 지역별 추천 가게
- 🗺️ **편의성**: Google Maps 통합으로 쉬운 길찾기
- 📱 **모바일 최적화**: 언제 어디서나 편리하게

### 대상 사용자
- 🧳 외국인 관광객
- 🇰🇷 한국인 여행자
- 🏪 로컬 비즈니스 소유주
- 📍 지역 탐방을 좋아하는 사람들

---

## ✨ 주요 기능

### 1. 🔥 HOT 가게 시스템
메인 페이지에서 중요한 가게를 우선 노출합니다.

```
특징:
✓ 관리자가 직접 선정
✓ 우선순위 숫자로 정렬 (1, 2, 3...)
✓ 조회수와 독립적으로 작동
```

### 2. ⭐ 지역별 인기 가게
각 지역마다 현지 추천 가게를 큐레이션합니다.

```
지원 지역:
• 홍대 (Hongdae)
• 명동 (Myeongdong)
• 강남 (Gangnam)
• 성수 (Seongsu)
```

### 3. 📂 카테고리별 분류
다양한 카테고리로 가게를 찾을 수 있습니다.

```
카테고리:
• 뷰티 (Beauty)
• 안경점 (Glasses Shop)
• 디저트 카페 (Dessert Cafe)
• 의류 (Clothing)
• 음식점 (Restaurant)
• 굿즈샵 (Goods Shop)
```

### 4. 🗺️ Google Maps 통합
실시간 위치 기반 길찾기 기능을 제공합니다.

```
기능:
✓ 가게 위치 표시
✓ 현재 위치에서 길찾기
✓ 대중교통 경로 안내
```

### 5. 💼 관리자 페이지
웹 기반 CMS로 가게 정보를 쉽게 관리합니다.

```
기능:
✓ 가게 추가/수정/삭제
✓ HOT 가게 설정
✓ 지역별 인기 가게 설정
✓ 데이터 백업/복원 (JSON)
```

---

## 🚀 빠른 시작

### 1. 파일 다운로드
```bash
# 모든 파일을 웹 서버 루트에 복사
- *.html
- *.js
- *.css
- /img/ (이미지 폴더)
```

### 2. 웹 서버 실행
```bash
# 로컬 테스트 (Python)
python -m http.server 8000

# 또는 Node.js
npx serve .

# 접속
http://localhost:8000
```

### 3. 관리자 페이지 접속
```
http://localhost:8000/admin.html
```

### 4. 가게 추가
```
1. [가게 추가] 탭 클릭
2. 필수 정보 입력
3. [가게 추가] 버튼 클릭
4. 메인 페이지에서 확인
```

---

## 📁 파일 구조

```
kotreet/
│
├── 📄 index.html                    # 메인 페이지
├── 📄 admin.html                    # 관리자 페이지
├── 📄 category.html                 # 지역별 페이지
├── 📄 category_type.html            # 카테고리별 페이지
├── 📄 category_all.html             # 전체 가게 보기
├── 📄 detail.html                   # 가게 상세 페이지
│
├── 📜 app.js                        # 메인 로직
├── 📜 admin.js                      # 관리자 로직
├── 📜 category.js                   # 지역 페이지 로직
├── 📜 category_type.js              # 카테고리 로직
├── 📜 category_all.js               # 전체 목록 로직
├── 📜 detail.js                     # 상세 페이지 로직
│
├── 🎨 styles.css                    # 전역 스타일
│
├── 📁 img/                          # 이미지 폴더
│   ├── logo.png
│   ├── main_*.jpg
│   ├── icn_*.png
│   └── ...
│
└── 📚 docs/                         # 문서 폴더
    ├── PROJECT_SUMMARY.md           # 프로젝트 개요
    ├── ADMIN_GUIDE.md               # 관리자 가이드
    └── README.md                    # 이 파일
```

---

## 📱 사용 방법

### 사용자 플로우

```
[메인 페이지]
    ↓
[지역 선택] → 홍대/명동/강남/성수
    ↓
[지역 페이지]
    ├── 🔥 인기 가게 (상단)
    └── 📂 카테고리별 가게
        ↓
    [가게 상세]
        ├── 📷 이미지 갤러리
        ├── 💰 가격 정보
        ├── 🏷️ 특징 (분위기/언어/결제)
        └── 🗺️ 지도 + 길찾기
```

### 관리자 플로우

```
[관리자 페이지]
    ├── [가게 추가] 탭
    │   ├── 기본 정보 입력
    │   ├── ✅ HOT 설정
    │   ├── ⭐ 지역별 인기 설정
    │   └── [저장]
    │
    ├── [가게 관리] 탭
    │   └── 수정/삭제
    │
    └── [데이터 관리] 탭
        ├── 📥 JSON 백업
        └── 📤 JSON 복원
```

---

## 📚 문서

| 문서 | 설명 | 링크 |
|------|------|------|
| 프로젝트 개요 | 전체 구조와 기능 설명 | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) |
| 관리자 가이드 | HOT/인기 가게 설정 방법 | [ADMIN_GUIDE.md](ADMIN_GUIDE.md) |
| README | 이 파일 | [README.md](README.md) |

---

## 🛠 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)** - Vanilla JS
- **Google Maps API** - 지도 및 길찾기

### Storage
- **LocalStorage** - 클라이언트 사이드 데이터 저장
- **JSON** - 데이터 포맷

### Design
- **Noto Sans KR** - 한글 웹폰트
- **Material Design** - 아이콘 스타일
- **Responsive Design** - 모바일 퍼스트

---

## 🎨 디자인 컨셉

### Color Palette
```css
Primary:    #000000 (검정)
Secondary:  #FFFFFF (흰색)
Accent:     #FF4444 (레드)
Gray:       #6C757D
Background: #F8F9FA
```

### Typography
```css
Font Family: 'Noto Sans KR', sans-serif
Weights:     400 (Regular), 600 (SemiBold), 700 (Bold)
```

### Breakpoints
```css
Mobile:  0~767px
Tablet:  768~1023px
Desktop: 1024px+
```

---

## 📊 데이터 구조

### 가게 객체 (Shop Object)
```javascript
{
  // 기본 정보
  id: Number,                    // 고유 ID
  name: String,                  // 가게명
  category: String,              // 카테고리
  location: String,              // 지역
  
  // 가격
  price: Number,                 // 최소 가격
  priceMax: Number,              // 최대 가격
  
  // 이미지
  thumbnail: String,             // 썸네일 (800x800)
  mainImage: String,             // 메인 이미지 (880x1280)
  images: Array<String>,         // 추가 이미지들
  video: String,                 // 동영상 URL
  
  // 특징
  mood: String,                  // 분위기 (busy/quiet)
  communication: String,         // 언어 (KR/EN/JP...)
  payment: String,               // 결제 (both/cash)
  
  // 위치
  locationDetail: String,        // 상세 위치
  latitude: Number,              // 위도
  longitude: Number,             // 경도
  
  // 기타
  hours: String,                 // 영업시간
  description: String,           // 소개
  
  // 통계/설정
  views: Number,                 // 조회수
  isHot: Boolean,                // HOT 가게 여부
  hotOrder: Number,              // HOT 우선순위
  regionOrder: Number,           // 지역별 인기 순서
  createdAt: String              // 생성 일시 (ISO)
}
```

---

## 🔒 보안

### 구현된 보안 기능
- ✅ HTML Escaping (XSS 방지)
- ✅ Content Security Policy
- ✅ Input Validation

### 권장 추가 보안 (프로덕션)
- 🔐 Admin 페이지 인증
- 🔐 HTTPS 강제
- 🔐 Rate Limiting
- 🔐 CSRF Protection

---

## 🚀 배포

### 정적 호스팅 (권장)
```
✓ Netlify
✓ Vercel
✓ GitHub Pages
✓ AWS S3 + CloudFront
```

### 전통적인 웹 서버
```
✓ Apache
✓ Nginx
```

### 배포 전 체크리스트
- [ ] Google Maps API 키 발급
- [ ] 이미지 파일 업로드
- [ ] 초기 데이터 입력
- [ ] 관리자 페이지 보안 설정
- [ ] HTTPS 인증서 설정
- [ ] 도메인 연결

---

## 🐛 알려진 이슈

### 현재 제한사항
1. **LocalStorage 한계**
   - 용량: ~5-10MB
   - 해결: 대용량은 백엔드 DB 필요

2. **관리자 인증 없음**
   - 누구나 admin.html 접근 가능
   - 해결: 서버 사이드 인증 추가 필요

3. **다국어 미지원**
   - 현재 한국어만 지원
   - 해결: i18n 라이브러리 추가 예정

---

## 🗺️ 로드맵

### v1.1 (예정)
- [ ] 사용자 리뷰 시스템
- [ ] 즐겨찾기 기능
- [ ] 관리자 로그인

### v1.2 (예정)
- [ ] 다국어 지원 (EN/JP/CH)
- [ ] 필터링/정렬 고도화
- [ ] PWA 지원

### v2.0 (예정)
- [ ] 백엔드 API (Node.js)
- [ ] 데이터베이스 (PostgreSQL)
- [ ] 사용자 계정 시스템

---

## 🤝 기여

기여는 언제나 환영합니다!

### 기여 방법
1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 연락처

- **Website**: [https://kotreet.com](https://kotreet.com)
- **Email**: support@kotreet.com
- **GitHub**: [https://github.com/yourusername/kotreet](https://github.com/yourusername/kotreet)

---

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

```
MIT License

Copyright (c) 2025 Kotreet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 감사의 말

- **Google Maps API** - 지도 서비스 제공
- **Noto Sans KR** - 아름다운 한글 폰트
- **Inspiration** - Airbnb, MyRealTrip

---

## 📈 통계

![GitHub stars](https://img.shields.io/github/stars/yourusername/kotreet?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/kotreet?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/kotreet?style=social)

---

<div align="center">

**Made with ❤️ in Korea**

[⬆ Back to Top](#-kotreet---korea-street-local-shop-platform)

</div>
