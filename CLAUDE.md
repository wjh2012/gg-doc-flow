# CLAUDE.md

## Project: GG Doc Flow

- **Stack**: NestJS 11 (Monorepo), TypeScript, SQLite (Kysely), Redis (BullMQ), gRPC.
- **Architecture**: Microservices (MSA).
  - **Gateway**: `gg-doc-api` (HTTP)
  - **Services**: `auth`, `user`, `orchestrator` (TCP/Redis)
  - **Workers**: `ocr`, `detection` (gRPC/Python)

## Directory Structure
- **Apps**: `apps/{app-name}/src/{domain}/{controller,service,module}.ts`
- **Libs**: `libs/{lib-name}/src/{feature}/`
- **Pattern**: Domain-driven modular design.

## Commands
- **Start All**: `npm run start:all`
- **Migrate**: `npm run db:migrate`
- **Dev**: `nest start --watch {app-name}`

## Conventions
- **Naming**: `camelCase` (vars/funcs), `kebab-case` (files), `PascalCase` (classes/types). No `I` prefix for interfaces.
- **Language**: **Korean** for comments and user chat.
- **Constraints**: 
  - Do not run build/test unless requested.
  - Do not make external API calls automatically.
