# GG Doc Flow (문서 처리 파이프라인)

NestJS Monorepo 기반의 문서 처리 및 분석 시스템입니다. 마이크로서비스 아키텍처(MSA)를 채택하여 확장성과 유지보수성을 극대화했습니다.

## 🏗 아키텍처

이 프로젝트는 다음과 같은 기술 스택과 구조로 이루어져 있습니다.

- **Framework**: NestJS (Monorepo)
- **Database**: SQLite (Kysely Query Builder)
- **Message Queue**: Redis (BullMQ, Pub/Sub)
- **RPC**: gRPC (서비스 간 통신)
- **Documentation**: Swagger (API Docs)

### 애플리케이션 (Apps)

| 서비스명                          | 설명                       | 통신 방식         |
|-------------------------------|--------------------------|---------------|
| `gg-doc-api`                  | 외부 요청을 받는 API Gateway    | HTTP          |
| `gg-doc-service-auth`         | 인증 및 인가 처리 담당            | HTTP / TCP    |
| `gg-doc-service-user`         | 사용자 관리 담당                | HTTP / TCP    |
| `gg-doc-service-orchestrator` | 문서 처리 흐름 제어 (Saga 패턴 등)  | Redis Pub/Sub |
| `gg-doc-worker-ocr`           | 이미지 텍스트 추출 (OCR) 워커      | gRPC          |
| `gg-doc-worker-detection`     | 이미지 객체 감지 (Detection) 워커 | gRPC          |

### 라이브러리 (Libs)

| 라이브러리명           | 설명                   |
|------------------|----------------------|
| `common-logging` | 공통 로깅 모듈             |
| `common-types`   | 공통 타입 및 인터페이스 정의     |
| `common-worker`  | 워커 공통 로직 (기본 큐 처리 등) |

| `database`         | DB 연결 및 마이그레이션 관리 |
| `ocr-client`       | OCR gRPC 클라이언트 모듈 |
| `detection-client` | Detection gRPC 클라이언트 모듈 |

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
  ├── gg-doc-api/                # API 서버
  ├── gg-doc-service-auth/       # 인증 서비스
  ├── gg-doc-service-orchestrator/# 문서 처리 오케스트레이터
  ├── gg-doc-worker-detection/   # 객체 감지 워커 (gRPC 서버)
  └── gg-doc-worker-ocr/         # OCR 워커 (gRPC 서버)

libs/
  ├── common-*/                  # 공통 유틸리티
  ├── database/                  # DB 관련 설정
  ├── detection-client/          # Detection gRPC 클라이언트
  └── ocr-client/                # OCR gRPC 클라이언트
```

## 🛠 개발 가이드

- **Proto 파일 변경 시**: `libs/ocr-client/src/proto` 또는 `libs/detection-client/src/proto`를 수정한 후 빌드해야
  `dist`에 반영됩니다.
- **새로운 gRPC 서비스 추가 시**: 전용 클라이언트 라이브러리를 `libs`에 생성하는 것을 권장합니다.

---
**GG Doc Flow**
