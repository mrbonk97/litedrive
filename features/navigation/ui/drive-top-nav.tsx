import Form from "next/form";
import { Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { MenuButton } from "@/components/nav/menu-button";
import { ProfileButton } from "@/components/nav/profile-button";
import { SearchDrawer } from "@/components/nav/search-drawer";

export function DriveTopNav() {
  return (
    <nav className="fixed top-0 left-0 lg:left-64 right-0 h-14 px-2 lg:pl-0 lg:pr-4 flex items-center justify-between gap-4 bg-sidebar border-b">
      <Logo className="lg:hidden" />
      <Form
        action="/folders"
        className="relative hidden lg:block h-full w-full"
      >
        <button
          type="submit"
          className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:bg-background duration-150 cursor-pointer"
          aria-label="검색"
        >
          <Search size={20} />
        </button>
        <input
          name="q"
          placeholder="파일 또는 폴더 검색"
          className="pl-12 h-full w-full focus:ring-0 focus:outline-0"
        />
      </Form>
      <div className="flex items-center gap-2">
        <SearchDrawer />
        <MenuButton />
        <ProfileButton />
      </div>
    </nav>
  );
}
