import { SignInForm } from "@/components/form/sign-in-form";
import { Logo } from "@/components/nav/logo";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "로그인 - LiteDrive",
};

async function SignInPage() {
  return (
    <main className="h-full grid grid-cols-2">
      <section className="p-4 h-full col-span-2 sm:col-span-1">
        <Logo />
        <SignInForm />
      </section>
      <Image
        src={"/static/pattern.svg"}
        alt="pattern"
        height={2000}
        width={2000}
        priority
        quality={100}
        className="hidden sm:block w-full h-full min-h-screen object-cover"
      />
    </main>
  );
}

export default SignInPage;
