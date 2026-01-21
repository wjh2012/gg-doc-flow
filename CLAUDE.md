# CLAUDE.md
# Project: Image Document AI Solution
## Tech Stack
- FrontReact: 19.2 + TypeScript
- Backend: Nestjs 11

## Project Structure
- **gg-gateway**: Central entry point for all client requests. Handles routing and JWT signature verification using shared secret/public key. Does not call gg-auth for every request.
- **gg-auth**: Authentication service responsible for token issuance, refresh, revocation, and OAuth provider integration (Google, Kakao, etc.). Only invoked during login/logout flows, not per-request validation.
- **gg-user**: User domain service managing profiles, account data, and permissions. Agnostic to authentication methods - receives user lookup/creation requests from gg-auth without knowledge of OAuth or JWT internals.
- **gg-doc**: Internal workflow orchestrator for document processing. Manages task creation, status tracking, and result retrieval. Publishes async tasks to message broker. Accessed via gg-gateway, not directly exposed.
- **gg-ocr-worker**: Async worker consuming OCR tasks from message queue. Communicates with external Python OCR engine via gRPC. Optimized for fast, lightweight text extraction workloads.
- **gg-detection-worker**: Async worker consuming object detection tasks from message queue. Communicates with external Python detection engine via gRPC. Isolated from OCR worker due to heavier processing time and different scaling requirements.

## Key Workflow
1. Client sends a request to gg-gateway.
2. gg-doc receives the request and triggers the necessary workflow.
3. Workers (ocr, object-detection) handle heavy AI tasks asynchronously by communicating with external Python engine servers.
4. Results are persisted in the database and reported back to the system.

## Protocol Strategy
- External Interface: HTTP/REST
- Internal Core Communication: TCP (Request-Response)
- Task Orchestration: Message Broker (RabbitMQ / Redis)
- Worker to AI Engine: gRPC

## Code Style
- Function Name: camelCase
- File Name: kebab-case

## Important Notes
- Do not call API
- Do not build
- Do not test
- When writing code, avoid explanatory comments as much as possible and only include essential core comments in Korean
- Use only Korean when communicating with the user directly