이 저장소 전체를 시니어 소프트웨어 아키텍트, 보안 엔지니어,
Next.js 및 TypeScript 전문가의 관점에서 종합 감사하라.

중요한 제약사항:

- 현재 단계에서는 기존 소스 코드를 수정하지 마라.
- 패키지를 임의로 설치하거나 업데이트하지 마라.
- 데이터베이스 마이그레이션을 실행하지 마라.
- 외부 서비스에 데이터를 전송하지 마라.
- .env, 인증서, 개인 키, 비밀키의 내용을 출력하지 마라.
- 확인하지 않은 파일을 확인했다고 주장하지 마라.
- 일반론이 아니라 이 저장소에서 실제로 확인한 근거만 보고하라.

먼저 다음 작업을 수행하라.

1. 저장소 분석

- git ls-files를 기준으로 저장소 구조를 파악한다.
- node_modules, .next, dist, build, 생성 파일, lock 파일은 분석 대상에서 제외한다.
- package.json, tsconfig, ESLint 설정, Next.js 설정을 확인한다.
- app, components, features, lib, hooks, actions, API route,
  middleware, Supabase 관련 코드의 의존 관계를 파악한다.
- 주요 사용자 기능과 데이터 흐름을 추적한다.

2. 자동 검증
   저장소에 정의된 명령을 확인한 뒤 가능한 범위에서 다음을 실행하라.

- lint
- TypeScript typecheck
- test
- build
- dependency 및 dead-code 검사 명령이 이미 있다면 해당 명령

명령이 실패하면 단순히 실패했다고 하지 말고,
최초 원인과 연쇄 오류를 구분하라.

3. 코드 정확성
   다음을 확인하라.

- 런타임 오류 가능성
- 타입은 통과하지만 실제로 잘못 작동하는 로직
- null, undefined 및 빈 배열 처리
- 비동기 처리와 Promise 누락
- race condition
- 중복 요청
- stale state와 stale closure
- 잘못된 React key
- hydration 오류
- cleanup 누락
- 로딩, 오류, 빈 상태 처리
- 예외가 삼켜지는 코드
- 경계값과 실패 시나리오

4. Next.js 및 React

- Server Component와 Client Component 경계
- 불필요한 "use client"
- 서버 전용 코드의 클라이언트 유입
- Server Action의 인증과 입력 검증
- Route Handler의 인증과 권한 검증
- 캐시, revalidation 및 fetch 정책
- redirect 및 notFound 사용
- middleware 동작
- 불필요한 재렌더링
- 잘못된 useEffect 사용
- 접근성 문제
- 번들 크기 증가 요인

5. 인증과 보안

- 인증과 인가를 구분하여 검사한다.
- UI에서 버튼을 숨기는 것만으로 권한을 통제하는 부분을 찾는다.
- IDOR 및 다른 사용자의 데이터 접근 가능성을 검사한다.
- 입력 검증 누락을 확인한다.
- XSS, SSRF, CSRF, open redirect 가능성을 확인한다.
- 파일 업로드 시 확장자, MIME, 크기 및 파일명 검증을 확인한다.
- 중요 정보가 로그나 클라이언트 번들에 노출되는지 확인한다.
- NEXT_PUBLIC 환경변수 사용을 확인한다.
- service role key 노출 가능성을 확인한다.
- 의존성으로 인한 명백한 보안 문제를 확인한다.

6. Supabase

- browser client와 server client 사용 위치
- getSession과 getUser 사용의 적절성
- 인증 조회 중복
- 사용자 소유권 검증
- RLS를 전제로 했지만 애플리케이션 코드에서 위험한 부분
- Storage 경로 조작 가능성
- DB 변경과 Storage 변경 사이의 불일치
- 실패 시 rollback 또는 보상 처리
- admin/service role 사용 범위
- migration과 schema가 있다면 RLS 정책까지 확인한다.

7. 아키텍처

- 계층 간 의존 방향
- 순환 참조
- feature 간 과도한 결합
- 비즈니스 로직이 UI에 들어간 부분
- DB 로직이 여러 컴포넌트에 흩어진 부분
- 거대한 컴포넌트와 과도한 책임
- 이름과 실제 책임이 다른 모듈
- 공통화가 필요한 중복
- 반대로 불필요하게 추상화된 코드
- Repository, Service, Use Case 등의 패턴이 실제로 필요한지
- 현재 규모에서 과설계된 부분

8. 유지보수성과 코드 품질

- 일관되지 않은 네이밍
- 사용되지 않는 코드
- 중복 코드
- 매직 넘버와 매직 문자열
- 잘못된 타입 단언
- any 사용
- eslint-disable 사용
- 지나치게 복잡한 조건문
- 테스트하기 어려운 구조
- 문서와 실제 코드의 불일치

9. UI와 Tailwind

- 반응형 레이아웃
- overflow 가능성
- 긴 한글 및 영문 처리
- focus-visible 및 키보드 접근성
- disabled와 loading 상태
- 중복 제출 방지
- 디자인 토큰 일관성
- spacing, radius, typography, container 폭의 일관성
- Tailwind에서 3의 배수 spacing 클래스는 권장하지 말고
  mt-2, mt-4, mt-8, mt-16 계열을 우선한다.

10. 테스트

- 현재 테스트가 실제 핵심 위험을 검증하는지
- 테스트가 필요한 핵심 로직
- 인증, 권한, 파일 처리, 실패 복구 시나리오
- 최소한 추가해야 할 단위, 통합, E2E 테스트를 제안한다.

보고서 형식:

- Executive Summary
- 실제로 실행한 명령과 결과
- 시스템의 주요 실행 흐름
- 아키텍처 및 의존 관계
- 발견 사항
- 권장 수정 순서
- 필요한 테스트
- 확인하지 못한 부분과 그 이유

각 발견 사항은 반드시 다음 형식을 따른다.

[심각도: Critical / High / Medium / Low]
제목:
근거 파일과 줄:
관련 코드:
현재 동작:
문제가 되는 이유:
재현 조건:
영향:
권장 수정:
수정 시 주의사항:
확신도: High / Medium / Low

심각도 기준:

- Critical: 인증 우회, 데이터 유출·손실, 운영 장애 가능성
- High: 주요 기능 오류, 권한 오류, 반복 가능한 런타임 장애
- Medium: 특정 조건의 버그, 구조적 결함, 성능 문제
- Low: 유지보수성, 일관성, 가독성 문제

최종적으로 문제를 다음 세 그룹으로 분류하라.

- 즉시 수정
- 다음 개발 주기에 수정
- 장기 개선

불필요한 칭찬이나 일반적인 모범 사례 나열은 제외하라.
실제 파일 및 실행 결과로 입증할 수 없는 문제는
'추정'이라고 명확하게 표시하라.

분석 결과는 저장소 루트의 CODE_AUDIT.md에 작성하되,
그 파일 외에는 아무 파일도 수정하지 마라.
