import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-20 p-4 bg-secondary">
      <section className="pt-8 mx-auto max-w-6xl h-96">
        <Logo />
        <div className="mt-4 text-sm font-semibold opacity-80">문의: hyunsuk1997@naver.com</div>
      </section>
    </footer>
  );
}
