import Image from "next/image";
import { Logo } from "@/components/nav/logo";
import { SignUpForm } from "@/components/form/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 - LiteDrive",
};

async function SignUpPage() {
  return (
    <main className="p-4 h-full flex flex-col items-center justify-center sm:bg-rose-200">
      <section className="flex sm:block justify-center max-w-4xl w-full">
        <Logo />
      </section>
      <section className="mt-2 p-4 sm:max-h-[36rem] max-w-4xl h-full w-full flex rounded-2xl bg-background">
        <div className="p-4 hidden sm:flex h-full w-full items-center justify-center bg-secondary rounded-2xl">
          <Image src={"/static/login.png"} alt="login" height={512} width={512} className="object-contain max-w-72" />
        </div>
        <SignUpForm />
      </section>
      <section className="mt-2 h-8" />
    </main>
  );
}

export default SignUpPage;
