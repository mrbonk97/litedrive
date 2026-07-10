import { Footer } from "@/components/footer";
import { UserTopNav } from "@/features/navigation/ui/user-top-nav";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { type ReactNode } from "react";

const PRIVACY_EMAIL = "privacy@hypersoso.com";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "LiteDrive가 처리하는 개인정보 항목, 이용 목적, 보관 및 파기 기준을 안내합니다.",
  alternates: {
    canonical: "/privacy",
  },
};

function PrivacySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pt-8 border-t">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function OrderedList({ children }: { children: ReactNode }) {
  return <ol className="pl-4 list-decimal space-y-2">{children}</ol>;
}

function UnorderedList({ children }: { children: ReactNode }) {
  return <ul className="pl-4 list-disc space-y-2">{children}</ul>;
}

function PolicyTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="bg-muted/50 text-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} className="p-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-4 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PrivacyPage() {
  const supabse = await createClient();
  const user = await getCurrentUser(supabse);

  return (
    <>
      <UserTopNav user={user} />
      <main className="p-4 mx-auto max-w-5xl">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">
            개인정보처리방침
          </h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground">
            Litedrive 개인정보처리방침
          </p>
        </header>

        <article className="mt-8 space-y-8">
          <PrivacySection title="제1조 개인정보처리방침의 목적">
            <p>
              hypersoso 이하 “회사”는 Litedrive 이하 “서비스”를 운영하며,
              개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고
              개인정보와 관련한 고충을 신속하고 원활하게 처리하기 위하여 본
              개인정보처리방침을 수립·공개합니다.
            </p>

            <p>
              본 개인정보처리방침은 서비스가 처리하는 개인정보의 항목, 처리
              목적, 보유 기간, 제3자 제공, 처리위탁, 국외 이전, 파기, 이용자의
              권리 및 행사 방법 등을 안내합니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제2조 개인정보의 처리 목적">
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>

            <OrderedList>
              <li>
                회원 가입 및 계정 관리
                <UnorderedList>
                  <li>회원 가입 의사 확인</li>
                  <li>회원 식별 및 계정 관리</li>
                  <li>서비스 부정 이용 방지</li>
                  <li>약관 위반 행위 확인 및 조치</li>
                  <li>계정 보안 및 접근 권한 관리</li>
                </UnorderedList>
              </li>

              <li>
                파일 업로드, 보관 및 공유 기능 제공
                <UnorderedList>
                  <li>파일 업로드 및 다운로드 기능 제공</li>
                  <li>파일명, 파일 크기, 파일 경로 등 파일 관리</li>
                  <li>Cloudflare R2를 통한 실제 파일 저장</li>
                  <li>공유 링크 또는 공유 코드를 통한 파일 공유</li>
                  <li>파일 삭제, 이름 변경 등 이용자 요청 처리</li>
                </UnorderedList>
              </li>

              <li>
                서비스 안정성 및 보안 관리
                <UnorderedList>
                  <li>비정상 접근 및 부정 이용 탐지</li>
                  <li>서비스 장애 대응</li>
                  <li>보안 사고 예방 및 대응</li>
                  <li>로그 분석 및 시스템 운영 관리</li>
                </UnorderedList>
              </li>

              <li>
                서비스 개선 및 통계 분석
                <UnorderedList>
                  <li>서비스 이용 현황 분석</li>
                  <li>사용성 개선</li>
                  <li>오류 및 성능 개선</li>
                  <li>접속 환경에 따른 서비스 최적화</li>
                </UnorderedList>
              </li>

              <li>
                문의 및 고충 처리
                <UnorderedList>
                  <li>이용자 문의 확인</li>
                  <li>민원 사항 확인 및 처리</li>
                  <li>처리 결과 안내</li>
                </UnorderedList>
              </li>
            </OrderedList>

            <p>
              회사는 위 목적 외의 용도로 개인정보를 이용하지 않으며, 이용 목적이
              변경되는 경우 관련 법령에 따라 필요한 조치를 이행합니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제3조 처리하는 개인정보 항목">
            <p>
              서비스는 간편한 파일 공유를 제공하기 위하여 최소한의 개인정보만
              처리합니다. 서비스는 회원가입 필수 항목으로 이메일 주소, 이름,
              전화번호, 주소를 수집하지 않습니다.
            </p>

            <PolicyTable
              headers={["구분", "처리 항목", "비고"]}
              rows={[
                [
                  "회원 가입 및 계정 관리",
                  "아이디, 비밀번호",
                  "회원 정보는 Supabase에 저장됩니다. 비밀번호는 원문으로 저장하지 않으며, 인증을 위해 암호화 또는 해시 처리된 형태로 처리됩니다.",
                ],
                [
                  "파일 메타데이터 관리",
                  "파일명, 파일 크기, 파일 형식, 파일 저장 경로, 객체 키, 업로드 일시, 수정 일시, 삭제 여부",
                  "파일 메타데이터는 Supabase에 저장될 수 있습니다.",
                ],
                [
                  "실제 업로드 파일 저장",
                  "이용자가 업로드한 파일의 내용 및 파일 객체",
                  "실제 업로드 파일은 Cloudflare R2에 저장됩니다. 파일 자체에는 이용자 또는 제3자의 개인정보가 포함될 수 있습니다.",
                ],
                [
                  "파일 공유",
                  "공유 링크, 공유 코드, 공유 토큰, 공유 상태, 다운로드 요청 정보",
                  "공유 링크 또는 공유 코드를 가진 제3자는 해당 파일에 접근하거나 다운로드할 수 있습니다.",
                ],
                [
                  "서비스 이용 과정에서 자동 생성되는 정보",
                  "IP 주소, 브라우저 정보, 기기 정보, 운영체제 정보, 접속 일시, 이용 기록, 오류 로그",
                  "보안, 장애 대응, 부정 이용 방지 및 서비스 개선을 위해 처리될 수 있습니다.",
                ],
                [
                  "분석 도구 사용",
                  "쿠키, 서비스 이용 기록, 페이지 방문 기록, 기기 및 브라우저 관련 정보",
                  "Google Analytics를 통해 처리될 수 있으며, 개인을 직접 식별할 수 있는 정보가 전송되지 않도록 관리합니다.",
                ],
                [
                  "문의 처리",
                  "이용자가 문의 과정에서 직접 제공하는 정보",
                  "문의 내용에 따라 답변 및 처리를 위해 필요한 범위에서만 처리합니다.",
                ],
              ]}
            />

            <p>
              서비스는 이메일 주소를 수집하지 않으므로, 이용자가 아이디 또는
              비밀번호를 분실한 경우 계정 복구, 비밀번호 재설정 및 업로드한
              파일의 복구가 불가능할 수 있습니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제4조 개인정보의 처리 및 보유 기간">
            <p>
              회사는 개인정보의 처리 목적이 달성되거나 이용자가 탈퇴하는 경우
              지체 없이 해당 개인정보를 파기합니다. 다만, 관계 법령에 따라
              보관할 필요가 있거나 보안, 장애 대응, 분쟁 처리 등 정당한 사유가
              있는 경우에는 필요한 기간 동안 보관할 수 있습니다.
            </p>

            <PolicyTable
              headers={["구분", "보유 기간"]}
              rows={[
                [
                  "회원 계정 정보",
                  "회원 탈퇴 시까지. 단, 부정 이용 방지, 분쟁 처리, 법령상 의무 이행을 위해 필요한 경우 해당 목적 달성 시까지 보관할 수 있습니다.",
                ],
                [
                  "파일 메타데이터",
                  "이용자가 파일을 삭제하거나 회원 탈퇴 시까지. 단, 백업, 장애 대응, 보안 조치 등 기술적 사유로 일정 기간 남아 있을 수 있습니다.",
                ],
                [
                  "실제 업로드 파일",
                  "이용자가 파일을 삭제하거나 회원 탈퇴 시까지. 단, Cloudflare R2의 저장소, 백업, 캐시, 장애 대응 등 기술적 사유로 일정 기간 남아 있을 수 있습니다.",
                ],
                [
                  "공유 링크 및 공유 코드 정보",
                  "공유가 해제되거나 파일이 삭제될 때까지. 단, 보안 및 부정 이용 방지를 위해 필요한 로그는 별도로 보관될 수 있습니다.",
                ],
                [
                  "접속 로그 및 보안 로그",
                  "서비스 보안, 장애 대응 및 부정 이용 방지를 위해 필요한 기간. 관련 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간까지 보관합니다.",
                ],
                [
                  "문의 처리 기록",
                  "문의 처리 완료 후 분쟁 대응 및 이력 관리를 위해 필요한 기간까지 보관할 수 있습니다.",
                ],
              ]}
            />
          </PrivacySection>

          <PrivacySection title="제5조 개인정보의 제3자 제공">
            <p>
              회사는 이용자의 개인정보를 제2조에서 명시한 처리 목적 범위
              내에서만 처리하며, 이용자의 동의가 있거나 법령에 특별한 규정이
              있는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.
            </p>

            <p>
              다만, 수사기관, 법원, 감독기관 등 권한 있는 기관이 관련 법령에
              따라 적법한 절차로 요청하는 경우 필요한 범위에서 정보를 제공할 수
              있습니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제6조 개인정보처리의 위탁">
            <p>
              회사는 안정적인 서비스 제공, 호스팅, 데이터 저장, 파일 저장, 분석
              및 서비스 개선을 위하여 아래와 같이 개인정보 처리 업무의 일부를
              외부 서비스에 위탁할 수 있습니다.
            </p>

            <PolicyTable
              headers={["수탁자", "위탁 업무", "처리되는 정보"]}
              rows={[
                [
                  "Vercel Inc.",
                  "웹 애플리케이션 호스팅, 배포, 서버리스 실행 환경 제공, 보안 및 장애 대응",
                  "접속 로그, IP 주소, 기기 및 브라우저 정보, 서비스 요청 정보 등",
                ],
                [
                  "Supabase Inc.",
                  "회원 인증, 데이터베이스, 파일 메타데이터 저장, 공유 정보 저장, 백엔드 인프라 제공",
                  "아이디, 암호화 또는 해시 처리된 비밀번호, 파일 메타데이터, 공유 정보, 접속 정보 등",
                ],
                [
                  "Cloudflare, Inc.",
                  "Cloudflare R2를 통한 실제 업로드 파일 저장, 파일 전송, 보안 및 장애 대응",
                  "이용자가 업로드한 파일, 파일 객체, 객체 키, 파일 요청 정보, 접속 로그 등",
                ],
                [
                  "Google LLC",
                  "Google Analytics를 통한 서비스 이용 통계 분석",
                  "쿠키, 서비스 이용 기록, 페이지 방문 기록, 기기 및 브라우저 관련 정보 등",
                ],
              ]}
            />

            <p>
              회사는 위탁계약 또는 각 수탁자의 서비스 약관 및 데이터 처리 조건에
              따라 개인정보가 안전하게 처리되도록 필요한 조치를 합니다. 위탁
              업무의 내용 또는 수탁자가 변경되는 경우 본 개인정보처리방침을
              통하여 공개합니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제7조 개인정보의 국외 이전">
            <p>
              회사는 Vercel, Supabase, Cloudflare R2, Google Analytics 등 국외
              사업자가 제공하는 클라우드, 파일 저장 및 분석 서비스를 이용하므로,
              서비스 제공 과정에서 일부 정보가 국외에서 처리될 수 있습니다.
            </p>

            <p>
              Cloudflare R2는 버킷 생성 시 관할 지역을 지정할 수 있으나, 회사의
              실제 설정 및 각 수탁자의 인프라 운영 방식에 따라 개인정보가
              처리되는 국가가 달라질 수 있습니다.
            </p>

            <PolicyTable
              headers={[
                "이전받는 자",
                "이전 국가",
                "이전 항목",
                "이전 목적",
                "보유 및 이용 기간",
              ]}
              rows={[
                [
                  "Vercel Inc.",
                  "미국 등 Vercel 및 하위 처리자가 운영하는 인프라 소재 국가",
                  "접속 로그, IP 주소, 기기 및 브라우저 정보, 서비스 요청 정보 등",
                  "서비스 호스팅, 배포, 보안, 장애 대응 및 성능 개선",
                  "서비스 제공 목적 달성 시까지 또는 위탁계약 및 관련 정책에서 정한 기간까지",
                ],
                [
                  "Supabase Inc.",
                  "미국 등 Supabase 및 하위 처리자가 운영하는 인프라 소재 국가",
                  "아이디, 암호화 또는 해시 처리된 비밀번호, 파일 메타데이터, 공유 정보, 접속 정보 등",
                  "회원 인증, 데이터베이스, 파일 메타데이터 저장, 공유 정보 저장, 백엔드 인프라 제공",
                  "서비스 제공 목적 달성 시까지 또는 위탁계약 및 관련 정책에서 정한 기간까지",
                ],
                [
                  "Cloudflare, Inc.",
                  "미국 등 Cloudflare 및 하위 처리자가 운영하는 인프라 소재 국가",
                  "이용자가 업로드한 파일, 파일 객체, 객체 키, 파일 요청 정보, 접속 로그 등",
                  "Cloudflare R2를 통한 실제 업로드 파일 저장, 파일 전송, 보안 및 장애 대응",
                  "서비스 제공 목적 달성 시까지 또는 위탁계약 및 관련 정책에서 정한 기간까지",
                ],
                [
                  "Google LLC",
                  "미국 등 Google이 서비스를 제공하는 국가",
                  "쿠키, 서비스 이용 기록, 페이지 방문 기록, 기기 및 브라우저 관련 정보 등",
                  "서비스 이용 통계 분석 및 서비스 개선",
                  "Google Analytics 설정 및 Google 정책에서 정한 기간까지",
                ],
              ]}
            />

            <p>
              국외 이전과 관련한 세부 사항은 각 수탁자의 정책 및 서비스 설정에
              따라 달라질 수 있으며, 회사는 필요한 경우 본 개인정보처리방침을
              통해 변경 사항을 안내합니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제8조 개인정보의 파기">
            <OrderedList>
              <li>
                회사는 개인정보 보유 기간의 경과, 처리 목적 달성, 회원 탈퇴,
                파일 삭제 등 개인정보가 불필요하게 되었을 때 지체 없이 해당
                개인정보를 파기합니다.
              </li>
              <li>
                전자적 파일 형태로 기록·저장된 개인정보는 복구 또는 재생할 수
                없도록 삭제합니다.
              </li>
              <li>
                종이 문서에 개인정보가 기록·저장된 경우 분쇄하거나 소각하여
                파기합니다.
              </li>
              <li>
                백업 데이터, 캐시, 로그 데이터는 기술적 특성상 즉시 삭제되지
                않을 수 있으며, 정해진 보관 주기에 따라 순차적으로 삭제됩니다.
              </li>
            </OrderedList>
          </PrivacySection>

          <PrivacySection title="제9조 정보주체의 권리와 행사 방법">
            <OrderedList>
              <li>
                이용자는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제,
                처리정지 요구 등의 권리를 행사할 수 있습니다.
              </li>
              <li>
                권리 행사는 개인정보 보호책임자 또는 개인정보 문의 창구를 통해
                요청할 수 있습니다.
              </li>
              <li>
                회사는 이용자의 요청에 대해 관련 법령에 따라 지체 없이
                조치합니다.
              </li>
              <li>
                이용자가 개인정보의 오류에 대한 정정을 요구한 경우, 회사는
                정정을 완료하기 전까지 해당 개인정보를 이용하거나 제공하지
                않습니다.
              </li>
              <li>
                법령상 보관 의무가 있거나 다른 사람의 권리와 자유를 침해할
                우려가 있는 경우, 개인정보의 삭제 또는 처리정지 요청이 제한될 수
                있습니다.
              </li>
              <li>
                서비스는 이메일 주소를 수집하지 않으므로, 계정 소유 여부 확인이
                제한될 수 있습니다. 이에 따라 아이디 또는 비밀번호를 분실한 경우
                계정 복구, 비밀번호 재설정 및 업로드한 파일의 복구가 불가능할 수
                있습니다.
              </li>
            </OrderedList>
          </PrivacySection>

          <PrivacySection title="제10조 개인정보의 안전성 확보조치">
            <p>
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
              있습니다.
            </p>

            <OrderedList>
              <li>
                관리적 조치: 개인정보 접근 권한 관리, 운영자 계정 관리, 개인정보
                보호 관련 정책 수립
              </li>
              <li>
                기술적 조치: 비밀번호 원문 미저장, 접근 권한 제한, 전송 구간
                암호화, 보안 로그 관리, 비정상 접근 탐지
              </li>
              <li>
                파일 저장 보안 조치: Cloudflare R2 저장소 접근 권한 관리, 공개
                접근 제한, 공유 링크 및 공유 코드 기반 접근 제어
              </li>
              <li>
                물리적 조치: 클라우드 인프라 제공자의 물리적 보안 조치 활용
              </li>
            </OrderedList>
          </PrivacySection>

          <PrivacySection title="제11조 쿠키 및 자동 수집 장치의 이용">
            <OrderedList>
              <li>
                회사는 로그인 상태 유지, 보안, 서비스 이용 분석 및 사용성 개선을
                위해 쿠키 또는 이와 유사한 기술을 사용할 수 있습니다.
              </li>
              <li>
                쿠키는 웹사이트 운영 서버가 이용자의 브라우저에 보내는 소량의
                정보이며, 이용자의 브라우저 또는 기기에 저장될 수 있습니다.
              </li>
              <li>
                이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
                있습니다. 다만, 쿠키 저장을 거부할 경우 로그인 유지 등 일부
                기능의 이용이 제한될 수 있습니다.
              </li>
              <li>
                회사는 Google Analytics를 사용하여 방문 기록, 이용 형태, 접속
                환경 등 통계 정보를 분석할 수 있습니다.
              </li>
              <li>
                회사는 Google Analytics로 이메일 주소, 전화번호, 주민등록번호,
                파일 내용 등 개인을 직접 식별할 수 있는 정보를 전송하지 않도록
                관리합니다.
              </li>
              <li>
                공유 링크, 공유 코드, 공유 토큰, 파일명 등 민감한 정보가 분석
                도구로 전송되지 않도록 서비스 설정 및 구현을 관리합니다.
              </li>
            </OrderedList>

            <div>
              <p className="font-medium text-foreground">
                주요 브라우저의 쿠키 설정 방법
              </p>

              <UnorderedList>
                <li>
                  Chrome: 설정 &gt; 개인정보 보호 및 보안 &gt; 서드 파티 쿠키
                  또는 인터넷 사용 기록 삭제
                </li>
                <li>
                  Edge: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터
                  관리 및 삭제
                </li>
                <li>
                  Safari: 설정 &gt; 개인정보 보호 및 보안 &gt; 쿠키 차단 또는
                  방문 기록 및 웹 사이트 데이터 지우기
                </li>
              </UnorderedList>
            </div>
          </PrivacySection>

          <PrivacySection title="제12조 파일에 포함된 개인정보에 관한 안내">
            <OrderedList>
              <li>
                이용자가 업로드하는 파일에는 개인정보, 민감정보, 저작물,
                영업비밀 등이 포함될 수 있습니다.
              </li>
              <li>
                이용자는 자신이 적법하게 보유하거나 공유할 권한이 있는 파일만
                업로드해야 합니다.
              </li>
              <li>
                공유 링크 또는 공유 코드를 가진 사람은 해당 파일에 접근하거나
                다운로드할 수 있으므로, 이용자는 공유 링크 및 공유 코드를
                안전하게 관리해야 합니다.
              </li>
              <li>
                이용자의 부주의로 공유 링크 또는 공유 코드가 외부에 노출되어
                발생한 문제에 대해서는 이용자 본인에게 책임이 있을 수 있습니다.
              </li>
              <li>
                회사는 법령 위반 신고, 권리 침해 신고, 보안 사고 대응 등 필요한
                경우 파일 접근을 제한하거나 삭제할 수 있습니다.
              </li>
            </OrderedList>
          </PrivacySection>

          <PrivacySection title="제13조 만 14세 미만 아동의 개인정보 처리">
            <p>
              회사는 원칙적으로 만 14세 미만 아동의 회원가입 및 개인정보 처리를
              의도하지 않습니다. 만 14세 미만 아동이 법정대리인의 동의 없이
              서비스를 이용한 사실이 확인되는 경우, 회사는 해당 계정의 이용을
              제한하거나 필요한 조치를 할 수 있습니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제14조 개인정보 보호책임자">
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄하고, 개인정보 처리와
              관련한 이용자의 불만 처리 및 피해구제를 위하여 아래와 같이
              개인정보 보호책임자를 지정합니다.
            </p>

            <PolicyTable
              headers={["구분", "내용"]}
              rows={[
                ["개인정보 보호책임자", "hypersoso 운영자"],
                ["직책", "운영자"],
                ["문의", PRIVACY_EMAIL],
              ]}
            />

            <p>
              개인정보 관련 문의, 불만 처리, 피해구제 요청은 위 연락처를 통해
              접수할 수 있습니다. 회사는 이용자의 문의에 대해 지체 없이 답변 및
              처리하도록 노력합니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제15조 개인정보 열람청구">
            <p>
              이용자는 개인정보 보호법에 따른 개인정보 열람청구를 아래의 창구를
              통해 요청할 수 있습니다.
            </p>

            <PolicyTable
              headers={["구분", "내용"]}
              rows={[
                ["개인정보 열람청구 접수·처리 담당", "hypersoso 대표"],
                ["문의", PRIVACY_EMAIL],
              ]}
            />

            <p>
              회사는 이용자의 개인정보 열람청구가 신속하게 처리되도록
              노력합니다.
            </p>
          </PrivacySection>

          <PrivacySection title="제16조 권익침해 구제 방법">
            <p>
              이용자는 개인정보 침해에 대한 상담이나 피해구제를 위해 아래 기관에
              문의할 수 있습니다.
            </p>

            <OrderedList>
              <li>개인정보 분쟁조정위원회: 1833-6972</li>
              <li>개인정보침해신고센터: 국번없이 118</li>
              <li>대검찰청: 국번없이 1301</li>
              <li>경찰청: 국번없이 182</li>
            </OrderedList>
          </PrivacySection>

          <PrivacySection title="제17조 개인정보처리방침의 변경">
            <OrderedList>
              <li>본 개인정보처리방침은 시행일부터 적용됩니다.</li>
              <li>
                회사는 개인정보처리방침을 변경하는 경우 서비스 내 공지사항 또는
                개인정보처리방침 페이지를 통해 변경 내용을 공개합니다.
              </li>
              <li>
                수집하는 개인정보 항목, 처리 목적, 위탁 및 국외 이전 사항 등
                중요한 내용이 변경되는 경우 관련 법령에 따라 필요한 조치를
                취합니다.
              </li>
            </OrderedList>
          </PrivacySection>

          <section className="pt-8 border-t">
            <h2 className="text-2xl font-semibold tracking-tight">부칙</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>본 개인정보처리방침은 2026년 7월 7일부터 시행합니다.</p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
