# AGENTS.md

## Stack

- Next.js App Router
- React
- TypeScript
- Supabase
- Tailwind CSS
- shadcn/ui
- pnpm

## Commands

작업 완료 전 변경 범위에 맞게 다음 명령을 실행한다.

```bash
pnpm lint
pnpm typecheck
pnpm build
```

`typecheck` script가 없으면 다음을 사용한다.

```bash
pnpm exec tsc --noEmit
```

패키지 관리자는 반드시 `pnpm`을 사용한다.

새로운 패키지는 기존 코드나 Web API로 해결할 수 없는 경우에만 제안한다. 사용자의 요청 없이 설치하지 않는다.

## Project structure

현재 디렉터리 구조와 기존 코드 패턴을 우선한다.

- `app`: routing, layout, page, route handler
- `features`: 기능별 UI와 기능 종속 로직
- `components`: 여러 기능에서 재사용하는 UI
- `lib`: Supabase client와 공통 인프라 코드

의존 방향은 기본적으로 다음을 따른다.

```text
app → features → components / lib
```

다음 방향의 의존성을 새로 만들지 않는다.

```text
lib → features
components → features
features → app
```

폴더 구조를 대규모로 변경하거나 새로운 아키텍처 계층을 추가하기 전에 실제 필요성을 먼저 설명한다.

Repository, Service, Use Case 패턴을 기계적으로 추가하지 않는다. 현재 규모에서 중복 제거, 테스트 격리 또는 복잡한 업무 흐름 분리가 실제로 필요한 경우에만 사용한다.

## Next.js

기본적으로 Server Component를 유지한다.

`"use client"`는 다음 기능이 필요한 가장 작은 컴포넌트에만 추가한다.

- state
- event handler
- effect
- browser API

인증을 위해 layout과 page에서 각각 `features/auth/api/get-current-user.api.ts`의 `getCurrentUser()`가 필요할 수 있다. 중복처럼 보인다는 이유만으로 임의 제거하지 않는다. 실제 요청 단위 호출 흐름과 보안 경계를 확인한 뒤 수정한다.

`redirect()`, `notFound()` 등 Next.js의 제어 흐름 예외를 일반적인 `catch`에서 삼키지 않는다.

## Supabase

클라이언트 생성은 기존 유틸리티를 사용한다.

- Client Component: `@/lib/supabase/client`
- Server Component, Server Action, Route Handler: `@/lib/supabase/server`

새로운 Supabase client 생성 코드를 기능 파일에 직접 작성하지 않는다.

클라이언트가 전달한 `userId`, `ownerId`, role 값은 권한 판단에 사용하지 않는다. 서버에서 현재 사용자를 다시 확인한다.

UI에서 메뉴나 버튼을 숨기는 것은 권한 통제가 아니다. 데이터 변경 작업에서는 서버 측 인증, 소유권 검사와 RLS를 함께 확인한다.

RLS migration이 저장소에 없으면 RLS가 없다고 단정하지 않는다. 확인 불가 사항으로 보고한다.

service role key를 클라이언트 코드나 `NEXT_PUBLIC_*` 환경변수에서 사용하지 않는다.

## Code changes

사용자가 리뷰나 분석만 요청한 경우 코드를 수정하지 않는다.

수정을 요청받은 경우:

- 문제의 실제 호출 경로를 먼저 확인한다.
- 필요한 파일만 변경한다.
- 무관한 리팩터링을 섞지 않는다.
- 기존 공개 API와 컴포넌트 props를 임의로 변경하지 않는다.
- 기존 사용자 변경사항을 되돌리지 않는다.
- 대규모 포맷팅을 수행하지 않는다.

코드가 단순한데 불필요한 wrapper, factory, interface 또는 추상 계층을 추가하지 않는다.

## React

계산 가능한 값은 별도 state와 effect로 동기화하지 않는다.

`useMemo`와 `useCallback`은 실제 렌더링 비용이나 참조 안정성 문제가 확인된 경우에만 추가한다.

비동기 버튼 동작에는 중복 실행 방지가 필요한지 확인한다.

React key로 배열 index를 사용하기 전에 목록의 삽입, 삭제, 재정렬 가능성을 확인한다.

## Tailwind

새로운 spacing 클래스에는 3의 배수를 사용하지 않는다.

다음 간격을 우선한다.

```text
2, 4, 8, 16
```

예:

```text
mt-2
mt-4
mt-8
mt-16
gap-2
gap-4
gap-8
p-2
p-4
p-8
```

다음과 같은 클래스를 새로 추가하지 않는다.

```text
mt-3
mt-6
gap-3
gap-6
p-3
p-6
```

기존에 있는 값을 요청 없이 저장소 전체에서 일괄 변경하지 않는다.

기존 shadcn/ui 컴포넌트와 theme token을 우선 사용한다.

임의 색상값과 임의 픽셀값은 명확한 이유가 없으면 추가하지 않는다.

## Review output

코드 리뷰에서는 일반론보다 실제 결함을 우선 보고한다.

각 문제에는 다음 내용을 포함한다.

- 심각도
- 파일과 줄
- 실제 발생 조건
- 현재 동작
- 영향
- 최소 수정안
- 확신도

단순한 스타일 취향이나 근거 없는 미래 확장 가능성은 문제로 보고하지 않는다.

하나의 근본 원인으로 발생한 여러 증상을 별도 문제로 부풀리지 않는다.

## Restrictions

사용자의 명시적인 요청 없이 다음을 수행하지 않는다.

- 패키지 설치 또는 업데이트
- Git commit
- 브랜치 생성
- 데이터베이스 migration 실행
- 원격 Supabase 데이터 변경
- `.env` 수정 또는 secret 출력
- 운영 데이터 삭제
- 저장소 전체 자동 포맷팅
- 사용자 변경사항 제거
