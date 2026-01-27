# GG Doc Flow (문서 처리 파이프라인)

NestJS Monorepo 기반의 문서 처리 및 분석 시스템입니다. 마이크로서비스 아키텍처(MSA)를 채택하여 확장성과 유지보수성을 극대화했습니다.

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React 19.2 + TypeScript
- **Backend**: NestJS 11 (Monorepo)
- **Database**: SQLite (Kysely Query Builder)
- **Message Queue**: Redis (BullMQ, Pub/Sub)
- **RPC**: gRPC (서비스 간 통신)
- **Documentation**: Swagger (API Docs)

## 🏗 아키텍처 (Architecture)

### 애플리케이션 (Apps)

| 서비스명 | 포트 | 통신 방식 | 설명 |
|---|---|---|---|
| `gg-doc-api` | 8080 | HTTP | 클라이언트 진입점. JWT 검증, Swagger 제공 |
| `gg-doc-service-auth` | 3001 | TCP | 인증 및 인가 처리 담당 (토큰 발급/갱신/폐기) |
| `gg-doc-service-user` | 3002 | TCP | 사용자 관리 담당 (프로필, 계정, 권한) |
| `gg-doc-service-orchestrator` | 3003 | TCP / Redis | 문서 처리 흐름 제어 및 작업 상태 관리 |
| `gg-doc-worker-ocr` | - | BullMQ / gRPC | 이미지 텍스트 추출 (OCR) 워커 |
| `gg-doc-worker-detection` | - | BullMQ / gRPC | 이미지 객체 감지 (Detection) 워커 |

### 라이브러리 (Libs)

| 라이브러리명 | 경로 별칭 (@app/...) | 설명 |
|---|---|---|
| `database` | `database` | Kysely ORM 설정 및 마이그레이션 |
| `common-worker` | `common-worker` | 워커 베이스 클래스, BullMQ 설정, 큐 상수 |
| `common-logging` | `common-logging` | 공통 로깅 모듈 (OpenTelemetry 등) |
| `common-types` | - | 공통 타입 및 인터페이스 정의 |
| `ocr-client` | `ocr-client` | OCR gRPC 클라이언트 모듈 |
| `detection-client` | `detection-client` | Detection gRPC 클라이언트 모듈 |

## 📡 프로토콜 전략 & 워크플로우

### 프로토콜 (Protocol Strategy)

| 구간 | 프로토콜 | 설명 |
|---|---|---|
| Client → gg-doc-api | HTTP/REST | 표준 REST API |
| gg-doc-api → Services | TCP | NestJS Microservices (Request-Response) |
| Orchestrator → Workers | Redis (BullMQ) | 비동기 작업 큐 |
| Workers → AI Engine | gRPC | 고성능 모델 서빙 통신 |

### 주요 워크플로우 (Key Workflow)

1. **Client → gg-doc-api (HTTP)**: 작업 요청
2. **gg-doc-api → Orchestrator (TCP)**: 작업 생성 요청 전달
3. **Orchestrator → BullMQ**: 작업 큐에 발행
4. **Worker**: 큐에서 작업 수신 → **AI Engine (gRPC)** 호출하여 처리
5. **Worker → DB/Redis**: 결과 저장 및 Pub/Sub으로 상태 업데이트

## 🚀 시작하기 (Getting Started)

### 사전 요구사항 (Prerequisites)

- Node.js (v20 이상 권장)
- Docker & Docker Compose (Redis 실행용)

### 설치 (Installation)

```bash
# 의존성 설치
npm install
```

### 환경 설정 (Configuration)

루트 디렉토리의 `.env` 파일을 확인하고 필요한 경우 수정하세요. (기본 제공됨)

### 인프라 실행 (Infrastructure)

Redis 및 모니터링 툴(LGTM 스택)을 도커로 실행합니다.

```bash
docker-compose up -d
```

### 데이터베이스 마이그레이션

```bash
npm run db:migrate
```

### 전체 애플리케이션 실행

모든 애플리케이션을 동시에 실행합니다.

```bash
npm run start:all
```

또는 개별적으로 실행할 수 있습니다.

```bash
# API Gateway
nest start --watch gg-doc-api

# Workers
nest start --watch gg-doc-worker-ocr
nest start --watch gg-doc-worker-detection
```

## 📂 프로젝트 구조

```
apps/
  ├── gg-doc-api/                # API Gateway
  ├── gg-doc-service-auth/       # 인증 서비스
  ├── gg-doc-service-user/       # 유저 서비스
  ├── gg-doc-service-orchestrator/# 오케스트레이터
  ├── gg-doc-worker-detection/   # Detection 워커
  └── gg-doc-worker-ocr/         # OCR 워커

libs/
  ├── common-*/                  # 공통 유틸리티
  ├── database/                  # DB 관련 설정
  ├── detection-client/          # Detection gRPC 클라이언트
  └── ocr-client/                # OCR gRPC 클라이언트
```

## 🛠 개발 가이드

- **Proto 파일 변경 시**: `libs/ocr-client/src/proto` 또는 `libs/detection-client/src/proto`를 수정한 후 빌드해야 `dist`에 반영됩니다.
- **새로운 gRPC 서비스 추가 시**: 전용 클라이언트 라이브러리를 `libs`에 생성하는 것을 권장합니다.
