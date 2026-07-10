# LiteDrive

개인정보 부담 없이 파일을 보관하고 공유하는 가벼운 클라우드 드라이브입니다. Next.js App Router와 Supabase를 기반으로 사용자 인증과 파일 메타데이터를 관리하고, 실제 파일 객체는 Cloudflare R2에 저장합니다.

## 주요 기능

- 아이디와 비밀번호 기반 회원가입 및 로그인
- 파일 업로드, 다운로드, 이름 변경, 삭제
- 폴더 생성, 이름 변경, 삭제 및 계층 이동
- table/grid 방식의 드라이브 보기
- 파일명 검색
- 공유 코드 기반 공개 파일 전달
- 파일 수, 폴더 수, 최근 파일 및 저장 공간 현황 확인
- 계정 비밀번호 변경과 재인증 기반 회원 탈퇴
- 반응형 랜딩, 드라이브 및 프로필 UI

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS, shadcn/ui |
| Form | React Hook Form, Zod |
| Auth/Database | Supabase Auth, PostgreSQL, RLS |
| Object Storage | Cloudflare R2, AWS S3 SDK |
| Package Manager | pnpm |

## 애플리케이션 구조

```text
app/                    라우팅, layout, page, metadata route
features/               기능별 UI와 서버/클라이언트 로직
  auth/                 인증 및 계정 관리
  drive/                드라이브 목록과 파일/폴더 이동
  files/                파일 전송과 파일 작업
  folders/              폴더 작업
  profile/              프로필 통계
  share/                공개 공유 파일 조회와 다운로드
components/             여러 기능에서 공유하는 UI
lib/                    Supabase client와 공통 인프라
supabase/migrations/    RLS, trigger, DB 함수 migration
types/                  공통 데이터 타입
```

기본 의존 방향은 다음과 같습니다.

```text
app → features → components / lib
```

## 주요 실행 흐름

### 파일 업로드

1. Server Action에서 현재 Supabase 사용자를 확인합니다.
2. 파일 이름, 크기, 대상 폴더 소유권과 저장 공간을 검사합니다.
3. 서버가 파일 UUID와 사용자 전용 R2 경로를 생성합니다.
4. DB에 `pending` 메타데이터를 저장하고 5분 만료 전송 토큰을 발급합니다.
5. 클라이언트가 Worker를 통해 R2로 파일을 전송합니다.
6. 서버가 R2 객체의 실제 크기를 확인한 뒤 상태를 `success`로 변경합니다.
7. 검증 또는 완료 처리 실패 시 객체 삭제와 `fail` 상태 전환을 시도합니다.

### 공개 파일 공유

1. 파일 소유자가 공유를 활성화합니다.
2. DB 함수가 소유권과 업로드 상태를 확인하고 고유 공유 토큰을 생성합니다.
3. 수신자는 `/download?code=...`에서 공유 파일을 조회합니다.
4. 서버가 토큰 형식, 공유 상태, 업로드 상태와 요청 횟수를 검사합니다.
5. 짧은 수명의 R2 signed URL과 전송 토큰으로 다운로드를 준비합니다.

## 보안 설계

- 클라이언트가 전달한 사용자 ID를 권한 판단에 사용하지 않습니다.
- 서버 작업은 `supabase.auth.getUser()`로 현재 사용자를 다시 확인합니다.
- 파일과 폴더 쿼리에 `user_id` 소유권 조건을 적용합니다.
- Supabase RLS가 사용자별 행 접근을 한 번 더 제한하도록 migration을 제공합니다.
- DB trigger가 다른 사용자 폴더를 부모로 지정하는 교차 소유 관계를 차단합니다.
- 사용자별 advisory lock과 quota trigger로 동시 업로드의 용량 제한 우회를 완화합니다.
- R2 저장 경로는 클라이언트가 아닌 서버가 생성합니다.
- R2 access key, Supabase secret key와 전송 토큰 secret은 서버에서만 사용합니다.
- 파일 전송 토큰은 operation을 구분하며 5분 후 만료됩니다.
- 공유 조회는 입력 형식 제한과 요청 횟수 제한을 적용합니다.
- 계정 삭제는 비밀번호 재인증 후 진행합니다.

> `supabase/migrations`의 정책은 migration 파일을 실제 대상 DB에 적용해야 효력이 생깁니다. 파일이 저장소에 존재하는 것만으로 운영 DB의 RLS 적용을 보장하지 않습니다.

## 시작하기

### 요구 사항

- Node.js 20 이상 권장
- pnpm
- Supabase 프로젝트
- Cloudflare R2 bucket과 파일 전송 Worker

### 설치

```bash
pnpm install
```

### 환경변수

루트의 `.env`에 배포 환경에 맞는 값을 설정합니다. 실제 secret을 저장소에 커밋하지 마세요.

```dotenv
# 공개 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_WORKER_ENDPOINT=

# 서버 전용 설정
SUPABASE_SECRET_KEY=
JWT_SECRET=
R2_ENDPOINT=
R2_BUCKET_NAME=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
```

`SUPABASE_SECRET_KEY`, `JWT_SECRET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`에는 절대로 `NEXT_PUBLIC_` 접두사를 붙이지 마세요.

### 개발 서버

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 데이터베이스

현재 보안 migration은 다음 파일에 있습니다.

```text
supabase/migrations/20260710000000_harden_drive_authorization.sql
```

이 migration에는 다음 항목이 포함됩니다.

- `files`, `folders` RLS와 사용자 소유권 정책
- 부모 폴더 소유자 검증 trigger
- 500MB 저장 공간 제한 trigger
- 공유 토큰 unique index
- 공유 활성화/비활성화 DB 함수와 실행 권한

Migration은 대상 환경과 기존 schema를 검토한 뒤 별도로 적용해야 합니다. 애플리케이션 실행만으로 자동 적용되지 않습니다.

## SEO

Next.js metadata route를 사용해 다음 endpoint를 생성합니다.

- `/robots.txt`: 공개 페이지만 허용하고 인증·개인 드라이브·공유 다운로드 경로 제외
- `/sitemap.xml`: 홈, 이용약관, 개인정보 처리방침 제공
- `/manifest.webmanifest`: 서비스 이름, 테마, 아이콘 제공

전역 metadata에는 Open Graph, Twitter card, 한국어 locale, OG 이미지와 `metadataBase`가 설정되어 있습니다. 홈에는 canonical URL과 WebApplication JSON-LD가 포함됩니다.

운영 배포에서는 `NEXT_PUBLIC_BASE_URL`을 실제 HTTPS origin으로 반드시 설정해야 sitemap, canonical, OG 이미지 URL이 올바르게 생성됩니다.

## 검증

변경 범위에 맞춰 다음 명령을 실행합니다.

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

현재 `package.json`에는 자동화 test script가 없습니다. 권한, RLS, 업로드 실패 복구와 공유 링크 동작은 별도의 통합/E2E 테스트가 필요합니다.

## 주요 경로

| 경로 | 접근 | 설명 |
| --- | --- | --- |
| `/` | 공개 | 서비스 랜딩 페이지 |
| `/sign-in` | 공개 | 로그인 |
| `/sign-up` | 공개 | 회원가입 |
| `/download` | 공개 | 공유 코드 기반 다운로드 |
| `/policy` | 공개 | 이용약관 |
| `/privacy` | 공개 | 개인정보 처리방침 |
| `/folders` | 인증 필요 | 루트 드라이브 |
| `/folders/[id]` | 인증 필요 | 하위 폴더 |
| `/profile` | 인증 필요 | 계정 및 저장 공간 관리 |

## 배포 전 확인

- `NEXT_PUBLIC_BASE_URL`이 실제 HTTPS URL인지 확인합니다.
- Supabase RLS migration 적용 여부를 staging에서 검증합니다.
- R2 bucket의 public access가 비활성화되어 있는지 확인합니다.
- Worker가 HMAC 서명, 만료, operation, 사용자와 파일 ID를 모두 검증하는지 확인합니다.
- 사용자 A가 사용자 B의 파일과 폴더에 접근할 수 없는지 통합 테스트합니다.
- `/robots.txt`, `/sitemap.xml`, OG 이미지와 canonical URL을 배포 URL에서 확인합니다.
- 공유 코드가 analytics 또는 요청 로그에 불필요하게 남지 않는지 확인합니다.

## 알려진 한계

- 공개 공유 rate limit은 현재 단일 프로세스 메모리 기반이며 다중 인스턴스 간 공유되지 않습니다.
- 실제 파일 내용 기반 MIME 검증과 악성 파일 검사는 구현되어 있지 않습니다.
- DB와 R2는 하나의 transaction으로 묶이지 않으므로 극단적인 네트워크 실패 시 정합성 점검이 필요할 수 있습니다.
- 자동화 테스트 suite가 아직 없습니다.

## 작업 규칙

저장소 작업 규칙은 [AGENTS.md](./AGENTS.md)를 따릅니다. 패키지 관리자는 pnpm을 사용하며, 패키지 설치·migration 실행·Git commit·환경변수 변경은 명시적인 승인 없이 수행하지 않습니다.
