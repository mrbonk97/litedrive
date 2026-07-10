import { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { UserTopNav } from "@/features/navigation/ui/user-top-nav";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";

export const metadata: Metadata = {
  title: "이용약관",
  description: "LiteDrive 서비스 이용조건과 회원 및 운영자의 권리와 의무를 안내합니다.",
  alternates: {
    canonical: "/policy",
  },
};

async function TermSection({
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

export default async function PolicyPage() {
  const supabse = await createClient();
  const user = await getCurrentUser(supabse);

  return (
    <>
      <UserTopNav user={user} />
      <main className="p-4 mx-auto max-w-5xl">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">이용약관</h1>
          <p className="mt-2 text-lg font-medium text-muted-foreground">
            Litedrive 이용약관
          </p>
        </header>

        <article className="mt-8 space-y-8">
          <TermSection title="제1조 목적">
            <p>
              본 이용약관은 Litedrive 이하 “서비스”의 이용조건, 절차, 회원과
              운영자 간의 권리·의무 및 책임사항, 기타 서비스 이용에 필요한
              사항을 정하는 것을 목적으로 합니다.
            </p>
          </TermSection>

          <TermSection title="제2조 용어의 정의">
            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>

            <OrderedList>
              <li>
                “회원”이란 본 약관에 동의하고 서비스에 가입하여 서비스를
                이용하는 자를 말합니다.
              </li>
              <li>
                “계정”이란 회원이 서비스를 이용하기 위하여 생성한 아이디,
                비밀번호 및 이에 부속되는 이용 정보를 말합니다.
              </li>
              <li>
                “파일”이란 회원이 서비스를 통하여 업로드, 저장, 공유 또는
                다운로드하는 전자적 자료를 말합니다.
              </li>
              <li>
                “공유 링크” 또는 “공유 코드”란 회원이 파일을 제3자와 공유하기
                위하여 생성하거나 제공받는 접근 정보를 말합니다.
              </li>
              <li>“운영자”란 서비스를 제공하고 관리하는 주체를 말합니다.</li>
              <li>“해지”란 회원이 서비스 이용계약을 종료하는 것을 말합니다.</li>
            </OrderedList>
          </TermSection>

          <TermSection title="제3조 약관의 효력 및 변경">
            <OrderedList>
              <li>
                본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게
                공지함으로써 효력이 발생합니다.
              </li>
              <li>
                운영자는 필요한 경우 관련 법령을 위반하지 않는 범위에서 본
                약관을 변경할 수 있습니다.
              </li>
              <li>
                운영자가 약관을 변경하는 경우, 변경된 약관의 적용일자 및 변경
                내용을 서비스 내 공지사항 또는 별도 안내를 통하여 공지합니다.
              </li>
              <li>
                회원이 변경된 약관의 적용일 이후에도 서비스를 계속 이용하는
                경우, 변경된 약관에 동의한 것으로 봅니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제4조 이용계약의 체결">
            <OrderedList>
              <li>
                이용계약은 서비스를 이용하려는 자가 본 약관에 동의하고
                회원가입을 신청한 뒤, 운영자가 이를 승낙함으로써 체결됩니다.
              </li>
              <li>
                회원은 가입 시 서비스에서 요구하는 정보를 정확하게 입력하여야
                합니다.
              </li>
              <li>
                타인의 정보를 도용하거나 허위 정보를 입력한 경우, 운영자는
                이용계약을 취소하거나 서비스 이용을 제한할 수 있습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제5조 계정 관리 및 복구 제한">
            <OrderedList>
              <li>
                회원은 자신의 아이디와 비밀번호를 직접 관리하여야 하며, 이를
                제3자에게 제공하거나 이용하게 해서는 안 됩니다.
              </li>
              <li>
                회원의 아이디 또는 비밀번호 관리 소홀로 인하여 발생한 손해에
                대한 책임은 회원 본인에게 있습니다.
              </li>
              <li>
                서비스는 이메일 주소를 수집하지 않습니다. 이에 따라 회원이
                아이디 또는 비밀번호를 분실한 경우, 계정 복구, 비밀번호 재설정
                및 업로드한 파일의 복구가 불가능할 수 있습니다.
              </li>
              <li>
                회원은 이메일 미수집 정책으로 인해 계정 분실 시 본인 확인 및
                계정 복구가 제한될 수 있음을 이해하고 서비스에 가입합니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제6조 서비스의 내용">
            <p>서비스는 회원에게 다음과 같은 기능을 제공합니다.</p>

            <UnorderedList>
              <li>파일 업로드 및 보관 기능</li>
              <li>파일 다운로드 기능</li>
              <li>공유 링크 또는 공유 코드를 통한 파일 공유 기능</li>
              <li>파일명 변경, 삭제 등 파일 관리 기능</li>
              <li>기타 운영자가 정하는 부가 기능</li>
            </UnorderedList>

            <p>
              운영자는 서비스의 품질 개선, 보안 강화, 기능 변경 또는 운영상
              필요에 따라 서비스의 전부 또는 일부를 변경할 수 있습니다.
            </p>
          </TermSection>

          <TermSection title="제7조 파일 및 공유 링크 관리">
            <OrderedList>
              <li>
                회원은 본인이 적법하게 보유하거나 공유할 권한이 있는 파일만
                업로드하여야 합니다.
              </li>
              <li>
                회원이 업로드한 파일과 그 파일의 공유로 인해 발생하는 책임은
                회원 본인에게 있습니다.
              </li>
              <li>
                공유 링크 또는 공유 코드를 가진 제3자는 해당 파일에 접근하거나
                다운로드할 수 있습니다.
              </li>
              <li>
                회원은 공유 링크 또는 공유 코드가 외부에 노출되지 않도록
                관리하여야 합니다.
              </li>
              <li>
                회원의 공유 링크 또는 공유 코드 관리 소홀로 인해 발생한 파일
                유출, 다운로드, 제3자의 접근 등에 대하여 운영자는 책임을 지지
                않습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제8조 회원의 의무">
            <OrderedList>
              <li>
                회원은 본 약관, 운영정책, 서비스 내 공지사항 및 관련 법령을
                준수하여야 합니다.
              </li>
              <li>
                회원은 서비스를 정상적인 목적과 방법으로 이용하여야 하며,
                서비스의 운영을 방해하는 행위를 해서는 안 됩니다.
              </li>
              <li>
                회원은 운영자 또는 제3자의 권리, 명예, 신용, 개인정보,
                지적재산권 기타 정당한 이익을 침해해서는 안 됩니다.
              </li>
              <li>
                회원은 자신의 계정, 파일, 공유 링크 및 공유 코드를 안전하게
                관리하여야 합니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제9조 금지행위">
            <p>
              회원은 서비스를 이용하면서 다음 각 호의 행위를 해서는 안 됩니다.
            </p>

            <OrderedList>
              <li>타인의 계정 또는 정보를 도용하는 행위</li>
              <li>허위 정보를 입력하거나 운영자를 기망하는 행위</li>
              <li>
                타인의 개인정보가 포함된 파일을 무단으로 업로드하거나 공유하는
                행위
              </li>
              <li>
                저작권, 상표권, 영업비밀 등 제3자의 권리를 침해하는 파일을
                업로드하거나 공유하는 행위
              </li>
              <li>
                악성코드, 바이러스, 해킹 도구 또는 서비스 장애를 유발할 수 있는
                자료를 업로드하거나 공유하는 행위
              </li>
              <li>
                불법 촬영물, 음란물, 폭력적 자료, 범죄와 관련된 자료 등 관련
                법령에 위반되는 파일을 업로드하거나 공유하는 행위
              </li>
              <li>
                서비스의 보안 기능을 우회하거나 취약점을 탐색, 악용, 공개하는
                행위
              </li>
              <li>
                자동화된 수단을 이용하여 서비스에 과도한 부하를 발생시키는 행위
              </li>
              <li>
                운영자의 사전 동의 없이 서비스를 영리 목적으로 부정 이용하는
                행위
              </li>
              <li>기타 관련 법령, 본 약관 또는 공서양속에 반하는 행위</li>
            </OrderedList>
          </TermSection>

          <TermSection title="제10조 파일의 보관 및 삭제">
            <OrderedList>
              <li>
                회원이 업로드한 파일은 회원이 직접 삭제하거나 회원 탈퇴 시
                삭제될 수 있습니다.
              </li>
              <li>
                운영자는 저장 공간 관리, 보안, 장애 대응, 법령 위반 신고 또는
                서비스 운영상 필요한 경우 파일의 접근을 제한하거나 파일을 삭제할
                수 있습니다.
              </li>
              <li>
                회원이 삭제한 파일 또는 탈퇴로 인해 삭제된 파일은 복구할 수
                없습니다.
              </li>
              <li>
                시스템 백업, 장애 대응, 보안 로그 등 기술적 사유로 일부 정보가
                일정 기간 남아 있을 수 있으며, 해당 정보는 복구 제공 목적이 아닌
                서비스 운영 및 보안 목적으로만 처리됩니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제11조 서비스 이용 제한">
            <OrderedList>
              <li>
                운영자는 회원이 본 약관을 위반하거나 서비스 운영을 방해한다고
                판단되는 경우, 사전 통지 없이 서비스 이용을 제한할 수 있습니다.
              </li>
              <li>
                이용 제한에는 파일 삭제, 공유 중단, 다운로드 제한, 계정 정지,
                이용계약 해지 등이 포함될 수 있습니다.
              </li>
              <li>
                회원의 행위가 관련 법령에 위반된다고 판단되는 경우, 운영자는
                관계 기관의 요청 또는 법령상 의무에 따라 필요한 조치를 할 수
                있습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제12조 서비스의 중단">
            <OrderedList>
              <li>
                서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만,
                운영상 또는 기술상 필요한 경우 서비스의 전부 또는 일부가
                일시적으로 중단될 수 있습니다.
              </li>
              <li>
                운영자는 시스템 점검, 장애 복구, 서버 이전, 보안 대응, 서비스
                개선 등을 위하여 서비스를 일시 중단할 수 있습니다.
              </li>
              <li>
                천재지변, 정전, 통신 장애, 외부 서비스 장애, 해킹, 보안 사고 등
                운영자가 통제하기 어려운 사유가 발생한 경우 사전 공지 없이
                서비스가 중단될 수 있습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제13조 회원 탈퇴 및 이용계약 해지">
            <OrderedList>
              <li>
                회원은 서비스에서 제공하는 탈퇴 기능을 통하여 언제든지
                이용계약을 해지할 수 있습니다.
              </li>
              <li>
                회원이 탈퇴하는 경우 계정 정보 및 업로드한 파일은 삭제될 수
                있으며, 삭제된 정보와 파일은 복구할 수 없습니다.
              </li>
              <li>
                운영자는 회원이 본 약관을 중대하게 위반한 경우 이용계약을 해지할
                수 있습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제14조 지적재산권">
            <OrderedList>
              <li>
                회원이 서비스에 업로드한 파일에 대한 권리는 회원 또는 정당한
                권리자에게 귀속됩니다.
              </li>
              <li>
                회원은 자신이 업로드한 파일에 대하여 필요한 권리를 보유하고
                있거나 적법한 이용 권한을 가지고 있음을 보증합니다.
              </li>
              <li>
                운영자는 서비스 제공, 파일 저장, 공유, 다운로드, 보안 점검, 장애
                대응 등 서비스 운영에 필요한 범위 내에서 회원의 파일을 처리할 수
                있습니다.
              </li>
              <li>
                서비스의 화면, 로고, 디자인, 코드, 기능, 명칭 등 서비스 자체에
                관한 권리는 운영자에게 귀속됩니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제15조 손해배상 및 책임 제한">
            <OrderedList>
              <li>
                회원이 본 약관 또는 관련 법령을 위반하여 운영자 또는 제3자에게
                손해를 발생시킨 경우, 회원은 그 손해를 배상할 책임이 있습니다.
              </li>
              <li>
                운영자는 무료로 제공되는 서비스의 이용과 관련하여 운영자의 고의
                또는 중대한 과실이 없는 한 회원에게 발생한 손해에 대하여 책임을
                지지 않습니다.
              </li>
              <li>
                운영자는 회원의 계정 관리 소홀, 공유 링크 노출, 파일의 부적절한
                업로드 또는 공유로 인해 발생한 손해에 대하여 책임을 지지
                않습니다.
              </li>
              <li>
                운영자는 천재지변, 통신 장애, 외부 인프라 장애, 보안 사고 등
                운영자가 합리적으로 통제할 수 없는 사유로 인해 발생한 손해에
                대하여 책임을 지지 않습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제16조 면책">
            <OrderedList>
              <li>
                운영자는 회원이 서비스를 이용하여 기대하는 특정한 목적이나
                결과를 보장하지 않습니다.
              </li>
              <li>
                운영자는 회원이 업로드, 저장, 공유 또는 다운로드한 파일의 내용,
                정확성, 적법성, 안전성에 대하여 책임을 지지 않습니다.
              </li>
              <li>
                운영자는 회원 간 또는 회원과 제3자 간에 파일 공유, 다운로드,
                이용 등을 매개로 발생한 분쟁에 개입할 의무가 없습니다.
              </li>
              <li>
                운영자는 회원이 서비스를 이용하는 과정에서 직접 삭제한 파일,
                탈퇴로 인해 삭제된 계정 및 파일, 분실한 계정에 대하여 복구
                의무를 부담하지 않습니다.
              </li>
            </OrderedList>
          </TermSection>

          <TermSection title="제17조 개인정보 보호">
            <p>
              운영자는 서비스 제공 과정에서 필요한 개인정보를 관련 법령 및
              개인정보처리방침에 따라 처리합니다. 개인정보의 수집, 이용, 보관,
              파기, 위탁, 국외 이전, 쿠키 및 분석 도구 사용 등에 관한 구체적인
              사항은 별도의 개인정보처리방침에서 정합니다.
            </p>
          </TermSection>

          <TermSection title="제18조 준거법 및 관할">
            <OrderedList>
              <li>본 약관은 대한민국 법령에 따라 해석되고 적용됩니다.</li>
              <li>
                서비스 이용과 관련하여 운영자와 회원 사이에 분쟁이 발생한 경우,
                운영자와 회원은 성실히 협의하여 해결하도록 노력합니다.
              </li>
              <li>
                협의로 분쟁이 해결되지 않는 경우, 관련 법령에서 정한 절차와 관할
                법원에 따릅니다.
              </li>
            </OrderedList>
          </TermSection>

          <section className="pt-8 border-t">
            <h2 className="text-2xl font-semibold tracking-tight">부칙</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>본 약관은 2026년 7월 6일부터 시행합니다.</p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
