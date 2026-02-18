# Mini Jenkins

Git Clone → Docker Build → SCP 전송 → Container 배포까지의 파이프라인을 자체 구현한 미니 CI/CD 시스템입니다.

## 아키텍처

```
orchestration (:3000)  ──▶  build-server (:4001)  ──▶  deploy-server (:4002)
Next.js                     Node.js                    Node.js

UI 대시보드                 Git Clone                  Docker Load
REST API            ◀──    Docker Build         ──▶   Docker Run
SQLite DB           SSE    Docker Save          SCP   로그 스트리밍
작업 조율                   SCP 전송                    헬스체크
```

## 서버 구성

| 서버 | 역할 | 포트 | 기술 스택 |
|------|------|------|-----------|
| **orchestration** | UI, API, DB, 작업 조율 | 3000 | Next.js 15, SQLite, shadcn/ui |
| **build-server** | Git Clone, Docker Build, SCP 전송 | 4001 | Express, simple-git, ssh2 |
| **deploy-server** | Container 실행, 로그 스트리밍 | 4002 | Express, child_process |

## 주요 기능

- **프로젝트 관리** - Git 저장소 기반 프로젝트 CRUD
- **빌드 파이프라인** - Git Clone → Docker Build → Image Save → SCP 전송
- **배포 파이프라인** - Docker Load → Run → Health Check
- **실시간 모니터링** - SSE 기반 빌드/배포 진행률 스트리밍
- **컨테이너 관리** - Start / Stop / Restart / Delete + 로그 스트리밍
- **에이전트 시스템** - 빌드/배포 서버 자동 등록 + 하트비트

## 시작하기

```bash
# 각 서버 디렉토리에서
pnpm install

# orchestration - DB 초기화 후 실행
cd orchestration
pnpm db:init
pnpm dev

# build-server
cd build-server
pnpm dev

# deploy-server
cd deploy-server
pnpm dev
```

## 기술 스택

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui
- **Backend**: Express, better-sqlite3
- **Build**: simple-git, Docker CLI (child_process)
- **Transfer**: ssh2 (SCP)
- **Realtime**: Server-Sent Events (SSE)
- **Validation**: Zod
