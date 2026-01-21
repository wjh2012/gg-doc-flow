# CLAUDE.md
# Project: Image Document AI Solution

## Tech Stack
- Frontend: React 19.2 + TypeScript
- Backend: NestJS 11

## Project Structure

### Applications (apps/)
| Service                         | Port | Transport | Description |
|---------------------------------|------|-----------|-------------|
| **gg-doc-api**                  | 8080 | HTTP | 클라이언트 진입점. JWT 검증, Swagger 제공 |
| **gg-doc-service-auth**         | 3001 | TCP | 인증 서비스. 토큰 발급/갱신/폐기, OAuth 연동 |
| **gg-doc-service-user**         | 3002 | TCP | 사용자 도메인. 프로필, 계정, 권한 관리 |
| **gg-doc-service-orchestrator** | 3003 | TCP | 문서 처리 오케스트레이터. 작업 생성/상태 관리 |
| **gg-doc-worker-ocr**           | -    | BullMQ | OCR 워커. Python OCR 엔진과 gRPC 통신 |
| **gg-doc-worker-detection**     | -    | BullMQ | Detection 워커. Python Detection 엔진과 gRPC 통신 |

### Libraries (libs/)
| Library | Path Alias | Description |
|---------|------------|-------------|
| **database** | @app/database | Kysely ORM, 마이그레이션 |
| **common-types** | @app/common-types | 공통 타입, 인터페이스 |
| **common-worker** | @app/common-worker | 워커 베이스 클래스, BullMQ 설정 |
| **common-logging** | @app/common-logging | OpenTelemetry, 로깅 |
| **common-guard** | @app/common-guard | 인증/권한 가드, 데코레이터 |
| **common-grpc** | @app/common-grpc | gRPC 클라이언트 (OCR, Detection) |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (HTTP/REST)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    gg-doc-api :8080 (HTTP)                      │
│                    - JWT 검증                                    │
│                    - Swagger (/api)                             │
└───────┬───────────────────┬────────────────────────────────┬────┘
        │ TCP               │ TCP                            │ TCP
        ▼                   ▼                                ▼
┌────────────────────┐   ┌────────────────────────────┐   ┌───────────────────┐
│ gg-doc-service-auth│   │gg-doc-service-orchestrator │   │gg-doc-service-user│
│  3001              │   │ 3003                       │   │ 3002              │
│ (TCP)              │   │ (TCP)                      │   │ (TCP)             │
└───────┬────────────┘   └──────────┬─────────────────┘   └───────────────────┘
        │                           │                   
        │ TCP                       │ BullMQ            
        └───────────────────────────┴
                                    │
              ┌─────────────────────┴─────┐
              ▼                           ▼
┌─────────────────────┐       ┌─────────────────────────┐
│   gg-doc-worker-ocr │       │ gg-doc-worker-detection │
│   (BullMQ Consumer) │       │ (BullMQ Consumer)       │
└──────────┬──────────┘       └──────────┬──────────────┘
           │ gRPC                        │ gRPC
           ▼                             ▼
┌─────────────────────┐       ┌─────────────────────┐
│ Python OCR :50051   │       │ Python Det :50052   │
└─────────────────────┘       └─────────────────────┘
```

## API Endpoints (gg-doc-api)

### Auth
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인

### Doc
- `POST /doc/task/ocr` - OCR 작업 생성
- `POST /doc/task/detection` - Detection 작업 생성
- `GET /doc/task/recent` - 최근 작업 목록
- `GET /doc/task/sse` - 작업 상태 SSE 스트림

## Protocol Strategy
| 구간 | 프로토콜 |
|------|----------|
| Client → gg-doc-api | HTTP/REST |
| gg-doc-api → 내부 서비스 | TCP (Request-Response) |
| gg-doc-service-orchestrator → Workers | Message Broker (BullMQ/Redis) |
| Workers → AI Engine | gRPC |

## Key Workflow
1. Client → gg-doc-api (HTTP)
2. gg-doc-api → gg-doc-service-orchestrator (TCP) 작업 생성 요청
3. gg-doc-service-orchestrator → BullMQ 작업 발행
4. Worker가 작업 수신 → Python 엔진 gRPC 호출
5. 결과 DB 저장 → Redis pub/sub으로 상태 업데이트

## Directory Structure Convention

### App Structure
```
apps/{app-name}/src/
├── main.ts
├── app.module.ts
└── {domain}/
    ├── {domain}.controller.ts
    ├── {domain}.service.ts
    ├── {domain}.module.ts
    ├── dto/
    └── infra/
```

### Library Structure
```
libs/{lib-name}/src/
├── index.ts
├── {lib-name}.module.ts
└── {feature}/
```

### Examples
```
apps/gg-doc-service-auth/src/
├── main.ts
├── app.module.ts
└── auth/
    ├── auth.controller.ts
    ├── auth.service.ts
    └── auth.module.ts

apps/gg-doc-api/src/
├── main.ts
├── app.module.ts
├── gateway/
│   ├── gateway.service.ts
│   └── gateway.module.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── dto/
└── doc/
    ├── doc.controller.ts
    └── doc.module.ts
```

## Code Style
- Function Name: camelCase
- File Name: kebab-case
- Module Name: app.module.ts (root), {domain}.module.ts (feature)

## Important Notes
- Do not call API
- Do not build
- Do not test
- 코드 작성 시 설명 주석 최소화, 핵심 주석만 한국어로 작성
- 사용자와 직접 소통 시 한국어 사용
