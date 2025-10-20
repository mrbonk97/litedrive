import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/nav/logo";
import { Pointer, Shield } from "lucide-react";
import { Footer } from "@/components/nav/footer";

export default async function Home() {
  return (
    <>
      <main className="p-4 mx-auto max-w-7xl grid grid-cols-2 gap-4 gap-y-8">
        <h1 className="sr-only">LiteDrive</h1>
        <header className="col-span-2 flex items-center justify-between gap-2">
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
        <div className="col-span-2 md:col-span-1">
          <p className="mt-4 mx-auto md:mx-0 text-2xl md:text-5xl max-w-md md:max-w-full font-bold leading-normal text-rose-400">
            LiteDrive, 최소한의 보안으로 최대한의 속도. 파일만을 위한 가장 단순한 공유 플랫폼.
          </p>
          <Button className="mt-16 sm:mt-8 mx-auto md:mx-0 w-fit bg-rose-400" asChild>
            <Link href={"/sign-up"}>시작하기</Link>
          </Button>
        </div>
        <Image
          src={"/static/pattern.svg"}
          alt="bg"
          height={1000}
          width={1000}
          className="hidden md:block h-full w-full object-cover opacity-80"
        />
        <div className="mt-8 col-span-1 p-4 aspect-video border rounded flex flex-col justify-between">
          <h4 className="text-2xl font-bold opacity-80">보안</h4>
          <Shield className="my-24 mx-auto text-rose-400" size={96} />
          <p className="text-center text-sm opacity-80 break-keep">
            탈퇴 시 모든 데이터는 즉시 파기되며, 복구가 불가능합니다.
          </p>
        </div>
        <div className="mt-8 col-span-1 p-4 aspect-video border rounded flex flex-col justify-between">
          <h4 className="text-2xl font-bold opacity-80">편의성</h4>
          <Pointer className="my-24 mx-auto text-rose-400" size={96} />
          <p className="text-center text-sm opacity-80 break-keep">
            2FA 등 부가 기능 없이, 가장 가볍고 빠른 공유에 집중합니다.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
