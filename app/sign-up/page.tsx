import Image from "next/image";
import { Logo } from "@/components/nav/logo";
import { Metadata } from "next";
import { SignUpForm } from "@/components/form/sign-up-form";

export const metadata: Metadata = {
  title: "회원가입 - LiteDrive",
};

async function SignUpPage() {
  return (
    <main className="h-full grid grid-cols-2">
      <section className="p-4 h-full col-span-2 sm:col-span-1">
        <Logo />
        <SignUpForm />
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

export default SignUpPage;
