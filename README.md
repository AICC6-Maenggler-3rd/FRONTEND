# 🗺️ Inpick FRONTEND

AI 기반 **여행 일정 생성 및 추천 시스템**의 프론트엔드 서비스입니다.  
사용자 친화적인 UI/UX로 여행 계획 생성, 일정 관리, 장소 추천, 지도 탐색 기능을 제공합니다.

---

## 🚀 주요 기능

- 🔐 **소셜 로그인** – Google / Naver / Kakao OAuth 인증
- 🧭 **여행 일정 생성** – 4단계 마법사로 일정 생성
  - Step 1: 기본 정보 입력 (지역, 기간, 동반자, 테마)
  - Step 2: 장소 선택 및 추천
  - Step 3: 숙소 선택
  - Step 4: 일정 최종 확인
- 🏝️ **AI 추천** – CBF, ALS, GRU4Rec, SASRec, RAG 기반 장소 추천
- 🗺️ **지도 기능** – Kakao Map SDK 기반 경로 탐색
- 📊 **관리자 페이지** – 대시보드, 사용자/카테고리/숙소/SNS 계정 관리
- 📝 **일정 관리** – 내 일정 목록, 상세 조회, 수정, 삭제

---

## 🧩 기술 스택

| 분류                 | 기술                              |
| -------------------- | --------------------------------- |
| **Language**         | TypeScript                        |
| **Framework**        | React 19                          |
| **Build Tool**       | Vite 7                            |
| **Routing**          | React Router DOM 7                |
| **State Management** | React Hooks (useState, useEffect) |
| **UI Library**       | Radix UI, shadcn/ui               |
| **Styling**          | Tailwind CSS 4                    |
| **Forms**            | React Hook Form, Zod              |
| **HTTP Client**      | Axios                             |
| **Maps**             | Kakao Maps SDK                    |
| **Date**             | date-fns                          |
| **Charts**           | Recharts                          |
| **Notifications**    | React Toastify                    |
| **Infra**            | Docker, Jenkins, Nginx            |

---

## 📁 디렉토리 구조

```
src/
├─ api/                          # 백엔드 API 클라이언트
│  ├─ auth.ts                    # 인증 (로그인/로그아웃)
│  ├─ itinerary.ts               # 일정 CRUD, 생성
│  ├─ place.ts                   # 장소 조회, 검색
│  ├─ accommodation.ts           # 숙소 조회
│  ├─ region.ts                  # 지역 정보
│  ├─ map.ts                     # 경로 탐색 (Naver/TMAP)
│  └─ manage.ts                  # 관리자 API
├─ components/                   # 재사용 컴포넌트
│  ├─ common/                    # 공통 컴포넌트
│  │  ├─ Intro.tsx               # 메인 인트로
│  │  ├─ GoogleLogin.tsx         # Google 로그인 버튼
│  │  ├─ KakaoLogin.tsx          # Kakao 로그인 버튼
│  │  ├─ NaverLogin.tsx          # Naver 로그인 버튼
│  │  ├─ PlaceList.tsx           # 장소 리스트
│  │  ├─ PlaceDetail.tsx         # 장소 상세
│  │  ├─ RecommendationModal.tsx # 추천 결과 모달
│  │  └─ SearchRAG.tsx           # RAG 검색
│  ├─ journey/                   # 여행 계획 컴포넌트
│  │  └─ JourneySidebar.tsx      # 단계 네비게이션
│  ├─ manage/                    # 관리자 컴포넌트
│  │  ├─ UserManagementModal.tsx # 사용자 관리 모달
│  │  ├─ CreateCategoryModal.tsx # 카테고리 생성 모달
│  │  ├─ SnsAccountsModal.tsx    # SNS 계정 모달
│  │  └─ AccommodationsModal.tsx # 숙소 관리 모달
│  ├─ ui/                        # shadcn/ui 컴포넌트
│  │  ├─ button.tsx              # 버튼
│  │  ├─ card.tsx                # 카드
│  │  ├─ dialog.tsx              # 다이얼로그
│  │  ├─ input.tsx               # 입력 필드
│  │  ├─ badge.tsx               # 배지
│  │  ├─ switch.tsx              # 토글 스위치
│  │  └─ ...                     # 기타 UI 컴포넌트
│  └─ KakaoMap.tsx               # 카카오맵 래퍼
├─ layouts/                      # 레이아웃
│  ├─ DefaultLayout.tsx          # 기본 레이아웃
│  ├─ header.tsx                 # 헤더 (로그인 상태, 네비게이션)
│  ├─ footer.tsx                 # 푸터
│  └─ sidebar.tsx                # 사이드바
├─ pages/                        # 페이지 컴포넌트
│  ├─ Login.tsx                  # 로그인 페이지
│  ├─ MyPage.tsx                 # 마이페이지
│  ├─ journey/                   # 여행 계획 페이지
│  │  ├─ main.tsx                # 마법사 메인
│  │  ├─ step1/                  # Step 1: 기본 정보
│  │  ├─ step2/                  # Step 2: 장소 선택
│  │  ├─ step3/                  # Step 3: 숙소 선택
│  │  └─ step4/                  # Step 4: 최종 확인
│  ├─ users/                     # 사용자 페이지
│  │  ├─ ItineraryList.tsx       # 내 일정 목록
│  │  ├─ Schedule.tsx            # 일정 상세
│  │  ├─ EditSchedule.tsx        # 일정 수정
│  │  └─ DeleteUserPage.tsx      # 회원 탈퇴
│  └─ manage/                    # 관리자 페이지
│     ├─ Main.tsx                # 대시보드
│     ├─ Dashboard.tsx           # 통계 차트
│     ├─ memberdetail.tsx        # 사용자 관리
│     ├─ Categorydetail.tsx      # 카테고리 관리
│     ├─ AccommodationDetail.tsx # 숙소 관리
│     └─ Snsaccount.tsx          # SNS 계정 관리
├─ types/                        # TypeScript 타입 정의
│  ├─ accommodation.ts           # 숙소 타입
│  ├─ itinerary.ts               # 일정 타입
│  ├─ place.ts                   # 장소 타입
│  └─ global.d.ts                # 전역 타입
├─ hooks/                        # 커스텀 훅
│  └─ common.ts                  # 공통 훅
├─ lib/                          # 유틸리티
│  └─ utils.ts                   # cn, clsx, tailwind-merge
├─ images/                       # 이미지 리소스
│  └─ marker/                    # 지도 마커 아이콘
├─ App.tsx                       # 앱 루트 라우팅
├─ main.tsx                      # 진입점
└─ index.css                     # 전역 스타일
```

---

## ⚙️ 실행 방법

1️⃣ **의존성 설치**

```bash
npm install
```

2️⃣ **환경 변수 설정** (.env 파일 생성)

```env
VITE_API_HOST=http://localhost:8000
```

3️⃣ **개발 서버 실행**

```bash
npm run front
# 또는
npm run dev
```

서버: http://localhost:5180

4️⃣ **빌드**

```bash
npm run build
```

5️⃣ **프리뷰**

```bash
npm run preview
```

---

## 🗺️ 라우팅 구조

| 경로                          | 설명                    | 헤더/푸터 |
| ----------------------------- | ----------------------- | --------- |
| `/`                           | 인트로 (메인)           | ✅        |
| `/login`                      | 로그인 페이지           | ❌        |
| `/mypage`                     | 마이페이지              | ✅        |
| `/itineraries`                | 내 일정 목록            | ✅        |
| `/schedule/:id`               | 일정 상세               | ✅        |
| `/schedule/edit/:id`          | 일정 수정               | ✅        |
| `/users/delete`               | 회원 탈퇴               | ✅        |
| `/journey`                    | 여행 계획 마법사 (메인) | ✅        |
| `/journey/step1`              | Step 1: 기본 정보       | ✅        |
| `/journey/step2`              | Step 2: 장소 선택       | ✅        |
| `/journey/step3`              | Step 3: 숙소 선택       | ✅        |
| `/journey/step4`              | Step 4: 최종 확인       | ✅        |
| `/manageIndex`                | 관리자 대시보드         | ✅        |
| `/manage/memberdetail`        | 사용자 관리             | ✅        |
| `/manage/categorydetail`      | 카테고리 관리           | ✅        |
| `/manage/accommodationdetail` | 숙소 관리               | ✅        |
| `/manage/snsaccount`          | SNS 계정 관리           | ✅        |

---

## 🎨 UI/UX 특징

### 디자인 시스템

- **Color Palette**: Blue 계열 (Primary: #81d4fa)
- **Theme**: Light/Dark 모드 지원
- **Components**: shadcn/ui 기반 커스텀 컴포넌트

### 주요 UI 컴포넌트

- **Card**: 일정 카드, 장소 카드
- **Dialog**: 장소 상세, 추천 결과 모달
- **Badge**: 카테고리, 상태 표시
- **Button**: Primary, Secondary, Destructive
- **Input**: 텍스트, 날짜, 시간 입력
- **Switch**: 토글 스위치

### 맵 기능

- **Kakao Maps SDK** 통합
- **마커**: 장소 타입별 아이콘 (음식점, 카페, 관광지 등)
- **경로 탐색**: Naver Directions API, TMAP 경로 API
- **인포윈도우**: 장소 정보 표시

---

## 🔄 API 연동

### 인증

- OAuth 2.0 소셜 로그인 (Google, Naver, Kakao)
- 쿠키 기반 세션 관리
- localStorage 기반 사용자 정보 캐싱
- 자동 토큰 갱신

### 추천 시스템

- CBF (Content-Based Filtering)
- ALS (Collaborative Filtering)
- Next-POI 추천 (GRU4Rec, SASRec)
- RAG 기반 GPT 추천

### 지도 API

- **Kakao Maps**: 지도 렌더링, 마커, 경로 표시
- **Naver Directions**: 자동차 경로 탐색
- **TMAP**: 보행자 경로 탐색

---

## 🐳 Docker 실행

```bash
# 빌드
docker build -t inpick-frontend:latest -f deploy/Dockerfile .

# 실행
docker run -p 8381:80 --env-file .env inpick-frontend:latest
```

### Dockerfile 구조

1. **Build Stage**: Node.js 기반 Vite 빌드
2. **Production Stage**: Nginx 정적 파일 서빙

---

## 🔄 CI/CD (Jenkins)

`deploy/Jenkinsfile` 기반 파이프라인:

1. 📥 Checkout
2. 📦 Install Dependencies (npm ci)
3. 📄 .env 파일 생성
4. 🏗️ Build (npm run build)
5. 🐳 Docker Build
6. 📤 Push Docker Image
7. 🚀 Deploy

**포트**:

- 개발: 5180
- 프로덕션: 8381
- 컨테이너: 80

---

## 📋 환경 변수

| 변수명        | 설명            | 기본값                |
| ------------- | --------------- | --------------------- |
| VITE_API_HOST | 백엔드 API 주소 | http://localhost:8000 |

---

## 🔍 주요 기능 상세

### 1. 여행 계획 마법사

- 4단계 프로세스로 일정 생성
- 실시간 검증 및 피드백
- AI 추천 모델 선택 가능

### 2. 장소 추천

- CBF 기반 콘텐츠 추천
- RAG 기반 자연어 검색
- 지도 기반 필터링

### 3. 일정 관리

- 일정 목록 조회 (페이지네이션)
- 일정 상세, 수정, 삭제
- Kakao Map 기반 경로 시각화

### 4. 관리자 기능

- 대시보드 통계 (Recharts)
- 사용자/카테고리/숙소/SNS 계정 CRUD
- 실시간 데이터 업데이트

### 5. 상태 관리

- **React Hooks 기반**: useState, useEffect
- **로컬 상태**: 컴포넌트별 독립 관리
- **전역 상태**: localStorage로 사용자 정보 캐싱
- **API 상태**: Axios + React Hooks

---

## 🧪 개발 스크립트

```bash
npm run front      # 개발 서버 실행 (localhost:5180)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 프리뷰
npm run lint       # ESLint 검사 및 수정
npm run format     # Prettier 포맷팅
npm run kill-port  # 5180 포트 종료
```

---

## 📦 주요 의존성

### 핵심

- `react`, `react-dom`: 19.1.1
- `react-router-dom`: 7.8.2
- `typescript`: 5.8.3
- `vite`: 7.1.2

### UI

- `@radix-ui/*`: 접근성 UI 컴포넌트
- `tailwindcss`: 4.1.13
- `lucide-react`: 아이콘

### 폼 & 검증

- `react-hook-form`: 7.63.0
- `@hookform/resolvers`: 5.2.2
- `zod`: 4.1.11

### HTTP & API

- `axios`: 1.11.0

### 지도

- `react-kakao-maps-sdk`: 1.2.0

### 기타

- `date-fns`: 날짜 처리
- `recharts`: 차트
- `react-toastify`: 알림
- `class-variance-authority`: 컴포넌트 variant
- `clsx`, `tailwind-merge`: 클래스 병합

---

## 📋 체크리스트

✅ Node.js 20+ 설치 완료  
✅ .env 파일 설정 완료  
✅ 백엔드 서버 실행 확인 (http://localhost:8000)  
✅ Kakao Maps API Key 설정  
✅ TypeScript 컴파일 오류 없음  
✅ 빌드 성공 확인

---

## 🪪 라이선스

본 프로젝트의 저작권은 **AICC6-Maenggler-3rd 팀**에 있으며,  
상용 및 배포 정책은 별도 라이선스 조항을 따릅니다.

---

## 👥 팀 정보

**AICC6-Maenggler-3rd Team**  
AI 기반 여행 일정 생성 서비스 "Inpick"
