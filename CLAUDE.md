# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기술 스택

- **빌드 도구**: Vite 8
- **프레임워크**: React 19 (react, react-dom)
- **언어**: TypeScript (~6.0), strict 모드는 각 tsconfig 참조 파일에서 설정
- **린터**: Oxlint (ESLint 대체), 설정 파일은 `.oxlintrc.json`
- 별도의 테스트 프레임워크(Jest/Vitest 등)는 아직 설치되어 있지 않음

## 자주 사용하는 명령어

```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행 (Vite, HMR 지원)
npm run build     # 타입 체크(tsc -b) 후 프로덕션 빌드
npm run preview   # 빌드 결과물 로컬 프리뷰
npm run lint      # Oxlint 실행
```

### 테스트

현재 이 저장소에는 테스트 러너(Vitest, Jest 등)가 구성되어 있지 않다. 코드 검증은 다음으로 대체한다:

- `npm run build` — `tsc -b`를 통해 타입 오류를 확인
- `npm run lint` — Oxlint로 정적 분석
- 테스트 프레임워크를 새로 추가할 경우, 어떤 도구를 쓸지 먼저 사용자와 확인할 것

## 기획 / 설계 문서

- [docs/PRD.md](docs/PRD.md) — PANG 게임 미션 1 전체 개요(배경, 목표, 핵심 규칙, 승패 조건)
- [docs/FEATURES/main.md](docs/FEATURES/main.md) — 메인 화면 구성
- [docs/FEATURES/game_rule.md](docs/FEATURES/game_rule.md) — PLAYER/BUBBLE/WIRE/BLOCK 게임 룰 상세
- [docs/FEATURES/mission1.md](docs/FEATURES/mission1.md) — 미션 1 난이도 및 규칙
- [PLAN.md](PLAN.md) — Phase별 개발 계획(각 Phase는 직접 실행/테스트 가능한 단위)
- [docs/design/phase1.md](docs/design/phase1.md) — Phase 1(메인 화면 노출) 상세 설계. 이후 Phase 설계 문서도 `docs/design/phaseN.md` 형식으로 추가한다.

새 기능을 구현하기 전 해당 Phase의 설계 문서가 있는지 `docs/design/`에서 먼저 확인할 것.

## 프로젝트 구조 / 아키텍처

- `tsconfig.json`은 프로젝트 참조(project references) 방식으로 `tsconfig.app.json`(앱 소스용)과 `tsconfig.node.json`(Vite 설정 등 Node 환경용)을 분리 참조한다. 새 tsconfig 옵션을 추가할 때는 어느 쪽에 속하는지 구분해서 넣어야 한다.
- `vite.config.ts`는 `@vitejs/plugin-react`(Oxc 기반) 플러그인만 사용하는 최소 구성. React Compiler는 활성화되어 있지 않음(성능 영향 때문에 템플릿에서 기본 비활성화).
- 진입점: `index.html` → `src/main.tsx` → `src/App.tsx`
- `.oxlintrc.json`은 기본적으로 `react`, `typescript`, `oxc` 플러그인만 활성화된 최소 설정이며 타입 인지(type-aware) 린트 규칙은 꺼져 있다. 타입 인지 규칙이 필요하면 `oxlint-tsgolint` 설치와 `options.typeAware: true` 설정이 필요하다(README 참고).
