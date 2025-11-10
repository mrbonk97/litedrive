import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/nav/logo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/nav/footer";

async function Home() {
  return (
    <>
      <main className="">
        <h1 className="sr-only">LiteDrive</h1>
        <header className="p-4 mx-auto max-w-6xl flex items-center justify-between gap-2">
          <Logo />
          <nav className="text-xl font-medium flex gap-2">
            <Button variant={"secondary"} className="py-2" asChild>
              <Link href={"/sign-in"}>로그인</Link>
            </Button>
            <Button className="py-2" asChild>
              <Link href={"/sign-up"}>회원가입</Link>
            </Button>
          </nav>
        </header>
        <section className="p-4 mt-8 sm:mt-8 mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="mx-auto w-fit text-xl sm:text-4xl leading-normal font-bold sm:break-keep">
            최소한의 보안으로 최대한의 속도.
            <br /> 파일만을 위한 가장 단순한 공유 플랫폼.
          </p>
          <Image
            src={"/static/pattern.svg"}
            alt="pattern"
            height={1920}
            width={1920}
            quality={100}
            className="p-8 sm:p-0 rounded"
          />
        </section>
        <section className="mt-20 bg-secondary">
          <div className="p-4 py-14 sm:py-28 mx-auto max-w-6xl">
            <h4 className="text-4xl sm:text-5xl font-bold">너무 간단합니다.</h4>
            <h5 className="mt-2 sm:mt-4 font-medium opacity-70">파일 관리에 필요한 핵심 기능을 확인해보세요</h5>
            <div>
              <p className="mt-20 text-lg sm:text-3xl font-bold opacity-80">대시보드</p>
              <Image
                src={"/static/feature/litedrive-3.png"}
                alt="feature-dashboard"
                height={940}
                width={1660}
                quality={100}
                className="mt-2 sm:mt-4 shadow-2xl rounded"
              />
            </div>
            <div className="mt-40">
              <p className="text-lg sm:text-3xl font-bold opacity-80">파일공유 및 다운로드</p>
              <Image
                src={"/static/feature/litedrive-5.png"}
                alt="feature-share-1"
                height={940}
                width={1660}
                quality={100}
                className="mt-2 sm:mt-4 shadow-2xl rounded"
              />
              <Image
                src={"/static/feature/litedrive-6.png"}
                alt="feature-share-2"
                height={940}
                width={1660}
                quality={100}
                className="mt-8 shadow-2xl rounded"
              />
            </div>
          </div>
        </section>
        <section className="p-4 py-14 sm:py-28 mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-4xl font-bold leading-relaxed">
            평생 무료입니다. <br />
            무엇보다 <span className="text-rose-400">안전</span>하고요. <br />
            그러니, 지금 사용해보세요.
          </h2>

          <ol className="mt-20 space-y-16">
            <li className="p-4 bg-secondary rounded text-4xl font-bold">
              <strong className="text-rose-400">1.</strong> 보안
              <p className="mt-8 text-sm sm:text-lg font-semibold break-keep">
                보안 전문가가 직접 설계하고 취약점 검사를 수행한 시스템입니다. LiteDrive는 안전한 전송을 최우선으로
                생각합니다.
              </p>
            </li>

            <li className="p-4 bg-secondary rounded text-4xl font-bold">
              <strong className="text-rose-400">2.</strong> 완전한 삭제
              <p className="mt-8 text-sm sm:text-lg font-semibold break-keep">
                파일 삭제나 회원 탈퇴 시 <span className="text-rose-400">soft delete는 없습니다.</span>
                모든 데이터는 즉시 완전 삭제되어,
                <span className="text-rose-400">복구가 불가능하도록 설계</span>되었습니다.
              </p>
            </li>

            <li className="p-4 bg-secondary rounded text-4xl font-bold">
              <strong className="text-rose-400">3.</strong> 편의성
              <p className="mt-8 text-sm sm:text-lg font-semibold break-keep">
                단순히 파일만 빠르게 주고받고 싶은데, 매번 2차 인증이 번거로우셨나요? 공용 PC에서 개인 계정 로그인이
                불안하셨다면, LiteDrive는 가볍게 회원가입 후 바로 사용할 수 있습니다.
              </p>
            </li>
          </ol>
        </section>
        <section className="p-4 mb-60 mx-auto max-w-6xl">
          <Button asChild>
            <Link href={"/sign-up"} className="ml-auto block w-fit bg-rose-400">
              <span>시작하기</span>
              <ArrowUpRight />
            </Link>
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
