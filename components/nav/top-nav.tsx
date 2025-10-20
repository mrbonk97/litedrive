import Form from "next/form";
import { ProfileButton } from "./profile-button";
import { Search } from "lucide-react";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";

export function Topnav() {
  return (
    <nav className="z-50 fixed top-0 left-0 lg:left-64 right-0 h-14 pl-4 lg:pl-0 pr-4 bg-sidebar border-b flex items-center justify-between gap-4">
      <Logo className="flex lg:hidden" />
      <Form action={"/folders"} className="hidden lg:block relative shrink h-full w-full">
        <button className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-70">
          <span className="sr-only">검색</span>
          <Search className="text-rose-400" />
        </button>
        <input name="q" className="h-full w-full pl-12" placeholder="검색어를 입력해주세요" />
      </Form>
      <div className="flex gap-2">
        <SearchButton />
        <ProfileButton />
      </div>
    </nav>
  );
}
