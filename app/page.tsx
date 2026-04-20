import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/nav/logo";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/nav/footer";
import {
  BrickWallShield,
  FingerprintPattern,
  MousePointerClick,
  Rabbit,
  Sparkle,
} from "lucide-react";

function LandingPage() {
  return (
    <>
      <main className="p-4 mx-auto max-w-7xl break-keep">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-2">
            <Button className="py-2">
              <Link href={"/sign-up"}>회원가입</Link>
            </Button>
            <Button variant={"secondary"} className="py-2" asChild>
              <Link href={"/sign-in"}>로그인</Link>
            </Button>
          </div>
        </header>

        <h1 className="mt-8 text-7xl font-bold leading-tight md:leading-normal">
          파일 공유 가장 빠르고
          <br className="md:block" />
          <strong className="font-bold text-rose-400">안전하게</strong>
        </h1>

        <h2 className="mt-4 max-w-2xl md:text-lg text-muted-foreground">
          Litedrive는 파일 업로드와 링크 공유에만 집중한 가벼운 드라이브입니다.
          복잡한 협업 기능과 불필요한 설정을 덜어내고, 누구나 몇 초 안에 파일을
          올리고 바로 전달할 수 있게 만들었습니다.
        </h2>

        <section className="mt-16 md:mt-32">
          <Sparkle
            strokeWidth={1.6}
            className="mx-auto md:mx-0 h-32 w-32 text-rose-400"
          />
          <div className="flex md:hidden justify-center gap-4">
            <Sparkle strokeWidth={1.6} className="h-32 w-32 text-rose-400" />
            <Sparkle strokeWidth={1.6} className="h-32 w-32 text-rose-400" />
          </div>
        </section>

        <section className="mt-32">
          <ul className="grid md:grid-cols-3 gap-4 md:gap-8">
            <li className="p-4 md:p-8 rounded-2xl bg-rose-100 dark:bg-secondary">
              <h4 className="text-lg md:text-2xl font-bold text-rose-400">
                빠르고 간편한 공유
              </h4>
              <p className="mt-4 md:text-lg font-medium">
                회원가입부터 파일 공유까지 단 몇 단계. 링크 생성만으로 즉시
                공유가 가능합니다.
              </p>
              <Rabbit className="my-16 mx-auto text-rose-400" size={72} />
            </li>

            <li className="p-4 md:p-8 rounded-2xl bg-rose-100 dark:bg-secondary">
              <h4 className="text-lg md:text-2xl font-bold text-rose-400">
                번거로운 가입 절차 제거
              </h4>
              <p className="mt-4 md:text-lg font-medium">
                이메일 인증, 복잡한 정보 입력 없이 누구나 바로 시작할 수 있는
                초간단 온보딩.
              </p>
              <FingerprintPattern
                className="my-16 mx-auto text-rose-400"
                size={72}
              />
            </li>

            <li className="p-4 md:p-8 rounded-2xl bg-rose-100 dark:bg-secondary">
              <h4 className="text-lg md:text-2xl font-bold text-rose-400">
                전문가 수준의 보안
              </h4>
              <p className="mt-4 md:text-lg font-medium">
                보안 전문가가 직접 검수한 시스템으로 파일은 안전하게 보호됩니다.
              </p>
              <BrickWallShield
                className="my-16 mx-auto text-rose-400"
                size={72}
              />
            </li>
          </ul>
        </section>

        <section className="mt-32">
          <h2 className="text-2xl md:text-4xl font-bold">
            파일 전달에 필요한 것만 남겼습니다
          </h2>
          <p className="mt-4 max-w-2xl md:text-lg text-muted-foreground">
            대용량 협업 플랫폼처럼 복잡하지 않고, 메신저 첨부처럼 불안정하지도
            않습니다. 업로드, 링크 생성, 공유라는 가장 중요한 흐름을 빠르고
            안정적으로 완성하는 데 집중했습니다.
          </p>

          <div className="mt-16 mx-auto max-w-4xl rounded-2xl border">
            <div className="p-4 border-b flex gap-4 bg-secondary rounded-t-2xl">
              <div className="h-6 w-6 rounded-full bg-rose-400" />
              <div className="h-6 w-6 rounded-full bg-yellow-400" />
              <div className="h-6 w-6 rounded-full bg-green-400" />
            </div>
            <div className="p-4">
              <div className="my-16 mx-auto p-4 w-80 border rounded-2xl shadow-lg bg-secondary">
                <div className="text-lg font-medium">파일 다운로드</div>
                <Image
                  src={"/static/icons/032-zip.svg"}
                  alt="folder"
                  height={512}
                  width={512}
                  className="mt-16 mx-auto w-32"
                />
                <div className="mt-4 text-sm font-medium text-center text-muted-foreground">
                  공유폴더.zip
                </div>
                <div className="relative">
                  <div className="mt-16 p-4 rounded-lg bg-rose-400 text-background text-center font-bold cursor-pointer">
                    다운로드
                  </div>
                  <MousePointerClick
                    fill="white"
                    className="absolute top-1/6 right-1/6 w-16 h-16"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-32">
          <div className="p-4 md:p-8 rounded-2xl bg-rose-400 text-rose-50">
            <h4 className="text-2xl font-bold">
              지금 바로 더 가볍게 공유하세요
            </h4>
            <p className="mt-4 max-w-2xl md:text-lg">
              가입 즉시 500MB 무료 용량이 제공됩니다. 복잡한 기능보다 빠른
              전달이 중요한 팀과 개인에게 잘 맞는 파일 공유 경험을 시작해
              보세요.
            </p>

            <div className="mt-8 flex gap-4">
              <Button
                className="px-4 py-2 rounded-lg bg-white text-rose-500 hover:bg-rose-50"
                asChild
              >
                <Link href="/sign-up">무료로 회원가입</Link>
              </Button>
              <Button
                variant="ghost"
                className="px-4 py-2 rounded-lg hover:text-background hover:bg-white/10"
                asChild
              >
                <Link href="/sign-in">로그인</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
