# Waitly

실시간 웨이팅 · 예약 플랫폼 (개인 포트폴리오)

매장에 원격으로 줄을 서고, 내 순번이 바뀌는 순간 화면에 바로 반영되는 서비스입니다.
동시 요청 상황에서의 **정합성**과 **실시간 반영**을 핵심 과제로 다룹니다.

## Tech Stack

| 영역 | 기술 |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | Java 21, Spring Boot 4.2, Spring Data JPA, Maven |
| Data | PostgreSQL 17, Redis 7 |
| Infra | Docker Compose, GitHub Actions |

## Project Structure

```text
waitly/
├── frontend/            # Next.js
├── backend/             # Spring Boot (package-by-feature: domain/ global/ infra/)
├── docs/                # ERD, 설계 결정(ADR), 트러블슈팅
├── docker-compose.yml   # PostgreSQL, Redis
└── .github/             # CI (경로 필터로 변경된 영역만 빌드), PR 템플릿
```

## Getting Started

**요구 사항:** JDK 21, Node.js 24, Docker Desktop

```bash
# 1) 인프라 (PostgreSQL, Redis)
docker compose up -d

# 2) Backend  → http://localhost:8080/actuator/health
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run

# 3) Frontend → http://localhost:3000
cd frontend
npm install
npm run dev
```

STS에서는 `File > Import > Existing Maven Projects`로 `backend` 폴더를 가져옵니다.

## 핵심 설계

- **동시성:** 웨이팅 번호는 Redis `INCR`, 중복 등록은 멱등키와 DB 부분 유니크 인덱스, 예약 초과는 조건부 UPDATE / 비관적 락으로 막습니다. → [docs/design.md](docs/design.md)
- **실시간:** SSE와 Redis Pub/Sub을 함께 써서 서버가 여러 대일 때도 순번 변경을 브로드캐스트합니다.

## Git Convention

- 브랜치: GitHub Flow (`main` + `feat/*`, `fix/*`, `docs/*`, `refactor/*`)
- 커밋: Conventional Commits, scope로 영역 표시
  - `feat(backend): 웨이팅 번호 Redis INCR 발급`
  - `feat(frontend): 순번 SSE 구독 훅 추가`
  - `chore(infra): docker-compose에 redis 추가`
- 이슈 단위로 작업하고 PR 본문에 `Closes #번호`로 연결합니다.

## Roadmap

- [x] 모노레포 초기 구성
- [ ] 회원 / 인증
- [ ] 매장 · 웨이팅 등록
- [ ] 동시성 제어 + 동시 요청 테스트
- [ ] SSE 실시간 순번 반영
- [ ] 예약
- [ ] 배포 및 포트폴리오 정리
